// Main Application
(async function() {
  if (window.SQLAuthReady) {
    await window.SQLAuthReady;
  }
  // Update index.html script tags to load all lesson files
  const completed = JSON.parse(localStorage.getItem('sql_completed') || '[]');
  const theme = localStorage.getItem('sql_theme') || 'dark';
  let currentLesson = null;
  let allLessons = [];

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
  scriptEl.src = 'https://sql.js.org/dist/sql-wasm.js';
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
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('menu-toggle').addEventListener('click', () => toggleSidebar(true));
  document.getElementById('sidebar-close').addEventListener('click', () => toggleSidebar(false));
  document.getElementById('sidebar-overlay').addEventListener('click', () => toggleSidebar(false));
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
    document.getElementById('sql-editor-panel').style.display = '';
    document.getElementById('breadcrumb').innerHTML = '<span>Trang chủ</span>';
    document.getElementById('prev-lesson').disabled = true;
    document.getElementById('next-lesson').disabled = true;
    document.getElementById('complete-section').style.display = 'none';
    const stats = getDashboardStats();
    const solved = JSON.parse(localStorage.getItem('sql_solved') || '[]');
    const nextLessonTitle = stats.nextLesson ? stats.nextLesson.title : 'Đã hoàn thành';
    const nextExerciseTitle = stats.nextExercise ? stats.nextExercise.exercise.title : 'Đã hoàn thành';
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
            </div>
          </div>
          <div class="roadmap-summary">
            <div><strong>${stats.completedLessons}/${stats.totalLessons}</strong><span>Bài giảng</span></div>
            <div><strong>${stats.solvedExercises}/${stats.totalExercises}</strong><span>Bài tập</span></div>
            <div><strong>${stats.lessonPercent}%</strong><span>Tiến độ học</span></div>
            <div><strong>${nextLessonTitle}</strong><span>Bài học tiếp theo</span></div>
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
    document.querySelectorAll('[data-start-ch]').forEach(el => {
      el.addEventListener('click', () => loadLesson(el.dataset.startCh));
    });
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
