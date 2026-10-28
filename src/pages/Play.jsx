import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Play = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  // Estados del Minijuego (Snake)
  const boardSize = 20;
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Cargar detalles del juego
  useEffect(() => {
    fetch('/games.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(g => g.id === id);
        setGame(found);
      });
  }, [id]);

  // Controles de teclado para jugar
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevenir el scroll de la página con las flechas
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowUp': if (dir.y !== 1) setDir({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (dir.y !== -1) setDir({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (dir.x !== 1) setDir({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (dir.x !== -1) setDir({ x: 1, y: 0 }); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  // Bucle principal del juego (Motor del Snake)
  useEffect(() => {
    if (gameOver || id !== 'g1') return; // Solo corre si el juego es Snake (g1)

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

        // Colisión con paredes
        if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
          setGameOver(true);
          return prev;
        }

        // Colisión consigo misma
        if (prev.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Comer la comida
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood({
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
          });
        } else {
          newSnake.pop(); // Si no come, avanza (quita la cola)
        }

        return newSnake;
      });
    }, 150); // Velocidad del juego

    return () => clearInterval(interval);
  }, [dir, gameOver, food, id]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDir({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
  };

  if (!game) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando juego...</h2>;

  return (
    <div style={{ backgroundColor: '#171a21', minHeight: '100vh', padding: '30px', color: 'white', fontFamily: 'sans-serif' }}>
      <Link to="/" style={{ color: '#66c0f4', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Volver al catálogo
      </Link>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#c7d5e0', marginBottom: '10px' }}>{game.title}</h1>
        <p style={{ color: '#8f98a0', marginBottom: '30px' }}>{game.description}</p>

        {id === 'g1' ? (
          // INTERFAZ DEL JUEGO SNAKE
          <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#66c0f4' }}>Puntuación: {score}</span>
              {gameOver && <span style={{ color: '#E50914', fontWeight: 'bold' }}>¡Juego Terminado!</span>}
            </div>

            {/* Tablero del juego */}
            <div style={{ 
              width: '400px', height: '400px', backgroundColor: '#000', margin: '0 auto', 
              position: 'relative', border: '2px solid #2a475e' 
            }}>
              {/* Comida */}
              <div style={{
                position: 'absolute', width: '20px', height: '20px', backgroundColor: '#E50914',
                left: `${food.x * 20}px`, top: `${food.y * 20}px`, borderRadius: '50%'
              }} />
              
              {/* Serpiente */}
              {snake.map((segment, index) => (
                <div key={index} style={{
                  position: 'absolute', width: '20px', height: '20px', 
                  backgroundColor: index === 0 ? '#66c0f4' : '#2a475e', // Cabeza de un color, cuerpo de otro
                  left: `${segment.x * 20}px`, top: `${segment.y * 20}px`,
                  border: '1px solid #1a1a1a'
                }} />
              ))}
            </div>

            {gameOver && (
              <button 
                onClick={resetGame}
                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#66c0f4', color: '#000', border: 'none', borderRadius: '2px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Jugar de nuevo
              </button>
            )}
            
            <p style={{ color: '#8f98a0', fontSize: '12px', marginTop: '20px' }}>
              Usa las flechas del teclado para jugar.
            </p>
          </div>
        ) : (
          // PANTALLA PARA JUEGOS AÚN NO PROGRAMADOS
          <div style={{ backgroundColor: '#2a475e', padding: '50px', borderRadius: '8px' }}>
            <h2>Este juego está en desarrollo 🚧</h2>
            <p>El motor del juego para {game.title} estará disponible en la próxima actualización.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;