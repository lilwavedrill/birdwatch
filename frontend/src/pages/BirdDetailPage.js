import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function BirdDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [bird, setBird] = useState(null);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    api.get(`/birds/${id}`).then(r => setBird(r.data)).catch(() => {});
    if (user) {
      api.get('/favorites').then(r => {
        setIsFav(r.data.some(f => f.birdId === parseInt(id)));
      }).catch(() => {});
    }
  }, [id, user]);

  const toggleFav = async () => {
    if (isFav) {
      await api.delete(`/favorites/${id}`);
      setIsFav(false);
    } else {
      await api.post('/favorites', { birdId: parseInt(id) });
      setIsFav(true);
    }
  };

  if (!bird) return <div className="container"><p>Загрузка...</p></div>;

  return (
    <div className="container">
      <Link to="/catalog" style={{ color: '#4a7c23', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Назад к каталогу
      </Link>
      <div className="detail-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>{bird.name}</h1>
          {user && (
            <button className={isFav ? 'btn btn-danger' : 'btn'} onClick={toggleFav}>
              {isFav ? 'Убрать из избранного' : 'В избранное'}
            </button>
          )}
        </div>

        {bird.imageUrl && (
          <div className="detail-image">
            <img src={bird.imageUrl} alt={bird.name} />
          </div>
        )}

        <p style={{ fontSize: '1.05rem', margin: '1rem 0', color: '#555' }}>{bird.description}</p>

        <div className="detail-info">
          <div>
            <strong>Вид</strong>
            {bird.species?.name || 'Не указан'} ({bird.species?.latinName || '—'})
          </div>
          <div>
            <strong>Семейство</strong>
            {bird.species?.family || 'Не указано'}
          </div>
          <div>
            <strong>Среда обитания</strong>
            {bird.habitat?.name || 'Не указана'}
          </div>
          <div>
            <strong>Климат</strong>
            {bird.habitat?.climate || '—'}
          </div>
          <div>
            <strong>Размах крыльев</strong>
            {bird.wingspan ? `${bird.wingspan} см` : '—'}
          </div>
          <div>
            <strong>Масса</strong>
            {bird.weight ? `${bird.weight} г` : '—'}
          </div>
          <div>
            <strong>Охранный статус</strong>
            {bird.conservationStatus || 'Не определён'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BirdDetailPage;
