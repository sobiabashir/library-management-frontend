import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar({ onLogout }) {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        📚 Library System
      </div>
      <ul className="navbar-links">
        {user?.role === 'ADMIN' && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/books">Books</Link></li>
            <li><Link to="/authors">Authors</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/members">Members</Link></li>
            <li><Link to="/borrowing">Borrowing</Link></li>
          </>
        )}
        {user?.role === 'MEMBER' && (
          <>
            <li><Link to="/books">Search Books</Link></li>
            <li><Link to="/borrowing">My Books</Link></li>
          </>
        )}
      </ul>
      <div className="navbar-user">
        <span>👤 {user?.firstName} ({user?.role})</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;