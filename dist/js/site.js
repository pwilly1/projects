(function () {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const nav = document.getElementById('primary-navigation');
  const navToggle = document.querySelector('.nav-toggle');
  const progress = document.querySelector('.scroll-progress span');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeNavigation = () => {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
  };

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      nav.classList.toggle('is-open', !isOpen);
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNavigation();
        navToggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeNavigation();
    });
  }

  let scrollTicking = false;
  const updateScrollUI = () => {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;

    if (header) header.classList.toggle('is-scrolled', scrollTop > 28);
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    scrollTicking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollUI);
        scrollTicking = true;
      }
    },
    { passive: true },
  );
  updateScrollUI();

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window && revealItems.length) {
    root.classList.add('reveal-ready');
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -9% 0px', threshold: 0.08 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const sectionLinks = Array.from(document.querySelectorAll('.site-nav a[href*="#"]'));
  const sections = sectionLinks
    .map((link) => {
      const hash = new URL(link.href).hash;
      return { link, section: hash ? document.querySelector(hash) : null };
    })
    .filter((item) => item.section);

  if ('IntersectionObserver' in window && sections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        sectionLinks.forEach((link) => link.removeAttribute('aria-current'));
        const match = sections.find((item) => item.section === visible.target);
        if (match) match.link.setAttribute('aria-current', 'location');
      },
      { rootMargin: '-34% 0px -52% 0px', threshold: [0.01, 0.15, 0.4] },
    );

    sections.forEach((item) => activeObserver.observe(item.section));
  }
})();
