import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function HomePage() {
  const [stats, setStats] = useState({ birds: 0, species: 0, observations: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/birds').catch(() => ({ data: [] })),
      api.get('/species').catch(() => ({ data: [] })),
      api.get('/observations').catch(() => ({ data: [] })),
    ]).then(([b, s, o]) => {
      setStats({ birds: b.data.length, species: s.data.length, observations: o.data.length });
    });
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <h1>BirdWatch</h1>
        <p>
          Информационная система учёта и мониторинга птиц.
          Ведите наблюдения, изучайте каталог видов и делитесь находками.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
          Курсовая работа — Кривонос Никита Николаевич, БИВТ-24-1
        </p>
        <Link to="/catalog" className="btn">Открыть каталог</Link>
      </div>

      <div className="cards-grid">
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ fontSize: '2.5rem', color: '#4a7c23' }}>{stats.birds}</h3>
            <p style={{ fontSize: '1rem' }}>Птиц в базе</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ fontSize: '2.5rem', color: '#4a7c23' }}>{stats.species}</h3>
            <p style={{ fontSize: '1rem' }}>Видов</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ fontSize: '2.5rem', color: '#4a7c23' }}>{stats.observations}</h3>
            <p style={{ fontSize: '1rem' }}>Наблюдений</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
