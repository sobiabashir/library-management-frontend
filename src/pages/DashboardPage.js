import React, { useState, useEffect } from 'react';
import { getAllBooks, getAllAuthors, getAllMembers, getAllBorrowings } from '../services/api';
import { useNavigate } from 'react-router-dom';
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
  const [allBorrowings, setAllBorrowings] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      setAllBorrowings(borrowings);
      setRecentBorrowings(borrowings.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (type) => {
    if (type === 'books') {
      navigate('/books');
    } else if (type === 'authors') {
      navigate('/authors');
    } else if (type === 'members') {
      navigate('/members');
    } else if (type === 'borrowed') {
      if (activeFilter === 'borrowed') {
        setActiveFilter(null);
        setFilteredList([]);
      } else {
        setActiveFilter('borrowed');
        setFilteredList(allBorrowings.filter(b => b.status === 'BORROWED'));
      }
    } else if (type === 'returned') {
      if (activeFilter === 'returned') {
        setActiveFilter(null);
        setFilteredList([]);
      } else {
        setActiveFilter('returned');
        setFilteredList(allBorrowings.filter(b => b.status === 'RETURNED'));
      }
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
        <div className="stat-card stat-card--blue clickable" onClick={() => handleCardClick('books')}>
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalBooks}</span>
            <span className="stat-label">Total Books</span>
          </div>
          <span className="stat-hint">View all →</span>
        </div>

        <div className="stat-card stat-card--green clickable" onClick={() => handleCardClick('authors')}>
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalAuthors}</span>
            <span className="stat-label">Total Authors</span>
          </div>
          <span className="stat-hint">View all →</span>
        </div>

        <div className="stat-card stat-card--purple clickable" onClick={() => handleCardClick('members')}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalMembers}</span>
            <span className="stat-label">Total Members</span>
          </div>
          <span className="stat-hint">View all →</span>
        </div>

        <div className={`stat-card stat-card--orange clickable ${activeFilter === 'borrowed' ? 'active' : ''}`}
          onClick={() => handleCardClick('borrowed')}>
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <span className="stat-number">{stats.currentlyBorrowed}</span>
            <span className="stat-label">Currently Borrowed</span>
          </div>
          <span className="stat-hint">{activeFilter === 'borrowed' ? 'Hide ↑' : 'View list →'}</span>
        </div>

        <div className={`stat-card stat-card--teal clickable ${activeFilter === 'returned' ? 'active' : ''}`}
          onClick={() => handleCardClick('returned')}>
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-number">{stats.totalReturned}</span>
            <span className="stat-label">Total Returned</span>
          </div>
          <span className="stat-hint">{activeFilter === 'returned' ? 'Hide ↑' : 'View list →'}</span>
        </div>
      </div>

      {/* Filtered list for borrowed/returned */}
      {activeFilter && (
        <div className="dashboard-section">
          <h3>{activeFilter === 'borrowed' ? '📖 Currently Borrowed Books' : '✅ Returned Books'}</h3>
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
                {filteredList.map(record => (
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
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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