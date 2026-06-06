import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CatalogPage() {
  const { user } = useAuth();
  const [birds, setBirds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [filterHabitat, setFilterHabitat] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newBird, setNewBird] = useState({ name: '', description: '', speciesId: '', habitatId: '', wingspan: '', weight: '' });
  const [formMsg, setFormMsg] = useState('');

  const loadBirds = () => {
    const params = {};
    if (search) params.search = search;
    if (filterSpecies) params.speciesId = filterSpecies;
    if (filterHabitat) params.habitatId = filterHabitat;
    api.get('/birds', { params }).then(r => setBirds(r.data)).catch(() => {});
  };

  useEffect(() => {
    api.get('/species').then(r => setSpecies(r.data)).catch(() => {});
    api.get('/habitats').then(r => setHabitats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    loadBirds();
  }, [search, filterSpecies, filterHabitat]);

  const handleAddBird = async (e) => {
    e.preventDefault();
    setFormMsg('');
    if (!newBird.name.trim()) { setFormMsg('Введите название'); return; }
    try {
      const payload = { name: newBird.name };
      if (newBird.description) payload.description = newBird.description;
      if (newBird.speciesId) payload.speciesId = Number(newBird.speciesId);
      if (newBird.habitatId) payload.habitatId = Number(newBird.habitatId);
      if (newBird.wingspan) payload.wingspan = Number(newBird.wingspan);
      if (newBird.weight) payload.weight = Number(newBird.weight);
      await api.post('/birds', payload);
      setNewBird({ name: '', description: '', speciesId: '', habitatId: '', wingspan: '', weight: '' });
      setShowForm(false);
      setFormMsg('');
      loadBirds();
    } catch (err) {
      setFormMsg(err.response?.data?.message || 'Ошибка добавления');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: '#2d5016', margin: 0 }}>Каталог птиц</h2>
        {user && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Скрыть' : '+ Добавить птицу'}
          </button>
        )}
      </div>

      {showForm && user && (
        <form onSubmit={handleAddBird} style={{ background: '#f9f9f9', padding: '1.2rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ddd' }}>
          <h3 style={{ marginTop: 0, color: '#2d5016' }}>Новая птица</h3>
          {formMsg && <p style={{ color: 'red' }}>{formMsg}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <input placeholder="Название *" value={newBird.name} onChange={e => setNewBird({...newBird, name: e.target.value})} style={{ padding: '0.5rem' }} />
            <input placeholder="Описание" value={newBird.description} onChange={e => setNewBird({...newBird, description: e.target.value})} style={{ padding: '0.5rem' }} />
            <select value={newBird.speciesId} onChange={e => setNewBird({...newBird, speciesId: e.target.value})} style={{ padding: '0.5rem' }}>
              <option value="">— Вид —</option>
              {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={newBird.habitatId} onChange={e => setNewBird({...newBird, habitatId: e.target.value})} style={{ padding: '0.5rem' }}>
              <option value="">— Среда обитания —</option>
              {habitats.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <input placeholder="Размах крыльев (см)" type="number" value={newBird.wingspan} onChange={e => setNewBird({...newBird, wingspan: e.target.value})} style={{ padding: '0.5rem' }} />
            <input placeholder="Масса (г)" type="number" value={newBird.weight} onChange={e => setNewBird({...newBird, weight: e.target.value})} style={{ padding: '0.5rem' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Добавить</button>
        </form>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterSpecies} onChange={e => setFilterSpecies(e.target.value)}>
          <option value="">Все виды</option>
          {species.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select value={filterHabitat} onChange={e => setFilterHabitat(e.target.value)}>
          <option value="">Все места обитания</option>
          {habitats.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      {birds.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>
          Птицы не найдены. Попробуйте изменить параметры поиска.
        </p>
      ) : (
        <div className="cards-grid">
          {birds.map((bird) => (
            <Link to={`/birds/${bird.id}`} key={bird.id} className="card">
              {bird.imageUrl ? (
                <img
                  src={bird.imageUrl}
                  alt={bird.name}
                  className="card-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="card-img-fallback" style={{ display: bird.imageUrl ? 'none' : 'flex' }}>
                🐦
              </div>
              <div className="card-body">
                <h3>{bird.name}</h3>
                <p>{bird.description?.slice(0, 80)}...</p>
                {bird.species && <span className="card-tag">{bird.species.name}</span>}
                {bird.habitat && <span className="card-tag" style={{ marginLeft: '0.3rem' }}>{bird.habitat.name}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
