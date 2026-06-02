import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function CatalogPage() {
  const [birds, setBirds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [filterHabitat, setFilterHabitat] = useState('');

  useEffect(() => {
    api.get('/species').then(r => setSpecies(r.data)).catch(() => {});
    api.get('/habitats').then(r => setHabitats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (filterSpecies) params.speciesId = filterSpecies;
    if (filterHabitat) params.habitatId = filterHabitat;
    api.get('/birds', { params }).then(r => setBirds(r.data)).catch(() => {});
  }, [search, filterSpecies, filterHabitat]);

  return (
    <div className="container">
      <h2 style={{ color: '#2d5016', marginBottom: '1rem' }}>Каталог птиц</h2>

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
