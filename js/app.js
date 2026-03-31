/* ============================================================
   OLMS — Application Core
   Handles routing, theme toggle, sidebar, and shared utilities
   ============================================================ */

const App = (() => {
  // ── State ──
  let currentPage = 'login';
  let sidebarCollapsed = false;
  let theme = localStorage.getItem('olms-theme') || 'dark';

  // ── Initialization ──
  function init() {
    applyTheme(theme);
    setupThemeToggle();
    setupSidebar();
    setupMobileMenu();

    // Check if already "logged in"
    const isLoggedIn = sessionStorage.getItem('olms-logged-in');
    if (isLoggedIn) {
      navigateTo('dashboard');
    } else {
      navigateTo('login');
    }
  }

  // ── Theme ──
  function applyTheme(t) {
    theme = t;
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('olms-theme', t);

    // Update toggle icons
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(el => {
      el.innerHTML = t === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    });
  }

  function setupThemeToggle() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-toggle');
      if (btn) {
        applyTheme(theme === 'dark' ? 'light' : 'dark');
      }
    });
  }

  // ── Sidebar ──
  function setupSidebar() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.sidebar-toggle');
      if (toggle) {
        sidebarCollapsed = !sidebarCollapsed;
        const sidebar = document.querySelector('.sidebar');
        const appShell = document.querySelector('.app-shell');
        if (sidebar) sidebar.classList.toggle('collapsed', sidebarCollapsed);
        if (appShell) appShell.classList.toggle('sidebar-collapsed', sidebarCollapsed);
      }
    });
  }

  function setupMobileMenu() {
    document.addEventListener('click', (e) => {
      const menuBtn = e.target.closest('.navbar-menu-btn');
      if (menuBtn) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.toggle('mobile-open');
      }

      // Close sidebar on link click (mobile)
      if (e.target.closest('.sidebar-link') && window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
      }
    });

    // Close on backdrop click
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !e.target.closest('.navbar-menu-btn')) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });
  }

  // ── Page title mapping ──
  const pageTitles = {
    login: 'Login',
    dashboard: 'Dashboard',
    books: 'Book Search',
    issue: 'Issue Book',
    return: 'Return Book',
    profile: 'Student Profile'
  };

  // ── Routing ──
  function navigateTo(page) {
    currentPage = page;

    // Update navbar title
    const navTitle = document.getElementById('navbar-page-title');
    if (navTitle && pageTitles[page]) {
      navTitle.textContent = pageTitles[page];
    }

    // Update active sidebar link
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === page);
    });

    // Hide all pages
    document.querySelectorAll('.page-view').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    // Show shell for non-login pages
    const appShell = document.querySelector('.app-shell');
    const loginPage = document.getElementById('login-page');

    if (page === 'login') {
      if (appShell) appShell.style.display = 'none';
      if (loginPage) {
        loginPage.style.display = 'flex';
        loginPage.classList.add('active');
        if (typeof LoginPage !== 'undefined') LoginPage.init();
      }
    } else {
      if (loginPage) loginPage.style.display = 'none';
      if (appShell) appShell.style.display = 'flex';

      const targetPage = document.getElementById(`${page}-page`);
      if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');

        // Page-specific initialization
        switch (page) {
          case 'dashboard':
            if (typeof DashboardPage !== 'undefined') DashboardPage.init();
            break;
          case 'books':
            if (typeof BooksPage !== 'undefined') BooksPage.init();
            break;
          case 'issue':
            if (typeof IssuePage !== 'undefined') IssuePage.init();
            break;
          case 'return':
            if (typeof ReturnPage !== 'undefined') ReturnPage.init();
            break;
          case 'profile':
            if (typeof ProfilePage !== 'undefined') ProfilePage.init();
            break;
        }
      }
    }

    // Run GSAP entrance animations
    animatePageEntrance(page);
  }

  // ── GSAP Page Entrance ──
  function animatePageEntrance(page) {
    if (typeof gsap === 'undefined') return;

    const container = page === 'login'
      ? document.getElementById('login-page')
      : document.getElementById(`${page}-page`);
    if (!container) return;

    // Page header
    const header = container.querySelector('.page-header');
    if (header) {
      gsap.fromTo(header, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    }

    // Stat cards
    const statCards = container.querySelectorAll('.stat-card');
    if (statCards.length) {
      gsap.fromTo(statCards,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.15 }
      );
    }

    // Cards
    const cards = container.querySelectorAll('.card, .chart-card, .issue-form-card, .issue-preview, .return-search-card, .return-details, .profile-header-card, .profile-tab-content');
    if (cards.length) {
      gsap.fromTo(cards,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
      );
    }

    // Book cards
    const bookCards = container.querySelectorAll('.book-card');
    if (bookCards.length) {
      gsap.fromTo(bookCards,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.15 }
      );
    }

    // Tables
    const tableRows = container.querySelectorAll('.table tbody tr');
    if (tableRows.length) {
      gsap.fromTo(tableRows,
        { opacity: 0, x: -15 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out', delay: 0.2 }
      );
    }
  }

  // ── Logout ──
  function logout() {
    sessionStorage.removeItem('olms-logged-in');
    navigateTo('login');
    Toast.show('Logged Out', 'You have been signed out successfully.', 'info');
  }

  return { init, navigateTo, logout, animatePageEntrance };
})();

// ── Navigation event delegation ──
document.addEventListener('click', (e) => {
  const navLink = e.target.closest('[data-page]');
  if (navLink) {
    e.preventDefault();
    App.navigateTo(navLink.dataset.page);
  }

  const logoutBtn = e.target.closest('#logout-btn');
  if (logoutBtn) {
    e.preventDefault();
    App.logout();
  }
});

// ── Initialize on DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
