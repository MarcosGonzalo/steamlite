import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const GameCard = ({ game }) => {
  const { isInLibrary, isInCart, addToCart } = useShop();
  const owned = isInLibrary(game.id);
  const inCart = isInCart(game.id);

  return (
    <div style={{
      backgroundColor: '#1b2838',
      borderRadius: '6px',
      overflow: 'hidden',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      cursor: 'default'
    }}>
      {/* Game Thumbnail */}
      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden', backgroundColor: '#101216' }}>
        <img 
          src={game.imageUrl} 
          alt={game.title} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Genre Pill */}
        <span style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(23, 26, 33, 0.85)',
          color: '#66c0f4',
          fontSize: '11px',
          fontWeight: '600',
          padding: '3px 8px',
          borderRadius: '4px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(102, 192, 244, 0.3)'
        }}>
          {game.genre}
        </span>

        {/* Owned Status Flag */}
        {owned && (
          <span style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#5c7e10',
            color: '#d2efa9',
            fontSize: '11px',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
          }}>
            ✓ En Biblioteca
          </span>
        )}
      </div>

      {/* Game Info */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>
          {game.title}
        </h3>
        
        <p style={{
          color: '#8f98a0',
          fontSize: '13px',
          margin: '0 0 16px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {game.description}
        </p>

        {/* Bottom Bar: Price & Action */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <span style={{ color: '#8f98a0', fontSize: '11px', display: 'block' }}>PRECIO</span>
            <span style={{ color: '#66c0f4', fontWeight: '800', fontSize: '1.1rem' }}>
              ${Number(game.price).toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link
              to={`/game/${game.id}`}
              style={{
                backgroundColor: '#2a475e',
                color: '#c7d5e0',
                padding: '7px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Info
            </Link>

            {owned ? (
              <Link
                to={`/play/${game.id}`}
                style={{
                  backgroundColor: '#5c7e10',
                  color: '#fff',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                ▶ Jugar
              </Link>
            ) : inCart ? (
              <Link
                to="/cart"
                style={{
                  backgroundColor: 'rgba(102, 192, 244, 0.15)',
                  color: '#66c0f4',
                  border: '1px solid #66c0f4',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textDecoration: 'none'
                }}
              >
                En Carrito 🛒
              </Link>
            ) : (
              <button
                onClick={() => addToCart(game)}
                style={{
                  backgroundColor: '#5c7e10',
                  color: '#d2efa9',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                + Comprar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
