# 📋 OLMS — Team Execution Plan

## Online Library Management System — Full-Stack Development Guide

> **Team Size:** 4 Members  
> **Project Status:** Frontend ✅ Complete | Backend ⬜ | Database ⬜ | Testing & Integration ⬜  
> **Repository:** [https://github.com/ssnaveenss/OLMS](https://github.com/ssnaveenss/OLMS)

---

## 📌 Project Objective

To digitally manage library operations including:
- Book management (add, delete, search, update)
- Student registration and authentication
- Book issue & return processing
- Automated fine calculation ($1/day for late returns)
- Record maintenance and reporting

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│          HTML / CSS / JavaScript (COMPLETED ✅)              │
│  Login │ Dashboard │ Book Search │ Issue │ Return │ Profile  │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP REST API (JSON)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│              Python (Flask) / Node.js                        │
│     Auth │ Book CRUD │ Issue/Return │ Fine Calc │ Reports    │
└────────────────────────┬────────────────────────────────────┘
                         │  SQL Queries / ORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                              │
│                   MySQL / PostgreSQL                         │
│  Tables │ Triggers │ Views │ Stored Procedures │ Indexes     │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 Team Role Assignment

| Role | Member | Responsibility | Dependencies |
|------|--------|---------------|-------------|
| **Member 1** | *(You)* | Frontend UI/UX — **DONE ✅** | None |
| **Member 2** | *Backend Developer* | REST API, Business Logic, Authentication | Needs DB schema from Member 3 |
| **Member 3** | *Database Engineer* | Schema Design, Triggers, Views, Stored Procedures | None (can start immediately) |
| **Member 4** | *Integration & Testing* | Connect Frontend ↔ Backend, Write Test Cases, Documentation | Needs Backend API + DB ready |

### Execution Timeline

```
Week 1:  [Member 3: DB Design] ──────────────────────────►
         [Member 2: Backend Setup + API skeleton] ───────►

Week 2:  [Member 3: Triggers, Views, Procedures] ───────►
         [Member 2: Full API Development] ───────────────►

Week 3:  [Member 4: Frontend-Backend Integration] ──────►
         [Member 4: Testing all modules] ────────────────►

Week 4:  [ALL: Bug fixes, Final Testing, Documentation] ─►
```

> **Key Dependency:** Member 3 (Database) should finish the schema first so Member 2 (Backend) can connect to it. Member 4 waits for both to be ready before integrating.

---

---

# 🟢 MEMBER 2 — Backend Developer

## Your Mission

Build a **REST API server** that acts as the bridge between the frontend and the database. The frontend is already built and currently uses mock data in `js/data.js`. Your job is to replace that mock data layer with real API endpoints connected to the actual database.

---

## Tech Stack

Choose **one** of the following:

| Option | Framework | Language | Recommended For |
|--------|-----------|----------|----------------|
| **Option A** | Flask | Python | Simplicity, rapid development |
| **Option B** | Node.js + Express | JavaScript | Consistency with frontend JS |
| **Option C** | Spring Boot | Java | Enterprise-grade, strong typing |

> **Recommendation:** Flask (Python) or Express (Node.js) for fastest development.

---

## Step 1: Project Setup

### If using Flask (Python):

```bash
# 1. Clone the repository
git clone https://github.com/ssnaveenss/OLMS.git
cd OLMS

# 2. Create a backend directory
mkdir backend
cd backend

# 3. Create a virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install flask flask-cors flask-mysqldb python-dotenv bcrypt PyJWT

# 5. Create requirements file
pip freeze > requirements.txt
```

### If using Node.js + Express:

```bash
# 1. Clone the repository
git clone https://github.com/ssnaveenss/OLMS.git
cd OLMS

# 2. Create a backend directory
mkdir backend
cd backend

# 3. Initialize Node.js project
npm init -y

# 4. Install dependencies
npm install express cors mysql2 dotenv bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

---

## Step 2: Project Structure

```
OLMS/
├── index.html          # Frontend (already done)
├── css/                # Frontend styles (already done)
├── js/                 # Frontend scripts (already done)
│
└── backend/
    ├── app.py                  # Main Flask app (or server.js for Node)
    ├── requirements.txt        # Python dependencies (or package.json)
    ├── .env                    # Environment variables (DB credentials)
    │
    ├── config/
    │   └── db.py               # Database connection config
    │
    ├── routes/
    │   ├── auth.py             # Login, Register, Logout
    │   ├── books.py            # Book CRUD operations
    │   ├── students.py         # Student management
    │   ├── issues.py           # Issue & Return operations
    │   └── reports.py          # Dashboard stats, reports
    │
    ├── models/
    │   ├── book.py             # Book model
    │   ├── student.py          # Student model
    │   └── issue.py            # Issue/Return model
    │
    └── middleware/
        └── auth.py             # JWT authentication middleware
```

---

## Step 3: Environment Configuration

Create a `.env` file in the `backend/` folder:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=olms_db

# JWT Secret Key (use a random string)
JWT_SECRET=your_super_secret_key_change_this

# Server Configuration
FLASK_PORT=5000
FLASK_DEBUG=True
```

> ⚠️ **Add `.env` to `.gitignore`** — never commit credentials to GitHub.

---

## Step 4: API Endpoints to Build

### 4.1 Authentication APIs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `POST` | `/api/auth/login` | User login | `{ email, password }` | `{ token, user }` |
| `POST` | `/api/auth/register` | Student registration | `{ name, email, password, department, phone }` | `{ message, studentId }` |
| `POST` | `/api/auth/logout` | Logout (invalidate token) | — | `{ message }` |
| `GET` | `/api/auth/me` | Get current user profile | — (JWT in header) | `{ user }` |

**Implementation Notes:**
- Hash passwords using **bcrypt** before storing in DB
- Generate **JWT tokens** on successful login
- Token should be sent in the `Authorization: Bearer <token>` header
- Token expiry: 24 hours recommended

### 4.2 Book Management APIs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/books` | Get all books | — | `[{ id, title, author, ... }]` |
| `GET` | `/api/books/:id` | Get single book | — | `{ id, title, author, ... }` |
| `GET` | `/api/books/search?q=keyword` | Search books | Query param | `[{ matching books }]` |
| `POST` | `/api/books` | Add new book (Admin) | `{ title, author, category, isbn, totalCopies }` | `{ message, bookId }` |
| `PUT` | `/api/books/:id` | Update book (Admin) | `{ title, author, ... }` | `{ message }` |
| `DELETE` | `/api/books/:id` | Delete book (Admin) | — | `{ message }` |
| `GET` | `/api/books/available` | Get available books | — | `[{ books with copies > 0 }]` |

### 4.3 Student Management APIs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `GET` | `/api/students` | Get all students (Admin) | — | `[{ id, name, dept, ... }]` |
| `GET` | `/api/students/:id` | Get student profile | — | `{ id, name, dept, ... }` |
| `PUT` | `/api/students/:id` | Update student info | `{ name, email, ... }` | `{ message }` |
| `DELETE` | `/api/students/:id` | Remove student (Admin) | — | `{ message }` |

### 4.4 Issue & Return APIs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| `POST` | `/api/issues` | Issue a book | `{ studentId, bookId }` | `{ message, issueId, dueDate }` |
| `POST` | `/api/returns` | Return a book | `{ issueId }` | `{ message, fine, returnDate }` |
| `GET` | `/api/issues` | Get all active issues | — | `[{ issue records }]` |
| `GET` | `/api/issues/student/:id` | Get student's issues | — | `[{ student's issues }]` |
| `GET` | `/api/issues/search?bookId=X&studentId=Y` | Find specific issue | Query params | `{ issue record }` |

**Business Rules:**
- Due date = Issue date + 14 days
- Cannot issue a book if `issuedCopies >= totalCopies`
- Cannot issue the same book twice to the same student
- Fine = $1.00 per day late (calculated on return)

### 4.5 Dashboard & Reports APIs

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/dashboard/stats` | Get summary stats | `{ totalBooks, issuedBooks, available, totalFines }` |
| `GET` | `/api/dashboard/monthly` | Monthly issue/return data | `{ labels, issues, returns }` |
| `GET` | `/api/dashboard/categories` | Category distribution | `{ labels, values }` |
| `GET` | `/api/dashboard/activity` | Recent activity log | `[{ type, text, time }]` |
| `GET` | `/api/reports/fines` | Fine report | `[{ studentId, name, totalFine }]` |
| `GET` | `/api/reports/overdue` | Overdue books report | `[{ overdue issue records }]` |

