import { useState, useEffect, useMemo } from 'react';
import GameCard from '../components/GameCard';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando juegos:", err);
        setLoading(false);
      });
  }, []);

  // Extraer géneros únicos
  const genres = useMemo(() => {
    return ['Todos', ...new Set(games.map(g => g.genre))];
  }, [games]);

  // Filtrar y ordenar
  const filteredAndSortedGames = useMemo(() => {
    let result = games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'Todos' || game.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [games, searchTerm, selectedGenre, sortBy]);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px' }} className="fade-in">
      {/* Featured Header / Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1b2838 0%, #2a475e 100%)',
        borderRadius: '10px',
        padding: '36px 32px',
        marginBottom: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(102, 192, 244, 0.2)'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#66c0f4', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <span>✨</span> Catálogo Destacado
        </div>
        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: '800', margin: 0 }}>
          Descubre y Juega Títulos Exclusivos
        </h1>
        <p style={{ color: '#c7d5e0', fontSize: '15px', maxWidth: '680px', lineHeight: '1.5', margin: 0 }}>
          Explora la tienda SteamLite, compra tus favoritos y pruébalos al instante desde tu navegador con minijuegos retro integrados.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#1b2838',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 300px', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '12px', color: '#8f98a0', fontSize: '14px' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 36px 10px 36px',
              borderRadius: '4px',
              border: '1px solid #2a475e',
              backgroundColor: '#171a21',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                color: '#8f98a0',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort and Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Genre select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#8f98a0', fontSize: '13px' }}>Género:</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '4px',
                border: '1px solid #2a475e',
                backgroundColor: '#171a21',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Sort select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#8f98a0', fontSize: '13px' }}>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: '4px',
                border: '1px solid #2a475e',
                backgroundColor: '#171a21',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Alfabético (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#66c0f4' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
          <p>Cargando catálogo de juegos...</p>
        </div>
      ) : filteredAndSortedGames.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {filteredAndSortedGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: '#1b2838',
          borderRadius: '8px',
          padding: '60px 20px',
          textAlign: 'center',
          color: '#8f98a0'
        }}>
          <div style={{ fontSize: '42px', marginBottom: '16px' }}>🎮</div>
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>No se encontraron juegos</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto 20px' }}>
            No encontramos ningún título que coincida con tus criterios de búsqueda.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedGenre('Todos'); }}
            style={{
              backgroundColor: '#2a475e',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '4px',
              fontWeight: '600'
            }}
          >
            Restablecer Filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
