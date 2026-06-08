import React, { useState, useEffect } from 'react';
import { getAllBooks, createBook, updateBook, deleteBook, searchBooks, getAllAuthors, getAllCategories, borrowBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Page.css';

function BooksPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [formData, setFormData] = useState({
    title: '', isbn: '', publishedYear: '',
    availableCopies: '', authorId: '', categoryId: ''
  });

  useEffect(() => {
    fetchBooks();
    if (isAdmin) {
      fetchAuthors();
      fetchCategories();
    }
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await getAllAuthors();
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchTitle.trim() === '') {
        fetchBooks();
      } else {
        const response = await searchBooks(searchTitle);
        setBooks(response.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook.id, formData);
      } else {
        await createBook(formData);
      }
      fetchBooks();
      resetForm();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
      availableCopies: book.availableCopies,
      authorId: authors.find(a => `${a.firstName} ${a.lastName}` === book.authorName)?.id || '',
      categoryId: categories.find(c => c.name === book.categoryName)?.id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this book?')) {
      try {
        await deleteBook(id);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook({
        borrowDate: new Date().toISOString().split('T')[0],
        bookId: bookId,
        memberId: user.id
      });
      alert('Book borrowed successfully!');
      fetchBooks();
    } catch (error) {
      alert('Could not borrow book. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', isbn: '', publishedYear: '', availableCopies: '', authorId: '', categoryId: '' });
    setEditingBook(null);
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Books</h2>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Book'}
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" className="btn-secondary" onClick={() => { setSearchTitle(''); fetchBooks(); }}>
            Clear
          </button>
        </form>
      </div>

      {/* Add/Edit form — ADMIN only */}
      {isAdmin && showForm && (
        <div className="form-card">
          <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input type="text" value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Published Year</label>
              <input type="number" value={formData.publishedYear}
                onChange={(e) => setFormData({...formData, publishedYear: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Available Copies</label>
              <input type="number" value={formData.availableCopies}
                onChange={(e) => setFormData({...formData, availableCopies: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Author</label>
              <select value={formData.authorId}
                onChange={(e) => setFormData({...formData, authorId: e.target.value})} required>
                <option value="">— Select Author —</option>
                {authors.map(a => (
                  <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})} required>
                <option value="">— Select Category —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">{editingBook ? 'Update' : 'Save'}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Books table */}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Year</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.authorName}</td>
                <td>{book.categoryName}</td>
                <td>{book.publishedYear}</td>
                <td>
                  <span className={book.availableCopies > 0 ? 'badge-available' : 'badge-unavailable'}>
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Not available'}
                  </span>
                </td>
                <td>
                  {isAdmin && (
                    <>
                      <button className="btn-edit" onClick={() => handleEdit(book)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(book.id)}>Delete</button>
                    </>
                  )}
                  {!isAdmin && book.availableCopies > 0 && (
                    <button className="btn-borrow" onClick={() => handleBorrow(book.id)}>Borrow</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BooksPage;