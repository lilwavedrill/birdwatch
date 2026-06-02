import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, age);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="form-page">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        <div className="form-group">
          <label>Возраст (необязательно)</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} min={1} max={120} />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" className="btn btn-full" style={{ marginTop: '1rem' }}>Зарегистрироваться</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
        Уже есть аккаунт? <Link to="/login" style={{ color: '#4a7c23' }}>Войти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
