/* ============================================================
   OLMS — Mock Data Store
   Simulates a backend with realistic library data
   ============================================================ */

const DataStore = (() => {
  // ── Book covers — gradient placeholders ──
  const coverColors = [
    ['#6C5CE7', '#A29BFE'],
    ['#00CEC9', '#55EFC4'],
    ['#FD79A8', '#FDCB6E'],
    ['#E17055', '#FAB1A0'],
    ['#74B9FF', '#0984E3'],
    ['#00B894', '#55EFC4'],
    ['#636E72', '#B2BEC3'],
    ['#D63031', '#FF7675'],
    ['#E84393', '#FD79A8'],
    ['#2D3436', '#636E72'],
    ['#0984E3', '#74B9FF'],
    ['#6C5CE7', '#FD79A8'],
  ];

  // ── Books ──
  const books = [
    { id: 'BK001', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '978-0-262-03384-8', totalCopies: 5, issuedCopies: 3, coverIdx: 0 },
    { id: 'BK002', title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', isbn: '978-0-132-35088-4', totalCopies: 4, issuedCopies: 4, coverIdx: 1 },
    { id: 'BK003', title: 'Design Patterns', author: 'Erich Gamma et al.', category: 'Software Engineering', isbn: '978-0-201-63361-0', totalCopies: 3, issuedCopies: 1, coverIdx: 2 },
    { id: 'BK004', title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', category: 'Software Engineering', isbn: '978-0-135-95705-9', totalCopies: 6, issuedCopies: 2, coverIdx: 3 },
    { id: 'BK005', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', category: 'AI & ML', isbn: '978-0-134-61099-3', totalCopies: 4, issuedCopies: 3, coverIdx: 4 },
    { id: 'BK006', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', category: 'Networking', isbn: '978-0-132-12695-3', totalCopies: 5, issuedCopies: 1, coverIdx: 5 },
    { id: 'BK007', title: 'Operating System Concepts', author: 'Abraham Silberschatz', category: 'Computer Science', isbn: '978-1-119-80052-0', totalCopies: 4, issuedCopies: 2, coverIdx: 6 },
    { id: 'BK008', title: 'Database System Concepts', author: 'Abraham Silberschatz', category: 'Database', isbn: '978-0-078-02215-9', totalCopies: 3, issuedCopies: 0, coverIdx: 7 },
    { id: 'BK009', title: 'Deep Learning', author: 'Ian Goodfellow et al.', category: 'AI & ML', isbn: '978-0-262-03561-3', totalCopies: 3, issuedCopies: 2, coverIdx: 8 },
    { id: 'BK010', title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson & Gerald J. Sussman', category: 'Computer Science', isbn: '978-0-262-51087-5', totalCopies: 2, issuedCopies: 1, coverIdx: 9 },
    { id: 'BK011', title: 'The Art of Computer Programming', author: 'Donald E. Knuth', category: 'Computer Science', isbn: '978-0-201-89683-1', totalCopies: 2, issuedCopies: 0, coverIdx: 10 },
    { id: 'BK012', title: 'Refactoring', author: 'Martin Fowler', category: 'Software Engineering', isbn: '978-0-134-75759-8', totalCopies: 4, issuedCopies: 1, coverIdx: 11 },
  ];

  // ── Students ──
  const students = [
    { id: 'STU001', name: 'Alice Johnson', department: 'Computer Science', email: 'alice.j@university.edu', phone: '+1-234-567-8901' },
    { id: 'STU002', name: 'Bob Williams', department: 'Information Technology', email: 'bob.w@university.edu', phone: '+1-234-567-8902' },
    { id: 'STU003', name: 'Carol Davis', department: 'Computer Science', email: 'carol.d@university.edu', phone: '+1-234-567-8903' },
    { id: 'STU004', name: 'David Brown', department: 'Electronics', email: 'david.b@university.edu', phone: '+1-234-567-8904' },
    { id: 'STU005', name: 'Eva Martinez', department: 'Computer Science', email: 'eva.m@university.edu', phone: '+1-234-567-8905' },
  ];

  // ── Issued Books ──
  const issuedBooks = [
    { id: 'ISS001', studentId: 'STU001', bookId: 'BK001', issueDate: '2026-03-01', dueDate: '2026-03-15', returnDate: null, fine: 0.00 },
    { id: 'ISS002', studentId: 'STU001', bookId: 'BK005', issueDate: '2026-03-05', dueDate: '2026-03-19', returnDate: null, fine: 0.00 },
    { id: 'ISS003', studentId: 'STU002', bookId: 'BK002', issueDate: '2026-02-20', dueDate: '2026-03-06', returnDate: null, fine: 12.00 },
    { id: 'ISS004', studentId: 'STU002', bookId: 'BK009', issueDate: '2026-03-10', dueDate: '2026-03-24', returnDate: null, fine: 0.00 },
    { id: 'ISS005', studentId: 'STU003', bookId: 'BK001', issueDate: '2026-03-12', dueDate: '2026-03-26', returnDate: null, fine: 0.00 },
    { id: 'ISS006', studentId: 'STU003', bookId: 'BK004', issueDate: '2026-02-15', dueDate: '2026-03-01', returnDate: '2026-02-28', fine: 0.00 },
    { id: 'ISS007', studentId: 'STU004', bookId: 'BK007', issueDate: '2026-03-08', dueDate: '2026-03-22', returnDate: null, fine: 0.00 },
    { id: 'ISS008', studentId: 'STU005', bookId: 'BK001', issueDate: '2026-03-15', dueDate: '2026-03-29', returnDate: null, fine: 0.00 },
    { id: 'ISS009', studentId: 'STU005', bookId: 'BK003', issueDate: '2026-03-18', dueDate: '2026-04-01', returnDate: null, fine: 0.00 },
    { id: 'ISS010', studentId: 'STU001', bookId: 'BK012', issueDate: '2026-02-10', dueDate: '2026-02-24', returnDate: '2026-02-23', fine: 0.00 },
    { id: 'ISS011', studentId: 'STU004', bookId: 'BK005', issueDate: '2026-02-01', dueDate: '2026-02-15', returnDate: '2026-02-20', fine: 5.00 },
    { id: 'ISS012', studentId: 'STU002', bookId: 'BK006', issueDate: '2026-03-20', dueDate: '2026-04-03', returnDate: null, fine: 0.00 },
    { id: 'ISS013', studentId: 'STU005', bookId: 'BK010', issueDate: '2026-03-22', dueDate: '2026-04-05', returnDate: null, fine: 0.00 },
    { id: 'ISS014', studentId: 'STU003', bookId: 'BK005', issueDate: '2026-03-25', dueDate: '2026-04-08', returnDate: null, fine: 0.00 },
    { id: 'ISS015', studentId: 'STU004', bookId: 'BK002', issueDate: '2026-03-20', dueDate: '2026-04-03', returnDate: null, fine: 0.00 },
  ];

  // ── Return History ──
  const returnHistory = [
    { id: 'RET001', issueId: 'ISS006', studentId: 'STU003', bookId: 'BK004', returnDate: '2026-02-28', fine: 0.00 },
    { id: 'RET002', issueId: 'ISS010', studentId: 'STU001', bookId: 'BK012', returnDate: '2026-02-23', fine: 0.00 },
    { id: 'RET003', issueId: 'ISS011', studentId: 'STU004', bookId: 'BK005', returnDate: '2026-02-20', fine: 5.00 },
  ];

  // ── Activity Log ──
  const activities = [
    { type: 'issue', text: 'Alice Johnson issued "Introduction to Algorithms"', time: '2 hours ago' },
    { type: 'return', text: 'Carol Davis returned "The Pragmatic Programmer"', time: '5 hours ago' },
    { type: 'fine', text: 'Bob Williams fined $12.00 for overdue return', time: '1 day ago' },
    { type: 'issue', text: 'Eva Martinez issued "Deep Learning"', time: '1 day ago' },
    { type: 'register', text: 'New student David Brown registered', time: '2 days ago' },
    { type: 'return', text: 'Alice Johnson returned "Refactoring"', time: '3 days ago' },
    { type: 'issue', text: 'Bob Williams issued "Clean Code"', time: '4 days ago' },
    { type: 'fine', text: 'David Brown fined $5.00 for late return', time: '5 days ago' },
  ];

  // ── Dashboard Stats ──
  function getStats() {
    const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const issuedTotal = books.reduce((sum, b) => sum + b.issuedCopies, 0);
    const available = totalBooks - issuedTotal;
    const totalFines = issuedBooks.reduce((sum, i) => sum + i.fine, 0);

    return {
      totalBooks,
      issuedBooks: issuedTotal,
      availableBooks: available,
      totalFines: totalFines.toFixed(2)
    };
  }

  // ── Monthly issue data for chart ──
  function getMonthlyData() {
    return {
      labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      issues: [25, 32, 28, 45, 38, 42, 35],
      returns: [20, 28, 25, 40, 35, 38, 30]
    };
  }

  // ── Category distribution for chart ──
  function getCategoryData() {
    const categories = {};
    books.forEach(b => {
      categories[b.category] = (categories[b.category] || 0) + b.totalCopies;
    });
    return {
      labels: Object.keys(categories),
      values: Object.values(categories)
    };
  }

  // ── API-like accessors ──
  function getBooks() { return [...books]; }
  
  function getBook(id) { return books.find(b => b.id === id); }
  
  function getStudents() { return [...students]; }
  
  function getStudent(id) { return students.find(s => s.id === id); }
  
  function getIssuedBooks() { return [...issuedBooks]; }
  
  function getActiveIssues() { return issuedBooks.filter(i => !i.returnDate); }
  
  function getStudentIssues(studentId) { return issuedBooks.filter(i => i.studentId === studentId); }
  
  function getStudentActiveIssues(studentId) { return issuedBooks.filter(i => i.studentId === studentId && !i.returnDate); }
  
  function getStudentReturnHistory(studentId) { return returnHistory.filter(r => r.studentId === studentId); }

  function getActivities() { return [...activities]; }

  function getAvailableBooks() { return books.filter(b => b.issuedCopies < b.totalCopies); }

  function getCoverGradient(idx) {
    const colors = coverColors[idx % coverColors.length];
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
  }

  // ── Issue a book ──
  function issueBook(studentId, bookId) {
    const book = getBook(bookId);
    const student = getStudent(studentId);
    if (!book || !student) return { success: false, error: 'Invalid student or book ID' };
    if (book.issuedCopies >= book.totalCopies) return { success: false, error: 'No copies available' };

    book.issuedCopies++;
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 14);

    const issue = {
      id: 'ISS' + String(issuedBooks.length + 1).padStart(3, '0'),
      studentId,
      bookId,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      returnDate: null,
      fine: 0.00
    };

    issuedBooks.push(issue);
    activities.unshift({
      type: 'issue',
      text: `${student.name} issued "${book.title}"`,
      time: 'Just now'
    });

    return { success: true, issue };
  }

  // ── Return a book ──
  function returnBook(issueId) {
    const issue = issuedBooks.find(i => i.id === issueId);
    if (!issue) return { success: false, error: 'Issue record not found' };
    if (issue.returnDate) return { success: false, error: 'Book already returned' };

    const book = getBook(issue.bookId);
    const student = getStudent(issue.studentId);
    const today = new Date();
    const dueDate = new Date(issue.dueDate);
    
    let fine = 0;
    if (today > dueDate) {
      const daysLate = Utils.daysBetween(issue.dueDate, today.toISOString().split('T')[0]);
      fine = daysLate * 1.00; // $1 per day late
    }

    issue.returnDate = today.toISOString().split('T')[0];
    issue.fine = fine;
    if (book) book.issuedCopies = Math.max(0, book.issuedCopies - 1);

    returnHistory.push({
      id: 'RET' + String(returnHistory.length + 1).padStart(3, '0'),
      issueId,
      studentId: issue.studentId,
      bookId: issue.bookId,
      returnDate: issue.returnDate,
      fine
    });

    if (student && book) {
      activities.unshift({
        type: fine > 0 ? 'fine' : 'return',
        text: fine > 0
          ? `${student.name} fined $${fine.toFixed(2)} for late return of "${book.title}"`
          : `${student.name} returned "${book.title}"`,
        time: 'Just now'
      });
    }

    return { success: true, fine, returnDate: issue.returnDate };
  }

  // ── Find issued record ──
  function findIssueRecord(bookId, studentId) {
    return issuedBooks.find(i => i.bookId === bookId && i.studentId === studentId && !i.returnDate);
  }

  return {
    getBooks, getBook, getStudents, getStudent, getIssuedBooks, getActiveIssues,
    getStudentIssues, getStudentActiveIssues, getStudentReturnHistory,
    getActivities, getAvailableBooks, getCoverGradient,
    getStats, getMonthlyData, getCategoryData,
    issueBook, returnBook, findIssueRecord
  };
})();
