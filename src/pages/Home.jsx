import { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';

const Home = () => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');

  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error("Error cargando juegos:", err));
  }, []);

  // Extraer géneros únicos dinámicamente
  const genres = ['Todos', ...new Set(games.map(g => g.genre))];

  // Aplicar doble filtro: por texto y por género
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Todos' || game.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div style={{ backgroundColor: '#171a21', minHeight: '100vh', padding: '30px', color: '#c7d5e0', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '30px', color: 'white' }}>Catálogo de SteamLite</h1>
      
      {/* Panel de búsqueda y filtros */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Buscar juegos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: '10px', borderRadius: '4px', border: 'none', 
            backgroundColor: '#2a475e', color: 'white', flexGrow: 1, outline: 'none' 
          }}
        />
        
        <select 
          value={selectedGenre} 
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{ 
            padding: '10px', borderRadius: '4px', border: 'none', 
            backgroundColor: '#2a475e', color: 'white', cursor: 'pointer', outline: 'none' 
          }}
        >
          {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
        </select>
      </div>

      {/* Cuadrícula de juegos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredGames.length > 0 ? (
          filteredGames.map(game => <GameCard key={game.id} game={game} />)
        ) : (
          <p>No se encontraron juegos con esos criterios.</p>
        )}
      </div>
    </div>
  );
};

export default Home;