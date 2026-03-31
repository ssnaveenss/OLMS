/* ============================================================
   OLMS — Student Profile Page Logic
   ============================================================ */

const ProfilePage = (() => {
  let initialized = false;
  const currentStudentId = 'STU001'; // Default "logged in" student

  function init() {
    if (initialized) return;
    initialized = true;

    renderProfile();
    setupTabs();
  }

  function renderProfile() {
    const student = DataStore.getStudent(currentStudentId);
    if (!student) return;

    // Profile header
    const avatar = document.getElementById('profile-avatar');
    const name = document.getElementById('profile-name');
    const id = document.getElementById('profile-id');
    const dept = document.getElementById('profile-department');

    if (avatar) avatar.textContent = student.name.split(' ').map(n => n[0]).join('');
    if (name) name.textContent = student.name;
    if (id) id.textContent = student.id;
    if (dept) dept.textContent = student.department;

    // Stats
    const activeIssues = DataStore.getStudentActiveIssues(currentStudentId);
    const allIssues = DataStore.getStudentIssues(currentStudentId);
    const returns = DataStore.getStudentReturnHistory(currentStudentId);
    const totalFines = allIssues.reduce((sum, i) => sum + i.fine, 0);

    Utils.animateCounter(document.getElementById('profile-stat-active'), activeIssues.length);
    Utils.animateCounter(document.getElementById('profile-stat-total'), allIssues.length);

    const fineEl = document.getElementById('profile-stat-fines');
    if (fineEl) {
      const target = totalFines;
      const startTime = performance.now();
      function updateFine(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / 1200, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        fineEl.textContent = '$' + (target * eased).toFixed(2);
        if (progress < 1) requestAnimationFrame(updateFine);
      }
      requestAnimationFrame(updateFine);
    }

    // Render tab contents
    renderIssuedBooks(activeIssues);
    renderReturnHistory(allIssues.filter(i => i.returnDate));
    renderFineSummary(allIssues);
  }

  function setupTabs() {
    const tabs = document.querySelectorAll('#profile-tabs .tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        const targetPane = document.getElementById(target);
        if (targetPane) {
          targetPane.classList.add('active');

          // Animate table rows
          if (typeof gsap !== 'undefined') {
            const rows = targetPane.querySelectorAll('tr');
            gsap.fromTo(rows,
              { opacity: 0, x: -10 },
              { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
            );
          }
        }
      });
    });
  }

  function renderIssuedBooks(issues) {
    const tbody = document.getElementById('profile-issued-tbody');
    if (!tbody) return;

    if (issues.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-muted);">
          <i class="fas fa-book-open" style="font-size:2rem;margin-bottom:12px;display:block;opacity:0.3;"></i>
          No books currently issued
        </td></tr>
      `;
      return;
    }

    tbody.innerHTML = issues.map(issue => {
      const book = DataStore.getBook(issue.bookId);
      const today = new Date();
      const dueDate = new Date(issue.dueDate);
      const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      const isOverdue = daysLeft < 0;

      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;border-radius:8px;background:${DataStore.getCoverGradient(book ? book.coverIdx : 0)};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="fas fa-book" style="color:rgba(255,255,255,0.8);font-size:11px;"></i>
              </div>
              <span style="font-weight:500;">${book ? book.title : issue.bookId}</span>
            </div>
          </td>
          <td>${Utils.formatDate(issue.issueDate)}</td>
          <td style="color:${isOverdue ? 'var(--danger)' : 'var(--text-secondary)'}">
            ${Utils.formatDate(issue.dueDate)}
          </td>
          <td>
            <span class="badge ${isOverdue ? 'badge-danger' : daysLeft <= 3 ? 'badge-warning' : 'badge-success'}">
              ${isOverdue ? Math.abs(daysLeft) + ' days overdue' : daysLeft + ' days left'}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="ProfilePage.handleReturn('${issue.id}')">
              <i class="fas fa-undo"></i> Return
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderReturnHistory(returns) {
    const tbody = document.getElementById('profile-return-tbody');
    if (!tbody) return;

    if (returns.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-muted);">
          <i class="fas fa-history" style="font-size:2rem;margin-bottom:12px;display:block;opacity:0.3;"></i>
          No return history
        </td></tr>
      `;
      return;
    }

    tbody.innerHTML = returns.map(issue => {
      const book = DataStore.getBook(issue.bookId);

      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;border-radius:8px;background:${DataStore.getCoverGradient(book ? book.coverIdx : 0)};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="fas fa-book" style="color:rgba(255,255,255,0.8);font-size:11px;"></i>
              </div>
              <span style="font-weight:500;">${book ? book.title : issue.bookId}</span>
            </div>
          </td>
          <td>${Utils.formatDate(issue.issueDate)}</td>
          <td>${Utils.formatDate(issue.returnDate)}</td>
          <td>
            ${issue.fine > 0
              ? `<span class="badge badge-danger">$${issue.fine.toFixed(2)}</span>`
              : '<span class="badge badge-success">No fine</span>'}
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderFineSummary(allIssues) {
    const container = document.getElementById('fine-summary-content');
    if (!container) return;

    const fineIssues = allIssues.filter(i => i.fine > 0);
    const totalFine = fineIssues.reduce((sum, i) => sum + i.fine, 0);

    container.innerHTML = `
      <div style="display:flex;gap:var(--space-5);margin-bottom:var(--space-6);flex-wrap:wrap;">
        <div class="return-info-item" style="flex:1;min-width:180px;">
          <div class="return-info-label">Total Fines</div>
          <div class="return-info-value" style="color:${totalFine > 0 ? 'var(--danger)' : 'var(--success)'}">$${totalFine.toFixed(2)}</div>
        </div>
        <div class="return-info-item" style="flex:1;min-width:180px;">
          <div class="return-info-label">Fine Incidents</div>
          <div class="return-info-value">${fineIssues.length}</div>
        </div>
        <div class="return-info-item" style="flex:1;min-width:180px;">
          <div class="return-info-label">Average Fine</div>
          <div class="return-info-value">$${fineIssues.length > 0 ? (totalFine / fineIssues.length).toFixed(2) : '0.00'}</div>
        </div>
      </div>

      ${fineIssues.length > 0 ? `
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              ${fineIssues.map(issue => {
                const book = DataStore.getBook(issue.bookId);
                return `
                  <tr>
                    <td style="font-weight:500;">${book ? book.title : issue.bookId}</td>
                    <td>${Utils.formatDate(issue.dueDate)}</td>
                    <td>${issue.returnDate ? Utils.formatDate(issue.returnDate) : '-'}</td>
                    <td><span class="badge badge-danger">$${issue.fine.toFixed(2)}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state" style="padding:var(--space-8);">
          <div class="empty-state-icon"><i class="fas fa-check-circle"></i></div>
          <h3 class="empty-state-title">No Fines!</h3>
          <p class="empty-state-text">You have a clean record. Keep it up!</p>
        </div>
      `}
    `;
  }

  function handleReturn(issueId) {
    App.navigateTo('return');
  }

  return { init, handleReturn };
})();