---

## Step 5: Sample Flask Implementation

Here's a starter template to get going quickly:

### `backend/app.py`

```python
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend to call this API

# Import route blueprints
from routes.auth import auth_bp
from routes.books import books_bp
from routes.students import students_bp
from routes.issues import issues_bp
from routes.reports import reports_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(books_bp, url_prefix='/api/books')
app.register_blueprint(students_bp, url_prefix='/api/students')
app.register_blueprint(issues_bp, url_prefix='/api/issues')
app.register_blueprint(reports_bp, url_prefix='/api/reports')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "OLMS API is running"}), 200

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True') == 'True'
    )
```

### `backend/config/db.py`

```python
import mysql.connector
from mysql.connector import pooling
import os

db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "olms_db"),
}

# Connection pool for better performance
connection_pool = pooling.MySQLConnectionPool(
    pool_name="olms_pool",
    pool_size=5,
    **db_config
)

def get_db():
    """Get a database connection from the pool."""
    return connection_pool.get_connection()
```

### Running the Backend

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux

# Run the server
python app.py

# Server will start at http://localhost:5000
# Test: http://localhost:5000/api/health
```

---

## Step 6: Response Format Convention

All API responses should follow this consistent JSON format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description here",
  "code": 400
}
```

**List Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "count": 12,
  "message": "Books retrieved successfully"
}
```

---

## Step 7: CORS Configuration

The frontend runs on a different port (or opens as a file), so you **must** enable CORS:

```python
# Flask
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

```javascript
// Express.js
const cors = require('cors');
app.use(cors());
```

---

## ✅ Checklist for Member 2

- [ ] Set up project structure (`backend/` folder)
- [ ] Configure database connection
- [ ] Implement authentication (login/register with JWT + bcrypt)
- [ ] Implement Book CRUD APIs
- [ ] Implement Student APIs
- [ ] Implement Issue Book API (with validation)
- [ ] Implement Return Book API (with fine calculation)
- [ ] Implement Dashboard stats API
- [ ] Implement Reports API (overdue, fines)
- [ ] Add error handling middleware
- [ ] Test all endpoints with Postman or curl
- [ ] Write `backend/README.md` with setup instructions
- [ ] Add `.env.example` file (without real credentials)

---

---

# 🔵 MEMBER 3 — Database Engineer

## Your Mission

Design and implement the **complete database** for OLMS using **MySQL** (or PostgreSQL). This includes the ER model, table schemas, constraints, triggers for automatic fine calculation, views for reports, stored procedures for complex operations, and proper indexing for performance.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **MySQL** | 8.0+ | Primary database |
| **MySQL Workbench** | Latest | Visual ER modeling & query tool |

> **Alternative:** PostgreSQL with pgAdmin if preferred.

---

## Step 1: Setup

```bash
# 1. Install MySQL (if not already installed)
# Download from: https://dev.mysql.com/downloads/installer/
# During installation, set a root password — remember it!

# 2. Open MySQL CLI or MySQL Workbench
mysql -u root -p

# 3. Create the database
CREATE DATABASE olms_db;
USE olms_db;
```

---

## Step 2: ER Diagram (Entity-Relationship Model)

Design the following entities and their relationships:

