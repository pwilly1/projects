document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('resume-toggle');
  const panel = document.getElementById('resume-panel');
  if (!btn || !panel) return;
  // enforce initial closed state
  btn.setAttribute('aria-expanded', 'false');
  panel.hidden = true;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    if (open) {
      panel.hidden = true;
      panel.removeAttribute('data-open');
    } else {
      panel.hidden = false;
      panel.setAttribute('data-open', 'true');
      // focus first heading inside
      const h = panel.querySelector('h3, h4, h5');
      if (h) h.focus();
    }
  });
});

// Expose a global toggle function in case inline onclick is used or script timing differs
window.toggleResume = function() {
  const btn = document.getElementById('resume-toggle');
  const panel = document.getElementById('resume-panel');
  if (!btn || !panel) return;
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  if (open) {
    panel.hidden = true;
    panel.removeAttribute('data-open');
  } else {
    panel.hidden = false;
    panel.setAttribute('data-open', 'true');
    const h = panel.querySelector('h3, h4, h5');
    if (h) h.focus();
  }
};
