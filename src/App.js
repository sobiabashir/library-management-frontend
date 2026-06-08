import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AuthorsPage from './pages/AuthorsPage';
import BooksPage from './pages/BooksPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import MembersPage from './pages/MembersPage';
import BorrowingPage from './pages/BorrowingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import './App.css';

function ProtectedRoute({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/books" />;
  return children;
}

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
         <Route path="/reset-password" element={<ResetPasswordPage />} />
         <Route path="*" element={<Navigate to="/login" />} />
       </Routes>
    );
  }

  return (
    <div className="app">
      <Navbar onLogout={logout} />
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute adminOnly>
            <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/authors" element={
            <ProtectedRoute adminOnly>
              <AuthorsPage />
            </ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute adminOnly>
              <CategoriesPage />
            </ProtectedRoute>
          } />
          <Route path="/members" element={
            <ProtectedRoute adminOnly>
              <MembersPage />
            </ProtectedRoute>
          } />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/borrowing" element={<BorrowingPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;