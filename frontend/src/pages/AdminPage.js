import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('birds');
  const [data, setData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [species, setSpecies] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [newBird, setNewBird] = useState({
    name: '', description: '', wingspan: '', weight: '',
    speciesId: '', habitatId: '', conservationStatus: 'Least Concern'
  });
  const [formError, setFormError] = useState('');

  const loadData = () => {
    if (tab === 'logs') {
      api.get('/logs').then(r => setLogs(r.data)).catch(() => {});
    } else {
      api.get(`/${tab}`).then(r => setData(r.data)).catch(() => {});
    }
  };

  useEffect(() => {
    loadData();
    if (tab === 'birds') {
      api.get('/species').then(r => setSpecies(r.data)).catch(() => {});
      api.get('/habitats').then(r => setHabitats(r.data)).catch(() => {});
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

  const handleCreateBird = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newBird.name.trim()) { setFormError('Введите название'); return; }
    try {
      const payload = {
        name: newBird.name,
        description: newBird.description || undefined,
        conservationStatus: newBird.conservationStatus || undefined,
        wingspan: newBird.wingspan ? Number(newBird.wingspan) : undefined,
        weight: newBird.weight ? Number(newBird.weight) : undefined,
        speciesId: newBird.speciesId ? Number(newBird.speciesId) : undefined,
        habitatId: newBird.habitatId ? Number(newBird.habitatId) : undefined,
      };
      await api.post('/birds', payload);
      setNewBird({ name: '', description: '', wingspan: '', weight: '', speciesId: '', habitatId: '', conservationStatus: 'Least Concern' });
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Ошибка создания');
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
        <>
          <div style={{ marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Скрыть форму' : '+ Добавить птицу'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreateBird} style={{
              background: '#f9f9f9', padding: '1.2rem', borderRadius: '8px',
              marginBottom: '1.5rem', border: '1px solid #ddd'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2d5016' }}>Новая птица</h3>
              {formError && <p style={{ color: 'red' }}>{formError}</p>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <input placeholder="Название *" value={newBird.name}
                  onChange={e => setNewBird({...newBird, name: e.target.value})}
                  style={{ padding: '0.5rem' }} />
                <input placeholder="Описание" value={newBird.description}
                  onChange={e => setNewBird({...newBird, description: e.target.value})}
                  style={{ padding: '0.5rem' }} />
                <input placeholder="Размах крыльев (см)" type="number" value={newBird.wingspan}
                  onChange={e => setNewBird({...newBird, wingspan: e.target.value})}
                  style={{ padding: '0.5rem' }} />
                <input placeholder="Масса (г)" type="number" value={newBird.weight}
                  onChange={e => setNewBird({...newBird, weight: e.target.value})}
                  style={{ padding: '0.5rem' }} />
                <select value={newBird.speciesId}
                  onChange={e => setNewBird({...newBird, speciesId: e.target.value})}
                  style={{ padding: '0.5rem' }}>
                  <option value="">— Вид —</option>
                  {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select value={newBird.habitatId}
                  onChange={e => setNewBird({...newBird, habitatId: e.target.value})}
                  style={{ padding: '0.5rem' }}>
                  <option value="">— Среда обитания —</option>
                  {habitats.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Создать
              </button>
            </form>
          )}

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
        </>
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
      <h2 style={{ color: '#2d5016', marginBottom: '0.5rem' }}>Панель администратора</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Кривонос Никита Николаевич | БИВТ-24-1 | Вариант №16 «Птица»</p>

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