```
┌──────────────┐       ┌───────────────┐       ┌──────────────┐
│   ADMIN      │       │   STUDENT     │       │    BOOK      │
├──────────────┤       ├───────────────┤       ├──────────────┤
│ admin_id PK  │       │ student_id PK │       │ book_id PK   │
│ name         │       │ name          │       │ title        │
│ email UK     │       │ email UK      │       │ author       │
│ password     │       │ password      │       │ category     │
│ created_at   │       │ department    │       │ isbn UK      │
└──────────────┘       │ phone         │       │ total_copies │
                       │ created_at    │       │ issued_copies│
                       └───────┬───────┘       │ created_at   │
                               │               └──────┬───────┘
                               │ 1:M                   │ 1:M
                               ▼                       ▼
                       ┌───────────────────────────────────┐
                       │          ISSUE_RECORD             │
                       ├───────────────────────────────────┤
                       │ issue_id PK                       │
                       │ student_id FK → STUDENT           │
                       │ book_id FK → BOOK                 │
                       │ issue_date                        │
                       │ due_date                          │
                       │ return_date (NULL if not returned)│
                       │ fine DECIMAL(10,2)                │
                       │ status ENUM('ISSUED','RETURNED')  │
                       └───────────────┬───────────────────┘
                                       │ 1:1
                                       ▼
                       ┌───────────────────────────────────┐
                       │         RETURN_RECORD             │
                       ├───────────────────────────────────┤
                       │ return_id PK                      │
                       │ issue_id FK → ISSUE_RECORD        │
                       │ return_date                       │
                       │ fine DECIMAL(10,2)                │
                       └───────────────────────────────────┘
                       
                       ┌───────────────────────────────────┐
                       │        ACTIVITY_LOG               │
                       ├───────────────────────────────────┤
                       │ log_id PK                         │
                       │ action_type ENUM                  │
                       │ description TEXT                   │
                       │ performed_by                      │
                       │ created_at TIMESTAMP              │
                       └───────────────────────────────────┘
```

**Relationships:**
- One Student → Many Issue Records (1:M)
- One Book → Many Issue Records (1:M)
- One Issue Record → One Return Record (1:1)

---

## Step 3: Complete SQL Schema

Copy and execute this entire SQL script:

```sql
-- ============================================================
-- OLMS — Complete Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS olms_db;
USE olms_db;

-- ── 1. ADMIN TABLE ──
CREATE TABLE admin (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,           -- Store bcrypt hash, NOT plain text
    role        ENUM('SUPER_ADMIN', 'LIBRARIAN') DEFAULT 'LIBRARIAN',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ── 2. STUDENT TABLE ──
CREATE TABLE student (
    student_id  VARCHAR(10) PRIMARY KEY,         -- e.g., 'STU001'
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,           -- Store bcrypt hash
    department  VARCHAR(100) NOT NULL,
    phone       VARCHAR(20),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ── 3. BOOK TABLE ──
CREATE TABLE book (
    book_id       VARCHAR(10) PRIMARY KEY,       -- e.g., 'BK001'
    title         VARCHAR(255) NOT NULL,
    author        VARCHAR(200) NOT NULL,
    category      VARCHAR(100) NOT NULL,
    isbn          VARCHAR(20) UNIQUE,
    total_copies  INT NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
    issued_copies INT NOT NULL DEFAULT 0 CHECK (issued_copies >= 0),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraint: issued can never exceed total
    CONSTRAINT chk_copies CHECK (issued_copies <= total_copies)
) ENGINE=InnoDB;


-- ── 4. ISSUE RECORD TABLE ──
CREATE TABLE issue_record (
    issue_id    VARCHAR(10) PRIMARY KEY,         -- e.g., 'ISS001'
    student_id  VARCHAR(10) NOT NULL,
    book_id     VARCHAR(10) NOT NULL,
    issue_date  DATE NOT NULL,
    due_date    DATE NOT NULL,
    return_date DATE DEFAULT NULL,
    fine        DECIMAL(10, 2) DEFAULT 0.00,
    status      ENUM('ISSUED', 'RETURNED') DEFAULT 'ISSUED',

    -- Foreign Keys
    FOREIGN KEY (student_id) REFERENCES student(student_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (book_id) REFERENCES book(book_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;


-- ── 5. RETURN RECORD TABLE ──
CREATE TABLE return_record (
    return_id   VARCHAR(10) PRIMARY KEY,         -- e.g., 'RET001'
    issue_id    VARCHAR(10) NOT NULL UNIQUE,
    student_id  VARCHAR(10) NOT NULL,
    book_id     VARCHAR(10) NOT NULL,
    return_date DATE NOT NULL,
    fine        DECIMAL(10, 2) DEFAULT 0.00,

    -- Foreign Keys
    FOREIGN KEY (issue_id) REFERENCES issue_record(issue_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (student_id) REFERENCES student(student_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (book_id) REFERENCES book(book_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;


-- ── 6. ACTIVITY LOG TABLE ──
CREATE TABLE activity_log (
    log_id       INT AUTO_INCREMENT PRIMARY KEY,
    action_type  ENUM('ISSUE', 'RETURN', 'FINE', 'REGISTER', 'BOOK_ADD', 'BOOK_DELETE') NOT NULL,
    description  TEXT NOT NULL,
    performed_by VARCHAR(10),                    -- student_id or admin_id
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

---

## Step 4: Indexes (Performance Optimization)

```sql
-- ============================================================
-- INDEXES — Speed up frequent queries
-- ============================================================

-- Student lookups by email (login)
CREATE INDEX idx_student_email ON student(email);

-- Book searches by title and author
CREATE INDEX idx_book_title ON book(title);
CREATE INDEX idx_book_author ON book(author);
CREATE INDEX idx_book_category ON book(category);
CREATE INDEX idx_book_isbn ON book(isbn);

-- Issue record lookups
CREATE INDEX idx_issue_student ON issue_record(student_id);
CREATE INDEX idx_issue_book ON issue_record(book_id);
CREATE INDEX idx_issue_status ON issue_record(status);
CREATE INDEX idx_issue_due_date ON issue_record(due_date);

