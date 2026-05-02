const { handleAuthAPI } = require('../../lib/auth-store');

module.exports = function register(req, res) {
  return handleAuthAPI(req, res, '/api/auth/register').catch(error => {
    console.error(error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Server lỗi nội bộ.' }));
  });
};
