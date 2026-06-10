# Library Management System — Frontend 📚

A responsive React frontend for the Library Management System with JWT authentication and role-based access control.

## 🌐 Live Demo

**https://library-management-frontend-git-main-sobia-s-projects.vercel.app**

## 🛠 Tech Stack

- React 18
- React Router DOM
- Axios
- Context API (AuthContext)
- Plain CSS
- JWT Authentication

## ✨ Features

- Login page with JWT authentication
- Forgot password and reset password via email
- Role-based layouts — ADMIN and MEMBER see different interfaces
- Protected routes — unauthorized access redirected automatically
- Token automatically attached to every API request via Axios interceptor
- Persistent login via localStorage

## 👤 Role-Based Access

**ADMIN can:**
- View Dashboard with statistics
- Full CRUD for Books, Authors, Categories, Members
- View all borrowing records
- Mark books as returned

**MEMBER can:**
- Search and view all books
- See book availability
- Borrow available books
- View their own borrowing history

## 📁 Project Structure
src/
├── components/
│   └── Navbar.js         — Navigation bar with role-based links
├── context/
│   └── AuthContext.js    — Global authentication state
├── pages/
│   ├── LoginPage.js
│   ├── ForgotPasswordPage.js
│   ├── ResetPasswordPage.js
│   ├── DashboardPage.js
│   ├── BooksPage.js
│   ├── AuthorsPage.js
│   ├── CategoriesPage.js
│   ├── MembersPage.js
│   └── BorrowingPage.js
├── services/
│   └── api.js            — All API calls with Axios
└── styles/
├── Login.css
├── Navbar.css
├── Page.css
└── Dashboard.css

## ☁️ Deployment

- Deployed on **Vercel**
- Environment variable `REACT_APP_API_URL` points to Railway backend
- Backend deployed on **Railway** with MySQL

## 🚀 How to Run Locally

1. Clone the repository
```bash
git clone https://github.com/sobiabashir/library-management-frontend.git
```
2. Install dependencies
```bash
npm install
```
3. Start the development server
```bash
npm start
```
4. App runs on `http://localhost:3000`
5. Make sure the backend is running on `http://localhost:8080`

## 🔗 Backend Repository

[Library Management System Backend](https://github.com/sobiabashir/library-management-backend)

---
Built by **Sobia Bashir** — Java Developer | Full Stack Engineer