-- Activity log time-based queries
CREATE INDEX idx_activity_time ON activity_log(created_at DESC);
CREATE INDEX idx_activity_type ON activity_log(action_type);
```

---

## Step 5: Triggers (Automatic Fine Calculation)

```sql
-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger 1: Auto-calculate fine when a book is returned
DELIMITER //
CREATE TRIGGER trg_calculate_fine
BEFORE UPDATE ON issue_record
FOR EACH ROW
BEGIN
    -- Only calculate when status changes to RETURNED
    IF NEW.status = 'RETURNED' AND OLD.status = 'ISSUED' THEN
        -- Set return date to today if not provided
        IF NEW.return_date IS NULL THEN
            SET NEW.return_date = CURDATE();
        END IF;

        -- Calculate fine: $1 per day late
        IF NEW.return_date > OLD.due_date THEN
            SET NEW.fine = DATEDIFF(NEW.return_date, OLD.due_date) * 1.00;
        ELSE
            SET NEW.fine = 0.00;
        END IF;
    END IF;
END //
DELIMITER ;


-- Trigger 2: Decrement issued_copies when a book is returned
DELIMITER //
CREATE TRIGGER trg_decrement_on_return
AFTER UPDATE ON issue_record
FOR EACH ROW
BEGIN
    IF NEW.status = 'RETURNED' AND OLD.status = 'ISSUED' THEN
        UPDATE book
        SET issued_copies = issued_copies - 1
        WHERE book_id = NEW.book_id AND issued_copies > 0;

        -- Log the activity
        INSERT INTO activity_log (action_type, description, performed_by)
        VALUES ('RETURN',
                CONCAT('Book ', NEW.book_id, ' returned by student ', NEW.student_id),
                NEW.student_id);

        -- Log fine if applicable
        IF NEW.fine > 0 THEN
            INSERT INTO activity_log (action_type, description, performed_by)
            VALUES ('FINE',
                    CONCAT('Fine of $', FORMAT(NEW.fine, 2), ' charged to student ', NEW.student_id, ' for late return of book ', NEW.book_id),
                    NEW.student_id);
        END IF;
    END IF;
END //
DELIMITER ;


-- Trigger 3: Increment issued_copies when a book is issued
DELIMITER //
CREATE TRIGGER trg_increment_on_issue
AFTER INSERT ON issue_record
FOR EACH ROW
BEGIN
    UPDATE book
    SET issued_copies = issued_copies + 1
    WHERE book_id = NEW.book_id;

    -- Log the activity
    INSERT INTO activity_log (action_type, description, performed_by)
    VALUES ('ISSUE',
            CONCAT('Book ', NEW.book_id, ' issued to student ', NEW.student_id),
            NEW.student_id);
END //
DELIMITER ;


-- Trigger 4: Prevent issuing book when no copies available
DELIMITER //
CREATE TRIGGER trg_check_availability
BEFORE INSERT ON issue_record
FOR EACH ROW
BEGIN
    DECLARE avail INT;
    SELECT (total_copies - issued_copies) INTO avail
    FROM book WHERE book_id = NEW.book_id;

    IF avail <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'ERROR: No copies available for this book.';
    END IF;

    -- Set due date to 14 days from issue date if not set
    IF NEW.due_date IS NULL THEN
        SET NEW.due_date = DATE_ADD(NEW.issue_date, INTERVAL 14 DAY);
    END IF;
END //
DELIMITER ;
```

---

## Step 6: Views (Reports)

```sql
-- ============================================================
-- VIEWS — Predefined queries for reports
-- ============================================================

-- View 1: Currently issued books with student and book details
CREATE VIEW vw_active_issues AS
SELECT
    ir.issue_id,
    s.student_id,
    s.name AS student_name,
    s.department,
    b.book_id,
    b.title AS book_title,
    b.author,
    ir.issue_date,
    ir.due_date,
    CASE
        WHEN CURDATE() > ir.due_date THEN 'OVERDUE'
        WHEN DATEDIFF(ir.due_date, CURDATE()) <= 3 THEN 'DUE SOON'
        ELSE 'ON TIME'
    END AS status,
    CASE
        WHEN CURDATE() > ir.due_date THEN DATEDIFF(CURDATE(), ir.due_date)
        ELSE 0
    END AS days_overdue,
    CASE
        WHEN CURDATE() > ir.due_date THEN DATEDIFF(CURDATE(), ir.due_date) * 1.00
        ELSE 0.00
    END AS estimated_fine
FROM issue_record ir
JOIN student s ON ir.student_id = s.student_id
JOIN book b ON ir.book_id = b.book_id
WHERE ir.status = 'ISSUED';


-- View 2: Book availability summary
CREATE VIEW vw_book_availability AS
SELECT
    b.book_id,
    b.title,
    b.author,
    b.category,
    b.isbn,
    b.total_copies,
    b.issued_copies,
    (b.total_copies - b.issued_copies) AS available_copies,
    CASE
        WHEN b.issued_copies >= b.total_copies THEN 'UNAVAILABLE'
        WHEN (b.total_copies - b.issued_copies) <= 1 THEN 'LOW STOCK'
        ELSE 'AVAILABLE'
    END AS availability_status
FROM book b;


-- View 3: Student fine summary
CREATE VIEW vw_student_fines AS
SELECT
    s.student_id,
    s.name,
    s.department,
    s.email,
    COUNT(ir.issue_id) AS total_issues,
    SUM(CASE WHEN ir.status = 'ISSUED' THEN 1 ELSE 0 END) AS active_issues,
    SUM(CASE WHEN ir.status = 'RETURNED' THEN 1 ELSE 0 END) AS returned_books,
    COALESCE(SUM(ir.fine), 0.00) AS total_fines_paid,
    COALESCE(
        (SELECT SUM(DATEDIFF(CURDATE(), ir2.due_date) * 1.00)
         FROM issue_record ir2
         WHERE ir2.student_id = s.student_id
           AND ir2.status = 'ISSUED'
           AND CURDATE() > ir2.due_date),
        0.00
    ) AS pending_fines
FROM student s
LEFT JOIN issue_record ir ON s.student_id = ir.student_id
GROUP BY s.student_id, s.name, s.department, s.email;


