import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Library = () => {
  const { library, libraryCount } = useShop();
  const [search, setSearch] = useState('');

  const filteredLibrary = useMemo(() => {
    return library.filter(game =>
      game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.genre.toLowerCase().includes(search.toLowerCase())
    );
  }, [library, search]);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 20px' }} className="fade-in">
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '24px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '2.2rem', margin: '0 0 6px', fontWeight: '800' }}>
            Mi Biblioteca de Juegos
          </h1>
          <p style={{ color: '#8f98a0', margin: 0, fontSize: '14px' }}>
            Tienes {libraryCount} {libraryCount === 1 ? 'título adquirido' : 'títulos adquiridos'} listos para jugar.
          </p>
        </div>

        {libraryCount > 0 && (
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#8f98a0', fontSize: '13px' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar en tu biblioteca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                backgroundColor: '#1b2838',
                color: '#fff',
                border: '1px solid #2a475e',
                borderRadius: '4px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* Library Content */}
      {libraryCount === 0 ? (
        <div style={{
          backgroundColor: '#1b2838',
          borderRadius: '8px',
          padding: '60px 24px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>🎮</div>
          <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '10px' }}>
            Tu biblioteca está vacía
          </h2>
          <p style={{ color: '#8f98a0', maxWidth: '440px', margin: '0 auto 24px', lineHeight: '1.5' }}>
            Aún no has comprado ningún juego. Visita la tienda de SteamLite y desbloquea minijuegos retro interactivos.
          </p>
          <Link
            to="/"
            style={{
              backgroundColor: '#5c7e10',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '4px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Ir a la Tienda
          </Link>
        </div>
      ) : filteredLibrary.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {filteredLibrary.map(game => (
            <div
              key={game.id}
              style={{
                backgroundColor: '#1b2838',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '140px', backgroundColor: '#101216' }}>
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(23, 26, 33, 0.85)',
                  color: '#66c0f4',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>
                  {game.genre}
                </span>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: '1.15rem' }}>{game.title}</h3>
                  <p style={{
                    color: '#8f98a0',
                    fontSize: '12px',
                    margin: '0 0 16px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {game.description}
                  </p>
                </div>

                <Link
                  to={`/play/${game.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#5c7e10',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    fontSize: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(92, 126, 16, 0.3)'
                  }}
                >
                  ▶ Jugar Ahora
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8f98a0' }}>
          <p>No tienes ningún juego que coincida con "{search}".</p>
        </div>
      )}
    </div>
  );
};

export default Library;
