import React, { useState, useEffect } from 'react';
import { getAllBorrowings, getBorrowingsByMember, returnBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Page.css';

function BorrowingPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      let response;
      if (isAdmin) {
        response = await getAllBorrowings();
      } else {
        response = await getBorrowingsByMember(user.id);
      }
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleReturn = async (recordId) => {
    if (window.confirm('Mark this book as returned?')) {
      try {
        await returnBook(recordId);
        fetchRecords();
      } catch (error) {
        console.error('Error returning book:', error);
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>{isAdmin ? 'All Borrowing Records' : 'My Borrowed Books'}</h2>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Book Title</th>
              <th>Member</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.bookTitle}</td>
                <td>{record.memberName}</td>
                <td>{record.borrowDate}</td>
                <td>{record.returnDate || '—'}</td>
                <td>
                  <span className={record.status === 'BORROWED' ? 'badge-borrowed' : 'badge-returned'}>
                    {record.status}
                  </span>
                </td>
                {isAdmin && (
                  <td>
                    {record.status === 'BORROWED' && (
                      <button className="btn-return" onClick={() => handleReturn(record.id)}>
                        Mark Returned
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: '#999', padding: '32px' }}>
                  No borrowing records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BorrowingPage;