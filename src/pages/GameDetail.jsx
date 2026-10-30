import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const GameDetail = () => {
  const { id } = useParams();
  const { isInLibrary, isInCart, addToCart } = useShop();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(g => g.id === id);
        setGame(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando detalles del juego:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#66c0f4' }}>
        <h2>Cargando juego...</h2>
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#c7d5e0' }}>
        <h2>Juego no encontrado</h2>
        <p style={{ margin: '16px 0 24px', color: '#8f98a0' }}>El juego que buscas no existe o fue retirado del catálogo.</p>
        <Link 
          to="/" 
          style={{ backgroundColor: '#2a475e', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none' }}
        >
          ← Volver a la Tienda
        </Link>
      </div>
    );
  }

  const owned = isInLibrary(game.id);
  const inCart = isInCart(game.id);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }} className="fade-in">
      {/* Back button */}
      <Link 
        to="/" 
        style={{ 
          color: '#66c0f4', 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '24px',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        ← Volver al catálogo de la tienda
      </Link>

      {/* Main Showcase Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        backgroundColor: '#1b2838',
        borderRadius: '10px',
        padding: '32px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Left: Media Presentation */}
        <div>
          <div style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
            position: 'relative',
            maxHeight: '340px'
          }}>
            <img 
              src={game.imageUrl} 
              alt={game.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
              }}
            />
            {game.playable && (
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: '#66c0f4',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                backdropFilter: 'blur(4px)',
                border: '1px solid #66c0f4'
              }}>
                ⚡ Minijuego Integrado en Navegador
              </div>
            )}
          </div>
        </div>

        {/* Right: Info & Purchase Box */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                backgroundColor: '#2a475e',
                color: '#66c0f4',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {game.genre}
              </span>
              {game.rating && (
                <span style={{ color: '#ffc107', fontSize: '13px', fontWeight: 'bold' }}>
                  ★ {game.rating}
                </span>
              )}
            </div>

            <h1 style={{ color: '#fff', fontSize: '2.2rem', margin: '0 0 12px', fontWeight: '800' }}>
              {game.title}
            </h1>

            {game.developer && (
              <p style={{ color: '#8f98a0', fontSize: '13px', margin: '0 0 18px' }}>
                Desarrollado por: <span style={{ color: '#c7d5e0' }}>{game.developer}</span>
              </p>
            )}

            <p style={{ color: '#c7d5e0', lineHeight: '1.6', fontSize: '15px', marginBottom: '24px' }}>
              {game.description}
            </p>
          </div>

          {/* Steam Buy Box */}
          <div style={{
            backgroundColor: '#171a21',
            borderRadius: '6px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <span style={{ color: '#8f98a0', fontSize: '12px', display: 'block', textTransform: 'uppercase' }}>
                  {owned ? 'Estado de compra' : 'Comprar ' + game.title}
                </span>
                <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800' }}>
                  ${Number(game.price).toFixed(2)} USD
                </span>
              </div>

              <div>
                {owned ? (
                  <Link
                    to={`/play/${game.id}`}
                    style={{
                      backgroundColor: '#5c7e10',
                      color: '#fff',
                      padding: '12px 28px',
                      borderRadius: '4px',
                      fontSize: '15px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(92, 126, 16, 0.4)'
                    }}
                  >
                    ▶ Jugar Ahora
                  </Link>
                ) : inCart ? (
                  <Link
                    to="/cart"
                    style={{
                      backgroundColor: '#2a475e',
                      color: '#66c0f4',
                      border: '1px solid #66c0f4',
                      padding: '12px 24px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    🛒 Ir al Carrito
                  </Link>
                ) : (
                  <button
                    onClick={() => addToCart(game)}
                    style={{
                      backgroundColor: '#5c7e10',
                      color: '#d2efa9',
                      padding: '12px 28px',
                      borderRadius: '4px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(92, 126, 16, 0.4)'
                    }}
                  >
                    🛒 Añadir al Carrito
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
