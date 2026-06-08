import React, { useState, useEffect } from 'react';
import { getAllMembers, createMember, updateMember, deleteMember } from '../services/api';
import '../styles/Page.css';

function MembersPage() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', membershipDate: '', role: 'MEMBER', password: ''
  });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();
      setMembers(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateMember(editingMember.id, formData);
      } else {
        await createMember(formData);
      }
      fetchMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      membershipDate: member.membershipDate,
      role: member.role,
      password: ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this member?')) {
      try {
        await deleteMember(id);
        fetchMembers();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', membershipDate: '', role: 'MEMBER', password: '' });
    setEditingMember(null);
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Members</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password {editingMember && '(leave blank to keep current)'}</label>
              <input type="password" value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!editingMember} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Membership Date</label>
              <input type="date" value={formData.membershipDate}
                onChange={(e) => setFormData({...formData, membershipDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-primary">{editingMember ? 'Update' : 'Save'}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
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
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.firstName}</td>
                <td>{member.lastName}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>
                  <span className={member.role === 'ADMIN' ? 'badge-admin' : 'badge-member'}>
                    {member.role}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(member)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(member.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MembersPage;