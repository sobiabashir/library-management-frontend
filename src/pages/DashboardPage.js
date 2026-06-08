import React, { useState, useEffect } from 'react';
import { getAllBooks, getAllAuthors, getAllMembers, getAllBorrowings } from '../services/api';
import '../styles/Dashboard.css';

function DashboardPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalMembers: 0,
    currentlyBorrowed: 0,
    totalReturned: 0
  });
  const [recentBorrowings, setRecentBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [booksRes, authorsRes, membersRes, borrowingsRes] = await Promise.all([
        getAllBooks(),
        getAllAuthors(),
        getAllMembers(),
        getAllBorrowings()
      ]);

      const borrowings = borrowingsRes.data;
      const currentlyBorrowed = borrowings.filter(b => b.status === 'BORROWED').length;
      const totalReturned = borrowings.filter(b => b.status === 'RETURNED').length;

      setStats({
        totalBooks: booksRes.data.length,
        totalAuthors: authorsRes.data.length,
        totalMembers: membersRes.data.length,
        currentlyBorrowed,
        totalReturned
      });

      // Show last 5 borrowing records
      setRecentBorrowings(borrowings.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Welcome to Library Management System</p>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--blue">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalBooks}</span>
            <span className="stat-label">Total Books</span>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalAuthors}</span>
            <span className="stat-label">Total Authors</span>
          </div>
        </div>

        <div className="stat-card stat-card--purple">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalMembers}</span>
            <span className="stat-label">Total Members</span>
          </div>
        </div>

        <div className="stat-card stat-card--orange">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <span className="stat-number">{stats.currentlyBorrowed}</span>
            <span className="stat-label">Currently Borrowed</span>
          </div>
        </div>

        <div className="stat-card stat-card--teal">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalReturned}</span>
            <span className="stat-label">Total Returned</span>
          </div>
        </div>
      </div>

      {/* Recent borrowings table */}
      <div className="dashboard-section">
        <h3>Recent Borrowing Activity</h3>
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Member</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBorrowings.map(record => (
                <tr key={record.id}>
                  <td>{record.bookTitle}</td>
                  <td>{record.memberName}</td>
                  <td>{record.borrowDate}</td>
                  <td>{record.returnDate || '—'}</td>
                  <td>
                    <span className={record.status === 'BORROWED' ? 'badge-borrowed' : 'badge-returned'}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBorrowings.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
                    No borrowing records yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;