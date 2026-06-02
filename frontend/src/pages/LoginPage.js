import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка авторизации');
    }
  };

  return (
    <div className="form-page">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn btn-full" style={{ marginTop: '1rem' }}>Войти</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
        Нет аккаунта? <Link to="/register" style={{ color: '#4a7c23' }}>Зарегистрироваться</Link>
      </p>
    </div>
  );
}

export default LoginPage;
