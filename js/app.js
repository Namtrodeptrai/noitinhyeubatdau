// Main Application

// ── Streak & activity tracking (global so exercises.js can call logDailyActivity) ──
function logDailyActivity(type) {
  const today = new Date().toISOString().slice(0, 10);
  const log = JSON.parse(localStorage.getItem('sql_daily_log') || '{}');
  if (!log[today]) log[today] = { lessons: 0, exercises: 0 };
  if (type === 'lesson') log[today].lessons = (log[today].lessons || 0) + 1;
  else if (type === 'exercise') log[today].exercises = (log[today].exercises || 0) + 1;
  const keys = Object.keys(log).sort();
  if (keys.length > 30) keys.slice(0, keys.length - 30).forEach(k => delete log[k]);
  localStorage.setItem('sql_daily_log', JSON.stringify(log));
}

function updateStreakOnVisit() {
  const today = new Date().toISOString().slice(0, 10);
  const last = localStorage.getItem('sql_streak_last') || '';
  if (last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const current = parseInt(localStorage.getItem('sql_streak_count') || '0');
  const next = last === yesterday ? current + 1 : 1;
  localStorage.setItem('sql_streak_last', today);
  localStorage.setItem('sql_streak_count', String(next));
}

function getCurrentStreak() {
  return parseInt(localStorage.getItem('sql_streak_count') || '1');
}

function getWeeklyChartData() {
  const log = JSON.parse(localStorage.getItem('sql_daily_log') || '{}');
  const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const e = log[key] || {};
    return { label: DOW[d.getDay()], lessons: e.lessons || 0, exercises: e.exercises || 0, today: i === 6 };
  });
}

