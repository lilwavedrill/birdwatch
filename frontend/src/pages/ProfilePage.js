import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [myObs, setMyObs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editMsg, setEditMsg] = useState('');

  useEffect(() => {
    if (user) {
      api.get('/favorites').then(r => setFavorites(r.data)).catch(() => {});
      api.get('/observations/my').then(r => setMyObs(r.data)).catch(() => {});
      setEditName(user.name || '');
      setEditAge(user.age || '');
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditMsg('');
    try {
      const payload = { name: editName };
      if (editAge) payload.age = Number(editAge);
      const res = await api.put(`/users/${user.id}`, payload);
      if (updateUser) updateUser(res.data);
      setEditMsg('Данные сохранены!');
      setEditing(false);
    } catch (err) {
      setEditMsg(err.response?.data?.message || 'Ошибка сохранения');
    }
  };

  return (
    <div className="container">
      <div className="profile-card">
        <h2>Личный кабинет</h2>
        {!editing ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
              <div><strong>Имя:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Роль:</strong> {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</div>
              {user.age && <div><strong>Возраст:</strong> {user.age}</div>}
            </div>
            <button className="btn" onClick={() => setEditing(true)} style={{ marginTop: '0.5rem' }}>
              Редактировать профиль
            </button>
          </>
        ) : (
          <form onSubmit={handleSaveProfile} style={{ margin: '1rem 0' }}>
            <div className="form-group">
              <label>Имя</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Возраст</label>
              <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} min={1} max={120} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">Сохранить</button>
              <button type="button" className="btn" onClick={() => setEditing(false)} style={{ background: '#ccc' }}>Отмена</button>
            </div>
            {editMsg && <p style={{ marginTop: '0.5rem', color: editMsg.includes('Ошибка') ? 'red' : 'green' }}>{editMsg}</p>}
          </form>
        )}
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
