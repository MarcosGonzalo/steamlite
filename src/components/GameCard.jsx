import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  return (
    <div style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden', color: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
      <img src={game.imageUrl} alt={game.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      <div style={{ padding: '15px' }}>
        <h3 style={{ margin: '0 0 5px', fontSize: '1.2rem' }}>{game.title}</h3>
        <p style={{ color: '#8f98a0', fontSize: '12px', margin: '0 0 15px' }}>{game.genre}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#66c0f4', fontWeight: 'bold' }}>${game.price}</span>
          <Link 
            to={`/game/${game.id}`}
            style={{ 
              backgroundColor: '#2a475e', color: 'white', textDecoration: 'none', 
              padding: '6px 12px', borderRadius: '2px', fontSize: '13px', transition: 'background-color 0.2s' 
            }}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;