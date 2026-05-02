const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Redis } = require('@upstash/redis');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT_DIR, 'data');
const DATA_FILE = process.env.DATA_FILE || path.join(DATA_DIR, 'users.json');
const STORE_KEY = process.env.AUTH_STORE_KEY || 'sql_master_auth_store';
const SESSION_DAYS = 30;
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);

function emptyStore() {
  return {
    version: 2,
    users: {},
    sessions: {}
  };
}

function normalizeStore(value) {
  const parsed = value && typeof value === 'object' ? value : {};
  return {
    version: Number(parsed.version || 1),
    users: parsed.users && typeof parsed.users === 'object' ? parsed.users : {},
    sessions: parsed.sessions && typeof parsed.sessions === 'object' ? parsed.sessions : {}
  };
}

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

function createFileAdapter() {
  return {
    type: 'file',
    description: DATA_FILE,
    async ensure() {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(emptyStore(), null, 2));
      }
    },
    async read() {
      await this.ensure();
      try {
        return normalizeStore(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8').replace(/^\uFEFF/, '')));
      } catch {
        return emptyStore();
      }
    },
    async write(store) {
      await this.ensure();
      const tmp = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(normalizeStore(store), null, 2));
      fs.renameSync(tmp, DATA_FILE);
    }
  };
}

function createRedisAdapter(config) {
  const redis = new Redis(config);
  return {
    type: 'redis',
    description: `${config.url.replace(/\/$/, '')}/${STORE_KEY}`,
    async ensure() {
      const existing = await redis.get(STORE_KEY);
      if (!existing) await redis.set(STORE_KEY, emptyStore());
    },
    async read() {
      const value = await redis.get(STORE_KEY);
      if (!value) return emptyStore();
      if (typeof value === 'string') {
        try {
          return normalizeStore(JSON.parse(value));
        } catch {
          return emptyStore();
        }
      }
      return normalizeStore(value);
    },
    async write(store) {
      await redis.set(STORE_KEY, normalizeStore(store));
    }
  };
}

function createDisabledAdapter() {
  return {
    type: 'disabled',
    description: 'Persistent auth storage is not configured',
    async ensure() {
      throw new Error('Vercel cần cấu hình KV_REST_API_URL/KV_REST_API_TOKEN hoặc UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN để lưu tài khoản tập trung.');
    },
    async read() {
      await this.ensure();
    },
    async write() {
      await this.ensure();
    }
  };
}

function getAdapter() {
  const redisConfig = getRedisConfig();
  if (redisConfig) return createRedisAdapter(redisConfig);
  if (process.env.VERCEL) return createDisabledAdapter();
  return createFileAdapter();
}

async function ensureAuthStore() {
  const adapter = getAdapter();
  await adapter.ensure();
}

function getAuthStoreDescription() {
  return getAdapter().description;
}

function getAuthStoreType() {
  return getAdapter().type;
}

function nowISO() {
  return new Date().toISOString();
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

function sanitizeProgress(progress) {
  const cleanArray = value => Array.isArray(value)
    ? [...new Set(value.map(item => String(item)).filter(Boolean))].slice(0, 1000)
    : [];
  return {
    completed: cleanArray(progress?.completed),
    solved: cleanArray(progress?.solved)
  };
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

function hashLegacyPassword(password, salt) {
  return crypto.pbkdf2Sync(String(password), salt, 120000, 32, 'sha256').toString('hex');
}

function timingSafeEqualText(a, b) {
  const left = Buffer.from(String(a || ''), 'utf8');
  const right = Buffer.from(String(b || ''), 'utf8');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function hashPassword(password) {
  return bcrypt.hash(String(password), BCRYPT_ROUNDS);
}

async function verifyPassword(user, password) {
  const hash = String(user?.passwordHash || '');
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    return { ok: await bcrypt.compare(String(password), hash), needsRehash: false };
  }

  if (user?.salt && hash) {
    const legacyHash = hashLegacyPassword(password, user.salt);
    return {
      ok: timingSafeEqualText(legacyHash, hash),
      needsRehash: true
    };
  }

  return { ok: false, needsRehash: false };
}

function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

function parseCookies(req) {
  const cookies = {};
  String(req.headers?.cookie || '').split(';').forEach(part => {
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
  for (const [sessionKey, session] of Object.entries(store.sessions)) {
    if (!session?.expiresAt || Date.parse(session.expiresAt) <= now) {
      delete store.sessions[sessionKey];
    }
  }
}

function getSession(req, store) {
  cleanSessions(store);
  const token = parseCookies(req).sql_session;
  if (!token) return { token: '', sessionKey: '', user: null };

  const sessionKey = hashToken(token);
  let session = store.sessions[sessionKey];

  if (!session && store.sessions[token]) {
    session = store.sessions[token];
    store.sessions[sessionKey] = session;
    delete store.sessions[token];
  }

  if (!session) return { token: '', sessionKey: '', user: null };
  const user = store.users[session.username] || null;
  if (!user) {
    delete store.sessions[sessionKey];
    return { token: '', sessionKey: '', user: null };
  }
  return { token, sessionKey, user };
}

function createSession(store, username) {
  const token = makeToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  store.sessions[hashToken(token)] = { username, createdAt: nowISO(), expiresAt };
  return token;
}

function sendJSON(res, status, payload, headers = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  };
  Object.entries(finalHeaders).forEach(([key, value]) => {
    if (typeof res.setHeader === 'function') res.setHeader(key, value);
  });
  res.statusCode = status;
  res.end(JSON.stringify(payload));
}

function sendError(res, status, message) {
  sendJSON(res, status, { error: message });
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body || '{}'));
    } catch {
      return Promise.reject(new Error('JSON không hợp lệ.'));
    }
  }
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

