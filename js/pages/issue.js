/* ============================================================
   OLMS — Issue Book Page Logic
   ============================================================ */

const IssuePage = (() => {
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    populateDropdowns();
    setupPreview();
    setupForm();
  }

  // ── Populate Dropdowns ──
  function populateDropdowns() {
    const studentSelect = document.getElementById('issue-student-select');
    const bookSelect = document.getElementById('issue-book-select');

    if (studentSelect) {
      const students = DataStore.getStudents();
      studentSelect.innerHTML = '<option value="">Select a student...</option>' +
        students.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
    }

    if (bookSelect) {
      const books = DataStore.getAvailableBooks();
      bookSelect.innerHTML = '<option value="">Select a book...</option>' +
        books.map(b => {
          const avail = b.totalCopies - b.issuedCopies;
          return `<option value="${b.id}">${b.title} — ${avail} available</option>`;
        }).join('');
    }
  }

  // ── Live Preview ──
  function setupPreview() {
    const studentSelect = document.getElementById('issue-student-select');
    const bookSelect = document.getElementById('issue-book-select');

    const updatePreview = () => {
      const previewEmpty = document.getElementById('issue-preview-empty');
      const previewContent = document.getElementById('issue-preview-content');
      
      const studentId = studentSelect?.value;
      const bookId = bookSelect?.value;

      if (!studentId && !bookId) {
        if (previewEmpty) previewEmpty.style.display = 'flex';
        if (previewContent) previewContent.style.display = 'none';
        return;
      }

      if (previewEmpty) previewEmpty.style.display = 'none';
      if (previewContent) previewContent.style.display = 'block';

      const student = studentId ? DataStore.getStudent(studentId) : null;
      const book = bookId ? DataStore.getBook(bookId) : null;
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 14);

      const details = [
        { label: 'Student Name', value: student ? student.name : '-' },
        { label: 'Student ID', value: student ? student.id : '-' },
        { label: 'Department', value: student ? student.department : '-' },
        { label: 'Book Title', value: book ? book.title : '-' },
        { label: 'Author', value: book ? book.author : '-' },
        { label: 'Issue Date', value: Utils.formatDate(today.toISOString()) },
        { label: 'Due Date', value: Utils.formatDate(dueDate.toISOString()) },
      ];

      if (previewContent) {
        previewContent.innerHTML = `
          <h3 style="font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--space-5);">
            <i class="fas fa-eye" style="color: var(--primary-light); margin-right: 8px;"></i>
            Issue Preview
          </h3>
          ${details.map(d => `
            <div class="issue-detail-row">
              <span class="issue-detail-label">${d.label}</span>
              <span class="issue-detail-value">${d.value}</span>
            </div>
          `).join('')}
        `;

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(previewContent.querySelectorAll('.issue-detail-row'),
            { opacity: 0, x: 10 },
            { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
          );
        }
      }
    };

    if (studentSelect) studentSelect.addEventListener('change', updatePreview);
    if (bookSelect) bookSelect.addEventListener('change', updatePreview);
  }

  // ── Form Submission ──
  function setupForm() {
    const form = document.getElementById('issue-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const studentId = document.getElementById('issue-student-select').value;
      const bookId = document.getElementById('issue-book-select').value;
      const studentError = document.getElementById('issue-student-error');
      const bookError = document.getElementById('issue-book-error');
      let valid = true;

      // Reset
      studentError.classList.remove('visible');
      bookError.classList.remove('visible');

      if (!studentId) {
        studentError.textContent = '⚠ Please select a student';
        studentError.classList.add('visible');
        valid = false;
      }

      if (!bookId) {
        bookError.textContent = '⚠ Please select a book';
        bookError.classList.add('visible');
        valid = false;
      }

      if (!valid) return;

      // Confirm modal
      const book = DataStore.getBook(bookId);
      const student = DataStore.getStudent(studentId);

      Modal.confirm(
        'Confirm Book Issue',
        `Are you sure you want to issue <strong>"${book.title}"</strong> to <strong>${student.name}</strong>?<br><br>The due date will be <strong>14 days from today</strong>.`,
        () => {
          const result = DataStore.issueBook(studentId, bookId);

          if (result.success) {
            // Show success
            const formCard = document.getElementById('issue-form-card');
            const successEl = document.getElementById('issue-success');

            if (formCard) formCard.style.display = 'none';
            if (successEl) {
              successEl.classList.add('active');
              successEl.style.display = 'flex';

              if (typeof gsap !== 'undefined') {
                const icon = successEl.querySelector('.issue-success-icon');
                gsap.fromTo(icon,
                  { scale: 0, rotation: -180 },
                  { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
                );
              }
            }

            Toast.show('Book Issued!', `"${book.title}" issued to ${student.name} successfully.`, 'success');

            // Reset after 3 seconds
            setTimeout(() => {
              if (formCard) formCard.style.display = 'block';
              if (successEl) { successEl.classList.remove('active'); successEl.style.display = 'none'; }
              form.reset();
              document.getElementById('issue-preview-empty').style.display = 'flex';
              document.getElementById('issue-preview-content').style.display = 'none';
              populateDropdowns(); // Refresh available books
            }, 3000);
          } else {
            Toast.show('Error', result.error, 'error');
          }
        },
        'Issue Book',
        'primary'
      );
    });
  }

  return { init };
})();
