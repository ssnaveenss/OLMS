/* ============================================================
   OLMS — Book Search Page Logic
   Live search, card/table toggle, issue buttons
   ============================================================ */

const BooksPage = (() => {
  let currentView = 'grid'; // 'grid' or 'table'
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    renderBooks(DataStore.getBooks());
    setupSearch();
    setupViewToggle();
  }

  // ── Render Books Grid ──
  function renderBooks(books) {
    renderGrid(books);
    renderTable(books);
    updateResultsCount(books.length);
  }

  function renderGrid(books) {
    const container = document.getElementById('books-grid');
    if (!container) return;

    if (books.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon"><i class="fas fa-search"></i></div>
          <h3 class="empty-state-title">No books found</h3>
          <p class="empty-state-text">Try adjusting your search terms or filters.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = books.map(book => {
      const available = book.totalCopies - book.issuedCopies;
      const isAvailable = available > 0;
      const badgeClass = isAvailable ? 'badge-success' : 'badge-danger';
      const badgeText = isAvailable ? `${available} Available` : 'Unavailable';

      return `
        <div class="book-card" data-book-id="${book.id}">
          <div class="book-card-cover" style="background: ${DataStore.getCoverGradient(book.coverIdx)};">
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center;">
              <i class="fas fa-book" style="font-size: 2.5rem; color: rgba(255,255,255,0.7); margin-bottom: 12px;"></i>
              <span style="color: rgba(255,255,255,0.9); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">${book.category}</span>
            </div>
            <div class="book-card-cover-gradient"></div>
          </div>
          <div class="book-card-body">
            <div class="book-card-category">${book.category}</div>
            <h3 class="book-card-title">${book.title}</h3>
            <p class="book-card-author">by ${book.author}</p>
            <div class="book-card-meta">
              <span class="badge ${badgeClass}">${badgeText}</span>
              <button class="btn btn-sm ${isAvailable ? 'btn-primary' : 'btn-secondary'}" 
                      ${!isAvailable ? 'disabled' : ''}
                      onclick="BooksPage.handleIssue('${book.id}')">
                <i class="fas fa-${isAvailable ? 'plus' : 'ban'}"></i>
                ${isAvailable ? 'Issue' : 'N/A'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Animate cards on render
    if (typeof gsap !== 'undefined') {
      const cards = container.querySelectorAll('.book-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 25, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }

  function renderTable(books) {
    const container = document.getElementById('books-table-body');
    if (!container) return;

    if (books.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 40px;">
            <div class="empty-state-icon" style="font-size:2rem;"><i class="fas fa-search"></i></div>
            <p style="color: var(--text-muted); margin-top: 8px;">No books found</p>
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = books.map(book => {
      const available = book.totalCopies - book.issuedCopies;
      const isAvailable = available > 0;

      return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:36px;height:36px;border-radius:8px;background:${DataStore.getCoverGradient(book.coverIdx)};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="fas fa-book" style="color:rgba(255,255,255,0.8);font-size:14px;"></i>
              </div>
              <div>
                <div style="font-weight:600;color:var(--text-primary);">${book.title}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">${book.isbn}</div>
              </div>
            </div>
          </td>
          <td>${book.author}</td>
          <td><span class="badge badge-primary">${book.category}</span></td>
          <td>${book.totalCopies}</td>
          <td><span class="badge ${isAvailable ? 'badge-success' : 'badge-danger'}">${isAvailable ? available + ' Available' : 'Unavailable'}</span></td>
          <td>
            <button class="btn btn-sm ${isAvailable ? 'btn-primary' : 'btn-secondary'}" 
                    ${!isAvailable ? 'disabled' : ''}
                    onclick="BooksPage.handleIssue('${book.id}')">
              <i class="fas fa-${isAvailable ? 'plus' : 'ban'}"></i>
              ${isAvailable ? 'Issue' : 'N/A'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateResultsCount(count) {
    const el = document.getElementById('search-results-count');
    if (el) el.textContent = `${count} books found`;
  }

  // ── Search with Debounce ──
  function setupSearch() {
    const searchInput = document.getElementById('book-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', Utils.debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      const allBooks = DataStore.getBooks();

      if (!query) {
        renderBooks(allBooks);
        return;
      }

      const filtered = allBooks.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query) ||
        book.isbn.includes(query)
      );

      renderBooks(filtered);
    }, 250));
  }

  // ── View Toggle ──
  function setupViewToggle() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-toggle-btn');
      if (!btn) return;
      
      const view = btn.dataset.view;
      if (!view) return;

      currentView = view;
      document.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const grid = document.getElementById('books-grid');
      const table = document.getElementById('books-table-wrapper');

      if (view === 'grid') {
        if (grid) { grid.style.display = 'grid'; grid.classList.add('active'); }
        if (table) { table.style.display = 'none'; table.classList.remove('active'); }
      } else {
        if (grid) { grid.style.display = 'none'; grid.classList.remove('active'); }
        if (table) { table.style.display = 'block'; table.classList.add('active'); }
      }
    });
  }

  // ── Issue Button Handler ──
  function handleIssue(bookId) {
    const book = DataStore.getBook(bookId);
    if (!book) return;

    // Navigate to issue page with pre-selected book
    App.navigateTo('issue');
    setTimeout(() => {
      const bookSelect = document.getElementById('issue-book-select');
      if (bookSelect) {
        bookSelect.value = bookId;
        bookSelect.dispatchEvent(new Event('change'));
      }
    }, 100);
  }

  return { init, handleIssue };
})();
