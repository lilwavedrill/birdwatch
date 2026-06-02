import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('birds');
  const [data, setData] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (tab === 'logs') {
      api.get('/logs').then(r => setLogs(r.data)).catch(() => {});
    } else {
      api.get(`/${tab}`).then(r => setData(r.data)).catch(() => {});
    }
  }, [tab]);

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить запись?')) return;
    try {
      await api.delete(`/${tab}/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  const renderTable = () => {
    if (tab === 'logs') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Метод</th>
              <th>URL</th>
              <th>Статус</th>
              <th>User ID</th>
              <th>IP</th>
              <th>Время</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td><strong>{l.method}</strong></td>
                <td>{l.url}</td>
                <td>{l.statusCode}</td>
                <td>{l.userId || '—'}</td>
                <td>{l.ip}</td>
                <td>{new Date(l.timestamp).toLocaleString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === 'birds') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Вид</th>
              <th>Среда</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.species?.name || '—'}</td>
                <td>{b.habitat?.name || '—'}</td>
                <td>{b.conservationStatus || '—'}</td>
                <td><button className="btn btn-danger" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDelete(b.id)}>Удалить</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === 'users') {
      return (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Возраст</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.age || '—'}</td>
                <td><button className="btn btn-danger" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDelete(u.id)}>Удалить</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description?.slice(0, 80) || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <h2 style={{ color: '#2d5016', marginBottom: '1.5rem' }}>Панель администратора</h2>

      <div className="admin-tabs">
        {['birds', 'users', 'species', 'habitats', 'observations', 'logs'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t === 'birds' ? 'Птицы' :
             t === 'users' ? 'Пользователи' :
             t === 'species' ? 'Виды' :
             t === 'habitats' ? 'Среды обитания' :
             t === 'observations' ? 'Наблюдения' : 'Логи'}
          </button>
        ))}
      </div>

      {renderTable()}
    </div>
  );
}

export default AdminPage;