(async function() {
  if (window.SQLAuthReady) {
    await window.SQLAuthReady;
  }
  updateStreakOnVisit();
  // Update index.html script tags to load all lesson files
  const completed = JSON.parse(localStorage.getItem('sql_completed') || '[]');
  const theme = localStorage.getItem('sql_theme') || 'dark';
  let currentLesson = null;
  let allLessons = [];
  let userMissionOffset = 0;
  let userDataMissions = [];

  // Build flat lesson list
  SQL_CHAPTERS.forEach(ch => {
    ch.lessons.forEach(l => {
      allLessons.push({ ...l, chapter: ch.id, chapterTitle: ch.title, chapterNum: ch.num });
    });
  });

  // Apply theme
  if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  updateThemeLabel();

  // Init SQL Engine
  const scriptEl = document.createElement('script');
  scriptEl.src = 'js/sql-wasm.js';
  scriptEl.onload = async () => {
    await initSQL();
    document.getElementById('loading-screen').classList.add('hidden');
    setTimeout(() => document.getElementById('loading-screen').style.display = 'none', 600);
  };
  scriptEl.onerror = () => {
    document.getElementById('loading-screen').innerHTML = '<div class="loader"><p style="color:#ef4444">Không thể tải SQL Engine. Vui lòng kiểm tra kết nối mạng và tải lại trang.</p></div>';
  };
  document.head.appendChild(scriptEl);

  // Build Sidebar Navigation
  buildSidebar();
  updateProgress();
  renderWelcome();
  initChatbot();

  // Event Listeners
  document.getElementById('main-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    currentLesson = null;
    renderWelcome();
    buildSidebar();
    if (window.innerWidth <= 768) toggleSidebar(false);
  });
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('menu-toggle').addEventListener('click', () => toggleSidebar(true));
  document.getElementById('sidebar-close').addEventListener('click', () => toggleSidebar(false));
  document.getElementById('sidebar-overlay').addEventListener('click', () => toggleSidebar(false));
  document.getElementById('open-data-lab')?.addEventListener('click', renderUserDataLab);
  const dialectSelect = document.getElementById('sql-dialect');
  if (dialectSelect) {
    dialectSelect.value = localStorage.getItem('sql_dialect') || 'sqlite';
    dialectSelect.addEventListener('change', () => {
      localStorage.setItem('sql_dialect', dialectSelect.value);
      if (typeof updateDialectUI === 'function') updateDialectUI();
    });
  }
  document.getElementById('btn-run-sql').addEventListener('click', runSQL);
  document.getElementById('btn-clear-editor').addEventListener('click', () => {
    document.getElementById('sql-input').value = '';
    updateLineNumbers();
  });
  document.getElementById('btn-reset-db').addEventListener('click', resetDatabase);
  document.getElementById('sql-input').addEventListener('input', updateLineNumbers);
  document.getElementById('sql-input').addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); runSQL(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart;
      e.target.value = e.target.value.substring(0, s) + '  ' + e.target.value.substring(e.target.selectionEnd);
      e.target.selectionStart = e.target.selectionEnd = s + 2;
    }
  });
  document.getElementById('prev-lesson').addEventListener('click', () => navigateLesson(-1));
  document.getElementById('next-lesson').addEventListener('click', () => navigateLesson(1));
  document.getElementById('search-input').addEventListener('input', filterSidebar);
  document.getElementById('reset-progress').addEventListener('click', () => {
    if (confirm('Xóa toàn bộ tiến độ học?')) {
      localStorage.removeItem('sql_completed');
      localStorage.removeItem('sql_solved');
      if (window.SQLAuth) window.SQLAuth.saveProgress();
      completed.length = 0;
      updateProgress();
      buildSidebar();
      document.querySelectorAll('.exercise-card.solved').forEach(card => card.classList.remove('solved'));
      document.querySelectorAll('.ex-solved-badge').forEach(badge => badge.remove());
      if (typeof updateExerciseStats === 'function') updateExerciseStats();
      if (currentLesson && typeof refreshExerciseSection === 'function') refreshExerciseSection(currentLesson);
      if (currentLesson) updateCompleteBtn();
    }
  });

  function buildSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = '';
    SQL_CHAPTERS.forEach(ch => {
      const div = document.createElement('div');
      div.className = 'nav-chapter' + (currentLesson && ch.lessons.some(l => l.id === currentLesson) ? ' open' : '');
      div.innerHTML = `
        <div class="nav-chapter-title" data-chapter="${ch.id}">
          <span class="chapter-num">${ch.num}</span>
          ${ch.icon} ${ch.title}
          <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="nav-lessons">
          ${ch.lessons.map(l => `
            <div class="nav-lesson${currentLesson === l.id ? ' active' : ''}" data-lesson="${l.id}">
              <svg class="check${completed.includes(l.id) ? '' : ' hidden'}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              ${l.title}
            </div>
          `).join('')}
        </div>`;
      nav.appendChild(div);

      div.querySelector('.nav-chapter-title').addEventListener('click', () => {
        div.classList.toggle('open');
      });
      div.querySelectorAll('.nav-lesson').forEach(el => {
        el.addEventListener('click', () => loadLesson(el.dataset.lesson));
      });
    });
  }

  function loadLesson(id) {
    currentLesson = id;
    const lessonContentEl = document.getElementById('lesson-content');
    lessonContentEl.classList.remove('exercise-mode');
    lessonContentEl.classList.remove('data-lab-mode');
    document.getElementById('open-data-lab')?.classList.remove('active');
    const content = LESSON_CONTENT[id];
    if (!content) {
      document.getElementById('sql-editor-panel').style.display = '';
      lessonContentEl.innerHTML = `<div class="welcome-hero"><h2>🚧 Bài giảng đang được cập nhật</h2><p>Nội dung sẽ sớm có mặt!</p></div>`;
      return;
    }
    const info = allLessons.find(l => l.id === id);
    const hasExercises = typeof EXERCISES !== 'undefined' && Array.isArray(EXERCISES[id]) && EXERCISES[id].length > 0;
    // Build lesson content. Exercises are opened in a separate practice view.
    let fullContent = content;
    if (typeof renderLessonMindMap === 'function') {
      fullContent = injectLessonVisual(fullContent, renderLessonMindMap(id));
    }
    if (typeof DIAGRAMS !== 'undefined' && DIAGRAMS[id]) {
      fullContent += DIAGRAMS[id];
    }
    if (typeof renderLessonVideos === 'function') {
      fullContent += renderLessonVideos(id);
    }
    if (hasExercises) {
      fullContent += renderExerciseEntry(id);
    }
    lessonContentEl.innerHTML = fullContent;
    document.getElementById('sql-editor-panel').style.display = '';
    lessonContentEl.querySelector('[data-open-exercises]')?.addEventListener('click', () => openExerciseView(id));
    if (typeof initLessonVideos === 'function') {
      initLessonVideos(id);
    }
    if (typeof clearMainEditor === 'function') {
      clearMainEditor();
    }
    lessonContentEl.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update breadcrumb
    if (info) {
      document.getElementById('breadcrumb').innerHTML = `
        <span class="home-link" style="cursor:pointer">Trang chủ</span>
        <span class="sep">›</span>
        <span>${info.chapterTitle}</span>
        <span class="sep">›</span>
        <span class="current">${info.title}</span>`;
      document.querySelector('.home-link')?.addEventListener('click', () => { currentLesson = null; renderWelcome(); buildSidebar(); });
    }

    // Nav buttons
    const idx = allLessons.findIndex(l => l.id === id);
    document.getElementById('prev-lesson').disabled = idx <= 0;
    document.getElementById('next-lesson').disabled = idx >= allLessons.length - 1;

    // Complete button
    const sec = document.getElementById('complete-section');
    sec.style.display = 'block';
    updateCompleteBtn();

    buildSidebar();
    toggleSidebar(false);
  }

  function injectLessonVisual(content, visualHTML) {
    if (!visualHTML) return content;
    const firstParagraphEnd = content.indexOf('</p>');
    if (firstParagraphEnd === -1) return content + visualHTML;
    const insertAt = firstParagraphEnd + 4;
    return content.slice(0, insertAt) + visualHTML + content.slice(insertAt);
  }

  function renderExerciseEntry(lessonId) {
    const exs = EXERCISES[lessonId] || [];
    const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
    const done = exs.filter(ex => solved.includes(ex.id)).length;
    const percent = exs.length ? Math.round((done / exs.length) * 100) : 0;
    const next = typeof getNextExercise === 'function' ? getNextExercise(lessonId, solved) : null;
    const nextLabel = next
      ? `${EXERCISE_DIFF_META[next.exercise.diff]?.label || next.exercise.diff}: ${next.exercise.title}`
      : 'Đã hoàn thành toàn bộ bài tập';
    return `
      <section class="lesson-exercise-entry">
        <div>
          <span class="lesson-exercise-kicker">Practice</span>
          <h3>Bài tập thực hành</h3>
          <p>Cổ điển, tôn trọng và Hà Tĩnh.</p>
          <div class="lesson-exercise-stats">
            <span>${done}/${exs.length} đã giải</span>
            <span>${percent}% hoàn thành</span>
            <span>Tiếp theo: ${nextLabel}</span>
          </div>
        </div>
        <button class="exercise-entry-btn" type="button" data-open-exercises="${lessonId}">
          Mở bài tập
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </section>`;
  }

  function openExerciseView(id) {
    currentLesson = id;
    const info = allLessons.find(l => l.id === id);
    const lessonContentEl = document.getElementById('lesson-content');
    lessonContentEl.classList.add('exercise-mode');
    lessonContentEl.classList.remove('data-lab-mode');
    document.getElementById('open-data-lab')?.classList.remove('active');
    document.getElementById('sql-editor-panel').style.display = 'none';
    document.getElementById('complete-section').style.display = 'none';
    document.getElementById('prev-lesson').disabled = true;
    document.getElementById('next-lesson').disabled = true;

    if (info) {
      document.getElementById('breadcrumb').innerHTML = `
        <span class="home-link" style="cursor:pointer">Trang chủ</span>
        <span class="sep">›</span>
        <span>${info.chapterTitle}</span>
        <span class="sep">›</span>
        <span>${info.title}</span>
        <span class="sep">›</span>
        <span class="current">Bài tập</span>`;
      document.querySelector('.home-link')?.addEventListener('click', () => { currentLesson = null; renderWelcome(); buildSidebar(); });
    }

    const exercisesHTML = typeof renderExercises === 'function'
      ? renderExercises(id)
      : '<div class="hr-empty error">Không tải được phần bài tập.</div>';
    lessonContentEl.innerHTML = `
      <div class="exercise-workspace">
        <div class="exercise-workspace-head">
          <button class="exercise-back-btn" type="button" data-back-lesson="${id}">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Quay lại bài giảng
          </button>
          <div>
            <span class="lesson-exercise-kicker">SQL Practice</span>
            <h2>${info ? info.title : 'Bài tập'}</h2>
            <p>Luyện tập theo từng bài, chạy thử kết quả rồi nộp khi output đã khớp.</p>
          </div>
        </div>
        ${exercisesHTML}
      </div>`;
    lessonContentEl.querySelector('[data-back-lesson]')?.addEventListener('click', () => loadLesson(id));
    if (typeof updateDialectUI === 'function') updateDialectUI();
    buildSidebar();
    toggleSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateCompleteBtn() {
    const btn = document.getElementById('btn-complete');
    const sec = document.getElementById('complete-section');
    if (!currentLesson) { sec.style.display = 'none'; return; }
    const hasExercises = typeof EXERCISES !== 'undefined' && Array.isArray(EXERCISES[currentLesson]) && EXERCISES[currentLesson].length > 0;
    const exercisesComplete = hasExercises && typeof isLessonExercisesComplete === 'function'
      ? isLessonExercisesComplete(currentLesson)
      : false;
    if (hasExercises && !exercisesComplete && completed.includes(currentLesson)) {
      const staleIndex = completed.indexOf(currentLesson);
      completed.splice(staleIndex, 1);
      localStorage.setItem('sql_completed', JSON.stringify(completed));
      if (window.SQLAuth) window.SQLAuth.saveProgress();
      updateProgress();
      buildSidebar();
    }
    const done = completed.includes(currentLesson);
    const locked = hasExercises && !exercisesComplete;
    btn.disabled = locked;
    btn.className = 'btn-complete' + (done ? ' completed' : '') + (locked ? ' locked' : '');
    btn.innerHTML = locked
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 17h.01"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><rect x="5" y="11" width="14" height="10" rx="2"/></svg> Làm hết bài tập để hoàn thành'
      : done
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Đã hoàn thành ✓'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Đánh dấu đã hoàn thành';
    btn.onclick = () => {
      if (locked) return;
      if (!completed.includes(currentLesson)) {
        completed.push(currentLesson);
        localStorage.setItem('sql_completed', JSON.stringify(completed));
        if (window.SQLAuth) window.SQLAuth.saveProgress();
        logDailyActivity('lesson');
        updateProgress();
        buildSidebar();
        updateCompleteBtn();
      }
    };
  }

  window.syncCurrentLessonCompletion = () => {
    if (!currentLesson) return;
    updateCompleteBtn();
    updateProgress();
    buildSidebar();
  };

  function navigateLesson(dir) {
    if (!currentLesson) return;
    const idx = allLessons.findIndex(l => l.id === currentLesson);
    const next = allLessons[idx + dir];
    if (next) loadLesson(next.id);
  }

  function updateProgress() {
    const total = allLessons.length;
    const done = completed.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    document.getElementById('progress-percent').textContent = pct + '%';
    document.getElementById('progress-fill').style.width = pct + '%';
  }

  function getDashboardStats() {
    const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
    const totalLessons = allLessons.length;
    const completedLessons = completed.length;
    const lessonPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const exerciseEntries = typeof EXERCISES !== 'undefined'
      ? Object.entries(EXERCISES).flatMap(([lessonId, items]) => (items || []).map(exercise => ({ lessonId, exercise })))
      : [];
    const totalExercises = exerciseEntries.length;
    const solvedExercises = exerciseEntries.filter(item => solved.includes(item.exercise.id)).length;
    const exercisePercent = totalExercises ? Math.round((solvedExercises / totalExercises) * 100) : 0;
    const nextLesson = allLessons.find(lesson => !completed.includes(lesson.id)) || null;
    const nextExercise = exerciseEntries.find(item => !solved.includes(item.exercise.id));
    return {
      totalLessons,
      completedLessons,
      lessonPercent,
      totalExercises,
      solvedExercises,
      exercisePercent,
      nextLesson,
      nextExercise
    };
  }

  function getRoadmapMeta(chapterId) {
    const meta = {
      basic: {
        stage: 'Nền tảng',
        goal: 'Hiểu database, table, kiểu dữ liệu và thao tác CRUD trước khi viết truy vấn phức tạp.'
      },
      queries: {
        stage: 'Truy vấn dữ liệu',
        goal: 'Viết SELECT, lọc WHERE, sắp xếp, nhóm dữ liệu và kiểm soát kết quả trả về.'
      },
      functions: {
        stage: 'Tính toán',
        goal: 'Dùng hàm tổng hợp, chuỗi và ngày tháng để biến dữ liệu thô thành thông tin có ích.'
      },
      joins: {
        stage: 'Kết nối bảng',
        goal: 'Ghép dữ liệu từ nhiều bảng bằng INNER, LEFT, FULL và SELF JOIN.'
      },
      subqueries: {
        stage: 'Truy vấn lồng',
        goal: 'Dùng subquery để lọc, tạo bảng trung gian và xử lý câu hỏi nhiều bước.'
      },
      constraints: {
        stage: 'Chất lượng dữ liệu',
        goal: 'Dùng khóa chính, khóa ngoại và ràng buộc để giữ dữ liệu đúng ngay từ database.'
      },
      'indexes-views': {
        stage: 'Tối ưu và đóng gói',
        goal: 'Tăng tốc truy vấn bằng index và đóng gói logic đọc dữ liệu bằng view.'
      },
      transactions: {
        stage: 'An toàn thao tác',
        goal: 'Dùng transaction và ACID để đảm bảo dữ liệu không bị nửa vời khi có lỗi.'
      },
      normalization: {
        stage: 'Thiết kế CSDL',
        goal: 'Chuẩn hóa bảng để giảm dư thừa, tránh lỗi cập nhật và giữ dữ liệu nhất quán.'
      },
      advanced: {
        stage: 'Nâng cao',
        goal: 'Làm quen stored procedure, trigger, window function và CTE cho truy vấn chuyên nghiệp.'
      }
    };
    return meta[chapterId] || { stage: 'Chặng học', goal: 'Hoàn thành các bài học trong chương này.' };
  }

  function renderWelcome() {
    currentLesson = null;
    document.getElementById('lesson-content').classList.remove('exercise-mode');
    document.getElementById('lesson-content').classList.remove('data-lab-mode');
    document.getElementById('open-data-lab')?.classList.remove('active');
    document.getElementById('sql-editor-panel').style.display = '';
    document.getElementById('breadcrumb').innerHTML = '<span>Trang chủ</span>';
    document.getElementById('prev-lesson').disabled = true;
    document.getElementById('next-lesson').disabled = true;
    document.getElementById('complete-section').style.display = 'none';
    const stats = getDashboardStats();
    const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
    const nextLessonTitle = stats.nextLesson ? stats.nextLesson.title : 'Đã hoàn thành';
    const nextExerciseTitle = stats.nextExercise ? stats.nextExercise.exercise.title : 'Đã hoàn thành';
    const streak = getCurrentStreak();
    const weekData = getWeeklyChartData();
    const maxVal = Math.max(1, ...weekData.flatMap(d => [d.lessons, d.exercises]));
    const BAR_H = 64;
    const BADGE_DEFS = [
      { id: 'first_lesson',   icon: '🎓', label: 'Bước đầu tiên',    desc: 'Hoàn thành bài học đầu tiên',   check: s => s.completedLessons >= 1 },
      { id: 'first_exercise', icon: '💪', label: 'Luyện tập',         desc: 'Giải đúng bài tập đầu tiên',    check: s => s.solvedExercises >= 1 },
      { id: 'streak_3',       icon: '🔥', label: '3 ngày liên tiếp',  desc: 'Học 3 ngày liên tiếp',          check: s => s.streak >= 3 },
      { id: 'streak_7',       icon: '⭐', label: '1 tuần liên tục',   desc: 'Học 7 ngày liên tiếp',          check: s => s.streak >= 7 },
      { id: 'ten_exercises',  icon: '🎯', label: 'Luyện gia',         desc: 'Giải đúng 10 bài tập',          check: s => s.solvedExercises >= 10 },
      { id: 'half_lessons',   icon: '⚡', label: 'Nửa chặng đường',  desc: 'Hoàn thành 50% bài học',        check: s => s.lessonPercent >= 50 },
      { id: 'all_lessons',    icon: '🏆', label: 'SQL Master',        desc: 'Hoàn thành 100% bài học',       check: s => s.lessonPercent === 100 },
      { id: 'all_exercises',  icon: '👑', label: 'Vô đối',            desc: 'Giải hết tất cả bài tập',       check: s => s.exercisePercent === 100 },
    ];
    const badgeStats = { ...stats, streak };
    const badges = BADGE_DEFS.map(b => ({ ...b, earned: b.check(badgeStats) }));
    const earnedCount = badges.filter(b => b.earned).length;
    document.getElementById('lesson-content').innerHTML = `
      <section class="roadmap-home">
        <div class="roadmap-hero">
          <div>
            <span class="roadmap-kicker">SQL Roadmap</span>
            <h2>Lộ trình học SQL từ cơ bản đến nâng cao</h2>
            <p>Đi theo từng chặng: học khái niệm, thực hành truy vấn, luyện bài tập, rồi tiến tới tối ưu và thiết kế cơ sở dữ liệu.</p>
            <div class="roadmap-actions">
              <button class="btn-start" id="btn-continue-learning">
                Tiếp tục học
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button class="roadmap-secondary-btn" id="btn-start-learning">Bắt đầu từ đầu</button>
              <button class="roadmap-secondary-btn" id="btn-open-data-lab-home">Upload data riêng</button>
            </div>
          </div>
          <div class="roadmap-summary">
            <div><strong>${stats.completedLessons}/${stats.totalLessons}</strong><span>Bài giảng</span></div>
            <div><strong>${stats.solvedExercises}/${stats.totalExercises}</strong><span>Bài tập</span></div>
            <div><strong>${stats.lessonPercent}%</strong><span>Tiến độ học</span></div>
            <div><strong>${nextLessonTitle}</strong><span>Bài học tiếp theo</span></div>
          </div>
        </div>

        <div class="home-stats-row">
          <div class="streak-card">
            <div class="streak-fire">🔥</div>
            <div class="streak-info">
              <div class="streak-count">${streak}</div>
              <div class="streak-label">Ngày liên tiếp</div>
            </div>
          </div>
          <div class="weekly-chart-card">
            <div class="weekly-chart-head">
              <span>Hoạt động 7 ngày qua</span>
              <div class="weekly-legend">
                <span class="wc-legend-l">Bài học</span>
                <span class="wc-legend-e">Bài tập</span>
              </div>
            </div>
            <div class="weekly-chart">
              ${weekData.map(d => `<div class="wc-col">
                <div class="wc-bars">
                  <div class="wc-bar wc-l" style="height:${Math.round(d.lessons / maxVal * BAR_H)}px" title="${d.lessons} bài học"></div>
                  <div class="wc-bar wc-e" style="height:${Math.round(d.exercises / maxVal * BAR_H)}px" title="${d.exercises} bài tập"></div>
                </div>
                <div class="wc-day${d.today ? ' today' : ''}">${d.label}</div>
              </div>`).join('')}
            </div>
          </div>
        </div>
        <div class="home-badges">
          <div class="home-badges-head">
            <span>Thành tích</span>
            <span class="home-badges-count">${earnedCount}/${badges.length}</span>
          </div>
          <div class="badges-grid">
            ${badges.map(b => `<div class="badge-item${b.earned ? ' earned' : ''}" title="${b.desc}${b.earned ? '' : ' — chưa mở khóa'}">
              <span class="badge-icon">${b.icon}</span>
              <span class="badge-label">${b.label}</span>
            </div>`).join('')}
          </div>
        </div>

        <section class="roadmap-dashboard" aria-label="Dashboard lộ trình">
          <article class="roadmap-dashboard-item">
            <span class="roadmap-dashboard-dot">1</span>
            <div class="roadmap-dashboard-card">
              <div class="roadmap-dashboard-head"><span>📚</span><strong>Bài giảng</strong></div>
              <div class="dashboard-big-number">${stats.completedLessons}/${stats.totalLessons}</div>
              <div class="dashboard-progress"><div style="width:${stats.lessonPercent}%"></div></div>
              <p>${stats.lessonPercent}% hoàn thành, bài tiếp theo: ${nextLessonTitle}.</p>
            </div>
          </article>
          <article class="roadmap-dashboard-item">
            <span class="roadmap-dashboard-dot">2</span>
            <div class="roadmap-dashboard-card">
              <div class="roadmap-dashboard-head"><span>🏆</span><strong>Bài tập</strong></div>
              <div class="dashboard-big-number">${stats.solvedExercises}/${stats.totalExercises}</div>
              <div class="dashboard-progress"><div style="width:${stats.exercisePercent}%"></div></div>
              <p>${stats.exercisePercent}% hoàn thành, bài kế tiếp: ${nextExerciseTitle}.</p>
            </div>
          </article>
          <article class="roadmap-dashboard-item">
            <span class="roadmap-dashboard-dot">3</span>
            <div class="roadmap-dashboard-card">
              <div class="roadmap-dashboard-head"><span>💻</span><strong>Practice Workspace</strong></div>
              <div class="roadmap-dashboard-flow">Đọc đề <span></span> Viết SQL <span></span> Chạy thử <span></span> Nộp bài</div>
              <p>Workspace tách đề bài, editor và output để luyện tập giống môi trường thi SQL.</p>
            </div>
          </article>
          <article class="roadmap-dashboard-item">
            <span class="roadmap-dashboard-dot">4</span>
            <div class="roadmap-dashboard-card">
              <div class="roadmap-dashboard-head"><span>🤖</span><strong>SQL Bot</strong></div>
              <div class="roadmap-dashboard-flow">Gợi ý <span></span> Sửa lỗi <span></span> Code mẫu</div>
              <p>Hỏi bot khi bí bài: bot có thể gợi ý hướng làm, giải thích lỗi và đưa mẫu SQL.</p>
            </div>
          </article>
        </section>

        <section class="roadmap-board">
          <div class="roadmap-board-head">
            <div>
              <span class="roadmap-kicker">10 chặng học</span>
              <h3>Sơ đồ lộ trình SQL</h3>
              <p>Bấm vào một chặng để mở bài đầu tiên của chương đó. Hoàn thành theo thứ tự từ trên xuống để không bị hổng nền tảng.</p>
            </div>
            <button class="btn-start" id="btn-roadmap-next">
              Bài tiếp theo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div class="roadmap-path">
          ${SQL_CHAPTERS.map(ch => {
            const chapterCompleted = ch.lessons.filter(lesson => completed.includes(lesson.id)).length;
            const chapterPercent = ch.lessons.length ? Math.round((chapterCompleted / ch.lessons.length) * 100) : 0;
            const exerciseIds = ch.lessons.flatMap(lesson => (EXERCISES[lesson.id] || []).map(ex => ex.id));
            const exerciseDone = exerciseIds.filter(id => solved.includes(id)).length;
            const meta = getRoadmapMeta(ch.id);
            return `<button class="roadmap-step ${ch.num % 2 === 0 ? 'right' : 'left'} ${chapterPercent === 100 ? 'done' : ''}" type="button" data-start-ch="${ch.lessons[0].id}">
              <span class="roadmap-step-dot">${ch.num}</span>
              <article class="roadmap-step-card">
                <div class="roadmap-step-head">
                  <span class="roadmap-step-icon">${ch.icon}</span>
                  <div>
                    <span>${meta.stage}</span>
                    <h4>${ch.title}</h4>
                  </div>
                </div>
                <p>${meta.goal}</p>
                <div class="roadmap-lesson-list">
                  ${ch.lessons.map(lesson => `<span class="${completed.includes(lesson.id) ? 'done' : ''}">${lesson.title}</span>`).join('')}
                </div>
                <div class="roadmap-step-progress">
                  <div><span style="width:${chapterPercent}%"></span></div>
                  <strong>${chapterCompleted}/${ch.lessons.length} bài học</strong>
                  <em>${exerciseDone}/${exerciseIds.length} bài tập</em>
                </div>
              </article>
            </button>`;
          }).join('')}
          </div>
        </section>
      </section>`;
    document.getElementById('btn-continue-learning')?.addEventListener('click', () => loadLesson(stats.nextLesson?.id || 'what-is-sql'));
    document.getElementById('btn-roadmap-next')?.addEventListener('click', () => loadLesson(stats.nextLesson?.id || 'what-is-sql'));
    document.getElementById('btn-start-learning')?.addEventListener('click', () => loadLesson('what-is-sql'));
    document.getElementById('btn-open-data-lab-home')?.addEventListener('click', renderUserDataLab);
    document.querySelectorAll('[data-start-ch]').forEach(el => {
      el.addEventListener('click', () => loadLesson(el.dataset.startCh));
    });
  }

  function escapeAppHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getDialectOptionsHTML(selected = getSelectedDialect(), includeAuto = false) {
    const dialects = typeof SQL_DIALECTS !== 'undefined'
      ? SQL_DIALECTS
      : { sqlite: { name: 'SQLite' }, mysql: { name: 'MySQL' }, postgresql: { name: 'PostgreSQL' }, sqlserver: { name: 'SQL Server / MS SQL' } };
    const entries = includeAuto
      ? [['auto', { name: 'Tự nhận diện file SQL' }], ...Object.entries(dialects)]
      : Object.entries(dialects);
    return entries
      .map(([value, info]) => `<option value="${escapeAppHTML(value)}" ${value === selected ? 'selected' : ''}>${escapeAppHTML(info.name || value)}</option>`)
      .join('');
  }

  function getUserDataSchemaHTML() {
    const summary = typeof getUserDataSummary === 'function' ? getUserDataSummary() : { tables: [] };
    const tables = summary.tables || [];
    if (!tables.length) {
      return `
        <div class="data-empty-state">
          <strong>Chưa có bảng nào</strong>
          <span>Upload CSV, TSV, JSON hoặc SQL để tạo database riêng trong trình duyệt.</span>
        </div>`;
    }

    return tables.map(table => `
      <article class="data-table-card">
        <div class="data-table-head">
          <button class="data-table-name" type="button" data-query-table="${escapeAppHTML(table.name)}">${escapeAppHTML(table.name)}</button>
          <span>${table.rows} dòng</span>
        </div>
        <div class="data-column-list">
          ${table.columns.map(column => `
            <span><code>${escapeAppHTML(column.name)}</code><em>${escapeAppHTML(column.type || 'TEXT')}</em></span>
          `).join('')}
        </div>
      </article>
    `).join('');
  }

  function renderImportMessage(result) {
    if (result.type === 'sql') {
      const detected = result.detectedDialect?.dialect
        ? ` nhận diện ${SQL_DIALECTS[result.detectedDialect.dialect]?.name || result.detectedDialect.dialect}`
        : '';
      const stats = result.stats
        ? ` (${result.stats.executed}/${result.stats.statements} statement chạy; data ${result.stats.data || 0}; schema ${result.stats.schema || 0}; metadata ${result.stats.metadata || 0}; lỗi ${result.stats.failed || 0}${result.stats.shapeFixes ? `; tự dựng schema ${result.stats.shapeFixes}` : ''}${result.stats.copyRows ? `; COPY ${result.stats.copyRows} dòng` : ''})`
        : '';
      return `<li><strong>${escapeAppHTML(result.fileName)}</strong>: ${escapeAppHTML(result.message)}${escapeAppHTML(detected)}${escapeAppHTML(stats)}</li>`;
    }
    return (result.imported || []).map(item => `
      <li><strong>${escapeAppHTML(result.fileName)}</strong>: tạo bảng <code>${escapeAppHTML(item.tableName)}</code> với ${item.rows} dòng, ${item.columns.length} cột.</li>
    `).join('');
  }

  function getSelectedUserDialect() {
    return document.getElementById('user-data-dialect')?.value || getSelectedDialect();
  }

  function quoteUserQueryIdentifier(value, dialect = getSelectedUserDialect()) {
    const text = String(value);
    if (dialect === 'mysql') return `\`${text.replace(/`/g, '``')}\``;
    if (dialect === 'sqlserver') return `[${text.replace(/]/g, ']]')}]`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function normalizeSchemaLabel(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '_');
  }

  function isLikelyIdColumn(column) {
    const name = normalizeSchemaLabel(column.name);
    return /(^id$|_id$|^ma_|^ma$|code|key|uuid)/.test(name);
  }

  function isLikelyDateColumn(column) {
    const name = normalizeSchemaLabel(column.name);
    return /(date|time|ngay|thang|nam|created|updated|timestamp)/.test(name);
  }

  function isNumericColumn(column) {
    return /^(INTEGER|REAL|NUMERIC|DECIMAL|FLOAT|DOUBLE)$/i.test(column.type || '');
  }

  function getMetricColumns(table) {
    return (table.columns || []).filter(column => isNumericColumn(column) && !isLikelyIdColumn(column));
  }

  function getDimensionColumns(table) {
    return (table.columns || []).filter(column => !isNumericColumn(column) && !isLikelyDateColumn(column));
  }

  function getDateColumns(table) {
    return (table.columns || []).filter(isLikelyDateColumn);
  }

  function getKeyColumn(table) {
    const columns = table.columns || [];
    return columns.find(column => /(email|phone|sdt|dien_thoai|ma_|^id$|code)/.test(normalizeSchemaLabel(column.name)))
      || columns.find(column => /(name|ten|ho_ten|title|customer|user)/.test(normalizeSchemaLabel(column.name)))
      || columns[0];
  }

  function limitUserSQL(sql, limit, dialect) {
    const clean = sql.trim().replace(/;$/, '');
    const commentMatch = clean.match(/^((?:\s*--[^\n]*\n)+)([\s\S]*)$/);
    const prefix = commentMatch ? commentMatch[1] : '';
    const body = commentMatch ? commentMatch[2] : clean;
    if (dialect === 'sqlserver' && /^\s*SELECT\b/i.test(body)) {
      return prefix + body.replace(/^\s*SELECT\b/i, `SELECT TOP ${limit}`) + ';';
    }
    return `${clean}\nLIMIT ${limit};`;
  }

  function getMissionColumnAlias(column, fallback) {
    return normalizeSchemaLabel(column?.name || fallback).replace(/^_+|_+$/g, '') || fallback;
  }

  function makeMission({ type, title, brief, deliverable, sql, tables, difficulty = 'Khó' }) {
    return { type, title, brief, deliverable, sql, tables, difficulty };
  }

  const aiDomainCache = {};

  async function guessTableDomain(table) {
    const textToSearch = [table.name, ...(table.columns || []).map(c => c.name)].join(' ').toLowerCase();
    const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    const searchString = normalize(textToSearch);
    const cacheKey = table.name + '|' + (table.columns || []).map(c => c.name).join(',');

    if (aiDomainCache[cacheKey]) return aiDomainCache[cacheKey];

    const fallbackDomains = [
      {
        id: 'sales',
        keywords: ['hoadon', 'donhang', 'order', 'sale', 'cart', 'khachhang', 'customer', 'product', 'sanpham', 'doanhthu', 'price', 'gia', 'invoice', 'payment'],
        entityName: 'đơn hàng', valueName: 'doanh thu (tiền)', actionName: 'bán được', targetName: 'khách hàng/sản phẩm'
      },
      {
        id: 'edu',
        keywords: ['sinhvien', 'hocsinh', 'student', 'diem', 'score', 'class', 'lop', 'course', 'monhoc', 'exam', 'thi', 'grade'],
        entityName: 'học viên', valueName: 'điểm số', actionName: 'đạt được', targetName: 'lớp/môn học'
      },
      {
        id: 'hr',
        keywords: ['nhanvien', 'employee', 'staff', 'luong', 'salary', 'phongban', 'department', 'cong', 'timesheet', 'chamcong'],
        entityName: 'nhân sự', valueName: 'chi phí lương', actionName: 'nhận được', targetName: 'phòng ban'
      },
      {
        id: 'finance',
        keywords: ['giaodich', 'transaction', 'account', 'taikhoan', 'bank', 'nganhang', 'balance', 'sodu', 'transfer', 'deposit', 'loan', 'tien'],
        entityName: 'giao dịch', valueName: 'số tiền', actionName: 'phát sinh', targetName: 'tài khoản'
      },
      {
        id: 'healthcare',
        keywords: ['benhnhan', 'patient', 'doctor', 'bacsi', 'khambenh', 'treatment', 'hospital', 'benhvien', 'thuoc', 'medicine'],
        entityName: 'bệnh nhân', valueName: 'chi phí/số ca', actionName: 'thăm khám', targetName: 'bác sĩ/khoa'
      },
      {
        id: 'logistics',
        keywords: ['vanchuyen', 'delivery', 'shipping', 'kho', 'warehouse', 'driver', 'taixe', 'shipment', 'phivanchuyen', 'freight'],
        entityName: 'chuyến hàng', valueName: 'phí vận chuyển', actionName: 'thực hiện', targetName: 'tài xế/kho'
      },
      {
        id: 'marketing',
        keywords: ['campaign', 'chiendich', 'ads', 'quangcao', 'click', 'view', 'luotxem', 'share', 'follower', 'post', 'baiviet', 'tuongtac'],
        entityName: 'chiến dịch/bài viết', valueName: 'lượt tương tác', actionName: 'thu về', targetName: 'nền tảng'
      }
    ];

    let fallbackDomain = {
      id: 'general',
      entityName: 'dòng dữ liệu',
      valueName: 'giá trị',
      actionName: 'tạo ra',
      targetName: 'nhóm phân tích'
    };

    let maxMatches = 0;
    for (const dom of fallbackDomains) {
      let matches = 0;
      for (const kw of dom.keywords) {
        if (searchString.includes(kw)) matches++;
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        fallbackDomain = dom;
      }
    }

    try {
      const res = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'system',
            content: 'Bạn là chuyên gia phân tích dữ liệu. Dựa vào Tên bảng và Các cột, hãy suy luận ngữ cảnh nghiệp vụ. Trả về DUY NHẤT một JSON hợp lệ có 4 trường: "entityName" (danh từ chỉ từng dòng dữ liệu, VD: đơn hàng, sinh viên, bệnh nhân), "valueName" (danh từ chỉ số liệu quan trọng nhất để đo lường, VD: doanh thu, điểm số, chi phí), "actionName" (động từ đặc trưng, VD: bán được, đạt được, thăm khám), "targetName" (danh từ chỉ đối tượng bị tác động/nhóm chính, VD: khách hàng, lớp học, bác sĩ). Viết bằng Tiếng Việt. KHÔNG TRẢ LỜI GÌ KHÁC NGOÀI JSON.'
          }, {
            role: 'user',
            content: `Tên bảng: ${table.name}, Cột: ${(table.columns||[]).map(c=>c.name).join(', ')}`
          }],
          model: 'gpt-4o-mini',
          temperature: 0.1
        })
      });

      if (res.ok) {
        const data = await res.json();
        let text = data.choices[0].message.content;
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const aiDomain = JSON.parse(text);
        if (aiDomain.entityName && aiDomain.valueName && aiDomain.actionName && aiDomain.targetName) {
           aiDomainCache[cacheKey] = aiDomain;
           return aiDomain;
        }
      }
    } catch (e) {
      console.warn("AI Domain guess failed, using fallback:", e);
    }

    aiDomainCache[cacheKey] = fallbackDomain;
    return fallbackDomain;
  }

  function buildQualityMission(table, domain, dialect) {
    const q = value => quoteUserQueryIdentifier(value, dialect);
    const columns = (table.columns || []).slice(0, 5);
    const checks = columns.map(column => {
      const alias = `missing_${getMissionColumnAlias(column, 'col')}`;
      return `  SUM(CASE WHEN ${q(column.name)} IS NULL OR TRIM(CAST(${q(column.name)} AS TEXT)) = '' THEN 1 ELSE 0 END) AS ${q(alias)}`;
    });
    const key = getKeyColumn(table);
    const distinct = key ? `,\n  COUNT(DISTINCT ${q(key.name)}) AS ${q(`distinct_${getMissionColumnAlias(key, 'key')}`)}` : '';
    return makeMission({
      type: 'Tổng quan',
      title: `Thống kê tổng quan số lượng ${domain.entityName}`,
      brief: `Sếp hỏi: "Hiện tại chúng ta đang có tổng cộng bao nhiêu ${domain.entityName}? Hãy kiểm tra xem có trường dữ liệu nào bị trống (NULL) không để đảm bảo chất lượng báo cáo."`,
      deliverable: `Đếm tổng số ${domain.entityName} (dùng COUNT). Kèm theo đó đếm số dòng bị NULL của một số cột chính.`,
      tables: [table.name],
      difficulty: 'Dễ',
      sql: `-- Sếp giao: audit chất lượng dữ liệu bảng ${table.name}\nSELECT\n  COUNT(*) AS ${q('total_rows')}${distinct}${checks.length ? ',\n' + checks.join(',\n') : ''}\nFROM ${q(table.name)};`
    });
  }

  function buildTopContributorMission(table, metric, dimension, domain, dialect) {
    const q = value => quoteUserQueryIdentifier(value, dialect);
    const sql = `-- Sếp giao: tìm nhóm đóng góp lớn nhất theo ${metric.name}\nSELECT\n  ${q(dimension.name)} AS ${q('group_name')},\n  COUNT(*) AS ${q('record_count')},\n  SUM(${q(metric.name)}) AS ${q('total_value')},\n  AVG(${q(metric.name)}) AS ${q('avg_value')}\nFROM ${q(table.name)}\nGROUP BY ${q(dimension.name)}\nORDER BY ${q('total_value')} DESC`;
    return makeMission({
      type: 'Phân tích',
      title: `Nhóm ${domain.targetName} nào mang lại nhiều ${domain.valueName} nhất?`,
      brief: `Sếp muốn biết: "Nhóm ${domain.targetName} nào (dựa trên ${dimension.name}) đang mang lại tổng ${domain.valueName} (dựa vào cột ${metric.name}) cao nhất?".`,
      deliverable: `Sử dụng GROUP BY theo ${dimension.name}, tính tổng và trung bình của ${metric.name}. Sắp xếp từ cao xuống thấp.`,
      tables: [table.name],
      difficulty: 'Vừa',
      sql: limitUserSQL(sql, 10, dialect)
    });
  }

  function buildOutlierMission(table, metric, domain, dialect) {
    const q = value => quoteUserQueryIdentifier(value, dialect);
    const sql = `-- Sếp giao: tìm các dòng bất thường cao hơn mặt bằng chung\nSELECT *\nFROM ${q(table.name)}\nWHERE ${q(metric.name)} > (SELECT AVG(${q(metric.name)}) * 1.5 FROM ${q(table.name)})\nORDER BY ${q(metric.name)} DESC`;
    return makeMission({
      type: 'Săn lỗi',
      title: `Tìm kiếm ${domain.entityName} có ${domain.valueName} cao bất thường`,
      brief: `Sếp nghi ngờ: "Có vẻ như có một số ${domain.entityName} có ${domain.valueName} (ở cột ${metric.name}) cao quá mức bình thường. Lôi mấy record đó ra đây để tôi kiểm tra!".`,
      deliverable: `Lọc ra các dòng có ${metric.name} cao hơn gấp 1.5 lần so với mức trung bình của toàn bộ dữ liệu.`,
      tables: [table.name],
      difficulty: 'Khó',
      sql: limitUserSQL(sql, 20, dialect)
    });
  }

  function buildDuplicateMission(table, key, domain, dialect) {
    const q = value => quoteUserQueryIdentifier(value, dialect);
    const sql = `-- Sếp giao: tìm key bị trùng, dễ gây sai báo cáo\nSELECT\n  ${q(key.name)} AS ${q('suspect_key')},\n  COUNT(*) AS ${q('duplicate_count')}\nFROM ${q(table.name)}\nGROUP BY ${q(key.name)}\nHAVING COUNT(*) > 1\nORDER BY ${q('duplicate_count')} DESC`;
    return makeMission({
      type: 'Săn lỗi',
      title: `Kiểm tra trùng lặp mã ${domain.entityName}`,
      brief: `Phòng Data báo có rủi ro trùng lặp dữ liệu. Sếp yêu cầu: "Tìm xem có ${domain.entityName} nào (dựa trên ${key.name}) bị lặp lại nhiều lần không để tránh tính đúp số liệu."`,
      deliverable: `Tìm các giá trị ${key.name} xuất hiện từ 2 lần trở lên bằng cách dùng GROUP BY và HAVING.`,
      tables: [table.name],
      difficulty: 'Vừa',
      sql: limitUserSQL(sql, 20, dialect)
    });
  }

  function buildTrendMission(table, dateColumn, metric, domain, dialect) {
    const q = value => quoteUserQueryIdentifier(value, dialect);
    const metricSelect = metric
      ? `,\n  SUM(${q(metric.name)}) AS ${q('total_value')},\n  AVG(${q(metric.name)}) AS ${q('avg_value')}`
      : '';
    const sql = `-- Sếp giao: xem xu hướng theo thời gian\nSELECT\n  SUBSTR(CAST(${q(dateColumn.name)} AS TEXT), 1, 7) AS ${q('period')},\n  COUNT(*) AS ${q('record_count')}${metricSelect}\nFROM ${q(table.name)}\nGROUP BY SUBSTR(CAST(${q(dateColumn.name)} AS TEXT), 1, 7)\nORDER BY ${q('period')} ASC`;
    return makeMission({
      type: 'Xu hướng',
      title: `Phân tích biến động ${domain.valueName} theo thời gian`,
      brief: `Sếp thắc mắc: "Tình hình dạo này ra sao? Hãy vẽ cho tôi bức tranh xu hướng thay đổi của ${domain.valueName} qua từng tháng."`,
      deliverable: metric ? `Gộp dữ liệu theo từng tháng (dựa vào ${dateColumn.name}), tính tổng số ${domain.entityName} và tổng ${domain.valueName} của tháng đó.` : `Gộp dữ liệu theo tháng (dựa vào ${dateColumn.name}) và đếm số lượng ${domain.entityName}.`,
      tables: [table.name],
      difficulty: 'Khó',
      sql
    });
  }

  function buildSegmentMission(table, metric, dimension, domain, dialect) {
    const q = value => quoteUserQueryIdentifier(value, dialect);
    const dimSelect = dimension ? `,\n  ${q(dimension.name)} AS ${q('group_name')}` : '';
    const dimGroup = dimension ? `, ${q(dimension.name)}` : '';
    const sql = `-- Sếp giao: phân tầng record theo hiệu suất so với trung bình\nSELECT\n  CASE\n    WHEN ${q(metric.name)} >= stats.avg_metric * 1.2 THEN 'High'\n    WHEN ${q(metric.name)} <= stats.avg_metric * 0.8 THEN 'Low'\n    ELSE 'Normal'\n  END AS ${q('performance_band')}${dimSelect},\n  COUNT(*) AS ${q('record_count')},\n  AVG(${q(metric.name)}) AS ${q('avg_value')}\nFROM ${q(table.name)}\nCROSS JOIN (SELECT AVG(${q(metric.name)}) AS avg_metric FROM ${q(table.name)}) stats\nGROUP BY ${q('performance_band')}${dimGroup}\nORDER BY ${q('avg_value')} DESC`;
    return makeMission({
      type: 'Phân tầng',
      title: `Phân loại ${domain.entityName} thành các nhóm hiệu suất`,
      brief: `Sếp ra bài toán khó: "Để có chiến lược chăm sóc tốt hơn, hãy phân loại ${domain.entityName} thành 3 nhóm: Cao, Bình thường và Thấp dựa trên mức ${domain.valueName} so với mặt bằng chung."`,
      deliverable: `Sử dụng CASE WHEN để chia nhóm. Nhóm 'High' nếu ${metric.name} >= 120% trung bình, 'Low' nếu <= 80%, còn lại là 'Normal'. Đếm số lượng và tính trung bình ${metric.name} cho từng nhóm.`,
      tables: [table.name],
      difficulty: 'Rất khó',
      sql
    });
  }

  function findJoinMission(tables, domain, dialect) {
    if (!Array.isArray(tables) || tables.length < 2) return null;
    const q = value => quoteUserQueryIdentifier(value, dialect);
    for (let i = 0; i < tables.length; i++) {
      for (let j = i + 1; j < tables.length; j++) {
        const left = tables[i];
        const right = tables[j];
        const rightByName = new Map((right.columns || []).map(column => [normalizeSchemaLabel(column.name), column]));
        const leftColumn = (left.columns || []).find(column => rightByName.has(normalizeSchemaLabel(column.name)));
        if (!leftColumn) continue;
        const rightColumn = rightByName.get(normalizeSchemaLabel(leftColumn.name));
        const sql = `-- Sếp giao: kiểm tra mức độ khớp giữa 2 bảng\nSELECT\n  a.${q(leftColumn.name)} AS ${q('join_key')},\n  COUNT(*) AS ${q('matched_rows')}\nFROM ${q(left.name)} AS a\nINNER JOIN ${q(right.name)} AS b\n  ON a.${q(leftColumn.name)} = b.${q(rightColumn.name)}\nGROUP BY a.${q(leftColumn.name)}\nORDER BY ${q('matched_rows')} DESC`;
        return makeMission({
          type: 'Kết nối',
          title: `Kiểm tra mức độ khớp dữ liệu giữa 2 bảng`,
          brief: `Trước khi dựng báo cáo tổng hợp, sếp dặn: "Kiểm tra xem hai bảng ${left.name} và ${right.name} có khớp được với nhau qua key ${leftColumn.name} không nhé."`,
          deliverable: `Sử dụng INNER JOIN giữa 2 bảng, đếm số lượng ${domain.entityName} khớp nối thành công theo từng key.`,
          tables: [left.name, right.name],
          difficulty: 'Rất khó',
          sql: limitUserSQL(sql, 20, dialect)
        });
      }
    }
    return null;
  }

  async function buildUserDataMissions() {
    const summary = typeof getUserDataSummary === 'function' ? getUserDataSummary() : { tables: [] };
    const tables = summary.tables || [];
    const dialect = getSelectedUserDialect();
    let missions = [];

    for (const table of tables) {
      const domain = await guessTableDomain(table);
      const metrics = getMetricColumns(table);
      const dimensions = getDimensionColumns(table);
      const dates = getDateColumns(table);
      const key = getKeyColumn(table);
      const metric = metrics[0];
      const dimension = dimensions[0] || key;

      missions.push(buildQualityMission(table, domain, dialect));
      if (metric && dimension) missions.push(buildTopContributorMission(table, metric, dimension, domain, dialect));
      if (metric) missions.push(buildOutlierMission(table, metric, domain, dialect));
      if (key) missions.push(buildDuplicateMission(table, key, domain, dialect));
      if (dates[0]) missions.push(buildTrendMission(table, dates[0], metric, domain, dialect));
      if (metric) missions.push(buildSegmentMission(table, metric, dimension, domain, dialect));
    }

    if (tables.length > 0) {
      const firstDomain = await guessTableDomain(tables[0]);
      const joinMission = findJoinMission(tables, firstDomain, dialect);
      if (joinMission) missions.unshift(joinMission);
    }

    const diffMap = { 'Dễ': 1, 'Vừa': 2, 'Khó': 3, 'Rất khó': 4 };
    missions.sort((a, b) => (diffMap[a.difficulty] || 99) - (diffMap[b.difficulty] || 99));

    if (!missions.length) return [];
    const start = userMissionOffset % missions.length;
    return [...missions.slice(start), ...missions.slice(0, start)].slice(0, 1);
  }

  async function getUserDataMissionsHTML() {
    userDataMissions = await buildUserDataMissions();
    if (!userDataMissions.length) {
      return `
        <div class="data-empty-state">
          <strong>Chưa có mission</strong>
          <span>Upload data trước, hệ thống sẽ tự tạo vài bài phân tích kiểu sếp giao.</span>
        </div>`;
    }

    return userDataMissions.map((mission, index) => `
      <article class="data-mission-card clickable-mission" data-mission-index="${index}" title="Bấm để tạo sườn SQL">
        <div class="data-mission-meta">
          <span>${escapeAppHTML(mission.type)}</span>
          <strong>${escapeAppHTML(mission.difficulty)}</strong>
        </div>
        <h4>${escapeAppHTML(mission.title)}</h4>
        <p>${escapeAppHTML(mission.brief)}</p>
        <small>${escapeAppHTML(mission.deliverable)}</small>
        <div class="data-mission-foot">
          <em>Bảng: ${mission.tables.map(table => escapeAppHTML(table)).join(', ')}</em>
          <span class="mission-hint">Bấm để tạo sườn SQL</span>
        </div>
      </article>
    `).join('');
  }

  async function refreshUserDataMissions() {
    const list = document.getElementById('user-data-missions');
    if (!list) return;
    
    list.innerHTML = `
      <div class="data-empty-state" style="padding: 30px 10px; opacity: 0.8;">
        <style>@keyframes spin-ai { 100% { transform: rotate(360deg); } }</style>
        <div style="margin: 0 auto 15px; width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #06b6d4; border-radius: 50%; animation: spin-ai 1s linear infinite;"></div>
        <strong>AI đang phân tích ngữ cảnh...</strong>
        <span style="display:block; margin-top: 5px;">Đợi chút để hệ thống đọc schema và nhận diện nghiệp vụ.</span>
      </div>`;
      
    list.innerHTML = await getUserDataMissionsHTML();
    
    list.querySelectorAll('[data-mission-index]').forEach(card => {
      card.addEventListener('click', () => {
        const mission = userDataMissions[Number(card.dataset.missionIndex)];
        const input = document.getElementById('user-sql-input');
        if (!mission || !input) return;
        const q = value => quoteUserQueryIdentifier(value, getSelectedUserDialect());
        input.value = `-- Sếp giao: ${mission.title}\n-- Yêu cầu: ${mission.brief}\nSELECT \nFROM ${q(mission.tables[0])}\nLIMIT 20;`;
        updateUserDataLineNumbers();
        input.focus();
      });
    });
  }


  function getUserDataWorkspaceContext() {
    const active = document.getElementById('lesson-content')?.classList.contains('data-lab-mode') || false;
    const summary = typeof getUserDataSummary === 'function' ? getUserDataSummary() : { tables: [] };
    const queryInput = document.getElementById('user-sql-input');
    const output = document.getElementById('user-sql-output');
    const status = document.getElementById('user-data-status');
    return {
      active,
      dialect: getSelectedUserDialect(),
      tables: summary.tables || [],
      missions: userDataMissions || [],
      currentSQL: queryInput?.value?.trim() || '',
      outputText: output?.textContent?.trim() || '',
      statusText: status?.textContent?.trim() || ''
    };
  }

  window.SQLDataLab = {
    getContext: getUserDataWorkspaceContext,
    refreshMissions: refreshUserDataMissions
  };

  function updateUserDataLineNumbers() {
    const input = document.getElementById('user-sql-input');
    const lines = document.getElementById('user-sql-line-numbers');
    if (!input || !lines) return;
    lines.innerHTML = Array.from({ length: input.value.split('\n').length }, (_, index) => index + 1).join('<br>');
  }

  function refreshUserDataSchema() {
    const schema = document.getElementById('user-data-schema');
    if (!schema) return;
    schema.innerHTML = getUserDataSchemaHTML();
    schema.querySelectorAll('[data-query-table]').forEach(button => {
      button.addEventListener('click', () => {
        const input = document.getElementById('user-sql-input');
        if (!input) return;
        const dialect = getSelectedUserDialect();
        const sql = `SELECT * FROM ${quoteUserQueryIdentifier(button.dataset.queryTable, dialect)}`;
        input.value = limitUserSQL(sql, 20, dialect);
        updateUserDataLineNumbers();
        input.focus();
      });
    });
    refreshUserDataMissions();
  }

  function setUserDataStatus(html, type = '') {
    const el = document.getElementById('user-data-status');
    if (!el) return;
    el.className = `data-status ${type}`.trim();
    el.innerHTML = html;
  }

  function resetUserDataOutput() {
    const output = document.getElementById('user-sql-output');
    const time = document.getElementById('user-query-time');
    if (time) time.textContent = '';
    if (output) {
      output.innerHTML = `
        <div class="output-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <p>Kết quả query data riêng sẽ hiển thị tại đây</p>
        </div>`;
    }
  }

  async function handleUserDataFiles(files) {
    const items = Array.from(files || []);
    if (!items.length) return;
    const queryDialect = document.getElementById('user-data-dialect')?.value || getSelectedDialect();
    setUserDataStatus('Đang import dữ liệu...', 'loading');
    try {
      const results = await importUserDataFiles(items, { dialect: 'auto' });
      refreshUserDataSchema();
      setUserDataStatus(`<ul>${results.map(renderImportMessage).join('')}</ul>`, 'success');

      const summary = getUserDataSummary();
      const firstTable = summary.tables?.[0];
      const input = document.getElementById('user-sql-input');
      if (firstTable && input && !input.value.trim()) {
        const sql = `SELECT * FROM ${quoteUserQueryIdentifier(firstTable.name, queryDialect)}`;
        input.value = limitUserSQL(sql, 20, queryDialect);
        updateUserDataLineNumbers();
      }
    } catch (error) {
      setUserDataStatus(`<strong>Import lỗi:</strong> ${escapeAppHTML(error.message)}`, 'error');
    }
  }

  function runUserDataQuery() {
    const input = document.getElementById('user-sql-input');
    const output = document.getElementById('user-sql-output');
    const time = document.getElementById('user-query-time');
    if (!input || !output) return;
    const sql = input.value.trim();
    if (!sql) {
      output.innerHTML = '<div class="error-msg">⚠️ Hãy nhập câu SQL trước khi chạy.</div>';
      return;
    }
    const dialect = document.getElementById('user-data-dialect')?.value || getSelectedDialect();
    const result = executeUserDataSQL(sql, { dialect });
    output.innerHTML = formatResults(result);
    if (time) time.textContent = result.time ? `${result.time}ms` : '';
    refreshUserDataSchema();
  }

  function renderUserDataLab() {
    currentLesson = null;
    const lessonContentEl = document.getElementById('lesson-content');
    lessonContentEl.classList.remove('exercise-mode');
    lessonContentEl.classList.add('data-lab-mode');
    document.getElementById('sql-editor-panel').style.display = 'none';
    document.getElementById('complete-section').style.display = 'none';
    document.getElementById('prev-lesson').disabled = true;
    document.getElementById('next-lesson').disabled = true;
    document.getElementById('breadcrumb').innerHTML = '<span>Data Lab</span><span class="sep">›</span><span class="current">Upload data riêng</span>';
    document.getElementById('open-data-lab')?.classList.add('active');

    lessonContentEl.innerHTML = `
      <section class="data-lab">
        <div class="data-lab-hero">
          <div>
            <span class="data-lab-kicker">User Data Workspace</span>
            <h2>Upload dữ liệu riêng rồi query như SQL bình thường</h2>
            <p>Tạo database riêng từ CSV, TSV, JSON hoặc file SQL. Dữ liệu được xử lý trong trình duyệt và tách khỏi database mẫu của bài học.</p>
          </div>
          <div class="data-lab-format-grid" aria-label="Định dạng hỗ trợ">
            <span>CSV / TSV</span>
            <span>JSON</span>
            <span>SQL file</span>
            <span>SQLite engine</span>
          </div>
        </div>

        <div class="data-lab-grid">
          <section class="data-upload-panel">
            <div class="data-panel-head">
              <div>
                <span>Import</span>
                <h3>Dữ liệu của bạn</h3>
              </div>
              <button id="btn-reset-user-data" class="data-panel-action" type="button">Reset DB</button>
            </div>
            <label id="user-data-dropzone" class="data-dropzone" for="user-data-file">
              <input id="user-data-file" type="file" multiple accept=".csv,.tsv,.txt,.json,.sql,text/csv,application/json">
              <strong>Kéo thả file hoặc bấm để upload</strong>
              <span>CSV/TSV cần dòng header. JSON hỗ trợ array object hoặc object chứa nhiều array bảng.</span>
            </label>
            <div id="user-data-status" class="data-status"></div>
            <div class="data-schema-head">
              <h3>Schema hiện tại</h3>
              <span>Bấm tên bảng để tạo SELECT mẫu</span>
            </div>
            <div id="user-data-schema" class="data-schema-list">
              ${getUserDataSchemaHTML()}
            </div>
          </section>

          <section class="data-query-panel">
            <div class="data-query-toolbar">
              <label class="dialect-picker data-dialect-picker" title="Chọn dialect SQL để viết query">
                <span>Dialect</span>
                <select id="user-data-dialect">${getDialectOptionsHTML(getSelectedDialect(), false)}</select>
              </label>
              <div class="data-query-actions">
                <button id="btn-clear-user-query" class="editor-btn" type="button">Xóa</button>
                <button id="btn-run-user-query" class="editor-btn btn-run" type="button">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Chạy query
                </button>
              </div>
            </div>
            <div class="data-dialect-note">MySQL, PostgreSQL và SQL Server được mô phỏng bằng SQLite cho các cú pháp phổ biến như <code>TOP</code>, <code>CONCAT()</code>, <code>ILIKE</code>, <code>GETDATE()</code>.</div>
            <section class="data-mission-panel" aria-label="Sếp giao việc">
              <div class="data-mission-head">
                <div>
                  <span>Sếp giao việc</span>
                  <h3>Mission biến hoá theo data</h3>
                </div>
                <button id="btn-refresh-missions" class="data-panel-action" type="button">Đổi đề</button>
              </div>
              <div id="user-data-missions" class="data-mission-list">
                ${getUserDataMissionsHTML()}
              </div>
            </section>
            <div class="editor-input-wrap data-query-editor">
              <div class="line-numbers" id="user-sql-line-numbers">1</div>
              <textarea id="user-sql-input" class="sql-input" spellcheck="false" placeholder="-- Upload data trước, rồi query tại đây&#10;SELECT * FROM ten_bang LIMIT 20;"></textarea>
            </div>
            <div class="editor-output data-query-output">
              <div class="output-header">
                <span>📊 Kết quả data riêng</span>
                <span id="user-query-time" class="query-time"></span>
              </div>
              <div id="user-sql-output" class="sql-output">
                <div class="output-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                  <p>Kết quả query data riêng sẽ hiển thị tại đây</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>`;

    const fileInput = document.getElementById('user-data-file');
    const dropzone = document.getElementById('user-data-dropzone');
    const queryInput = document.getElementById('user-sql-input');
    const dialectSelect = document.getElementById('user-data-dialect');

    refreshUserDataSchema();
    resetUserDataOutput();

    fileInput?.addEventListener('change', () => {
      handleUserDataFiles(fileInput.files);
      fileInput.value = '';
    });
    dropzone?.addEventListener('dragover', event => {
      event.preventDefault();
      dropzone.classList.add('dragover');
    });
    dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone?.addEventListener('drop', event => {
      event.preventDefault();
      dropzone.classList.remove('dragover');
      handleUserDataFiles(event.dataTransfer?.files);
    });
    document.getElementById('btn-run-user-query')?.addEventListener('click', runUserDataQuery);
    document.getElementById('btn-refresh-missions')?.addEventListener('click', () => {
      userMissionOffset += 1;
      refreshUserDataMissions();
    });
    document.getElementById('btn-clear-user-query')?.addEventListener('click', () => {
      if (queryInput) queryInput.value = '';
      updateUserDataLineNumbers();
      resetUserDataOutput();
    });
    document.getElementById('btn-reset-user-data')?.addEventListener('click', () => {
      if (!confirm('Xóa toàn bộ database upload hiện tại?')) return;
      if (!resetUserDataDatabase()) {
        setUserDataStatus('SQL Engine chưa sẵn sàng. Vui lòng thử lại sau khi trang tải xong.', 'error');
        return;
      }
      if (queryInput) queryInput.value = '';
      updateUserDataLineNumbers();
      refreshUserDataSchema();
      resetUserDataOutput();
      setUserDataStatus('Đã reset database upload.', 'success');
    });
    queryInput?.addEventListener('input', updateUserDataLineNumbers);
    queryInput?.addEventListener('keydown', event => {
      if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        runUserDataQuery();
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        const start = queryInput.selectionStart;
        queryInput.value = queryInput.value.slice(0, start) + '  ' + queryInput.value.slice(queryInput.selectionEnd);
        queryInput.selectionStart = queryInput.selectionEnd = start + 2;
        updateUserDataLineNumbers();
      }
    });
    dialectSelect?.addEventListener('change', () => {
      if (dialectSelect.value !== 'auto') {
        localStorage.setItem('sql_dialect', dialectSelect.value);
        const mainDialect = document.getElementById('sql-dialect');
        if (mainDialect) mainDialect.value = dialectSelect.value;
      }
      refreshUserDataSchema();
    });

    toggleSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
    localStorage.setItem('sql_theme', isLight ? 'dark' : 'light');
    updateThemeLabel();
  }

  function updateThemeLabel() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.getElementById('theme-label').textContent = isLight ? 'Light Mode' : 'Dark Mode';
  }

  function toggleSidebar(show) {
    document.getElementById('sidebar').classList.toggle('open', show);
    document.getElementById('sidebar-overlay').classList.toggle('active', show);
  }

  function filterSidebar() {
    const q = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('.nav-chapter').forEach(ch => {
      let hasMatch = false;
      ch.querySelectorAll('.nav-lesson').forEach(l => {
        const match = l.textContent.toLowerCase().includes(q);
        l.style.display = match ? '' : 'none';
        if (match) hasMatch = true;
      });
      ch.style.display = hasMatch || !q ? '' : 'none';
      if (q && hasMatch) ch.classList.add('open');
    });
  }
})();