-- View 4: Monthly issue/return statistics
CREATE VIEW vw_monthly_stats AS
SELECT
    DATE_FORMAT(issue_date, '%Y-%m') AS month,
    COUNT(*) AS total_issues,
    SUM(CASE WHEN status = 'RETURNED' THEN 1 ELSE 0 END) AS total_returns,
    SUM(fine) AS total_fines
FROM issue_record
GROUP BY DATE_FORMAT(issue_date, '%Y-%m')
ORDER BY month DESC;


-- View 5: Dashboard overview stats
CREATE VIEW vw_dashboard_stats AS
SELECT
    (SELECT SUM(total_copies) FROM book) AS total_books,
    (SELECT SUM(issued_copies) FROM book) AS issued_books,
    (SELECT SUM(total_copies) - SUM(issued_copies) FROM book) AS available_books,
    (SELECT COALESCE(SUM(fine), 0) FROM issue_record) AS total_fines,
    (SELECT COUNT(*) FROM student WHERE is_active = TRUE) AS total_students,
    (SELECT COUNT(*) FROM issue_record WHERE status = 'ISSUED' AND due_date < CURDATE()) AS overdue_count;
```

---

## Step 7: Stored Procedures

```sql
-- ============================================================
-- STORED PROCEDURES
-- ============================================================

-- Procedure 1: Issue a book to a student
DELIMITER //
CREATE PROCEDURE sp_issue_book(
    IN p_issue_id VARCHAR(10),
    IN p_student_id VARCHAR(10),
    IN p_book_id VARCHAR(10),
    IN p_issue_date DATE
)
BEGIN
    DECLARE v_available INT;
    DECLARE v_already_issued INT;

    -- Check availability
    SELECT (total_copies - issued_copies) INTO v_available
    FROM book WHERE book_id = p_book_id;

    IF v_available IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book not found.';
    END IF;

    IF v_available <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No copies available.';
    END IF;

    -- Check if same book already issued to same student
    SELECT COUNT(*) INTO v_already_issued
    FROM issue_record
    WHERE student_id = p_student_id
      AND book_id = p_book_id
      AND status = 'ISSUED';

    IF v_already_issued > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This book is already issued to this student.';
    END IF;

    -- Issue the book (trigger handles issued_copies increment)
    INSERT INTO issue_record (issue_id, student_id, book_id, issue_date, due_date, status)
    VALUES (p_issue_id, p_student_id, p_book_id, p_issue_date, DATE_ADD(p_issue_date, INTERVAL 14 DAY), 'ISSUED');

    SELECT 'Book issued successfully.' AS message, p_issue_id AS issue_id, DATE_ADD(p_issue_date, INTERVAL 14 DAY) AS due_date;
END //
DELIMITER ;


-- Procedure 2: Return a book
DELIMITER //
CREATE PROCEDURE sp_return_book(
    IN p_issue_id VARCHAR(10),
    IN p_return_id VARCHAR(10)
)
BEGIN
    DECLARE v_status VARCHAR(10);
    DECLARE v_student_id VARCHAR(10);
    DECLARE v_book_id VARCHAR(10);
    DECLARE v_due_date DATE;
    DECLARE v_fine DECIMAL(10,2);

    -- Validate issue record exists
    SELECT status, student_id, book_id, due_date
    INTO v_status, v_student_id, v_book_id, v_due_date
    FROM issue_record WHERE issue_id = p_issue_id;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Issue record not found.';
    END IF;

    IF v_status = 'RETURNED' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book already returned.';
    END IF;

    -- Update issue record (triggers handle fine calc + copy decrement)
    UPDATE issue_record
    SET status = 'RETURNED', return_date = CURDATE()
    WHERE issue_id = p_issue_id;

    -- Get the calculated fine
    SELECT fine INTO v_fine FROM issue_record WHERE issue_id = p_issue_id;

    -- Insert into return_record
    INSERT INTO return_record (return_id, issue_id, student_id, book_id, return_date, fine)
    VALUES (p_return_id, p_issue_id, v_student_id, v_book_id, CURDATE(), v_fine);

    SELECT 'Book returned successfully.' AS message, v_fine AS fine, CURDATE() AS return_date;
END //
DELIMITER ;


-- Procedure 3: Get Dashboard Stats
DELIMITER //
CREATE PROCEDURE sp_get_dashboard_stats()
BEGIN
    SELECT * FROM vw_dashboard_stats;
END //
DELIMITER ;
```

---

## Step 8: Sample/Seed Data

Insert this test data to match what the frontend currently displays:

```sql
-- ============================================================
-- SEED DATA — Matches the frontend mock data
-- ============================================================

-- Insert Admin
INSERT INTO admin (name, email, password, role) VALUES
('Super Admin', 'admin@library.com', '$2b$12$HASH_THIS_WITH_BCRYPT', 'SUPER_ADMIN');

-- Insert Students
INSERT INTO student (student_id, name, email, password, department, phone) VALUES
('STU001', 'Alice Johnson',  'alice.j@university.edu',  '$2b$12$HASH', 'Computer Science',          '+1-234-567-8901'),
('STU002', 'Bob Williams',   'bob.w@university.edu',    '$2b$12$HASH', 'Information Technology',     '+1-234-567-8902'),
('STU003', 'Carol Davis',    'carol.d@university.edu',  '$2b$12$HASH', 'Computer Science',          '+1-234-567-8903'),
('STU004', 'David Brown',    'david.b@university.edu',  '$2b$12$HASH', 'Electronics',               '+1-234-567-8904'),
('STU005', 'Eva Martinez',   'eva.m@university.edu',    '$2b$12$HASH', 'Computer Science',          '+1-234-567-8905');

