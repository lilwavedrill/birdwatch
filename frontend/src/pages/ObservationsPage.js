import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ObservationsPage() {
  const { user } = useAuth();
  const [birds, setBirds] = useState([]);
  const [observations, setObservations] = useState([]);
  const [form, setForm] = useState({ birdId: '', location: '', latitude: '', longitude: '', notes: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/birds').then(r => setBirds(r.data)).catch(() => {});
    api.get('/observations').then(r => setObservations(r.data)).catch(() => {});
  }, []);

  if (!user) return <Navigate to="/login" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const body = {
        birdId: parseInt(form.birdId),
        location: form.location,
        notes: form.notes || undefined,
      };
      if (form.latitude) body.latitude = parseFloat(form.latitude);
      if (form.longitude) body.longitude = parseFloat(form.longitude);
      await api.post('/observations', body);
      setForm({ birdId: '', location: '', latitude: '', longitude: '', notes: '' });
      setMsg('Наблюдение добавлено!');
      const res = await api.get('/observations');
      setObservations(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Ошибка при добавлении');
    }
  };

  return (
    <div className="container">
      <h2 style={{ color: '#2d5016', marginBottom: '1.5rem' }}>Наблюдения за птицами</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="form-page" style={{ margin: 0, maxWidth: 'none' }}>
          <h3 style={{ marginBottom: '1rem' }}>Добавить наблюдение</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Птица</label>
              <select value={form.birdId} onChange={e => setForm({ ...form, birdId: e.target.value })} required>
                <option value="">Выберите птицу</option>
                {birds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Место наблюдения</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Широта</label>
              <input type="number" step="0.0001" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Долгота</label>
              <input type="number" step="0.0001" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Заметки</label>
              <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-full">Добавить</button>
            {msg && <p style={{ textAlign: 'center', marginTop: '0.5rem', color: msg.includes('Ошибка') ? '#e74c3c' : '#4a7c23' }}>{msg}</p>}
          </form>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem' }}>Последние наблюдения</h3>
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
              {observations.map(o => (
                <tr key={o.id}>
                  <td>{o.bird?.name}</td>
                  <td>{o.location}</td>
                  <td>{new Date(o.observedAt).toLocaleDateString('ru-RU')}</td>
                  <td>{o.notes?.slice(0, 60) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ObservationsPage;
