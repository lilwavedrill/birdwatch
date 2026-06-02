import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import BirdDetailPage from './pages/BirdDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ObservationsPage from './pages/ObservationsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="header">
        <Link to="/" className="header-logo">
          BirdWatch
        </Link>
        <nav className="header-nav">
          <Link to="/catalog">Каталог</Link>
          {user ? (
            <>
              <Link to="/observations">Наблюдения</Link>
              <Link to="/profile">Профиль</Link>
              {user.role === 'admin' && <Link to="/admin">Админ</Link>}
              <button onClick={logout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login">Вход</Link>
              <Link to="/register">Регистрация</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/birds/:id" element={<BirdDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/observations" element={<ObservationsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <footer className="footer">
        BirdWatch &copy; 2024 &mdash; Орнитологическая информационная система
      </footer>
    </div>
  );
}

export default App;
