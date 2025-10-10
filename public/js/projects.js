// Client-side script for project modal interactions
(function () {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalTech = modal.querySelector('.modal-tech');
  const modalImage = modal.querySelector('.modal-image img');
  const closeBtn = modal.querySelector('.modal-close');

  function openModal(data) {
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.long;
    if (modalTech) modalTech.textContent = 'Tech: ' + (data.tech || []).join(', ');
    if (modalImage) {
      modalImage.src = data.image;
      modalImage.alt = data.title + ' screenshot';
    }
    // set repo/demo links
    const repoBtn = modal.querySelector('#modal-repo');
    const demoBtn = modal.querySelector('#modal-demo');
    if (repoBtn) repoBtn.setAttribute('href', data.repo || 'https://github.com/pwilly1');
    if (demoBtn) {
      if (data.demo) {
        demoBtn.removeAttribute('hidden');
        demoBtn.setAttribute('href', data.demo);
      } else {
        demoBtn.setAttribute('hidden', '');
      }
    }

    // accessibility: show modal and trap focus
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    previousActiveElement = document.activeElement;
    // focus the close button first
    if (closeBtn && typeof closeBtn.focus === 'function') closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    // return focus to the element that opened the modal
    try { if (previousActiveElement && typeof previousActiveElement.focus === 'function') previousActiveElement.focus(); } catch (e) {}
  }

  let previousActiveElement = null;
  document.querySelectorAll('.card').forEach((c) => {
    const card = /** @type {HTMLElement} */ (c);
    card.addEventListener('click', () => {
      const data = {
        title: card.dataset.title,
        image: card.dataset.image,
        short: card.dataset.short,
        long: card.dataset.long,
        tech: JSON.parse(card.dataset.tech || '[]'),
        repo: card.dataset.repo,
        demo: card.dataset.demo
      };
      openModal(data);
    });

    card.addEventListener('keydown', (e) => {
      const key = /** @type {KeyboardEvent} */ (e).key;
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Simple focus trap
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && modal.classList.contains('open')) {
      const focusable = modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = /** @type {HTMLElement} */ (focusable[0]);
      const last = /** @type {HTMLElement} */ (focusable[focusable.length - 1]);
      if (e.shiftKey) { // shift + tab
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else { // tab
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
