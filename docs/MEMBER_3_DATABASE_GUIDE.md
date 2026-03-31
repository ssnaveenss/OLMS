# 🔵 Member 3 — Database Engineer Guide

## Online Library Management System (OLMS)

> **Role:** Database Engineer  
> **Objective:** Design and implement the complete MySQL database — schema, triggers, views, stored procedures, indexes  
> **Repository:** [https://github.com/ssnaveenss/OLMS](https://github.com/ssnaveenss/OLMS)  
> **Dependencies:** None — you can start immediately

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Environment Setup](#3-environment-setup)
4. [Connection Setup](#4-connection-setup)
5. [ER Diagram](#5-er-diagram)
6. [Complete Schema](#6-complete-schema)
7. [Constraints](#7-constraints)
8. [Indexes](#8-indexes)
9. [Triggers](#9-triggers)
10. [Views](#10-views)
11. [Stored Procedures](#11-stored-procedures)
12. [Seed Data](#12-seed-data)
13. [Verification](#13-verification)
14. [Deliverables](#14-deliverables)

---

## 1. Overview

### What You're Building

You are responsible for the **entire data layer** of OLMS. This means:

- Designing the **Entity-Relationship (ER) Model**
- Creating **6 tables** with proper constraints and relationships
- Writing **4 triggers** for automated fine calculation and copy tracking
- Creating **5 views** for reports and dashboards
- Writing **3 stored procedures** for complex operations
- Adding **indexes** for query performance
- Inserting **seed data** that matches the frontend's mock data

### How It Fits

```
Frontend (Done ✅) → Backend (Member 2) → YOUR DATABASE (MySQL)
                                               │
                                    ┌──────────┼──────────┐
                                    │          │          │
                                 Tables    Triggers    Views
                              Constraints  Procedures  Indexes
```

### Database Concepts Covered

| Concept | Where It's Used |
|---------|----------------|
| ER Modeling | Entity design, relationships (1:M) |
| Constraints | PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL |
| Triggers | Auto fine calculation, copy count management |
| Views | Dashboard stats, reports, active issues |
| Stored Procedures | Issue book, return book operations |
| Indexes | Search optimization on frequently queried columns |
| Joins | Combining student + book + issue data |
| Transactions | Ensuring data integrity on issue/return |
| CRUD | Insert, Select, Update, Delete on all tables |

---

## 2. Prerequisites

### Software to Install

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **MySQL Server** | 8.0+ | [dev.mysql.com/downloads](https://dev.mysql.com/downloads/installer/) | Database engine |
| **MySQL Workbench** | 8.0+ | Included with MySQL installer | Visual DB design & query tool |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |

### MySQL Installation Steps (Windows)

1. Download MySQL Installer from the link above
2. Choose **"Custom"** install type
3. Select: **MySQL Server 8.0+** and **MySQL Workbench**
4. During configuration:
   - Config Type: **Development Computer**
   - Authentication: **Use Strong Password Encryption**
   - Set root password — **remember this password!**
   - Windows Service: **YES** (start at boot)
5. Click **Execute** → **Finish**

### Verify Installation

```bash
# Open Command Prompt or PowerShell
mysql --version
# Expected: mysql  Ver 8.0.XX for Win64 on x86_64

# Test login
mysql -u root -p
# Enter your root password
# You should see: mysql>

# Exit
EXIT;
```

---

## 3. Environment Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/ssnaveenss/OLMS.git
cd OLMS
```

### Step 2: Create Your Branch

```bash
git checkout -b feature/database
```

### Step 3: Create the Database Directory

```bash
mkdir database
```

You will create these files inside `database/`:

```
database/
├── README.md           # Setup instructions for other members
├── schema.sql          # All CREATE TABLE statements
├── indexes.sql         # All CREATE INDEX statements
├── triggers.sql        # All trigger definitions
├── views.sql           # All view definitions
├── procedures.sql      # All stored procedures
├── seed.sql            # Sample data insertion
├── verify.sql          # Verification queries
└── er_diagram.png      # ER diagram screenshot (from Workbench)
```

---

## 4. Connection Setup

### Option A: MySQL Command Line

```bash
mysql -u root -p
# Enter password

CREATE DATABASE olms_db;
USE olms_db;

# Now you can run SQL commands directly
# To run a file:
SOURCE C:/path/to/OLMS/database/schema.sql;
```

### Option B: MySQL Workbench (Recommended)

1. Open MySQL Workbench
2. Click the **+** next to "MySQL Connections"
3. Set up connection:
   - Connection Name: `OLMS Local`
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: Click **Store in Vault** → enter your password
4. Click **Test Connection** → should show "Successfully connected"
5. Click **OK**
6. Double-click the connection to open it
7. In the query tab, run: `CREATE DATABASE olms_db;`

### Share Connection Details with Member 2

After setup, give Member 2 (Backend Developer) these values for their `.env` file:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=olms_db
```

---

## 5. ER Diagram

Create this ER model in MySQL Workbench (File → New Model → Add Diagram):

```
┌──────────────┐       ┌───────────────┐       ┌──────────────┐
│   ADMIN      │       │   STUDENT     │       │    BOOK      │
├──────────────┤       ├───────────────┤       ├──────────────┤
│ PK admin_id  │       │ PK student_id │       │ PK book_id   │
│    name      │       │    name       │       │    title     │
│ UK email     │       │ UK email      │       │    author    │
│    password  │       │    password   │       │    category  │
│    role      │       │    department │       │ UK isbn      │
│    created_at│       │    phone      │       │    total_copies│
│    updated_at│       │    is_active  │       │    issued_copies│
└──────────────┘       │    created_at │       │    created_at│
                       │    updated_at │       │    updated_at│
                       └───────┬───────┘       └──────┬───────┘
                               │ 1                     │ 1
                               │                       │
                               │ M                     │ M
                       ┌───────┴───────────────────────┴───┐
                       │          ISSUE_RECORD             │
                       ├───────────────────────────────────┤
                       │ PK issue_id                       │
                       │ FK student_id → STUDENT           │
                       │ FK book_id → BOOK                 │
                       │    issue_date                     │
                       │    due_date                       │
                       │    return_date (nullable)         │
                       │    fine                           │
                       │    status ENUM                    │
                       └───────────────┬───────────────────┘
                                       │ 1
                                       │ 1
                       ┌───────────────┴───────────────────┐
                       │         RETURN_RECORD             │
                       ├───────────────────────────────────┤
                       │ PK return_id                      │
                       │ FK issue_id → ISSUE_RECORD (UK)   │
                       │ FK student_id → STUDENT           │
                       │ FK book_id → BOOK                 │
                       │    return_date                    │
                       │    fine                           │
                       └───────────────────────────────────┘

                       ┌───────────────────────────────────┐
                       │        ACTIVITY_LOG               │
                       ├───────────────────────────────────┤
                       │ PK log_id (AUTO_INCREMENT)        │
                       │    action_type ENUM               │
                       │    description TEXT                │
                       │    performed_by                   │
                       │    created_at TIMESTAMP           │
                       └───────────────────────────────────┘
```

**Relationships:**
- Student → Issue Record: **One-to-Many** (one student can have many issues)
- Book → Issue Record: **One-to-Many** (one book can appear in many issues)
- Issue Record → Return Record: **One-to-One** (one issue has at most one return)

> 📸 **Export the ER diagram** from Workbench as `er_diagram.png` and save it in the `database/` folder.

---

## 6. Complete Schema

Save this as `database/schema.sql`:

```sql
-- ============================================================
-- OLMS Database Schema
-- Run this file first to create all tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS olms_db;
USE olms_db;

-- Drop tables in reverse dependency order (for re-runs)
DROP TABLE IF EXISTS activity_log;
DROP TABLE IF EXISTS return_record;
DROP TABLE IF EXISTS issue_record;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS admin;

-- 1. ADMIN TABLE
CREATE TABLE admin (
    admin_id    INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        ENUM('SUPER_ADMIN', 'LIBRARIAN') DEFAULT 'LIBRARIAN',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. STUDENT TABLE
CREATE TABLE student (
    student_id  VARCHAR(10) PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    department  VARCHAR(100) NOT NULL,
    phone       VARCHAR(20),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. BOOK TABLE
CREATE TABLE book (
    book_id       VARCHAR(10) PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    author        VARCHAR(200) NOT NULL,
    category      VARCHAR(100) NOT NULL,
    isbn          VARCHAR(20) UNIQUE,
    total_copies  INT NOT NULL DEFAULT 1 CHECK (total_copies >= 0),
    issued_copies INT NOT NULL DEFAULT 0 CHECK (issued_copies >= 0),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_copies CHECK (issued_copies <= total_copies)
) ENGINE=InnoDB;

-- 4. ISSUE RECORD TABLE
CREATE TABLE issue_record (
    issue_id    VARCHAR(10) PRIMARY KEY,
    student_id  VARCHAR(10) NOT NULL,
    book_id     VARCHAR(10) NOT NULL,
    issue_date  DATE NOT NULL,
    due_date    DATE NOT NULL,
    return_date DATE DEFAULT NULL,
    fine        DECIMAL(10, 2) DEFAULT 0.00,
    status      ENUM('ISSUED', 'RETURNED') DEFAULT 'ISSUED',
    FOREIGN KEY (student_id) REFERENCES student(student_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (book_id) REFERENCES book(book_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. RETURN RECORD TABLE
CREATE TABLE return_record (
    return_id   VARCHAR(10) PRIMARY KEY,
    issue_id    VARCHAR(10) NOT NULL UNIQUE,
    student_id  VARCHAR(10) NOT NULL,
    book_id     VARCHAR(10) NOT NULL,
    return_date DATE NOT NULL,
    fine        DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (issue_id) REFERENCES issue_record(issue_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (student_id) REFERENCES student(student_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (book_id) REFERENCES book(book_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. ACTIVITY LOG TABLE
CREATE TABLE activity_log (
    log_id       INT AUTO_INCREMENT PRIMARY KEY,
    action_type  ENUM('ISSUE', 'RETURN', 'FINE', 'REGISTER', 'BOOK_ADD', 'BOOK_DELETE') NOT NULL,
    description  TEXT NOT NULL,
    performed_by VARCHAR(10),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

---

## 7. Constraints

The schema above includes these constraint types:

| Constraint | Table | Column(s) | Purpose |
|-----------|-------|-----------|---------|
| PRIMARY KEY | All tables | `*_id` | Unique row identifier |
| UNIQUE | student | `email` | No duplicate emails |
| UNIQUE | admin | `email` | No duplicate admin emails |
| UNIQUE | book | `isbn` | No duplicate ISBNs |
| UNIQUE | return_record | `issue_id` | One return per issue |
| FOREIGN KEY | issue_record | `student_id` | Links to student |
| FOREIGN KEY | issue_record | `book_id` | Links to book |
| FOREIGN KEY | return_record | `issue_id` | Links to issue |
| CHECK | book | `total_copies` | Must be ≥ 0 |
| CHECK | book | `issued_copies` | Must be ≥ 0 and ≤ total |
| NOT NULL | Multiple | Various | Required fields |
| DEFAULT | issue_record | `status` | Defaults to 'ISSUED' |
| ON DELETE RESTRICT | issue_record | FKs | Cannot delete student/book with active issues |

---

## 8. Indexes

Save as `database/indexes.sql`:

```sql
USE olms_db;

-- Student lookups
CREATE INDEX idx_student_email ON student(email);
CREATE INDEX idx_student_dept ON student(department);

-- Book searches
CREATE INDEX idx_book_title ON book(title);
CREATE INDEX idx_book_author ON book(author);
CREATE INDEX idx_book_category ON book(category);

-- Issue record queries
CREATE INDEX idx_issue_student ON issue_record(student_id);
CREATE INDEX idx_issue_book ON issue_record(book_id);
CREATE INDEX idx_issue_status ON issue_record(status);
CREATE INDEX idx_issue_due ON issue_record(due_date);

-- Activity log
CREATE INDEX idx_activity_time ON activity_log(created_at DESC);
CREATE INDEX idx_activity_type ON activity_log(action_type);
```

---

## 9. Triggers

Save as `database/triggers.sql`:

```sql
USE olms_db;

-- ── Trigger 1: Calculate fine automatically on return ──
DELIMITER //
CREATE TRIGGER trg_calculate_fine
BEFORE UPDATE ON issue_record
FOR EACH ROW
BEGIN
    IF NEW.status = 'RETURNED' AND OLD.status = 'ISSUED' THEN
        IF NEW.return_date IS NULL THEN
            SET NEW.return_date = CURDATE();
        END IF;
        IF NEW.return_date > OLD.due_date THEN
            SET NEW.fine = DATEDIFF(NEW.return_date, OLD.due_date) * 1.00;
        ELSE
            SET NEW.fine = 0.00;
        END IF;
    END IF;
END //
DELIMITER ;

-- ── Trigger 2: Increment issued_copies on book issue ──
DELIMITER //
CREATE TRIGGER trg_increment_on_issue
AFTER INSERT ON issue_record
FOR EACH ROW
BEGIN
    UPDATE book SET issued_copies = issued_copies + 1
    WHERE book_id = NEW.book_id;

    INSERT INTO activity_log (action_type, description, performed_by)
    VALUES ('ISSUE', CONCAT('Book ', NEW.book_id, ' issued to student ', NEW.student_id), NEW.student_id);
END //
DELIMITER ;

-- ── Trigger 3: Decrement issued_copies on book return ──
DELIMITER //
CREATE TRIGGER trg_decrement_on_return
AFTER UPDATE ON issue_record
FOR EACH ROW
BEGIN
    IF NEW.status = 'RETURNED' AND OLD.status = 'ISSUED' THEN
        UPDATE book SET issued_copies = GREATEST(issued_copies - 1, 0)
        WHERE book_id = NEW.book_id;

        INSERT INTO activity_log (action_type, description, performed_by)
        VALUES ('RETURN', CONCAT('Book ', NEW.book_id, ' returned by student ', NEW.student_id), NEW.student_id);

        IF NEW.fine > 0 THEN
            INSERT INTO activity_log (action_type, description, performed_by)
            VALUES ('FINE', CONCAT('Fine of $', FORMAT(NEW.fine, 2), ' charged to student ', NEW.student_id), NEW.student_id);
        END IF;
    END IF;
END //
DELIMITER ;

-- ── Trigger 4: Prevent issuing when no copies available ──
DELIMITER //
CREATE TRIGGER trg_check_availability
BEFORE INSERT ON issue_record
FOR EACH ROW
BEGIN
    DECLARE avail INT;
    SELECT (total_copies - issued_copies) INTO avail FROM book WHERE book_id = NEW.book_id;

    IF avail <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No copies available for this book.';
    END IF;

    IF NEW.due_date IS NULL THEN
        SET NEW.due_date = DATE_ADD(NEW.issue_date, INTERVAL 14 DAY);
    END IF;
END //
DELIMITER ;
```

---

## 10. Views

Save as `database/views.sql`:

```sql
USE olms_db;

-- View 1: Currently active issued books
CREATE OR REPLACE VIEW vw_active_issues AS
SELECT ir.issue_id, s.student_id, s.name AS student_name, s.department,
       b.book_id, b.title AS book_title, b.author,
       ir.issue_date, ir.due_date,
       CASE WHEN CURDATE() > ir.due_date THEN 'OVERDUE'
            WHEN DATEDIFF(ir.due_date, CURDATE()) <= 3 THEN 'DUE SOON'
            ELSE 'ON TIME' END AS status,
       GREATEST(DATEDIFF(CURDATE(), ir.due_date), 0) AS days_overdue,
       GREATEST(DATEDIFF(CURDATE(), ir.due_date), 0) * 1.00 AS estimated_fine
FROM issue_record ir
JOIN student s ON ir.student_id = s.student_id
JOIN book b ON ir.book_id = b.book_id
WHERE ir.status = 'ISSUED';

-- View 2: Book availability
CREATE OR REPLACE VIEW vw_book_availability AS
SELECT book_id, title, author, category, isbn,
       total_copies, issued_copies,
       (total_copies - issued_copies) AS available_copies,
       CASE WHEN issued_copies >= total_copies THEN 'UNAVAILABLE'
            WHEN (total_copies - issued_copies) <= 1 THEN 'LOW STOCK'
            ELSE 'AVAILABLE' END AS availability_status
FROM book;

-- View 3: Student fine summary
CREATE OR REPLACE VIEW vw_student_fines AS
SELECT s.student_id, s.name, s.department, s.email,
       COUNT(ir.issue_id) AS total_issues,
       SUM(CASE WHEN ir.status = 'ISSUED' THEN 1 ELSE 0 END) AS active_issues,
       SUM(CASE WHEN ir.status = 'RETURNED' THEN 1 ELSE 0 END) AS returned_books,
       COALESCE(SUM(ir.fine), 0.00) AS total_fines
FROM student s
LEFT JOIN issue_record ir ON s.student_id = ir.student_id
GROUP BY s.student_id, s.name, s.department, s.email;

-- View 4: Monthly statistics
CREATE OR REPLACE VIEW vw_monthly_stats AS
SELECT DATE_FORMAT(issue_date, '%Y-%m') AS month,
       COUNT(*) AS total_issues,
       SUM(CASE WHEN status = 'RETURNED' THEN 1 ELSE 0 END) AS total_returns,
       SUM(fine) AS total_fines
FROM issue_record
GROUP BY DATE_FORMAT(issue_date, '%Y-%m')
ORDER BY month DESC;

-- View 5: Dashboard overview
CREATE OR REPLACE VIEW vw_dashboard_stats AS
SELECT (SELECT SUM(total_copies) FROM book) AS total_books,
       (SELECT SUM(issued_copies) FROM book) AS issued_books,
       (SELECT SUM(total_copies) - SUM(issued_copies) FROM book) AS available_books,
       (SELECT COALESCE(SUM(fine), 0) FROM issue_record) AS total_fines,
       (SELECT COUNT(*) FROM student WHERE is_active = TRUE) AS total_students,
       (SELECT COUNT(*) FROM issue_record WHERE status = 'ISSUED' AND due_date < CURDATE()) AS overdue_count;
```

---

## 11. Stored Procedures

Save as `database/procedures.sql`:

```sql
USE olms_db;

-- Procedure 1: Issue a book
DELIMITER //
CREATE PROCEDURE sp_issue_book(
    IN p_issue_id VARCHAR(10), IN p_student_id VARCHAR(10),
    IN p_book_id VARCHAR(10), IN p_issue_date DATE
)
BEGIN
    DECLARE v_already INT;
    SELECT COUNT(*) INTO v_already FROM issue_record
    WHERE student_id = p_student_id AND book_id = p_book_id AND status = 'ISSUED';

    IF v_already > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This book is already issued to this student.';
    END IF;

    INSERT INTO issue_record (issue_id, student_id, book_id, issue_date, due_date, status)
    VALUES (p_issue_id, p_student_id, p_book_id, p_issue_date, DATE_ADD(p_issue_date, INTERVAL 14 DAY), 'ISSUED');

    SELECT 'Book issued successfully.' AS message, p_issue_id AS issue_id,
           DATE_ADD(p_issue_date, INTERVAL 14 DAY) AS due_date;
END //
DELIMITER ;

-- Procedure 2: Return a book
DELIMITER //
CREATE PROCEDURE sp_return_book(IN p_issue_id VARCHAR(10), IN p_return_id VARCHAR(10))
BEGIN
    DECLARE v_status VARCHAR(10);
    DECLARE v_student VARCHAR(10);
    DECLARE v_book VARCHAR(10);
    DECLARE v_fine DECIMAL(10,2);

    SELECT status, student_id, book_id INTO v_status, v_student, v_book
    FROM issue_record WHERE issue_id = p_issue_id;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Issue record not found.';
    END IF;
    IF v_status = 'RETURNED' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Book already returned.';
    END IF;

    UPDATE issue_record SET status = 'RETURNED', return_date = CURDATE()
    WHERE issue_id = p_issue_id;

    SELECT fine INTO v_fine FROM issue_record WHERE issue_id = p_issue_id;

    INSERT INTO return_record (return_id, issue_id, student_id, book_id, return_date, fine)
    VALUES (p_return_id, p_issue_id, v_student, v_book, CURDATE(), v_fine);

    SELECT 'Book returned successfully.' AS message, v_fine AS fine, CURDATE() AS return_date;
END //
DELIMITER ;

-- Procedure 3: Get dashboard stats
DELIMITER //
CREATE PROCEDURE sp_get_dashboard_stats()
BEGIN
    SELECT * FROM vw_dashboard_stats;
END //
DELIMITER ;
```

---

## 12. Seed Data

Save as `database/seed.sql`. This data matches the frontend's mock data exactly:

```sql
USE olms_db;

-- Admin (password: admin123 — hash with bcrypt in production)
INSERT INTO admin (name, email, password, role) VALUES
('Super Admin', 'admin@library.com', '$2b$12$placeholder_hash_replace_me', 'SUPER_ADMIN');

-- Students (password: password123 — hash with bcrypt in production)
INSERT INTO student VALUES
('STU001','Alice Johnson','alice.j@university.edu','$2b$12$placeholder','Computer Science','+1-234-567-8901',1,NOW(),NOW()),
('STU002','Bob Williams','bob.w@university.edu','$2b$12$placeholder','Information Technology','+1-234-567-8902',1,NOW(),NOW()),
('STU003','Carol Davis','carol.d@university.edu','$2b$12$placeholder','Computer Science','+1-234-567-8903',1,NOW(),NOW()),
('STU004','David Brown','david.b@university.edu','$2b$12$placeholder','Electronics','+1-234-567-8904',1,NOW(),NOW()),
('STU005','Eva Martinez','eva.m@university.edu','$2b$12$placeholder','Computer Science','+1-234-567-8905',1,NOW(),NOW());

-- Books (12 books — NOTE: Don't set issued_copies here, triggers will handle it)
INSERT INTO book (book_id, title, author, category, isbn, total_copies, issued_copies) VALUES
('BK001','Introduction to Algorithms','Thomas H. Cormen','Computer Science','978-0-262-03384-8',5,0),
('BK002','Clean Code','Robert C. Martin','Software Engineering','978-0-132-35088-4',4,0),
('BK003','Design Patterns','Erich Gamma et al.','Software Engineering','978-0-201-63361-0',3,0),
('BK004','The Pragmatic Programmer','David Thomas & Andrew Hunt','Software Engineering','978-0-135-95705-9',6,0),
('BK005','Artificial Intelligence: A Modern Approach','Stuart Russell & Peter Norvig','AI & ML','978-0-134-61099-3',4,0),
('BK006','Computer Networks','Andrew S. Tanenbaum','Networking','978-0-132-12695-3',5,0),
('BK007','Operating System Concepts','Abraham Silberschatz','Computer Science','978-1-119-80052-0',4,0),
('BK008','Database System Concepts','Abraham Silberschatz','Database','978-0-078-02215-9',3,0),
('BK009','Deep Learning','Ian Goodfellow et al.','AI & ML','978-0-262-03561-3',3,0),
('BK010','Structure and Interpretation of Computer Programs','Harold Abelson & Gerald J. Sussman','Computer Science','978-0-262-51087-5',2,0),
('BK011','The Art of Computer Programming','Donald E. Knuth','Computer Science','978-0-201-89683-1',2,0),
('BK012','Refactoring','Martin Fowler','Software Engineering','978-0-134-75759-8',4,0);

-- Issue Records (triggers will auto-increment issued_copies)
-- First, disable the trigger check temporarily for seed data with pre-set issued_copies
-- OR insert issues and let triggers manage counts

-- For seeding, we insert issues directly. The trg_increment_on_issue trigger 
-- will automatically update book.issued_copies for each insert.

INSERT INTO issue_record (issue_id, student_id, book_id, issue_date, due_date, return_date, fine, status) VALUES
('ISS006','STU003','BK004','2026-02-15','2026-03-01','2026-02-28',0.00,'RETURNED'),
('ISS010','STU001','BK012','2026-02-10','2026-02-24','2026-02-23',0.00,'RETURNED'),
('ISS011','STU004','BK005','2026-02-01','2026-02-15','2026-02-20',5.00,'RETURNED');

-- Now insert active issues
INSERT INTO issue_record (issue_id, student_id, book_id, issue_date, due_date, status) VALUES
('ISS001','STU001','BK001','2026-03-01','2026-03-15','ISSUED'),
('ISS002','STU001','BK005','2026-03-05','2026-03-19','ISSUED'),
('ISS003','STU002','BK002','2026-02-20','2026-03-06','ISSUED'),
('ISS004','STU002','BK009','2026-03-10','2026-03-24','ISSUED'),
('ISS005','STU003','BK001','2026-03-12','2026-03-26','ISSUED'),
('ISS007','STU004','BK007','2026-03-08','2026-03-22','ISSUED'),
('ISS008','STU005','BK001','2026-03-15','2026-03-29','ISSUED'),
('ISS009','STU005','BK003','2026-03-18','2026-04-01','ISSUED'),
('ISS012','STU002','BK006','2026-03-20','2026-04-03','ISSUED'),
('ISS013','STU005','BK010','2026-03-22','2026-04-05','ISSUED'),
('ISS014','STU003','BK005','2026-03-25','2026-04-08','ISSUED'),
('ISS015','STU004','BK002','2026-03-20','2026-04-03','ISSUED');

-- Return Records
INSERT INTO return_record VALUES
('RET001','ISS006','STU003','BK004','2026-02-28',0.00),
('RET002','ISS010','STU001','BK012','2026-02-23',0.00),
('RET003','ISS011','STU004','BK005','2026-02-20',5.00);
```

> ⚠️ **Important:** The `$2b$12$placeholder` passwords are placeholders. In production, Member 2 should generate real bcrypt hashes. For testing, you can generate one using Python: `python -c "import bcrypt; print(bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode())"`

---

## 13. Verification

Save as `database/verify.sql` and run after all setup:

```sql
USE olms_db;

-- 1. Check all tables exist
SHOW TABLES;
-- Expected: 6 tables

-- 2. Verify row counts
SELECT 'admin' AS tbl, COUNT(*) AS rows FROM admin
UNION SELECT 'student', COUNT(*) FROM student
UNION SELECT 'book', COUNT(*) FROM book
UNION SELECT 'issue_record', COUNT(*) FROM issue_record
UNION SELECT 'return_record', COUNT(*) FROM return_record
UNION SELECT 'activity_log', COUNT(*) FROM activity_log;

-- 3. Test views
SELECT * FROM vw_dashboard_stats;
SELECT * FROM vw_active_issues LIMIT 5;
SELECT * FROM vw_book_availability;
SELECT * FROM vw_student_fines;

-- 4. Test stored procedure
CALL sp_get_dashboard_stats();

-- 5. Verify triggers (check book copy counts)
SELECT book_id, title, total_copies, issued_copies,
       (total_copies - issued_copies) AS available
FROM book ORDER BY book_id;

-- 6. Test a join query
SELECT s.name, b.title, ir.issue_date, ir.due_date, ir.status
FROM issue_record ir
JOIN student s ON ir.student_id = s.student_id
JOIN book b ON ir.book_id = b.book_id
WHERE ir.status = 'ISSUED'
ORDER BY ir.due_date;
```

### Execution Order

Run the SQL files in this exact order:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p olms_db < database/indexes.sql
mysql -u root -p olms_db < database/triggers.sql
mysql -u root -p olms_db < database/views.sql
mysql -u root -p olms_db < database/procedures.sql
mysql -u root -p olms_db < database/seed.sql
mysql -u root -p olms_db < database/verify.sql
```

Or in MySQL Workbench: Open each file and click the ⚡ Execute button in order.

---

## 14. Deliverables

- [ ] MySQL 8.0+ installed and running
- [ ] Database `olms_db` created
- [ ] 6 tables with all constraints (PK, FK, UNIQUE, CHECK, NOT NULL)
- [ ] ER Diagram exported as `database/er_diagram.png`
- [ ] `database/schema.sql` — All table definitions
- [ ] `database/indexes.sql` — All indexes
- [ ] `database/triggers.sql` — 4 triggers (fine calc, increment, decrement, availability)
- [ ] `database/views.sql` — 5 views (active issues, availability, fines, monthly, dashboard)
- [ ] `database/procedures.sql` — 3 stored procedures (issue, return, stats)
- [ ] `database/seed.sql` — Sample data matching frontend
- [ ] `database/verify.sql` — Verification queries all pass
- [ ] `database/README.md` — Setup instructions for teammates
- [ ] Share DB credentials with Member 2
- [ ] Code committed and pushed:
  ```bash
  git add .
  git commit -m "feat: complete database schema, triggers, views, procedures"
  git push origin feature/database
  ```

---

> **Questions?** See `TEAM_PLAN.md` in project root for full architecture overview.
