const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT_DIR, 'data');
const DATA_FILE = process.env.DATA_FILE || path.join(DATA_DIR, 'users.json');
const PORT = Number(process.env.PORT || 8080);
const SESSION_DAYS = 30;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function ensureDataFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: {}, sessions: {} }, null, 2));
  }
}

function readStore() {
  ensureDataFile();
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return {
      users: parsed.users && typeof parsed.users === 'object' ? parsed.users : {},
      sessions: parsed.sessions && typeof parsed.sessions === 'object' ? parsed.sessions : {}
    };
  } catch {
    return { users: {}, sessions: {} };
  }
}

function writeStore(store) {
  ensureDataFile();
  const tmp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

function nowISO() {
  return new Date().toISOString();
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(String(password), salt, 120000, 32, 'sha256').toString('hex');
}

function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}

function parseCookies(req) {
  const cookies = {};
  String(req.headers.cookie || '').split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    cookies[key] = decodeURIComponent(value);
  });
  return cookies;
}

function sessionCookie(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `sql_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 24 * 60 * 60}${secure}`;
}

function clearSessionCookie() {
  return 'sql_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

function cleanSessions(store) {
  const now = Date.now();
  for (const [token, session] of Object.entries(store.sessions)) {
    if (!session.expiresAt || Date.parse(session.expiresAt) <= now) {
      delete store.sessions[token];
    }
  }
}

function getSession(req, store) {
  cleanSessions(store);
  const token = parseCookies(req).sql_session;
  if (!token || !store.sessions[token]) return { token: '', session: null, user: null };
  const session = store.sessions[token];
  const user = store.users[session.username] || null;
  if (!user) {
    delete store.sessions[token];
    return { token: '', session: null, user: null };
  }
  return { token, session, user };
}

function publicUser(user) {
  if (!user) return null;
  return {
    username: user.username,
    displayName: user.displayName,
    progress: sanitizeProgress(user.progress),
    createdAt: user.createdAt,
    lastActiveAt: user.lastActiveAt
  };
}

function sanitizeProgress(progress) {
  const cleanArray = value => Array.isArray(value)
    ? [...new Set(value.map(item => String(item)).filter(Boolean))].slice(0, 1000)
    : [];
  return {
    completed: cleanArray(progress?.completed),
    solved: cleanArray(progress?.solved)
  };
}

function validateUsername(username) {
  const normalized = String(username || '').trim().toLowerCase();
  if (!/^[a-z0-9_.-]{3,24}$/.test(normalized)) {
    throw new Error('Tên đăng nhập cần 3-24 ký tự, chỉ dùng chữ không dấu, số, dấu gạch, chấm hoặc gạch dưới.');
  }
  return normalized;
}

function validatePassword(password) {
  if (String(password || '').length < 6) {
    throw new Error('Mật khẩu cần ít nhất 6 ký tự.');
  }
}

function sendJSON(res, status, payload, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJSON(res, status, { error: message });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error('Request quá lớn.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('JSON không hợp lệ.'));
      }
    });
    req.on('error', reject);
  });
}

function createSession(store, username) {
  const token = makeToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  store.sessions[token] = { username, createdAt: nowISO(), expiresAt };
  return token;
}

async function handleAPI(req, res, pathname) {
  const store = readStore();
  const { token, user } = getSession(req, store);

  if (req.method === 'GET' && pathname === '/api/health') {
    writeStore(store);
    return sendJSON(res, 200, { ok: true, dynamic: true });
  }

  if (req.method === 'GET' && pathname === '/api/auth/me') {
    writeStore(store);
    return sendJSON(res, 200, { user: publicUser(user) });
  }

  if (req.method === 'POST' && pathname === '/api/auth/register') {
    try {
      const body = await readBody(req);
      const username = validateUsername(body.username);
      validatePassword(body.password);
      if (body.password !== body.confirm) throw new Error('Mật khẩu nhập lại chưa khớp.');
      if (store.users[username]) return sendError(res, 409, 'Tên đăng nhập này đã tồn tại.');
      const salt = crypto.randomBytes(16).toString('hex');
      const displayName = String(body.username || '').trim();
      store.users[username] = {
        username,
        displayName,
        salt,
        passwordHash: hashPassword(body.password, salt),
        progress: sanitizeProgress(body.progress),
        createdAt: nowISO(),
        lastActiveAt: nowISO()
      };
      const newToken = createSession(store, username);
      writeStore(store);
      return sendJSON(res, 201, { user: publicUser(store.users[username]) }, { 'Set-Cookie': sessionCookie(newToken) });
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  if (req.method === 'POST' && pathname === '/api/auth/login') {
    try {
      const body = await readBody(req);
      const username = validateUsername(body.username);
      const found = store.users[username];
      if (!found || found.passwordHash !== hashPassword(body.password, found.salt)) {
        return sendError(res, 401, 'Tên đăng nhập hoặc mật khẩu không đúng.');
      }
      found.lastActiveAt = nowISO();
      const newToken = createSession(store, username);
      writeStore(store);
      return sendJSON(res, 200, { user: publicUser(found) }, { 'Set-Cookie': sessionCookie(newToken) });
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    if (token) delete store.sessions[token];
    writeStore(store);
    return sendJSON(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie() });
  }

  if (pathname === '/api/progress') {
    if (!user) {
      writeStore(store);
      return sendError(res, 401, 'Bạn cần đăng nhập để lưu tiến độ trên server.');
    }
    if (req.method === 'GET') {
      writeStore(store);
      return sendJSON(res, 200, { progress: sanitizeProgress(user.progress) });
    }
    if (req.method === 'PUT') {
      try {
        const body = await readBody(req);
        user.progress = sanitizeProgress(body);
        user.lastActiveAt = nowISO();
        writeStore(store);
        return sendJSON(res, 200, { ok: true, user: publicUser(user) });
      } catch (error) {
        return sendError(res, 400, error.message);
      }
    }
  }

  writeStore(store);
  return sendError(res, 404, 'Không tìm thấy API.');
}

function isStaticPath(pathname) {
  return pathname === '/' ||
    pathname === '/index.html' ||
    pathname.startsWith('/css/') ||
    pathname.startsWith('/js/') ||
    pathname.startsWith('/assets/');
}

function serveStatic(req, res, pathname) {
  if (!isStaticPath(pathname)) {
    pathname = '/index.html';
  }
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const resolved = path.resolve(ROOT_DIR, relative);
  const root = path.resolve(ROOT_DIR);
  if (!resolved.startsWith(root) || resolved.includes(`${path.sep}data${path.sep}`)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(resolved, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(req, res, url.pathname).catch(error => {
      console.error(error);
      sendError(res, 500, 'Server lỗi nội bộ.');
    });
  }
  return serveStatic(req, res, url.pathname);
});

ensureDataFile();
server.listen(PORT, () => {
  console.log(`SQL Master running at http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
