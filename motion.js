(() => {
  'use strict';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  // Content remains visible if JavaScript is unavailable or an animation fails.
  const running = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (preference.matches) continue;
      const animation = entry.target.animate([
        { opacity: 0, transform: 'translateY(22px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
      running.add(animation);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .contact').forEach(node => observer.observe(node));
  preference.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    running.forEach(animation => animation.cancel());
    running.clear();
  });
})();
