// Account/progress system.
// Uses the deployed backend when available, and falls back to localStorage for file:// usage.

(function() {
  const USERS_KEY = 'sql_auth_users';
  const ACTIVE_KEY = 'sql_auth_active';
  const GUEST_COMPLETED_KEY = 'sql_guest_completed';
  const GUEST_SOLVED_KEY = 'sql_guest_solved';
  const SERVER_HINT_KEY = 'sql_server_hint';
  const PROGRESS_KEYS = {
    completed: 'sql_completed',
    solved: 'sql_solved'
  };

  const serverState = {
    checked: false,
    enabled: false,
    user: null,
    error: ''
  };

  function isFileMode() {
    return location.protocol === 'file:';
  }

  function readJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeUsername(value) {
    return String(value || '').trim().toLowerCase();
  }

  function cleanDisplayName(value) {
    return String(value || '').trim();
  }

  function getCurrentProgress() {
    return {
      completed: readJSON(PROGRESS_KEYS.completed, []),
      solved: readJSON(PROGRESS_KEYS.solved, [])
    };
  }

  function setCurrentProgress(progress) {
    writeJSON(PROGRESS_KEYS.completed, Array.isArray(progress?.completed) ? progress.completed : []);
    writeJSON(PROGRESS_KEYS.solved, Array.isArray(progress?.solved) ? progress.solved : []);
  }

  function makeSalt() {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }

  function hashPassword(password, salt) {
    const input = `${salt}:${password}`;
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < input.length; i++) {
      const ch = input.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return `${(h2 >>> 0).toString(16)}${(h1 >>> 0).toString(16)}`;
  }

  function getUsers() {
    return readJSON(USERS_KEY, {});
  }

  function saveUsers(users) {
    writeJSON(USERS_KEY, users);
  }

  function saveGuestProgress() {
    const progress = getCurrentProgress();
    writeJSON(GUEST_COMPLETED_KEY, progress.completed);
    writeJSON(GUEST_SOLVED_KEY, progress.solved);
  }

  function getGuestProgress() {
    return {
      completed: readJSON(GUEST_COMPLETED_KEY, readJSON(PROGRESS_KEYS.completed, [])),
      solved: readJSON(GUEST_SOLVED_KEY, readJSON(PROGRESS_KEYS.solved, []))
    };
  }

  function getLocalActiveUserKey() {
    const key = localStorage.getItem(ACTIVE_KEY);
    const users = getUsers();
    return key && users[key] ? key : '';
  }

  function getLocalActiveUser() {
    const key = getLocalActiveUserKey();
    return key ? getUsers()[key] || null : null;
  }

  function saveLocalActiveProgress() {
    const key = getLocalActiveUserKey();
    if (!key) {
      saveGuestProgress();
      return;
    }
    const users = getUsers();
    if (!users[key]) return;
    users[key].progress = getCurrentProgress();
    users[key].lastActiveAt = new Date().toISOString();
    saveUsers(users);
  }

  function hydrateLocalActiveUserProgress() {
    const key = getLocalActiveUserKey();
    if (!key) {
      localStorage.removeItem(ACTIVE_KEY);
      return;
    }
    const users = getUsers();
    setCurrentProgress(users[key].progress || { completed: [], solved: [] });
  }

  function validateRegisterInput(username, password, confirm) {
    const displayName = cleanDisplayName(username);
    const key = normalizeUsername(username);
    if (!/^[a-z0-9_.-]{3,24}$/.test(key)) {
      throw new Error('Tên đăng nhập cần 3-24 ký tự, chỉ dùng chữ không dấu, số, dấu gạch, chấm hoặc gạch dưới.');
    }
    if (String(password || '').length < 6) {
      throw new Error('Mật khẩu cần ít nhất 6 ký tự.');
    }
    if (password !== confirm) {
      throw new Error('Mật khẩu nhập lại chưa khớp.');
    }
    return { key, displayName };
  }

  function registerLocal(username, password, confirm) {
    const { key, displayName } = validateRegisterInput(username, password, confirm);
    const users = getUsers();
    if (users[key]) throw new Error('Tên đăng nhập này đã tồn tại.');
    const salt = makeSalt();
    users[key] = {
      username: key,
      displayName,
      salt,
      passwordHash: hashPassword(password, salt),
      progress: getCurrentProgress(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    saveUsers(users);
    localStorage.setItem(ACTIVE_KEY, key);
    location.reload();
  }

  function loginLocal(username, password) {
    const key = normalizeUsername(username);
    const users = getUsers();
    const user = users[key];
    if (!user || user.passwordHash !== hashPassword(password, user.salt)) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
    saveLocalActiveProgress();
    localStorage.setItem(ACTIVE_KEY, key);
    setCurrentProgress(user.progress || { completed: [], solved: [] });
    location.reload();
  }

  function logoutLocal() {
    saveLocalActiveProgress();
    localStorage.removeItem(ACTIVE_KEY);
    setCurrentProgress(getGuestProgress());
    location.reload();
  }

  async function apiRequest(path, options = {}) {
    const headers = options.body
      ? { 'Content-Type': 'application/json', ...(options.headers || {}) }
      : { ...(options.headers || {}) };
    const response = await fetch(path, {
      credentials: 'include',
      ...options,
      headers
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Server trả về HTTP ${response.status}`);
    }
    return data;
  }

  async function detectServerAuth() {
    if (isFileMode()) {
      hydrateLocalActiveUserProgress();
      serverState.checked = true;
      return false;
    }
    try {
      const health = await apiRequest('/api/health');
      if (!health.dynamic) throw new Error('Backend API is not enabled.');
      const data = await apiRequest('/api/auth/me');
      serverState.enabled = true;
      serverState.user = data.user || null;
      serverState.error = '';
      if (data.user) localStorage.setItem(SERVER_HINT_KEY, data.user.username);
      if (data.user?.progress) {
        setCurrentProgress(data.user.progress);
      }
      serverState.checked = true;
      return true;
    } catch (error) {
      if (isFileMode()) hydrateLocalActiveUserProgress();
      serverState.enabled = false;
      serverState.user = null;
      serverState.error = error.message || 'Backend tài khoản chưa sẵn sàng.';
      serverState.checked = true;
      return false;
    }
  }

  const readyPromise = detectServerAuth();

  function getActiveUser() {
    if (serverState.enabled) return serverState.user;
    return isFileMode() ? getLocalActiveUser() : null;
  }

  function saveActiveProgress() {
    if (!serverState.enabled) {
      if (isFileMode()) saveLocalActiveProgress();
      else saveGuestProgress();
      return;
    }
    if (!serverState.user) return;
    const progress = getCurrentProgress();
    serverState.user.progress = progress;
    apiRequest('/api/progress', {
      method: 'PUT',
      body: JSON.stringify(progress)
    }).catch(error => console.warn('Không lưu được tiến độ lên server:', error));
  }

  function hydrateActiveUserProgress() {
    if (serverState.enabled) {
      if (serverState.user?.progress) setCurrentProgress(serverState.user.progress);
      return;
    }
    if (isFileMode()) hydrateLocalActiveUserProgress();
  }

  async function register(username, password, confirm) {
    if (!serverState.enabled) {
      if (!isFileMode()) {
        throw new Error('Backend tài khoản chưa bật. Hãy cấu hình KV/Upstash rồi deploy lại để tạo tài khoản dùng chung nhiều thiết bị.');
      }
      registerLocal(username, password, confirm);
      return;
    }
    validateRegisterInput(username, password, confirm);
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        confirm,
        progress: getCurrentProgress()
      })
    });
    serverState.user = data.user;
    setCurrentProgress(data.user?.progress || { completed: [], solved: [] });
    localStorage.setItem(SERVER_HINT_KEY, data.user?.username || normalizeUsername(username));
    location.reload();
  }

  async function login(username, password) {
    if (!serverState.enabled) {
      if (!isFileMode()) {
        throw new Error('Backend tài khoản chưa bật. Tài khoản tập trung cần API server và KV/Upstash.');
      }
      loginLocal(username, password);
      return;
    }
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    serverState.user = data.user;
    setCurrentProgress(data.user?.progress || { completed: [], solved: [] });
    localStorage.setItem(SERVER_HINT_KEY, data.user?.username || normalizeUsername(username));
    location.reload();
  }

  async function logout() {
    if (!serverState.enabled) {
      if (isFileMode()) logoutLocal();
      else location.reload();
      return;
    }
    saveActiveProgress();
    await apiRequest('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) }).catch(() => {});
    serverState.user = null;
    localStorage.removeItem(SERVER_HINT_KEY);
    location.reload();
  }

  function renderAuthModal() {
    if (document.getElementById('auth-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-backdrop" data-auth-close></div>
      <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button class="auth-close" type="button" data-auth-close aria-label="Đóng">×</button>
        <div id="auth-content"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', event => {
      if (event.target.closest('[data-auth-close]')) closeAuthModal();
    });
  }

  function openAuthModal(mode = 'login') {
    renderAuthModal();
    document.getElementById('auth-modal')?.classList.add('open');
    renderAuthContent(mode);
  }

  function closeAuthModal() {
    document.getElementById('auth-modal')?.classList.remove('open');
  }

  function renderAuthContent(mode) {
    const user = getActiveUser();
    const content = document.getElementById('auth-content');
    if (!content) return;
    const storageText = serverState.enabled
      ? 'trên server deploy'
      : isFileMode()
        ? 'trên trình duyệt hiện tại'
        : 'sau khi backend tài khoản được bật';
    if (user) {
      const solved = user.progress?.solved?.length || 0;
      const completed = user.progress?.completed?.length || 0;
      content.innerHTML = `
        <div class="auth-user-card">
          <div class="auth-avatar">${escapeHTML(user.displayName || user.username).charAt(0).toUpperCase()}</div>
          <div>
            <h3 id="auth-title">${escapeHTML(user.displayName || user.username)}</h3>
            <p>@${escapeHTML(user.username)}</p>
          </div>
        </div>
        <div class="auth-stats">
          <div><strong>${completed}</strong><span>bài học hoàn thành</span></div>
          <div><strong>${solved}</strong><span>bài tập đã giải</span></div>
        </div>
        <p class="auth-note">Tiến độ đang được lưu riêng cho tài khoản này ${storageText}.</p>
        <button class="auth-primary" type="button" id="auth-logout">Đăng xuất</button>`;
      document.getElementById('auth-logout')?.addEventListener('click', logout);
      return;
    }

    const isRegister = mode === 'register';
    content.innerHTML = `
      <h3 id="auth-title">${isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</h3>
      <p class="auth-note">Tài khoản dùng để lưu tiến độ học và bài tập ${storageText}.</p>
      ${!serverState.enabled && !isFileMode() ? `<div class="auth-message">${escapeHTML(serverState.error || 'Backend tài khoản chưa sẵn sàng.')}</div>` : ''}
      <div class="auth-tabs">
        <button class="${!isRegister ? 'active' : ''}" type="button" data-auth-mode="login">Đăng nhập</button>
        <button class="${isRegister ? 'active' : ''}" type="button" data-auth-mode="register">Tạo tài khoản</button>
      </div>
      <form id="auth-form" class="auth-form">
        <label>
          <span>Tên đăng nhập</span>
          <input name="username" type="text" autocomplete="username" placeholder="vd: sql_user01" required>
        </label>
        <label>
          <span>Mật khẩu</span>
          <input name="password" type="password" autocomplete="${isRegister ? 'new-password' : 'current-password'}" required>
        </label>
        ${isRegister ? `<label>
          <span>Nhập lại mật khẩu</span>
          <input name="confirm" type="password" autocomplete="new-password" required>
        </label>` : ''}
        <div id="auth-message" class="auth-message"></div>
        <button class="auth-primary" type="submit">${isRegister ? 'Tạo và đăng nhập' : 'Đăng nhập'}</button>
      </form>`;

    content.querySelectorAll('[data-auth-mode]').forEach(btn => {
      btn.addEventListener('click', () => renderAuthContent(btn.dataset.authMode));
    });
    content.querySelector('#auth-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const msg = document.getElementById('auth-message');
      const submitBtn = event.currentTarget.querySelector('button[type="submit"]');
      try {
        if (msg) msg.textContent = 'Đang xử lý...';
        if (submitBtn) submitBtn.disabled = true;
        if (isRegister) {
          await register(form.get('username'), form.get('password'), form.get('confirm'));
        } else {
          await login(form.get('username'), form.get('password'));
        }
      } catch (error) {
        if (msg) msg.textContent = error.message;
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  function renderAuthEntry() {
    const actions = document.querySelector('.topbar-actions');
    if (!actions || document.getElementById('auth-entry')) return;
    const btn = document.createElement('button');
    btn.id = 'auth-entry';
    btn.className = 'auth-entry';
    btn.type = 'button';
    actions.insertBefore(btn, actions.firstChild);
    btn.addEventListener('click', () => openAuthModal(getActiveUser() ? 'profile' : 'login'));
    updateAuthEntry();
  }

  function updateAuthEntry() {
    const btn = document.getElementById('auth-entry');
    if (!btn) return;
    const user = getActiveUser();
    btn.innerHTML = user
      ? `<span class="auth-entry-avatar">${escapeHTML(user.displayName || user.username).charAt(0).toUpperCase()}</span><span>${escapeHTML(user.displayName || user.username)}</span>`
      : `<span class="auth-entry-avatar">?</span><span>Đăng nhập</span>`;
  }

  function initAuthUI() {
    renderAuthEntry();
    renderAuthModal();
    updateAuthEntry();

    const wasReturning = document.body.classList.contains('user-returning');

    if (getActiveUser()) {
      document.body.classList.remove('user-returning');
      const intro = document.getElementById('intro-screen');
      if (intro) {
        intro.classList.add('intro-screen-hidden');
        document.body.classList.remove('intro-active');
        setTimeout(() => intro.remove(), 420);
      }
    } else if (wasReturning) {
      // Hint existed but session expired — restore intro so user can log in
      document.body.classList.remove('user-returning');
      localStorage.removeItem(SERVER_HINT_KEY);
      document.body.classList.add('intro-active');
    }
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.addEventListener('beforeunload', saveActiveProgress);
  window.SQLAuthReady = readyPromise;
  window.SQLAuth = {
    getActiveUser,
    saveProgress: saveActiveProgress,
    open: openAuthModal,
    hydrateActiveUserProgress,
    isServerEnabled: () => serverState.enabled
  };

  readyPromise.finally(() => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAuthUI);
    } else {
      initAuthUI();
    }
  });
})();
