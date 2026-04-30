(function() {
  function closeIntro() {
    const intro = document.getElementById('intro-screen');
    if (!intro) return;
    intro.classList.add('intro-screen-hidden');
    document.body.classList.remove('intro-active');
    setTimeout(() => intro.remove(), 420);
  }

  function initIntro() {
    const intro = document.getElementById('intro-screen');
    const enter = document.getElementById('intro-enter');
    if (!intro || !enter) {
      document.body.classList.remove('intro-active');
      return;
    }
    enter.addEventListener('click', closeIntro);
    intro.addEventListener('keydown', event => {
      if (event.key === 'Enter') closeIntro();
    });
    setTimeout(() => enter.focus(), 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntro);
  } else {
    initIntro();
  }
})();
