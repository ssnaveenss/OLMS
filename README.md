# 📚 OLMS — Online Library Management System

A **premium, SaaS-style** frontend for managing library operations — built entirely with **vanilla HTML, CSS, and JavaScript**. No frameworks, no build tools, no dependencies to install. Just open and go.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Frontend_Only-orange.svg)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 🎯 What is this?

OLMS is a **frontend-only** library management dashboard. It simulates a full library system using mock data stored in JavaScript — no backend or database required. It's designed as a modern, responsive Single Page Application (SPA) with smooth animations and a premium glassmorphism UI.

> **Note:** This is a frontend prototype/demo. All data is stored in-memory and resets on page refresh. There is no real authentication or server-side persistence.

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- That's it! No Node.js, no npm, no build tools needed.

### Setup & Run

**Option 1 — Clone from GitHub:**

```bash
# 1. Clone the repository
git clone https://github.com/ssnaveenss/OLMS.git

# 2. Navigate into the project folder
cd OLMS

# 3. Open index.html in your browser
```

**Option 2 — Download ZIP:**

1. Go to [https://github.com/ssnaveenss/OLMS](https://github.com/ssnaveenss/OLMS)
2. Click the green **"Code"** button → **"Download ZIP"**
3. Extract the ZIP file
4. Open `index.html` in your browser

**Option 3 — Using a Local Server (recommended for best experience):**

```bash
# If you have Python installed:
cd OLMS
python -m http.server 8000
# Then open http://localhost:8000 in your browser

# Or if you have Node.js installed:
npx serve .
# Then open the URL shown in the terminal

# Or using VS Code:
# Install the "Live Server" extension → Right-click index.html → "Open with Live Server"
```

### 🔐 Login Credentials

Use any email/password combination to log in — the login form validates format only (not real credentials):

| Field    | Example Value          |
|----------|------------------------|
| Email    | `admin@library.com`    |
| Password | `password123`          |

> Any valid email format + any password (6+ characters) will work.

---

## 📸 Pages & Features

### 1. 🔑 Login Page
- Animated particle canvas background with floating orbs
- Glassmorphism login card with gradient accent
- Floating label inputs with validation
- Password visibility toggle
- "Remember me" checkbox & "Forgot password" link (UI only)
- Social login buttons (Google, Microsoft, GitHub — UI only)
- Success animation overlay on login
- GSAP-powered entrance animations

### 2. 📊 Dashboard
- **4 Stat Cards** — Total Books, Issued Books, Available Books, Total Fines
  - Animated number counters that count up on page load
  - Trend indicators (up/down percentages)
- **Monthly Overview Chart** — Bar chart (Chart.js) showing issues vs returns over 7 months
- **Category Distribution Chart** — Doughnut chart showing book categories
- **Recent Activity Feed** — Live-updating activity log with color-coded icons

### 3. 🔍 Book Search
- Real-time search bar — filters by title, author, category, or ISBN
- **Two view modes:**
  - **Grid View** — Gradient book cover cards with availability badges
  - **Table View** — Sortable table with status indicators
- Live result count
- Quick "Issue" button on available books

### 4. 📤 Issue Book
- Dropdown selects for Student and Book (populated from mock data)
- Live preview panel showing selected student/book details
- Form validation with error messages
- Success state with animated checkmark
- "Issue Another" quick-action button

### 5. 📥 Return Book
- Search by Book ID and/or Student ID
- Return details card showing:
  - Book info, student info, issue date, due date
  - Overdue status and calculated fine ($1/day late)
- Confirmation modal before processing return
- Toast notification on successful return

### 6. 👤 Student Profile
- Profile header card with avatar, name, department
- Quick stats (Active issues, Total issues, Fines)
- **3 Tabbed sections:**
  - **Issued Books** — Currently borrowed books with status badges
  - **Return History** — Past returns with fine details
  - **Fine Summary** — Breakdown of accumulated fines

---

## 🎨 Design & UI Features

| Feature | Details |
|---------|---------|
| **Theme Toggle** | Dark mode (default) and Light mode with full CSS variable switching |
| **Glassmorphism** | Frosted-glass cards with `backdrop-filter: blur()` |
| **Animations** | GSAP-powered page transitions, staggered card reveals, counter animations |
| **Typography** | Google Fonts — `Outfit` for headings, `Inter` for body text |
| **Color System** | HSL-based palette with primary (purple), secondary (teal), accent (pink) |
| **Responsive** | Fully responsive — works on mobile, tablet, and desktop |
| **Sidebar** | Collapsible sidebar with section grouping and active state tracking |
| **Toast Notifications** | Animated toast system with success, error, warning, info types |
| **Modals** | Confirmation modals with backdrop blur |
| **Custom Scrollbar** | Styled scrollbar matching the theme |

---

## 📁 Project Structure

```
OLMS/
├── index.html              # Single HTML file — all pages defined here
├── README.md               # You are here!
│
├── css/
│   ├── design-system.css   # Core design tokens, variables, and reusable components
│   ├── layout.css          # Sidebar, navbar, and app shell layout
│   ├── login.css           # Login page specific styles
│   └── pages.css           # Dashboard, books, issue, return, profile page styles
│
└── js/
    ├── app.js              # App core — routing, theme toggle, sidebar, GSAP animations
    ├── data.js             # Mock data store — books, students, issues, returns, activities
    ├── utils.js            # Toast notifications, Modal system, utility functions
    │
    └── pages/
        ├── login.js        # Login form validation, particle canvas, submit handler
        ├── dashboard.js    # Stat counters, Chart.js charts, activity feed
        ├── books.js        # Book search, grid/table rendering, view toggle
        ├── issue.js        # Issue form, preview panel, book issuing logic
        ├── return.js       # Return search, fine calculation, return processing
        └── profile.js      # Profile rendering, tabs, issued/history/fine tables
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling — custom properties, glassmorphism, gradients, animations, responsive design |
| **Vanilla JavaScript** | Application logic — SPA routing, DOM manipulation, event handling |
| **[GSAP 3.12](https://gsap.com/)** | Smooth page transitions, staggered animations, entrance effects |
| **[Chart.js 4.4](https://www.chartjs.org/)** | Dashboard charts (bar chart, doughnut chart) |
| **[Font Awesome 6.5](https://fontawesome.com/)** | Icon library |
| **[Google Fonts](https://fonts.google.com/)** | Inter & Outfit typefaces |

> All external libraries are loaded via CDN — no local installation required.

---

## ⚙️ Architecture Overview

### Single Page Application (SPA)
The app uses a custom client-side router (`App.navigateTo()`) to switch between pages without reloading. All pages are defined as `<div>` sections inside `index.html` and toggled via `display: none/block`.

### Module Pattern
Each JavaScript file uses the **Revealing Module Pattern** (IIFE returning public methods):
```javascript
const ModuleName = (() => {
  // Private state and functions
  function init() { /* ... */ }
  return { init };  // Public API
})();
```

### Data Layer
`DataStore` acts as a mock backend API with methods like:
- `getBooks()`, `getStudents()`, `getStats()`
- `issueBook(studentId, bookId)` — mutates in-memory data
- `returnBook(issueId)` — calculates fines, updates records
- `findIssueRecord(bookId, studentId)`

### Theme System
Uses CSS custom properties on `:root` and `[data-theme="light"]` selectors. The `App.applyTheme()` function toggles the `data-theme` attribute on `<html>` and persists the choice to `localStorage`.

---

## 📝 Important Notes

1. **No Backend** — This is purely a frontend project. All data lives in `js/data.js` as JavaScript arrays/objects and resets when you refresh the page.

2. **No Build Step** — There's no Webpack, Vite, or any bundler. Just raw HTML/CSS/JS files served directly.

3. **CDN Dependencies** — GSAP, Chart.js, Font Awesome, and Google Fonts are all loaded from CDNs. You **need an internet connection** for the full experience (icons, fonts, animations, charts).

4. **Session Persistence** — Login state is stored in `sessionStorage` (cleared when the browser tab closes). Theme preference is stored in `localStorage` (persists across sessions).

5. **Mock Data** — The app comes pre-loaded with:
   - 📖 12 books across 5 categories
   - 🎓 5 students from different departments
   - 📋 15 issue records (active + returned)
   - 📊 3 return history records
   - 📝 8 activity log entries

---

## 🤝 Contributing

This is a demo/learning project. Feel free to fork it and build on top of it — add a real backend, connect a database, or use it as a UI reference!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ using vanilla HTML, CSS & JavaScript
</p>
