(() => {
  const panel = document.querySelector('.cinematic-panel');
  const background = document.querySelector('.cinematic-panel .cinematic-bg');
  if (!panel || !background) return;

  let ticking = false;

  const update = () => {
    ticking = false;

    // Desktop already uses background-attachment: fixed.
    // This JS parallax recreates the same premium "photo stays behind"
    // feeling on iOS/Android where fixed backgrounds are unreliable.
    if (window.innerWidth > 1000) {
      background.style.transform = '';
      return;
    }

    const rect = panel.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom < -100 || rect.top > viewport + 100) return;

    const travel = viewport + rect.height;
    const progress = Math.max(0, Math.min(1, (viewport - rect.top) / travel));
    const offset = (progress - 0.5) * 150;

    background.style.backgroundAttachment = 'scroll';
    background.style.willChange = 'transform';
    background.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('orientationchange', requestUpdate, { passive: true });
})();