-- Insert Books
INSERT INTO book (book_id, title, author, category, isbn, total_copies, issued_copies) VALUES
('BK001', 'Introduction to Algorithms',                          'Thomas H. Cormen',                    'Computer Science',       '978-0-262-03384-8', 5, 3),
('BK002', 'Clean Code',                                          'Robert C. Martin',                    'Software Engineering',   '978-0-132-35088-4', 4, 4),
('BK003', 'Design Patterns',                                     'Erich Gamma et al.',                  'Software Engineering',   '978-0-201-63361-0', 3, 1),
('BK004', 'The Pragmatic Programmer',                             'David Thomas & Andrew Hunt',          'Software Engineering',   '978-0-135-95705-9', 6, 2),
('BK005', 'Artificial Intelligence: A Modern Approach',           'Stuart Russell & Peter Norvig',       'AI & ML',               '978-0-134-61099-3', 4, 3),
('BK006', 'Computer Networks',                                    'Andrew S. Tanenbaum',                 'Networking',            '978-0-132-12695-3', 5, 1),
('BK007', 'Operating System Concepts',                            'Abraham Silberschatz',                'Computer Science',       '978-1-119-80052-0', 4, 2),
('BK008', 'Database System Concepts',                             'Abraham Silberschatz',                'Database',              '978-0-078-02215-9', 3, 0),
('BK009', 'Deep Learning',                                        'Ian Goodfellow et al.',               'AI & ML',               '978-0-262-03561-3', 3, 2),
('BK010', 'Structure and Interpretation of Computer Programs',    'Harold Abelson & Gerald J. Sussman',  'Computer Science',       '978-0-262-51087-5', 2, 1),
('BK011', 'The Art of Computer Programming',                      'Donald E. Knuth',                     'Computer Science',       '978-0-201-89683-1', 2, 0),
('BK012', 'Refactoring',                                          'Martin Fowler',                       'Software Engineering',   '978-0-134-75759-8', 4, 1);

-- Insert Issue Records
INSERT INTO issue_record (issue_id, student_id, book_id, issue_date, due_date, return_date, fine, status) VALUES
('ISS001', 'STU001', 'BK001', '2026-03-01', '2026-03-15', NULL,          0.00,  'ISSUED'),
('ISS002', 'STU001', 'BK005', '2026-03-05', '2026-03-19', NULL,          0.00,  'ISSUED'),
('ISS003', 'STU002', 'BK002', '2026-02-20', '2026-03-06', NULL,          12.00, 'ISSUED'),
('ISS004', 'STU002', 'BK009', '2026-03-10', '2026-03-24', NULL,          0.00,  'ISSUED'),
('ISS005', 'STU003', 'BK001', '2026-03-12', '2026-03-26', NULL,          0.00,  'ISSUED'),
('ISS006', 'STU003', 'BK004', '2026-02-15', '2026-03-01', '2026-02-28',  0.00,  'RETURNED'),
('ISS007', 'STU004', 'BK007', '2026-03-08', '2026-03-22', NULL,          0.00,  'ISSUED'),
('ISS008', 'STU005', 'BK001', '2026-03-15', '2026-03-29', NULL,          0.00,  'ISSUED'),
('ISS009', 'STU005', 'BK003', '2026-03-18', '2026-04-01', NULL,          0.00,  'ISSUED'),
('ISS010', 'STU001', 'BK012', '2026-02-10', '2026-02-24', '2026-02-23',  0.00,  'RETURNED'),
('ISS011', 'STU004', 'BK005', '2026-02-01', '2026-02-15', '2026-02-20',  5.00,  'RETURNED'),
('ISS012', 'STU002', 'BK006', '2026-03-20', '2026-04-03', NULL,          0.00,  'ISSUED'),
('ISS013', 'STU005', 'BK010', '2026-03-22', '2026-04-05', NULL,          0.00,  'ISSUED'),
('ISS014', 'STU003', 'BK005', '2026-03-25', '2026-04-08', NULL,          0.00,  'ISSUED'),
('ISS015', 'STU004', 'BK002', '2026-03-20', '2026-04-03', NULL,          0.00,  'ISSUED');

-- Insert Return Records
INSERT INTO return_record (return_id, issue_id, student_id, book_id, return_date, fine) VALUES
('RET001', 'ISS006', 'STU003', 'BK004', '2026-02-28', 0.00),
('RET002', 'ISS010', 'STU001', 'BK012', '2026-02-23', 0.00),
('RET003', 'ISS011', 'STU004', 'BK005', '2026-02-20', 5.00);

-- Insert Activity Log
INSERT INTO activity_log (action_type, description, performed_by) VALUES
('ISSUE',    'Alice Johnson issued "Introduction to Algorithms"',         'STU001'),
('RETURN',   'Carol Davis returned "The Pragmatic Programmer"',           'STU003'),
('FINE',     'Bob Williams fined $12.00 for overdue return',              'STU002'),
('ISSUE',    'Eva Martinez issued "Deep Learning"',                       'STU005'),
('REGISTER', 'New student David Brown registered',                        'STU004'),
('RETURN',   'Alice Johnson returned "Refactoring"',                      'STU001'),
('ISSUE',    'Bob Williams issued "Clean Code"',                          'STU002'),
('FINE',     'David Brown fined $5.00 for late return',                   'STU004');
```

---

## Step 9: Verification Queries

Run these to verify your database is set up correctly:

```sql
-- Test View: Active Issues
SELECT * FROM vw_active_issues;

-- Test View: Book Availability
SELECT * FROM vw_book_availability;

-- Test View: Student Fines
SELECT * FROM vw_student_fines;

-- Test View: Dashboard Stats
SELECT * FROM vw_dashboard_stats;

-- Test Stored Procedure: Dashboard Stats
CALL sp_get_dashboard_stats();

