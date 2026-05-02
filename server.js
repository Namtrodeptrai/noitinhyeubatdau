const http = require('http');
const fs = require('fs');
const path = require('path');
const {
  ensureAuthStore,
  getAuthStoreDescription,
  handleAuthAPI
} = require('./lib/auth-store');

const ROOT_DIR = __dirname;
const PORT = Number(process.env.PORT || 8080);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

async function handleAPI(req, res, pathname) {
  return handleAuthAPI(req, res, pathname);
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
      res.writeHead(500, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({ error: 'Server lỗi nội bộ.' }));
    });
  }
  return serveStatic(req, res, url.pathname);
});

ensureAuthStore().then(() => {
  server.listen(PORT, () => {
    console.log(`SQL Master running at http://localhost:${PORT}`);
    console.log(`Auth store: ${getAuthStoreDescription()}`);
  });
}).catch(error => {
  console.error('Cannot initialize auth store:', error);
  process.exit(1);
});
