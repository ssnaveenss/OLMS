# 🟢 Member 2 — Backend Developer Guide

## Online Library Management System (OLMS)

> **Role:** Backend Developer  
> **Objective:** Build the REST API server that connects the frontend to the database  
> **Repository:** [https://github.com/ssnaveenss/OLMS](https://github.com/ssnaveenss/OLMS)  
> **Depends On:** Member 3 (Database) — but you can start in parallel using the seed data

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Environment Setup](#3-environment-setup)
4. [Project Structure](#4-project-structure)
5. [Database Connection Setup](#5-database-connection-setup)
6. [API Endpoints — Full Specification](#6-api-endpoints--full-specification)
7. [Implementation Guide](#7-implementation-guide)
8. [Authentication System](#8-authentication-system)
9. [Error Handling](#9-error-handling)
10. [CORS Configuration](#10-cors-configuration)
11. [Testing Your API](#11-testing-your-api)
12. [Deliverables Checklist](#12-deliverables-checklist)

---

## 1. Overview

### What You're Building

The frontend of OLMS is already complete. It currently uses **mock data** stored in `js/data.js` — a JavaScript file that simulates a backend with hardcoded arrays of books, students, and issue records. Your job is to build a **real backend server** that:

1. **Exposes REST API endpoints** that the frontend will call
2. **Processes business logic** (authentication, fine calculation, validation)
3. **Communicates with the MySQL database** (designed by Member 3)
4. **Returns JSON responses** to the frontend

### How It Fits Together

```
Frontend (HTML/CSS/JS)  ──── HTTP requests ────►  YOUR BACKEND (Flask/Express)
     Already Done ✅          (JSON)                    │
                                                        │ SQL queries
                                                        ▼
                                                    MySQL Database
                                                    (Member 3's work)
```

### What the Frontend Currently Does

The frontend's `js/data.js` has these mock functions that you need to replicate as API endpoints:

| Mock Function | Your API Equivalent |
|--------------|---------------------|
| `DataStore.getBooks()` | `GET /api/books` |
| `DataStore.getBook(id)` | `GET /api/books/:id` |
| `DataStore.getStudents()` | `GET /api/students` |
| `DataStore.getStudent(id)` | `GET /api/students/:id` |
| `DataStore.getStats()` | `GET /api/dashboard/stats` |
| `DataStore.getMonthlyData()` | `GET /api/dashboard/monthly` |
| `DataStore.getCategoryData()` | `GET /api/dashboard/categories` |
| `DataStore.getActivities()` | `GET /api/dashboard/activity` |
| `DataStore.getAvailableBooks()` | `GET /api/books/available` |
| `DataStore.issueBook(sid, bid)` | `POST /api/issues` |
| `DataStore.returnBook(issueId)` | `POST /api/returns` |
| `DataStore.findIssueRecord(bid, sid)` | `GET /api/issues/search` |
| `DataStore.getStudentIssues(sid)` | `GET /api/issues/student/:id` |
| `DataStore.getStudentActiveIssues(sid)` | `GET /api/issues/student/:id?status=active` |
| `DataStore.getStudentReturnHistory(sid)` | `GET /api/returns/student/:id` |

---

## 2. Prerequisites

### Software to Install

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Python** | 3.10+ | [python.org/downloads](https://www.python.org/downloads/) | Backend runtime |
| **pip** | Latest | Comes with Python | Package manager |
| **MySQL** | 8.0+ | [dev.mysql.com/downloads](https://dev.mysql.com/downloads/installer/) | Database (install if testing locally) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com/) | Code editor |
| **Postman** | Latest | [postman.com/downloads](https://www.postman.com/downloads/) | API testing tool |

### VS Code Extensions (Recommended)

- Python (Microsoft)
- Pylance
- REST Client (alternative to Postman)
- MySQL (Weijan Chen)
- GitLens

### Verify Installations

Open a terminal and run:

```bash
python --version      # Should show Python 3.10+
pip --version          # Should show pip 2X.X+
git --version          # Should show git 2.X+
mysql --version        # Should show mysql Ver 8.X+ (if installed locally)
```

> **Note:** On some systems, use `python3` and `pip3` instead of `python` and `pip`.

---

## 3. Environment Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/ssnaveenss/OLMS.git
cd OLMS
```

### Step 2: Create Your Branch

```bash
git checkout -b feature/backend
```

### Step 3: Create the Backend Directory

```bash
mkdir backend
cd backend
```

### Step 4: Create a Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it:
# On Windows (Command Prompt):
venv\Scripts\activate

# On Windows (PowerShell):
venv\Scripts\Activate.ps1

# On Mac/Linux:
source venv/bin/activate
```

> ⚠️ **Always activate the virtual environment** before installing packages or running the server. You should see `(venv)` at the start of your terminal prompt.

### Step 5: Install Python Dependencies

```bash
pip install flask flask-cors flask-mysqldb python-dotenv bcrypt PyJWT
```

**What each package does:**

| Package | Purpose |
|---------|---------|
| `flask` | Lightweight web framework for building the API server |
| `flask-cors` | Enables Cross-Origin Resource Sharing (so the frontend can call the API) |
| `flask-mysqldb` | MySQL connector for Flask |
| `python-dotenv` | Loads environment variables from `.env` file |
| `bcrypt` | Password hashing (never store plain text passwords) |
| `PyJWT` | JSON Web Token generation and verification for authentication |

### Step 6: Save Dependencies

```bash
pip freeze > requirements.txt
```

### Step 7: Create the `.env` File

Create a file called `.env` inside the `backend/` folder:

```env
# ============================================================
# OLMS Backend — Environment Configuration
# ============================================================

# Database Configuration (get these from Member 3)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=olms_db

# JWT Configuration
JWT_SECRET=olms_jwt_secret_key_change_this_to_something_random
JWT_EXPIRY_HOURS=24

# Server Configuration
FLASK_PORT=5000
FLASK_DEBUG=True
FLASK_ENV=development
```

### Step 8: Create `.env.example` (for Git)

Create a copy without real values — this one IS safe to commit:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=olms_db
JWT_SECRET=change_this
JWT_EXPIRY_HOURS=24
FLASK_PORT=5000
FLASK_DEBUG=True
```

### Step 9: Update `.gitignore`

Add these lines to the project's `.gitignore`:

```gitignore
# Backend
backend/venv/
backend/.env
__pycache__/
*.pyc
```

---

## 4. Project Structure

Create the following folder and file structure inside `backend/`:

```
backend/
├── app.py                      # Main entry point — Flask application
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (DO NOT COMMIT)
├── .env.example                # Template for .env (safe to commit)
│
├── config/
│   ├── __init__.py             # Empty file (makes this a Python package)
│   └── database.py             # Database connection configuration
│
├── routes/
│   ├── __init__.py
│   ├── auth_routes.py          # POST /api/auth/login, /register, /logout
│   ├── book_routes.py          # GET/POST/PUT/DELETE /api/books
│   ├── student_routes.py       # GET/PUT/DELETE /api/students
│   ├── issue_routes.py         # POST /api/issues, POST /api/returns
│   └── report_routes.py       # GET /api/dashboard/*, /api/reports/*
│
├── middleware/
│   ├── __init__.py
│   └── auth_middleware.py      # JWT verification middleware
│
└── utils/
    ├── __init__.py
    └── helpers.py              # Shared utility functions
```

Create all `__init__.py` files (they can be empty):

```bash
# From inside backend/
mkdir config routes middleware utils
type nul > config\__init__.py
type nul > routes\__init__.py
type nul > middleware\__init__.py
type nul > utils\__init__.py
```

> On Mac/Linux use `touch` instead of `type nul >`.

---

## 5. Database Connection Setup

### Step 1: Ensure MySQL is Running

```bash
# Check if MySQL service is running (Windows):
net start mysql80

# Or start it via Services app:
# Win + R → services.msc → Find "MySQL80" → Start
```

### Step 2: Verify You Can Connect

```bash
mysql -u root -p
# Enter your password when prompted

# You should see the MySQL prompt:
# mysql>

# Check if the database exists (Member 3 should have created it):
SHOW DATABASES;

# If olms_db exists:
USE olms_db;
SHOW TABLES;

# Exit:
EXIT;
```

### Step 3: Create `config/database.py`

```python
"""
OLMS — Database Connection Configuration
Manages MySQL connection pool for the Flask application.
"""

import os
import mysql.connector
from mysql.connector import pooling, Error

# Load configuration from environment variables
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "olms_db"),
    "charset": "utf8mb4",
    "collation": "utf8mb4_general_ci",
    "autocommit": False,  # We handle commits manually for transactions
}

# Connection pool — reuses connections for better performance
try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="olms_pool",
        pool_size=5,
        pool_reset_session=True,
        **db_config
    )
    print("✅ Database connection pool created successfully.")
except Error as e:
    print(f"❌ Error creating database connection pool: {e}")
    connection_pool = None


def get_db():
    """
    Get a database connection from the pool.
    
    Usage:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM book")
        results = cursor.fetchall()
        cursor.close()
        conn.close()  # Returns connection to pool
    """
    if connection_pool is None:
        raise Exception("Database connection pool is not initialized.")
    return connection_pool.get_connection()


def execute_query(query, params=None, fetch_one=False, fetch_all=False, commit=False):
    """
    Execute a database query with automatic connection handling.

    Args:
        query (str): SQL query string
        params (tuple): Query parameters
        fetch_one (bool): Return a single row
        fetch_all (bool): Return all rows
        commit (bool): Commit the transaction (for INSERT/UPDATE/DELETE)

    Returns:
        dict or list or int: Query result or affected row count
    """
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    try:
        cursor.execute(query, params)
        
        if commit:
            conn.commit()
            return cursor.rowcount
        elif fetch_one:
            return cursor.fetchone()
        elif fetch_all:
            return cursor.fetchall()
        else:
            return cursor.rowcount
    except Error as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
```

### Step 4: Test the Connection

Create a quick test script `backend/test_db.py`:

```python
"""Quick test to verify database connection works."""
from dotenv import load_dotenv
load_dotenv()

from config.database import get_db

try:
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT 1 AS test")
    result = cursor.fetchone()
    print(f"✅ Database connection successful! Result: {result}")
    
    # Try reading books table
    cursor.execute("SELECT COUNT(*) AS count FROM book")
    result = cursor.fetchone()
    print(f"📚 Books in database: {result['count']}")
    
    cursor.close()
    conn.close()
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print("\nTroubleshooting:")
    print("1. Is MySQL running? (net start mysql80)")
    print("2. Is the password in .env correct?")
    print("3. Has Member 3 created the olms_db database?")
    print("4. If DB doesn't exist yet, create it: CREATE DATABASE olms_db;")
```

Run the test:

```bash
cd backend
python test_db.py
```

---

## 6. API Endpoints — Full Specification

### Response Format Convention

**Every** API response must follow this structure:

```json
// ✅ Success Response
{
    "success": true,
    "data": { ... },
    "message": "Operation completed successfully"
}

// ✅ List Response
{
    "success": true,
    "data": [ ... ],
    "count": 12,
    "message": "Books retrieved successfully"
}

// ❌ Error Response
{
    "success": false,
    "error": "Descriptive error message",
    "code": 400
}
```

### 6.1 Authentication Endpoints

---

#### `POST /api/auth/login`

**Description:** Authenticates a user (student or admin) and returns a JWT token.

**Request Body:**
```json
{
    "email": "alice.j@university.edu",
    "password": "password123"
}
```

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
        "user": {
            "id": "STU001",
            "name": "Alice Johnson",
            "email": "alice.j@university.edu",
            "department": "Computer Science",
            "role": "student"
        }
    },
    "message": "Login successful"
}
```

**Error Responses:**
- `400` — Missing email or password
- `401` — Invalid email or password
- `403` — Account is deactivated

**Business Logic:**
1. Query the `student` table by email
2. If not found, query the `admin` table by email
3. Compare password hash using `bcrypt.checkpw()`
4. If match, generate JWT token with `{ id, email, role }` payload
5. Return token and user info

---

#### `POST /api/auth/register`

**Description:** Registers a new student account.

**Request Body:**
```json
{
    "studentId": "STU006",
    "name": "Frank Wilson",
    "email": "frank.w@university.edu",
    "password": "securepassword",
    "department": "Mechanical Engineering",
    "phone": "+1-234-567-8906"
}
```

**Success Response (201):**
```json
{
    "success": true,
    "data": { "studentId": "STU006" },
    "message": "Student registered successfully"
}
```

**Error Responses:**
- `400` — Missing required fields
- `409` — Email already exists

**Business Logic:**
1. Validate all required fields
2. Check if email already exists in `student` table
3. Hash the password with bcrypt
4. Insert into `student` table
5. Log activity in `activity_log` table

---

### 6.2 Book Endpoints

---

#### `GET /api/books`

**Description:** Returns all books in the library.

**Success Response (200):**
```json
{
    "success": true,
    "data": [
        {
            "id": "BK001",
            "title": "Introduction to Algorithms",
            "author": "Thomas H. Cormen",
            "category": "Computer Science",
            "isbn": "978-0-262-03384-8",
            "totalCopies": 5,
            "issuedCopies": 3
        },
        ...
    ],
    "count": 12,
    "message": "Books retrieved successfully"
}
```

**SQL Query:**
```sql
SELECT book_id AS id, title, author, category, isbn,
       total_copies AS totalCopies, issued_copies AS issuedCopies
FROM book
ORDER BY title ASC;
```

---

#### `GET /api/books/search?q=algorithms`

**Description:** Searches books by title, author, category, or ISBN.

**Query Parameter:** `q` — search keyword (required)

**SQL Query:**
```sql
SELECT book_id AS id, title, author, category, isbn,
       total_copies AS totalCopies, issued_copies AS issuedCopies
FROM book
WHERE title LIKE '%algorithms%'
   OR author LIKE '%algorithms%'
   OR category LIKE '%algorithms%'
   OR isbn LIKE '%algorithms%'
ORDER BY title ASC;
```

---

#### `GET /api/books/:id`

**Description:** Returns a single book by ID.

**Example:** `GET /api/books/BK001`

---

#### `GET /api/books/available`

**Description:** Returns books that have at least 1 copy available.

**SQL Query:**
```sql
SELECT * FROM vw_book_availability WHERE available_copies > 0;
```

---

#### `POST /api/books` *(Admin Only)*

**Description:** Adds a new book to the library.

**Request Body:**
```json
{
    "bookId": "BK013",
    "title": "Cracking the Coding Interview",
    "author": "Gayle McDowell",
    "category": "Interview Prep",
    "isbn": "978-0-984-78285-0",
    "totalCopies": 3
}
```

---

#### `PUT /api/books/:id` *(Admin Only)*

**Description:** Updates a book's details.

---

#### `DELETE /api/books/:id` *(Admin Only)*

**Description:** Deletes a book. Must not have any active issues.

---

### 6.3 Student Endpoints

---

#### `GET /api/students`

**Description:** Returns all registered students. *(Admin only)*

#### `GET /api/students/:id`

**Description:** Returns a specific student's profile including their issue/fine stats.

**SQL Query (use the view):**
```sql
SELECT * FROM vw_student_fines WHERE student_id = 'STU001';
```

---

### 6.4 Issue & Return Endpoints

---

#### `POST /api/issues`

**Description:** Issues a book to a student.

**Request Body:**
```json
{
    "studentId": "STU001",
    "bookId": "BK008"
}
```

**Success Response (201):**
```json
{
    "success": true,
    "data": {
        "issueId": "ISS016",
        "studentId": "STU001",
        "bookId": "BK008",
        "issueDate": "2026-03-31",
        "dueDate": "2026-04-14"
    },
    "message": "Book issued successfully"
}
```

**Business Logic:**
1. Validate studentId exists in `student` table
2. Validate bookId exists in `book` table
3. Check if book has available copies (`total_copies > issued_copies`)
4. Check if same book is already issued to same student (prevent duplicates)
5. Generate new issue ID (`ISS` + next number)
6. Call stored procedure `sp_issue_book()` OR insert directly (trigger handles copy increment)
7. Return issue details with due date

**Error Responses:**
- `400` — Missing studentId or bookId
- `404` — Student or book not found
- `409` — Book already issued to this student
- `422` — No copies available

---

#### `POST /api/returns`

**Description:** Processes a book return.

**Request Body:**
```json
{
    "issueId": "ISS001"
}
```

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "issueId": "ISS001",
        "returnDate": "2026-03-31",
        "fine": 16.00,
        "daysLate": 16
    },
    "message": "Book returned successfully. Fine: $16.00"
}
```

**Business Logic:**
1. Find the issue record by issueId
2. Confirm it hasn't been returned already (`status = 'ISSUED'`)
3. Call stored procedure `sp_return_book()` OR update directly (trigger calculates fine)
4. Return fine amount and return date

---

#### `GET /api/issues`

**Description:** Returns all currently active (non-returned) issues.

**SQL Query:**
```sql
SELECT * FROM vw_active_issues;
```

---

#### `GET /api/issues/student/:id`

**Description:** Returns all issues for a specific student.

**Optional Query Param:** `?status=active` — filter to only active issues

---

#### `GET /api/issues/search?bookId=BK001&studentId=STU001`

**Description:** Finds a specific active issue record for a book+student combination.

**SQL Query:**
```sql
SELECT * FROM issue_record
WHERE book_id = 'BK001' AND student_id = 'STU001' AND status = 'ISSUED';
```

---

#### `GET /api/returns/student/:id`

**Description:** Returns the return history for a specific student.

**SQL Query:**
```sql
SELECT rr.*, b.title AS book_title
FROM return_record rr
JOIN book b ON rr.book_id = b.book_id
WHERE rr.student_id = 'STU001'
ORDER BY rr.return_date DESC;
```

---

### 6.5 Dashboard & Report Endpoints

---

#### `GET /api/dashboard/stats`

**Description:** Returns summary statistics for the dashboard.

**SQL Query:**
```sql
SELECT * FROM vw_dashboard_stats;
-- OR
CALL sp_get_dashboard_stats();
```

**Response:**
```json
{
    "success": true,
    "data": {
        "totalBooks": 45,
        "issuedBooks": 20,
        "availableBooks": 25,
        "totalFines": 17.00,
        "totalStudents": 5,
        "overdueCount": 2
    }
}
```

---

#### `GET /api/dashboard/monthly`

**Description:** Returns monthly issue/return counts for the chart.

**SQL Query:**
```sql
SELECT * FROM vw_monthly_stats ORDER BY month DESC LIMIT 7;
```

---

#### `GET /api/dashboard/categories`

**Description:** Returns book count per category for the doughnut chart.

**SQL Query:**
```sql
SELECT category AS label, SUM(total_copies) AS value
FROM book
GROUP BY category
ORDER BY value DESC;
```

---

#### `GET /api/dashboard/activity`

**Description:** Returns recent activity log entries.

**SQL Query:**
```sql
SELECT action_type AS type, description AS text,
       TIMESTAMPDIFF(HOUR, created_at, NOW()) AS hours_ago
FROM activity_log
ORDER BY created_at DESC
LIMIT 20;
```

---

## 7. Implementation Guide

### Step 1: Create `app.py` (Main Entry Point)

```python
"""
OLMS — Main Flask Application
Entry point for the backend REST API server.
"""

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables BEFORE importing routes
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ── Import and Register Route Blueprints ──
from routes.auth_routes import auth_bp
from routes.book_routes import books_bp
from routes.student_routes import students_bp
from routes.issue_routes import issues_bp
from routes.report_routes import reports_bp

app.register_blueprint(auth_bp,     url_prefix='/api/auth')
app.register_blueprint(books_bp,    url_prefix='/api/books')
app.register_blueprint(students_bp, url_prefix='/api/students')
app.register_blueprint(issues_bp,   url_prefix='/api/issues')
app.register_blueprint(reports_bp,  url_prefix='/api')

# ── Health Check Endpoint ──
@app.route('/api/health', methods=['GET'])
def health_check():
    """Quick endpoint to verify the API server is running."""
    return jsonify({
        "success": True,
        "message": "OLMS API is running",
        "version": "1.0.0"
    }), 200

# ── 404 Handler ──
@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "success": False,
        "error": "Endpoint not found",
        "code": 404
    }), 404

# ── 500 Handler ──
@app.errorhandler(500)
def server_error(e):
    return jsonify({
        "success": False,
        "error": "Internal server error",
        "code": 500
    }), 500

# ── Run Server ──
if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"""
    ╔══════════════════════════════════════╗
    ║     OLMS Backend API Server          ║
    ║     Running on: http://localhost:{port}  ║
    ║     Debug Mode: {debug}                ║
    ╚══════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
```

### Step 2: Create Route Files

#### `routes/auth_routes.py` — Starter Template

```python
"""
OLMS — Authentication Routes
Handles login, registration, and session management.
"""

from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from config.database import execute_query

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token."""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({
            "success": False,
            "error": "Email and password are required",
            "code": 400
        }), 400
    
    email = data['email'].strip().lower()
    password = data['password']
    
    # Look up student by email
    student = execute_query(
        "SELECT * FROM student WHERE email = %s AND is_active = TRUE",
        (email,),
        fetch_one=True
    )
    
    if not student:
        # Try admin table
        admin = execute_query(
            "SELECT * FROM admin WHERE email = %s",
            (email,),
            fetch_one=True
        )
        if not admin:
            return jsonify({
                "success": False,
                "error": "Invalid email or password",
                "code": 401
            }), 401
        
        user = admin
        role = admin.get('role', 'LIBRARIAN')
        user_id = str(admin['admin_id'])
    else:
        user = student
        role = 'STUDENT'
        user_id = student['student_id']
    
    # Verify password
    stored_hash = user['password'].encode('utf-8')
    if not bcrypt.checkpw(password.encode('utf-8'), stored_hash):
        return jsonify({
            "success": False,
            "error": "Invalid email or password",
            "code": 401
        }), 401
    
    # Generate JWT token
    payload = {
        "id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=int(os.getenv('JWT_EXPIRY_HOURS', 24)))
    }
    token = jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm='HS256')
    
    return jsonify({
        "success": True,
        "data": {
            "token": token,
            "user": {
                "id": user_id,
                "name": user['name'],
                "email": email,
                "role": role,
                "department": user.get('department', 'Admin')
            }
        },
        "message": "Login successful"
    }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new student account."""
    data = request.get_json()
    
    # Validate required fields
    required = ['studentId', 'name', 'email', 'password', 'department']
    for field in required:
        if not data.get(field):
            return jsonify({
                "success": False,
                "error": f"'{field}' is required",
                "code": 400
            }), 400
    
    # Check for duplicate email
    existing = execute_query(
        "SELECT student_id FROM student WHERE email = %s",
        (data['email'],),
        fetch_one=True
    )
    if existing:
        return jsonify({
            "success": False,
            "error": "A student with this email already exists",
            "code": 409
        }), 409
    
    # Hash password
    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Insert student
    execute_query(
        """INSERT INTO student (student_id, name, email, password, department, phone)
           VALUES (%s, %s, %s, %s, %s, %s)""",
        (data['studentId'], data['name'], data['email'],
         hashed.decode('utf-8'), data['department'], data.get('phone', '')),
        commit=True
    )
    
    # Log activity
    execute_query(
        """INSERT INTO activity_log (action_type, description, performed_by)
           VALUES ('REGISTER', %s, %s)""",
        (f"New student {data['name']} registered", data['studentId']),
        commit=True
    )
    
    return jsonify({
        "success": True,
        "data": {"studentId": data['studentId']},
        "message": "Student registered successfully"
    }), 201
```

> **Follow this same pattern** for `book_routes.py`, `student_routes.py`, `issue_routes.py`, and `report_routes.py`. Use the SQL queries from Section 6 for each endpoint.

### Step 3: Create JWT Middleware

#### `middleware/auth_middleware.py`

```python
"""
OLMS — JWT Authentication Middleware
Protects routes that require a logged-in user.
"""

from functools import wraps
from flask import request, jsonify
import jwt
import os


def token_required(f):
    """Decorator to protect routes with JWT authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({
                "success": False,
                "error": "Authentication token is missing",
                "code": 401
            }), 401
        
        try:
            payload = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=['HS256'])
            request.current_user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "error": "Token has expired. Please login again.",
                "code": 401
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "error": "Invalid token",
                "code": 401
            }), 401
        
        return f(*args, **kwargs)
    return decorated


def admin_required(f):
    """Decorator to restrict routes to admin users only."""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.current_user.get('role') not in ['SUPER_ADMIN', 'LIBRARIAN']:
            return jsonify({
                "success": False,
                "error": "Admin access required",
                "code": 403
            }), 403
        return f(*args, **kwargs)
    return decorated
```

**Usage in routes:**
```python
from middleware.auth_middleware import token_required, admin_required

@books_bp.route('/', methods=['POST'])
@admin_required
def add_book():
    # Only admins can add books
    ...

@books_bp.route('/', methods=['GET'])
@token_required
def get_books():
    # Any logged-in user can view books
    ...
```

---

## 8. Authentication System

### How JWT Auth Works in This Project

```
1. User sends POST /api/auth/login with { email, password }
          │
2. Backend checks email exists in student/admin table
          │
3. Backend verifies password hash with bcrypt
          │
4. Backend generates JWT token with { id, email, role, exp }
          │
5. Token sent back to frontend in response
          │
6. Frontend stores token in sessionStorage
          │
7. For all subsequent requests, frontend sends:
   Header: "Authorization: Bearer <token>"
          │
8. Backend middleware decodes token, verifies it's valid
          │
9. Request proceeds with user identity attached
```

### Password Hashing

**NEVER** store plain text passwords. Always use bcrypt:

```python
import bcrypt

# Hashing a password (during registration):
plain_password = "password123"
hashed = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
# Store hashed.decode('utf-8') in the database

# Verifying a password (during login):
stored_hash = "$2b$12$fetched_from_database".encode('utf-8')
is_valid = bcrypt.checkpw("password123".encode('utf-8'), stored_hash)
```

---

## 9. Error Handling

### Standard HTTP Status Codes to Use

| Code | Meaning | When to Use |
|------|---------|------------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST (new resource created) |
| `400` | Bad Request | Missing or invalid request data |
| `401` | Unauthorized | Missing or invalid auth token |
| `403` | Forbidden | User doesn't have permission |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate (email exists, book already issued) |
| `422` | Unprocessable Entity | Valid data but can't process (no copies available) |
| `500` | Internal Server Error | Unexpected server error |

### Wrapping Routes with Try-Catch

```python
@books_bp.route('/', methods=['GET'])
def get_all_books():
    try:
        books = execute_query("SELECT * FROM book", fetch_all=True)
        return jsonify({
            "success": True,
            "data": books,
            "count": len(books),
            "message": "Books retrieved successfully"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "code": 500
        }), 500
```

---

## 10. CORS Configuration

Since the frontend and backend run on different origins (frontend on `file://` or `localhost:8080`, backend on `localhost:5000`), CORS must be enabled:

```python
from flask_cors import CORS

# Allow all origins (for development):
CORS(app, resources={r"/api/*": {"origins": "*"}})

# For production, restrict to specific origins:
# CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "https://yoursite.com"]}})
```

---

## 11. Testing Your API

### Running the Server

```bash
cd backend
venv\Scripts\activate     # Windows
python app.py
```

You should see:
```
╔══════════════════════════════════════╗
║     OLMS Backend API Server          ║
║     Running on: http://localhost:5000 ║
║     Debug Mode: True                 ║
╚══════════════════════════════════════╝
```

### Testing with Postman

1. Open Postman
2. Create a new Collection called "OLMS API"
3. Test each endpoint:

**Test 1 — Health Check:**
```
GET http://localhost:5000/api/health
Expected: { "success": true, "message": "OLMS API is running" }
```

**Test 2 — Get All Books:**
```
GET http://localhost:5000/api/books
Expected: List of 12 books
```

**Test 3 — Login:**
```
POST http://localhost:5000/api/auth/login
Body (JSON): { "email": "alice.j@university.edu", "password": "password123" }
Expected: { "success": true, "data": { "token": "xxx", "user": {...} } }
```

**Test 4 — Issue a Book (with auth):**
```
POST http://localhost:5000/api/issues
Headers: Authorization: Bearer <token_from_login>
Body (JSON): { "studentId": "STU001", "bookId": "BK008" }
Expected: { "success": true, "data": { "issueId": "ISS016", ... } }
```

### Testing with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Get all books
curl http://localhost:5000/api/books

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.j@university.edu","password":"password123"}'

# Issue a book (replace TOKEN with actual JWT)
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"studentId":"STU001","bookId":"BK008"}'
```

---

## 12. Deliverables Checklist

Before you consider your work complete, ensure you have:

- [ ] `backend/app.py` — Main Flask application running without errors
- [ ] `backend/config/database.py` — Working database connection
- [ ] `backend/routes/auth_routes.py` — Login and register working
- [ ] `backend/routes/book_routes.py` — All book CRUD endpoints working
- [ ] `backend/routes/student_routes.py` — Student management endpoints
- [ ] `backend/routes/issue_routes.py` — Issue and return endpoints with validation
- [ ] `backend/routes/report_routes.py` — Dashboard stats and report endpoints
- [ ] `backend/middleware/auth_middleware.py` — JWT authentication middleware
- [ ] `backend/requirements.txt` — All dependencies listed
- [ ] `backend/.env.example` — Template environment file (no real credentials)
- [ ] All endpoints tested via Postman (export the collection if possible)
- [ ] Error handling on every route (try-catch with proper status codes)
- [ ] Passwords hashed with bcrypt (never plain text)
- [ ] CORS enabled for frontend access
- [ ] Code committed to `feature/backend` branch and pushed to GitHub

### Merge Your Work

```bash
git add .
git commit -m "feat: complete backend API with auth, CRUD, issue/return"
git push origin feature/backend
# Then create a Pull Request on GitHub to merge into main
```

---

> **Questions?** Refer to the `TEAM_PLAN.md` in the project root for the overall architecture and how your work connects with the other members.
