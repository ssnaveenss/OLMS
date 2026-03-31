/* ============================================================
   OLMS — Return Book Page Logic
   ============================================================ */

const ReturnPage = (() => {
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    setupSearch();
  }

  function setupSearch() {
    const form = document.getElementById('return-search-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const bookId = document.getElementById('return-book-id').value.trim().toUpperCase();
      const studentId = document.getElementById('return-student-id').value.trim().toUpperCase();

      if (!bookId || !studentId) {
        Toast.show('Missing Fields', 'Please enter both Book ID and Student ID.', 'warning');
        return;
      }

      const issue = DataStore.findIssueRecord(bookId, studentId);

      if (!issue) {
        Toast.show('Not Found', 'No active issue found for this Book ID and Student ID combination.', 'error');
        hideDetails();
        return;
      }

      showDetails(issue);
    });
  }

  function showDetails(issue) {
    const container = document.getElementById('return-details');
    if (!container) return;

    container.style.display = 'block';

    const book = DataStore.getBook(issue.bookId);
    const student = DataStore.getStudent(issue.studentId);
    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    const isOverdue = today > dueDate;
    const daysLate = isOverdue ? Utils.daysBetween(issue.dueDate, today.toISOString().split('T')[0]) : 0;
    const fine = daysLate * 1.00;

    const detailsContent = document.getElementById('return-details-content');
    if (detailsContent) {
      detailsContent.innerHTML = `
        <div class="return-details-header">
          <div>
            <h3 style="font-size: var(--text-xl); font-weight: 700;">Issue Details</h3>
            <p style="font-size: var(--text-sm); color: var(--text-muted);">Issue ID: ${issue.id}</p>
          </div>
          <span class="badge ${isOverdue ? 'badge-danger' : 'badge-success'}">
            ${isOverdue ? '⚠ Overdue' : '✓ On Time'}
          </span>
        </div>

        <div class="return-info-grid">
          <div class="return-info-item">
            <div class="return-info-label">Book Title</div>
            <div class="return-info-value">${book ? book.title : issue.bookId}</div>
          </div>
          <div class="return-info-item">
            <div class="return-info-label">Author</div>
            <div class="return-info-value">${book ? book.author : '-'}</div>
          </div>
          <div class="return-info-item">
            <div class="return-info-label">Student</div>
            <div class="return-info-value">${student ? student.name : issue.studentId}</div>
          </div>
          <div class="return-info-item">
            <div class="return-info-label">Department</div>
            <div class="return-info-value">${student ? student.department : '-'}</div>
          </div>
          <div class="return-info-item">
            <div class="return-info-label">Issue Date</div>
            <div class="return-info-value">${Utils.formatDate(issue.issueDate)}</div>
          </div>
          <div class="return-info-item">
            <div class="return-info-label">Due Date</div>
            <div class="return-info-value" style="color: ${isOverdue ? 'var(--danger)' : 'var(--text-primary)'}">${Utils.formatDate(issue.dueDate)}</div>
          </div>
          ${isOverdue ? `
          <div class="return-info-item fine-highlight">
            <div class="return-info-label">Days Overdue</div>
            <div class="return-info-value">${daysLate} days</div>
          </div>
          <div class="return-info-item fine-highlight">
            <div class="return-info-label">Fine Amount</div>
            <div class="return-info-value">$${fine.toFixed(2)}</div>
          </div>
          ` : `
          <div class="return-info-item fine-highlight no-fine">
            <div class="return-info-label">Fine</div>
            <div class="return-info-value">$0.00</div>
          </div>
          `}
        </div>

        <div class="return-actions">
          <button class="btn btn-secondary" onclick="ReturnPage.hideDetails()">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button class="btn ${isOverdue ? 'btn-danger' : 'btn-success'}" onclick="ReturnPage.confirmReturn('${issue.id}')">
            <i class="fas fa-undo"></i> ${isOverdue ? 'Return & Pay Fine ($' + fine.toFixed(2) + ')' : 'Confirm Return'}
          </button>
        </div>
      `;
    }

    // Animate in
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(container,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );

      const items = container.querySelectorAll('.return-info-item');
      gsap.fromTo(items,
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.2 }
      );

      // Animate fine amount if overdue
      if (daysLate > 0) {
        const fineEls = container.querySelectorAll('.fine-highlight');
        gsap.fromTo(fineEls,
          { boxShadow: '0 0 0 rgba(225, 112, 85, 0)' },
          { boxShadow: '0 0 20px rgba(225, 112, 85, 0.15)', duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' }
        );
      }
    }
  }

  function hideDetails() {
    const container = document.getElementById('return-details');
    if (container) {
      if (typeof gsap !== 'undefined') {
        gsap.to(container, {
          opacity: 0, y: 10, duration: 0.3, ease: 'power2.in',
          onComplete: () => { container.style.display = 'none'; }
        });
      } else {
        container.style.display = 'none';
      }
    }
  }

  function confirmReturn(issueId) {
    const issue = DataStore.getIssuedBooks().find(i => i.id === issueId);
    if (!issue) return;

    const book = DataStore.getBook(issue.bookId);
    const student = DataStore.getStudent(issue.studentId);

    Modal.confirm(
      'Confirm Return',
      `Confirm return of <strong>"${book ? book.title : issue.bookId}"</strong> from <strong>${student ? student.name : issue.studentId}</strong>?`,
      () => {
        const result = DataStore.returnBook(issueId);

        if (result.success) {
          if (result.fine > 0) {
            Toast.show('Book Returned with Fine', `Fine of $${result.fine.toFixed(2)} applied for late return.`, 'warning');
          } else {
            Toast.show('Book Returned', 'Book has been returned on time. No fine.', 'success');
          }
          hideDetails();

          // Clear form
          document.getElementById('return-book-id').value = '';
          document.getElementById('return-student-id').value = '';
        } else {
          Toast.show('Error', result.error, 'error');
        }
      },
      'Confirm Return',
      'success'
    );
  }

  return { init, hideDetails, confirmReturn };
})();
