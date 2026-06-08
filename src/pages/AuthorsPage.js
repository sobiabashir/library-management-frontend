import React, { useState, useEffect } from 'react';
import { getAllAuthors, createAuthor, updateAuthor, deleteAuthor } from '../services/api';
import '../styles/Page.css';

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await getAllAuthors();
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAuthor) {
        await updateAuthor(editingAuthor.id, formData);
      } else {
        await createAuthor(formData);
      }
      fetchAuthors();
      resetForm();
    } catch (error) {
      console.error('Error saving author:', error);
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setFormData({
      firstName: author.firstName,
      lastName: author.lastName,
      email: author.email
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await deleteAuthor(id);
        fetchAuthors();
      } catch (error) {
        console.error('Error deleting author:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '' });
    setEditingAuthor(null);
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Authors</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Author'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingAuthor ? 'Edit Author' : 'Add New Author'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">
                {editingAuthor ? 'Update' : 'Save'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map(author => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.firstName}</td>
                <td>{author.lastName}</td>
                <td>{author.email}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(author)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(author.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuthorsPage;