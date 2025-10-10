// Simple toggle for project details
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(targetId);
      if (!panel) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      // Use hidden attribute for instant hide; when opening, set data-open to allow CSS
      if (isOpen) {
        panel.hidden = true;
        panel.removeAttribute('data-open');
      } else {
        panel.hidden = false;
        panel.setAttribute('data-open', 'true');
        // move focus into the content for accessibility
        const firstFocusable = panel.querySelector('a, button, input, [tabindex]');
        if (firstFocusable) firstFocusable.focus();
      }
    });
  });
});