-- Test Join: Books with their issue details
SELECT b.title, s.name, ir.issue_date, ir.due_date, ir.status
FROM issue_record ir
JOIN book b ON ir.book_id = b.book_id
JOIN student s ON ir.student_id = s.student_id
WHERE ir.status = 'ISSUED'
ORDER BY ir.due_date;
```

---

## ✅ Checklist for Member 3

- [ ] Install MySQL 8.0+ and MySQL Workbench
- [ ] Create ER Diagram (screenshot/export for documentation)
- [ ] Create database `olms_db`
- [ ] Create all 6 tables with proper constraints
- [ ] Add all indexes
- [ ] Create 4 triggers (fine calc, copy increment/decrement, availability check)
- [ ] Create 5 views (active issues, availability, fines, monthly stats, dashboard)
- [ ] Create 3 stored procedures (issue, return, stats)
- [ ] Insert all seed data
- [ ] Run verification queries and confirm all work
- [ ] Export full SQL script as `database/schema.sql`
- [ ] Export seed data as `database/seed.sql`
- [ ] Write `database/README.md` with setup instructions

---

---

# 🟡 MEMBER 4 — Integration & Testing

## Your Mission

You are the person who **connects everything together** and ensures it all works. Your responsibilities:

1. **Modify the frontend** JavaScript to call real API endpoints instead of mock data
2. **Write and execute all test cases**
3. **Handle deployment setup** (optional)
4. **Write final project documentation**

---

## Part A: Frontend-Backend Integration

### Step 1: Create an API Service Layer

Create a new file `js/api.js` that replaces the mock `DataStore` with real HTTP calls:

```javascript
/* ============================================================
   OLMS — API Service Layer
   Replaces DataStore mock data with real backend API calls
   ============================================================ */