async function readStore() {
  const adapter = getAdapter();
  return adapter.read();
}

async function writeStore(store) {
  const adapter = getAdapter();
  store.version = 2;
  await adapter.write(store);
}

async function handleAuthAPI(req, res, pathname) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (getAuthStoreType() === 'disabled') {
    return sendJSON(res, 503, {
      ok: false,
      dynamic: false,
      error: 'Chưa cấu hình storage tài khoản tập trung cho Vercel.',
      requiredEnv: [
        'KV_REST_API_URL',
        'KV_REST_API_TOKEN'
      ]
    });
  }

  const store = await readStore();
  const { token, sessionKey, user } = getSession(req, store);

  if (req.method === 'GET' && pathname === '/api/health') {
    await writeStore(store);
    return sendJSON(res, 200, {
      ok: true,
      dynamic: true,
      storage: getAuthStoreType(),
      password: 'bcrypt'
    });
  }

  if (req.method === 'GET' && pathname === '/api/auth/me') {
    await writeStore(store);
    return sendJSON(res, 200, { user: publicUser(user) });
  }

  if (req.method === 'POST' && pathname === '/api/auth/register') {
    try {
      const body = await readBody(req);
      const username = validateUsername(body.username);
      validatePassword(body.password);
      if (body.password !== body.confirm) throw new Error('Mật khẩu nhập lại chưa khớp.');
      if (store.users[username]) return sendError(res, 409, 'Tên đăng nhập này đã tồn tại.');

      const displayName = String(body.username || '').trim();
      store.users[username] = {
        username,
        displayName,
        passwordAlgo: 'bcrypt',
        passwordHash: await hashPassword(body.password),
        progress: sanitizeProgress(body.progress),
        createdAt: nowISO(),
        lastActiveAt: nowISO()
      };

      const newToken = createSession(store, username);
      await writeStore(store);
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
      const verified = await verifyPassword(found, body.password);
      if (!found || !verified.ok) {
        return sendError(res, 401, 'Tên đăng nhập hoặc mật khẩu không đúng.');
      }

      if (verified.needsRehash) {
        found.passwordAlgo = 'bcrypt';
        found.passwordHash = await hashPassword(body.password);
        delete found.salt;
      }

      found.lastActiveAt = nowISO();
      const newToken = createSession(store, username);
      await writeStore(store);
      return sendJSON(res, 200, { user: publicUser(found) }, { 'Set-Cookie': sessionCookie(newToken) });
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    if (token && sessionKey) delete store.sessions[sessionKey];
    await writeStore(store);
    return sendJSON(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie() });
  }

  if (pathname === '/api/progress') {
    if (!user) {
      await writeStore(store);
      return sendError(res, 401, 'Bạn cần đăng nhập để lưu tiến độ trên server.');
    }
    if (req.method === 'GET') {
      await writeStore(store);
      return sendJSON(res, 200, { progress: sanitizeProgress(user.progress) });
    }
    if (req.method === 'PUT') {
      try {
        const body = await readBody(req);
        user.progress = sanitizeProgress(body);
        user.lastActiveAt = nowISO();
        await writeStore(store);
        return sendJSON(res, 200, { ok: true, user: publicUser(user) });
      } catch (error) {
        return sendError(res, 400, error.message);
      }
    }
  }

  await writeStore(store);
  return sendError(res, 404, 'Không tìm thấy API.');
}

module.exports = {
  DATA_FILE,
  STORE_KEY,
  SESSION_DAYS,
  ensureAuthStore,
  getAuthStoreDescription,
  getAuthStoreType,
  handleAuthAPI,
  hashPassword,
  verifyPassword,
  sanitizeProgress
};
