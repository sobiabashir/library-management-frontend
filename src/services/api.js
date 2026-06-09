import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('library_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authors
export const getAllAuthors = () => api.get('/authors');
export const getAuthorById = (id) => api.get(`/authors/${id}`);
export const createAuthor = (data) => api.post('/authors', data);
export const updateAuthor = (id, data) => api.put(`/authors/${id}`, data);
export const deleteAuthor = (id) => api.delete(`/authors/${id}`);

// Categories
export const getAllCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Books
export const getAllBooks = () => api.get('/books');
export const getBookById = (id) => api.get(`/books/${id}`);
export const searchBooks = (title) => api.get(`/books/search?title=${title}`);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// Members
export const getAllMembers = () => api.get('/members');
export const getMemberById = (id) => api.get(`/members/${id}`);
export const createMember = (data) => api.post('/members', data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);

// Borrowing
export const getAllBorrowings = () => api.get('/borrowing');
export const borrowBook = (data) => api.post('/borrowing/borrow', data);
export const returnBook = (id) => api.put(`/borrowing/return/${id}`);
export const getBorrowingsByMember = (memberId) => api.get(`/borrowing/member/${memberId}`);

// Auth
export const loginUser = (data) => api.post('/auth/login', data);

export default api;