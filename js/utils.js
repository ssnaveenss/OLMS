/* ============================================================
   OLMS — Toast Notification System
   ============================================================ */

const Toast = (() => {
  let container = null;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Show a toast notification
   * @param {string} title 
   * @param {string} message 
   * @param {'success'|'error'|'warning'|'info'} type 
   * @param {number} duration - ms before auto-dismiss (default 4000)
   */
  function show(title, message, type = 'info', duration = 4000) {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;
    toastEl.innerHTML = `
      <div class="toast-icon">
        <i class="${icons[type]}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
    `;

    const c = getContainer();
    c.appendChild(toastEl);

    // Close button
    toastEl.querySelector('.toast-close').addEventListener('click', () => dismiss(toastEl));

    // GSAP entrance
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(toastEl,
        { opacity: 0, x: 60, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    }

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => dismiss(toastEl), duration);
    }

    return toastEl;
  }

  function dismiss(toastEl) {
    if (!toastEl || toastEl.classList.contains('removing')) return;
    toastEl.classList.add('removing');

    if (typeof gsap !== 'undefined') {
      gsap.to(toastEl, {
        opacity: 0,
        x: 60,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => toastEl.remove()
      });
    } else {
      setTimeout(() => toastEl.remove(), 300);
    }
  }

  return { show };
})();


/* ============================================================
   OLMS — Modal System
   ============================================================ */

const Modal = (() => {
  /**
   * Show a confirmation modal
   * @param {string} title
   * @param {string} message
   * @param {Function} onConfirm
   * @param {string} confirmText
   * @param {string} type - 'danger' | 'primary' | 'success'
   */
  function confirm(title, message, onConfirm, confirmText = 'Confirm', type = 'primary') {
    // Remove existing modal
    const existing = document.querySelector('.modal-backdrop.dynamic');
    if (existing) existing.remove();
    const existingModal = document.querySelector('.modal.dynamic');
    if (existingModal) existingModal.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop dynamic';
    
    const modal = document.createElement('div');
    modal.className = 'modal dynamic';
    modal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" aria-label="Close modal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">${message}</div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
        <button class="btn btn-${type} modal-confirm-btn">${confirmText}</button>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    // Animate in
    requestAnimationFrame(() => {
      backdrop.classList.add('active');
      modal.classList.add('active');
    });

    function close() {
      backdrop.classList.remove('active');
      modal.classList.remove('active');
      setTimeout(() => {
        backdrop.remove();
        modal.remove();
      }, 300);
    }

    backdrop.addEventListener('click', close);
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('.modal-cancel-btn').addEventListener('click', close);
    modal.querySelector('.modal-confirm-btn').addEventListener('click', () => {
      close();
      if (onConfirm) onConfirm();
    });
  }

  return { confirm };
})();


/* ============================================================
   OLMS — Utility Functions
   ============================================================ */

const Utils = (() => {
  /**
   * Animate a number counter from 0 to target
   */
  function animateCounter(element, target, duration = 1500) {
    if (!element) return;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(start + (target - start) * eased);
      element.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Debounce function
   */
  function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Format date to readable string
   */
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /**
   * Calculate days between two dates
   */
  function daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2 - d1);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Generate random ID
   */
  function randomId() {
    return Math.random().toString(36).substring(2, 10);
  }

  return { animateCounter, debounce, formatDate, daysBetween, randomId };
})();
