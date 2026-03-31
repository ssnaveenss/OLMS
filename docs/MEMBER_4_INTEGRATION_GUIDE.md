# 🟡 Member 4 — Integration & Testing Guide

## Online Library Management System (OLMS)

> **Role:** Integration Engineer & QA Tester  
> **Objective:** Connect the frontend to the backend API, execute all test cases, write final documentation  
> **Repository:** [https://github.com/ssnaveenss/OLMS](https://github.com/ssnaveenss/OLMS)  
> **Depends On:** Member 2 (Backend) + Member 3 (Database) must be complete first

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Environment Setup](#3-environment-setup)
4. [Connection Verification](#4-connection-verification)
5. [Frontend-Backend Integration](#5-frontend-backend-integration)
6. [Test Cases](#6-test-cases)
7. [Documentation](#7-documentation)
8. [Deliverables](#8-deliverables)

---

## 1. Overview

### What You're Doing

You are the **final piece** that makes everything work together. Right now:

- **Frontend** (Member 1 ✅): A beautiful UI that uses fake/mock data from `js/data.js`
- **Backend** (Member 2): REST API server that talks to the database
- **Database** (Member 3): MySQL with tables, triggers, views, stored procedures

Your job is to:
1. **Replace** the mock data layer (`DataStore`) with real HTTP API calls
2. **Test** every feature end-to-end and document results
3. **Write** the final project documentation

### The Integration Flow

```
BEFORE (current state):
  Frontend → js/data.js (mock arrays in memory) → Fake responses

AFTER (your work):
  Frontend → js/api.js (HTTP fetch calls) → Backend API → MySQL Database → Real responses
```

---

## 2. Prerequisites

### Software to Install

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com/) | Code editor |
| **Python** | 3.10+ | [python.org](https://www.python.org/downloads/) | To run the backend |
| **MySQL** | 8.0+ | [dev.mysql.com](https://dev.mysql.com/downloads/installer/) | Database |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |
| **Postman** | Latest | [postman.com](https://www.postman.com/downloads/) | API testing |
| **Live Server** | VS Code Extension | Install from Extensions panel | Serve frontend |

### VS Code Extensions

- Live Server (Ritwick Dey)
- REST Client
- MySQL (Weijan Chen)

---

## 3. Environment Setup

### Step 1: Get the Latest Code

```bash
# Clone the repo (or pull latest if already cloned)
git clone https://github.com/ssnaveenss/OLMS.git
cd OLMS

# Make sure you have Member 2 and Member 3's work merged
git pull origin main

# Create your branch
git checkout -b feature/integration
```

### Step 2: Set Up the Database

```bash
# Login to MySQL
mysql -u root -p

# Run Member 3's scripts in order:
SOURCE database/schema.sql;
SOURCE database/indexes.sql;
SOURCE database/triggers.sql;
SOURCE database/views.sql;
SOURCE database/procedures.sql;
SOURCE database/seed.sql;

# Verify
SOURCE database/verify.sql;
EXIT;
```

### Step 3: Start the Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with your MySQL credentials
# Copy .env.example to .env and fill in your DB password

# Start the server
python app.py
```

You should see the backend running at `http://localhost:5000`.

### Step 4: Serve the Frontend

**Option A — VS Code Live Server:**
1. Open `index.html` in VS Code
2. Right-click → "Open with Live Server"
3. Browser opens at `http://localhost:5500` (or similar)

**Option B — Python HTTP server:**
```bash
# From the OLMS root directory (not backend/)
python -m http.server 8080
# Open http://localhost:8080
```

**Option C — npx serve:**
```bash
npx serve .
# Open the URL shown
```

---

## 4. Connection Verification

Before writing any code, verify all three layers are working:

### Test 1: Database is Running

```bash
mysql -u root -p -e "USE olms_db; SELECT COUNT(*) AS books FROM book;"
# Expected: 12
```

### Test 2: Backend is Running

```bash
curl http://localhost:5000/api/health
# Expected: {"success": true, "message": "OLMS API is running"}
```

Or open `http://localhost:5000/api/health` in your browser.

### Test 3: Backend Can Reach Database

```bash
curl http://localhost:5000/api/books
# Expected: JSON array of 12 books
```

### Test 4: Frontend Loads

Open `http://localhost:5500` (or your frontend URL) — you should see the login page.

> ⚠️ If any of these tests fail, coordinate with the responsible member before proceeding.

---

## 5. Frontend-Backend Integration

### Step 1: Create `js/api.js`

This file replaces the mock `DataStore` with real API calls:

```javascript
/* ============================================================
   OLMS — API Service Layer
   Replaces DataStore with real backend API calls
   ============================================================ */

const API = (() => {
  const BASE_URL = 'http://localhost:5000/api';

  function getToken() {
    return sessionStorage.getItem('olms-token');
  }

  function headers() {
    const h = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }

  async function request(endpoint, method = 'GET', body = null) {
    const options = { method, headers: headers() };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    return data;
  }

  // Auth
  const login = (email, password) => request('/auth/login', 'POST', { email, password });
  const register = (data) => request('/auth/register', 'POST', data);

  // Books
  const getBooks = () => request('/books');
  const getBook = (id) => request(`/books/${id}`);
  const searchBooks = (q) => request(`/books/search?q=${encodeURIComponent(q)}`);
  const getAvailableBooks = () => request('/books/available');

  // Students
  const getStudents = () => request('/students');
  const getStudent = (id) => request(`/students/${id}`);

  // Issues & Returns
  const issueBook = (studentId, bookId) => request('/issues', 'POST', { studentId, bookId });
  const returnBook = (issueId) => request('/returns', 'POST', { issueId });
  const getActiveIssues = () => request('/issues');
  const getStudentIssues = (id) => request(`/issues/student/${id}`);
  const findIssueRecord = (bookId, studentId) => request(`/issues/search?bookId=${bookId}&studentId=${studentId}`);
  const getStudentReturns = (id) => request(`/returns/student/${id}`);

  // Dashboard
  const getStats = () => request('/dashboard/stats');
  const getMonthlyData = () => request('/dashboard/monthly');
  const getCategoryData = () => request('/dashboard/categories');
  const getActivities = () => request('/dashboard/activity');

  return {
    login, register,
    getBooks, getBook, searchBooks, getAvailableBooks,
    getStudents, getStudent,
    issueBook, returnBook, getActiveIssues, getStudentIssues, findIssueRecord, getStudentReturns,
    getStats, getMonthlyData, getCategoryData, getActivities
  };
})();
```

### Step 2: Add `api.js` to `index.html`

Open `index.html` and add this script tag **before** the page scripts (around line 593):

```html
<!-- Add this AFTER js/data.js and BEFORE js/pages/login.js -->
<script src="js/api.js"></script>
```

### Step 3: Update Each Page Module

For each file in `js/pages/`, you need to replace synchronous `DataStore.xxx()` calls with asynchronous `API.xxx()` calls. This requires making functions `async` and adding `await`.

#### Pattern for Conversion

```javascript
// ══ BEFORE (synchronous mock data) ══
function init() {
    const books = DataStore.getBooks();
    renderBooks(books);
}

// ══ AFTER (async API calls) ══
async function init() {
    try {
        const response = await API.getBooks();
        const books = response.data;
        renderBooks(books);
    } catch (error) {
        console.error('Failed to load books:', error);
        Toast.show('Error', 'Failed to load books. Please try again.', 'error');
    }
}
```

#### Files to Update

| File | Key Changes |
|------|-------------|
| `js/pages/login.js` | Replace mock login with `await API.login(email, password)`. Store the returned JWT token in `sessionStorage.setItem('olms-token', data.token)`. |
| `js/pages/dashboard.js` | Replace `DataStore.getStats()` → `await API.getStats()`. Same for monthly data, category data, activities. |
| `js/pages/books.js` | Replace `DataStore.getBooks()` → `await API.getBooks()`. Replace search filtering with `await API.searchBooks(query)`. |
| `js/pages/issue.js` | Replace `DataStore.getStudents()` and `DataStore.getAvailableBooks()` → API calls for populating dropdowns. Replace `DataStore.issueBook()` → `await API.issueBook()`. |
| `js/pages/return.js` | Replace `DataStore.findIssueRecord()` → `await API.findIssueRecord()`. Replace `DataStore.returnBook()` → `await API.returnBook()`. |
| `js/pages/profile.js` | Replace all `DataStore.getStudent*()` calls with API equivalents. |

#### Update `app.js` Logout

```javascript
// In App.logout(), also clear the JWT token:
function logout() {
    sessionStorage.removeItem('olms-logged-in');
    sessionStorage.removeItem('olms-token');      // ADD THIS
    sessionStorage.removeItem('olms-user');        // ADD THIS
    navigateTo('login');
    Toast.show('Logged Out', 'You have been signed out successfully.', 'info');
}
```

### Step 4: Handle Loading States

Since API calls take time (unlike instant mock data), add loading indicators:

```javascript
async function init() {
    // Show loading
    container.innerHTML = '<div class="skeleton" style="height:200px;"></div>';
    
    try {
        const response = await API.getBooks();
        renderBooks(response.data);
    } catch (error) {
        container.innerHTML = '<p>Failed to load data.</p>';
        Toast.show('Error', error.message, 'error');
    }
}
```

### Step 5: Keep `data.js` as Fallback

Don't delete `js/data.js`. If the backend is down, the app can fall back to mock data:

```javascript
async function getBooks() {
    try {
        const response = await API.getBooks();
        return response.data;
    } catch {
        console.warn('API unavailable, using mock data');
        return DataStore.getBooks();
    }
}
```

---

## 6. Test Cases

### How to Document Results

For each test case, record:

| Field | Description |
|-------|-------------|
| Test ID | Unique identifier (TC-01, TC-02, etc.) |
| Module | Which module (Auth, Books, Issue, Return, etc.) |
| Description | What you're testing |
| Pre-conditions | What must be true before the test |
| Steps | Exact steps to reproduce |
| Expected Result | What should happen |
| Actual Result | What actually happened |
| Status | ✅ PASS or ❌ FAIL |
| Screenshot | Attach if relevant |

### 6.1 Authentication Tests (TC-01 to TC-06)

| ID | Description | Steps | Expected | Status |
|----|-------------|-------|----------|--------|
| TC-01 | Valid login | Enter `alice.j@university.edu` / `password123` → Click Sign In | Redirects to Dashboard, token stored | ⬜ |
| TC-02 | Invalid email format | Enter `abc` as email → Submit | "Invalid email" error shown | ⬜ |
| TC-03 | Empty password | Leave password blank → Submit | "Password required" error | ⬜ |
| TC-04 | Wrong password | Enter valid email + `wrongpass` → Submit | "Invalid credentials" error from API | ⬜ |
| TC-05 | Session persistence | Login → Close tab → Reopen page | Should show login page (session cleared) | ⬜ |
| TC-06 | Logout | Click logout button | Returns to login, token removed | ⬜ |

### 6.2 Book Search Tests (TC-07 to TC-12)

| ID | Description | Steps | Expected | Status |
|----|-------------|-------|----------|--------|
| TC-07 | Search by title | Type "Algorithms" in search | Shows matching books | ⬜ |
| TC-08 | Search by author | Type "Martin" in search | Shows "Clean Code" + "Refactoring" | ⬜ |
| TC-09 | Search by category | Type "AI" in search | Shows AI & ML books | ⬜ |
| TC-10 | Empty search results | Type "xyz123" | Shows "No books found" | ⬜ |
| TC-11 | Grid/Table toggle | Click grid icon, then table icon | View switches correctly | ⬜ |
| TC-12 | Book count | Load page | Correct "X books found" count | ⬜ |

### 6.3 Issue Book Tests (TC-13 to TC-18)

| ID | Description | Steps | Expected | Status |
|----|-------------|-------|----------|--------|
| TC-13 | Valid issue | Select student + available book → Submit | Success message, book issued | ⬜ |
| TC-14 | No student selected | Leave student blank → Submit | Validation error | ⬜ |
| TC-15 | No book selected | Leave book blank → Submit | Validation error | ⬜ |
| TC-16 | Book unavailable | Try issuing "Clean Code" (4/4 issued) | "No copies available" error | ⬜ |
| TC-17 | Duplicate issue | Issue same book to same student twice | "Already issued" error | ⬜ |
| TC-18 | Issue another | After success → Click "Issue Another" | Form resets | ⬜ |

### 6.4 Return Book Tests (TC-19 to TC-24)

| ID | Description | Steps | Expected | Status |
|----|-------------|-------|----------|--------|
| TC-19 | Valid return (on time) | Search active issue → Return | Success, fine = $0 | ⬜ |
| TC-20 | Late return | Return overdue book | Fine calculated correctly | ⬜ |
| TC-21 | Invalid book ID | Search non-existent ID | "Not found" error | ⬜ |
| TC-22 | Already returned | Return same book twice | "Already returned" error | ⬜ |
| TC-23 | Fine: 5 days late | Return book 5 days after due date | Fine = $5.00 | ⬜ |
| TC-24 | Fine: 25 days late | Return book 25 days after due date | Fine = $25.00 | ⬜ |

### 6.5 Dashboard Tests (TC-25 to TC-28)

| ID | Description | Steps | Expected | Status |
|----|-------------|-------|----------|--------|
| TC-25 | Stats display | Navigate to Dashboard | All 4 cards show correct numbers | ⬜ |
| TC-26 | Stats update | Issue a book → Go to Dashboard | Stats reflect new issue | ⬜ |
| TC-27 | Charts render | Load Dashboard | Both charts render with data | ⬜ |
| TC-28 | Activity feed | Load Dashboard | Recent activities shown | ⬜ |

### 6.6 Profile Tests (TC-29 to TC-32)

| ID | Description | Steps | Expected | Status |
|----|-------------|-------|----------|--------|
| TC-29 | Profile display | Go to Profile | Name, dept, avatar correct | ⬜ |
| TC-30 | Issued books tab | Click "Issued Books" | Shows active issues | ⬜ |
| TC-31 | Return history tab | Click "Return History" | Shows past returns | ⬜ |
| TC-32 | Fine summary tab | Click "Fine Summary" | Shows fine breakdown | ⬜ |

### 6.7 UI & Theme Tests (TC-33 to TC-37)

| ID | Description | Steps | Expected | Status |
|----|-------------|-------|----------|--------|
| TC-33 | Dark mode default | Load app | Dark theme active | ⬜ |
| TC-34 | Theme toggle | Click sun/moon icon | Switches theme | ⬜ |
| TC-35 | Theme persistence | Set light → Refresh | Light mode persists | ⬜ |
| TC-36 | Sidebar collapse | Click collapse button | Sidebar collapses | ⬜ |
| TC-37 | Mobile responsive | Resize to 375px width | Hamburger menu appears | ⬜ |

### 6.8 Database Constraint Tests (TC-38 to TC-40)

| ID | Description | Steps | Expected | Status |
|----|-------------|-------|----------|--------|
| TC-38 | Duplicate email | Register with existing email | "Email exists" error | ⬜ |
| TC-39 | Duplicate ISBN | Add book with existing ISBN | Rejected by DB | ⬜ |
| TC-40 | Invalid FK | Issue to fake student ID | Foreign key error | ⬜ |

---

## 7. Documentation

### Update `README.md`

After integration is complete, update the project's README to include:

1. **Full-stack setup instructions** (DB + Backend + Frontend)
2. **Architecture diagram** (copy from TEAM_PLAN.md)
3. **API endpoint summary table**
4. **Screenshots** of each page (take them and save in `docs/screenshots/`)
5. **Test results summary** (X/40 passed)

### Create Test Results Document

Save as `docs/test_results.md`:

```markdown
# OLMS — Test Results

| Module | Total | Passed | Failed |
|--------|-------|--------|--------|
| Authentication | 6 | ? | ? |
| Book Search | 6 | ? | ? |
| Issue Book | 6 | ? | ? |
| Return Book | 6 | ? | ? |
| Dashboard | 4 | ? | ? |
| Profile | 4 | ? | ? |
| UI & Theme | 5 | ? | ? |
| DB Constraints | 3 | ? | ? |
| **TOTAL** | **40** | **?** | **?** |

## Detailed Results
(Fill in each test case with actual results)
```

### Take Screenshots

Save in `docs/screenshots/`:
- `01_login_page.png`
- `02_dashboard.png`
- `03_book_search_grid.png`
- `04_book_search_table.png`
- `05_issue_book.png`
- `06_issue_success.png`
- `07_return_book.png`
- `08_return_fine.png`
- `09_profile.png`
- `10_dark_mode.png`
- `11_light_mode.png`
- `12_mobile_view.png`

---

## 8. Deliverables

- [ ] `js/api.js` — API service layer created
- [ ] `index.html` — Updated to include `api.js` script
- [ ] `js/pages/login.js` — Uses real API authentication
- [ ] `js/pages/dashboard.js` — Fetches stats from API
- [ ] `js/pages/books.js` — Fetches books from API
- [ ] `js/pages/issue.js` — Issues books via API
- [ ] `js/pages/return.js` — Returns books via API
- [ ] `js/pages/profile.js` — Fetches student data from API
- [ ] `js/app.js` — Updated logout to clear token
- [ ] All 40 test cases executed and documented
- [ ] `docs/test_results.md` — Test results document
- [ ] `docs/screenshots/` — Screenshots of all pages
- [ ] `README.md` — Updated with full-stack instructions
- [ ] Code committed and pushed:
  ```bash
  git add .
  git commit -m "feat: frontend-backend integration, test cases, documentation"
  git push origin feature/integration
  ```

---

> **Questions?** See `TEAM_PLAN.md` in project root for full architecture overview and how your work connects with other members.
