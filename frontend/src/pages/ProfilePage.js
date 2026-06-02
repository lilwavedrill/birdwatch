import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ProfilePage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [myObs, setMyObs] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/favorites').then(r => setFavorites(r.data)).catch(() => {});
      api.get('/observations/my').then(r => setMyObs(r.data)).catch(() => {});
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container">
      <div className="profile-card">
        <h2>Личный кабинет</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
          <div><strong>Имя:</strong> {user.name}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Роль:</strong> {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</div>
          {user.age && <div><strong>Возраст:</strong> {user.age}</div>}
        </div>
      </div>

      <h3 style={{ color: '#2d5016', margin: '2rem 0 1rem' }}>Избранные птицы ({favorites.length})</h3>
      {favorites.length === 0 ? (
        <p style={{ color: '#888' }}>У вас пока нет избранных птиц. <Link to="/catalog" style={{ color: '#4a7c23' }}>Перейти в каталог</Link></p>
      ) : (
        <div className="cards-grid">
          {favorites.map(f => (
            <Link to={`/birds/${f.bird.id}`} key={f.id} className="card">
              <div className="card-body">
                <h3>{f.bird.name}</h3>
                <p>{f.bird.description?.slice(0, 60)}...</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h3 style={{ color: '#2d5016', margin: '2rem 0 1rem' }}>Мои наблюдения ({myObs.length})</h3>
      {myObs.length === 0 ? (
        <p style={{ color: '#888' }}>Наблюдений пока нет. <Link to="/observations" style={{ color: '#4a7c23' }}>Добавить наблюдение</Link></p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Птица</th>
              <th>Место</th>
              <th>Дата</th>
              <th>Заметки</th>
            </tr>
          </thead>
          <tbody>
            {myObs.map(o => (
              <tr key={o.id}>
                <td>{o.bird?.name}</td>
                <td>{o.location}</td>
                <td>{new Date(o.observedAt).toLocaleDateString('ru-RU')}</td>
                <td>{o.notes?.slice(0, 50) || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProfilePage;