const API = (() => {
  const BASE_URL = 'http://localhost:5000/api';

  // Get JWT token from storage
  function getToken() {
    return sessionStorage.getItem('olms-token');
  }

  // Common headers
  function headers() {
    const h = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }

  // Generic fetch wrapper
  async function request(endpoint, method = 'GET', body = null) {
    try {
      const options = { method, headers: headers() };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      return data;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // ── Auth ──
  async function login(email, password) {
    return request('/auth/login', 'POST', { email, password });
  }

  async function register(data) {
    return request('/auth/register', 'POST', data);
  }

  // ── Books ──
  async function getBooks() {
    return request('/books');
  }

  async function searchBooks(query) {
    return request(`/books/search?q=${encodeURIComponent(query)}`);
  }

  async function getAvailableBooks() {
    return request('/books/available');
  }

  // ── Students ──
  async function getStudents() {
    return request('/students');
  }

  async function getStudent(id) {
    return request(`/students/${id}`);
  }

  // ── Issues ──
  async function issueBook(studentId, bookId) {
    return request('/issues', 'POST', { studentId, bookId });
  }

  async function returnBook(issueId) {
    return request('/returns', 'POST', { issueId });
  }

  async function getActiveIssues() {
    return request('/issues');
  }

  async function findIssueRecord(bookId, studentId) {
    return request(`/issues/search?bookId=${bookId}&studentId=${studentId}`);
  }

  async function getStudentIssues(studentId) {
    return request(`/issues/student/${studentId}`);
  }

  // ── Dashboard ──
  async function getDashboardStats() {
    return request('/dashboard/stats');
  }

  async function getMonthlyData() {
    return request('/dashboard/monthly');
  }

  async function getCategoryData() {
    return request('/dashboard/categories');
  }

  async function getActivities() {
    return request('/dashboard/activity');
  }

  return {
    login, register,
    getBooks, searchBooks, getAvailableBooks,
    getStudents, getStudent,
    issueBook, returnBook, getActiveIssues, findIssueRecord, getStudentIssues,
    getDashboardStats, getMonthlyData, getCategoryData, getActivities
  };
})();
```

### Step 2: Update `index.html`

Add the API script before the page scripts:

```html
<!-- Add this line BEFORE js/pages/login.js -->
<script src="js/api.js"></script>
```

### Step 3: Update Each Page Module

For each page in `js/pages/`, replace `DataStore.methodName()` calls with `await API.methodName()` calls. Since the API calls are async, you'll need to convert the `init()` functions to `async` functions.

**Example — Converting `dashboard.js`:**

```javascript
// BEFORE (mock data):
const stats = DataStore.getStats();

// AFTER (real API):
const response = await API.getDashboardStats();
const stats = response.data;
```

---

## Part B: Test Cases

### Test Case Document

Execute and document each test case with: **Test ID, Description, Steps, Expected Result, Actual Result, Status (Pass/Fail).**

### B.1: Authentication Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC-01 | Valid Login | Enter valid email + password → Click Sign In | Redirect to Dashboard |
| TC-02 | Invalid Email Format | Enter "abc" as email → Click Sign In | Show "Invalid email" error |
| TC-03 | Empty Password | Leave password blank → Click Sign In | Show "Password required" error |
| TC-04 | Wrong Password | Enter valid email + wrong password | Show "Invalid credentials" error |
| TC-05 | Session Persistence | Login → Close tab → Reopen | Should be logged out (sessionStorage cleared) |
| TC-06 | Logout | Click logout button | Redirect to login page, session cleared |

### B.2: Book Search Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC-07 | Search by Title | Type "Algorithms" in search bar | Show matching books |
| TC-08 | Search by Author | Type "Martin" in search bar | Show "Clean Code" + "Refactoring" |
| TC-09 | Search by Category | Type "AI" in search bar | Show AI & ML books |
| TC-10 | Search No Results | Type "xyz123" in search bar | Show "No books found" empty state |
| TC-11 | Grid/Table Toggle | Click grid icon → Click table icon | View switches between grid and table |
| TC-12 | Book Count Display | Load book search page | Show correct "X books found" count |

### B.3: Issue Book Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC-13 | Valid Issue | Select student + available book → Submit | Success message, book issued |
| TC-14 | No Student Selected | Leave student blank → Submit | Show "Select a student" error |
| TC-15 | No Book Selected | Leave book blank → Submit | Show "Select a book" error |
| TC-16 | Book Unavailable | Try to issue "Clean Code" (0 copies) | Error: "No copies available" |
| TC-17 | Duplicate Issue | Issue same book to same student twice | Error: "Already issued to this student" |
| TC-18 | Issue Another Flow | After successful issue, click "Issue Another" | Form resets, ready for new issue |

### B.4: Return Book Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC-19 | Valid Return (On Time) | Search for an active issue → Click Return | Success, fine = $0 |
| TC-20 | Valid Return (Late) | Return an overdue book | Success, fine calculated correctly |
| TC-21 | Invalid Book ID | Search with non-existent book ID | Show "Record not found" |
| TC-22 | Already Returned | Try to return already-returned book | Error: "Already returned" |
| TC-23 | Fine Calculation | Return book 5 days late | Fine = $5.00 (5 × $1) |
| TC-24 | Fine Calculation 2 | Return book 25 days late | Fine = $25.00 |

### B.5: Dashboard Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC-25 | Stats Display | Navigate to Dashboard | All 4 stat cards show correct numbers |
| TC-26 | Stats Update | Issue a book → Return to Dashboard | Stats should reflect the new issue |
| TC-27 | Charts Render | Load Dashboard | Monthly chart + Category chart render correctly |
| TC-28 | Activity Feed | Load Dashboard | Recent activities shown in chronological order |

### B.6: Profile Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC-29 | Profile Display | Navigate to Profile | Name, department, avatar shown correctly |
| TC-30 | Issued Books Tab | Click "Issued Books" tab | Show currently issued books |
| TC-31 | Return History Tab | Click "Return History" tab | Show past returns with dates |
| TC-32 | Fine Summary Tab | Click "Fine Summary" tab | Show total fines breakdown |

### B.7: Theme & UI Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC-33 | Dark Mode (Default) | Load the app | Dark theme is active |
| TC-34 | Toggle to Light Mode | Click sun/moon icon | All pages switch to light theme |
| TC-35 | Theme Persistence | Set light mode → Refresh page | Light mode is preserved |
| TC-36 | Sidebar Collapse | Click sidebar collapse button | Sidebar collapses, content expands |
| TC-37 | Mobile Responsive | Resize browser to 375px width | Sidebar becomes hamburger menu |

### B.8: Database Constraint Tests

| Test ID | Description | Steps | Expected Result |
|---------|-------------|-------|-----------------|
| TC-38 | Unique Email | Register two students with same email | Database rejects with duplicate error |
| TC-39 | Unique ISBN | Add two books with same ISBN | Database rejects with duplicate error |
| TC-40 | FK Constraint | Try to issue to non-existent student ID | Database rejects, foreign key violation |

---

## Part C: Final Documentation

Update the project's `README.md` to include:

1. **Architecture diagram** (screenshot of the full stack)
2. **Backend setup instructions** (from Member 2)
3. **Database setup instructions** (from Member 3)
4. **API documentation** (list of all endpoints)
5. **Test results** (summary table of all test cases)
6. **Screenshots** of each page
7. **ER Diagram** image (from Member 3)

---

## ✅ Checklist for Member 4

- [ ] Create `js/api.js` service layer
- [ ] Update `index.html` to include `api.js`
- [ ] Modify `js/pages/login.js` to use real API authentication
- [ ] Modify `js/pages/dashboard.js` to fetch stats from API
- [ ] Modify `js/pages/books.js` to fetch books from API
- [ ] Modify `js/pages/issue.js` to use API for issuing
- [ ] Modify `js/pages/return.js` to use API for returning
- [ ] Modify `js/pages/profile.js` to fetch student data from API
- [ ] Execute all 40 test cases and document results
- [ ] Take screenshots of each page
- [ ] Update README.md with full project documentation
- [ ] Create test results document

---

---

## 🔗 How the Parts Connect

```
MEMBER 1 (DONE ✅)                    MEMBER 3
Frontend UI                           Database Schema
  │                                     │
  │  js/data.js (mock data)             │ MySQL tables, triggers,
  │  currently uses ──────────►         │ views, stored procedures
  │                                     │
  │                                     ▼
  │                                   MEMBER 2
  │                                   Backend API
  │                                     │
  │         REST API calls              │ SQL queries to DB
  │  ◄──────────────────────────────────│
  │                                     │
  ▼                                     ▼
MEMBER 4
Integration + Testing
  │
  ├── Creates js/api.js (replaces js/data.js)
  ├── Updates all page modules to call API
  ├── Runs all test cases
  └── Final documentation
```

---

## 📦 Final Project Structure

```
OLMS/
├── index.html
├── README.md
├── TEAM_PLAN.md
├── .gitignore
│
├── css/
│   ├── design-system.css
│   ├── layout.css
│   ├── login.css
│   └── pages.css
│
├── js/
│   ├── api.js              ← NEW (Member 4)
│   ├── app.js
│   ├── data.js             ← Keep as fallback
│   ├── utils.js
│   └── pages/
│       ├── login.js
│       ├── dashboard.js
│       ├── books.js
│       ├── issue.js
│       ├── return.js
│       └── profile.js
│
├── backend/                 ← NEW (Member 2)
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   │   └── db.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── books.py
│   │   ├── students.py
│   │   ├── issues.py
│   │   └── reports.py
│   ├── models/
│   └── middleware/
│       └── auth.py
│
├── database/                ← NEW (Member 3)
│   ├── README.md
│   ├── schema.sql
│   ├── seed.sql
│   ├── triggers.sql
│   ├── views.sql
│   ├── procedures.sql
│   └── er_diagram.png
│
└── docs/                    ← NEW (Member 4)
    ├── test_cases.md
    ├── test_results.md
    ├── api_documentation.md
    └── screenshots/
```

---

## 🚨 Important Rules for the Team

1. **Git Branching:** Each member should work on their own branch:
   ```bash
   git checkout -b feature/backend      # Member 2
   git checkout -b feature/database     # Member 3
   git checkout -b feature/integration  # Member 4
   ```
   Merge into `main` only after testing.

2. **Never commit `.env` files** — use `.env.example` with placeholder values.

3. **Always hash passwords** — never store plain text passwords in the database.

4. **Use consistent ID formats:**
   - Students: `STU001`, `STU002`, ...
   - Books: `BK001`, `BK002`, ...
   - Issues: `ISS001`, `ISS002`, ...
   - Returns: `RET001`, `RET002`, ...

5. **API response format** — always use the standard JSON format documented in Member 2's section.

6. **Communicate blockers early** — if Member 3 is delayed, Member 2 can use the seed data SQL to create a temporary DB and start coding.

---

<p align="center">
  <strong>Good luck team! 🚀</strong><br>
  Built with ❤️ — Frontend by Member 1
</p>
