// Simple parallax engine for layered background
(function () {
  if (typeof window === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.getElementById('landscape');
  if (!container) return;
  const layers = Array.from(container.querySelectorAll('.layer'));
  let lastScrollY = window.scrollY;
  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed) || 0.1;
      // horizontal and subtle vertical parallax to give depth
      const offsetX = -scrollY * speed;
      const offsetY = -Math.max(0, scrollY * (speed * 0.15));
      layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });
    lastScrollY = scrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // initial position
  update();
})();
