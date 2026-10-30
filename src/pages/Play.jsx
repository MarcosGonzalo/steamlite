import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

/* =========================================================================
   MINIJUEGO 1: SNAKE RETRO
   ========================================================================= */
const SnakeGame = () => {
  const boardSize = 20;
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('snake_highscore') || 0);
  });
  const [isPaused, setIsPaused] = useState(false);

  // Controles por teclado (Flechas y WASD)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setDir(prev => (prev.y !== 1 ? { x: 0, y: -1 } : prev));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setDir(prev => (prev.y !== -1 ? { x: 0, y: 1 } : prev));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setDir(prev => (prev.x !== 1 ? { x: -1, y: 0 } : prev));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setDir(prev => (prev.x !== -1 ? { x: 1, y: 0 } : prev));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Motor del juego
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

        // Colisión con paredes
        if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
          setGameOver(true);
          return prev;
        }

        // Colisión consigo misma
        if (prev.some(seg => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];

        // Comer fruta
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('snake_highscore', String(nextScore));
            }
            return nextScore;
          });
          setFood({
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [dir, gameOver, food, isPaused, highScore]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDir({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div style={{
      backgroundColor: '#1b2838',
      padding: '24px',
      borderRadius: '8px',
      maxWidth: '480px',
      margin: '0 auto',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      border: '1px solid rgba(102, 192, 244, 0.2)'
    }}>
      {/* Top Bar Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '0 4px'
      }}>
        <div>
          <span style={{ color: '#8f98a0', fontSize: '12px', display: 'block' }}>PUNTOS</span>
          <span style={{ color: '#66c0f4', fontSize: '1.4rem', fontWeight: '800' }}>{score}</span>
        </div>

        <div>
          <span style={{ color: '#8f98a0', fontSize: '12px', display: 'block', textAlign: 'right' }}>RÉCORD</span>
          <span style={{ color: '#a4d007', fontSize: '1.4rem', fontWeight: '800' }}>{highScore}</span>
        </div>
      </div>

      {/* Board */}
      <div style={{
        width: '400px',
        height: '400px',
        backgroundColor: '#0a0c10',
        margin: '0 auto',
        position: 'relative',
        borderRadius: '6px',
        border: '2px solid #2a475e',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
      }}>
        {/* Food */}
        <div style={{
          position: 'absolute',
          width: '20px',
          height: '20px',
          backgroundColor: '#ff4d4d',
          left: `${food.x * 20}px`,
          top: `${food.y * 20}px`,
          borderRadius: '50%',
          boxShadow: '0 0 10px #ff4d4d'
        }} />

        {/* Snake Segments */}
        {snake.map((seg, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '18px',
              height: '18px',
              backgroundColor: i === 0 ? '#66c0f4' : '#2a475e',
              left: `${seg.x * 20 + 1}px`,
              top: `${seg.y * 20 + 1}px`,
              borderRadius: i === 0 ? '4px' : '2px',
              boxShadow: i === 0 ? '0 0 8px #66c0f4' : 'none'
            }}
          />
        ))}

        {/* Overlay if GameOver or Paused */}
        {gameOver && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(10, 12, 16, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <h3 style={{ color: '#ff4d4d', fontSize: '1.6rem', margin: 0, fontWeight: '800' }}>¡FIN DEL JUEGO!</h3>
            <p style={{ color: '#c7d5e0', fontSize: '14px', margin: 0 }}>Puntaje final: {score}</p>
            <button
              onClick={resetGame}
              style={{
                backgroundColor: '#5c7e10',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '4px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              🔄 Jugar de Nuevo
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(10, 12, 16, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <h3 style={{ color: '#66c0f4', fontSize: '1.5rem', margin: 0 }}>PAUSA</h3>
          </div>
        )}
      </div>

      {/* Controls description */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#8f98a0',
        fontSize: '12px'
      }}>
        <span>Controles: Flechas o W A S D</span>
        <button
          onClick={() => setIsPaused(p => !p)}
          style={{
            backgroundColor: '#2a475e',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px'
          }}
        >
          {isPaused ? 'Reanudar' : 'Pausar (Espacio)'}
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
   MINIJUEGO 2: NEON PONG (SYNTHWAVE PADDLE BATTLE)
   ========================================================================= */
const NeonPongGame = () => {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const gameState = useRef({
    width: 600,
    height: 380,
    paddleWidth: 12,
    paddleHeight: 70,
    paddleSpeed: 6,
    playerY: 155,
    aiY: 155,
    ballX: 300,
    ballY: 190,
    ballSpeedX: 5,
    ballSpeedY: 3,
    ballRadius: 7,
    keys: { ArrowUp: false, ArrowDown: false, w: false, s: false }
  });

  const resetBall = useCallback((towardsPlayer = false) => {
    const state = gameState.current;
    state.ballX = state.width / 2;
    state.ballY = state.height / 2;
    const direction = towardsPlayer ? -1 : 1;
    state.ballSpeedX = direction * 5;
    state.ballSpeedY = (Math.random() * 6 - 3);
  }, []);

  const resetGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setWinner(null);
    setIsPlaying(true);
    resetBall();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        gameState.current.keys.ArrowUp = true;
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        gameState.current.keys.ArrowDown = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        gameState.current.keys.ArrowUp = false;
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        gameState.current.keys.ArrowDown = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const gameLoop = () => {
      const state = gameState.current;

      if (isPlaying && !winner) {
        // Mover Pala Jugador
        if (state.keys.ArrowUp && state.playerY > 0) {
          state.playerY -= state.paddleSpeed;
        }
        if (state.keys.ArrowDown && state.playerY < state.height - state.paddleHeight) {
          state.playerY += state.paddleSpeed;
        }

        // IA Pala Rivale (suave con retraso)
        const aiCenter = state.aiY + state.paddleHeight / 2;
        if (aiCenter < state.ballY - 12 && state.aiY < state.height - state.paddleHeight) {
          state.aiY += 4.5;
        } else if (aiCenter > state.ballY + 12 && state.aiY > 0) {
          state.aiY -= 4.5;
        }

        // Mover Pelota
        state.ballX += state.ballSpeedX;
        state.ballY += state.ballSpeedY;

        // Rebote techo y suelo
        if (state.ballY - state.ballRadius <= 0 || state.ballY + state.ballRadius >= state.height) {
          state.ballSpeedY = -state.ballSpeedY;
        }

        // Rebote en Pala Jugador (Izquierda)
        if (
          state.ballX - state.ballRadius <= 25 + state.paddleWidth &&
          state.ballX - state.ballRadius >= 20 &&
          state.ballY >= state.playerY &&
          state.ballY <= state.playerY + state.paddleHeight
        ) {
          state.ballSpeedX = Math.abs(state.ballSpeedX) * 1.05; // Acelerar ligeramente
          const deltaY = state.ballY - (state.playerY + state.paddleHeight / 2);
          state.ballSpeedY = deltaY * 0.22;
        }

        // Rebote en Pala IA (Derecha)
        if (
          state.ballX + state.ballRadius >= state.width - 25 - state.paddleWidth &&
          state.ballX + state.ballRadius <= state.width - 20 &&
          state.ballY >= state.aiY &&
          state.ballY <= state.aiY + state.paddleHeight
        ) {
          state.ballSpeedX = -Math.abs(state.ballSpeedX) * 1.05;
          const deltaY = state.ballY - (state.aiY + state.paddleHeight / 2);
          state.ballSpeedY = deltaY * 0.22;
        }

        // Punto Jugador
        if (state.ballX > state.width) {
          setPlayerScore(p => {
            const next = p + 1;
            if (next >= 5) setWinner('¡Has Ganado!');
            return next;
          });
          resetBall(false);
        }

        // Punto IA
        if (state.ballX < 0) {
          setAiScore(a => {
            const next = a + 1;
            if (next >= 5) setWinner('La IA Ha Ganado');
            return next;
          });
          resetBall(true);
        }
      }

      // Dibujar en Canvas
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, state.width, state.height);

      // Línea central punteada
      ctx.strokeStyle = 'rgba(102, 192, 244, 0.2)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(state.width / 2, 0);
      ctx.lineTo(state.width / 2, state.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pala Jugador (Cyan neón)
      ctx.fillStyle = '#00f7ff';
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 12;
      ctx.fillRect(25, state.playerY, state.paddleWidth, state.paddleHeight);

      // Pala IA (Magenta neón)
      ctx.fillStyle = '#ff0077';
      ctx.shadowColor = '#ff0077';
      ctx.shadowBlur = 12;
      ctx.fillRect(state.width - 25 - state.paddleWidth, state.aiY, state.paddleWidth, state.paddleHeight);

      // Pelota Neón
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, winner, resetBall]);

  return (
    <div style={{
      backgroundColor: '#1b2838',
      padding: '24px',
      borderRadius: '8px',
      maxWidth: '660px',
      margin: '0 auto',
      boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
      border: '1px solid rgba(0, 247, 255, 0.3)'
    }}>
      {/* Marcador Superior */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#00f7ff', fontSize: '13px', fontWeight: 'bold' }}>TÚ (P1)</span>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>{playerScore}</div>
        </div>

        <div style={{ color: '#8f98a0', fontSize: '14px', fontWeight: '600' }}>PRIMERO A 5 PUNTOS</div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ color: '#ff0077', fontSize: '13px', fontWeight: 'bold' }}>IA (CPU)</span>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>{aiScore}</div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative', width: '600px', height: '380px', margin: '0 auto', borderRadius: '6px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={380}
          style={{ display: 'block', border: '1px solid #2a475e' }}
        />

        {/* Start / Winner Overlay */}
        {(!isPlaying || winner) && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(8, 10, 15, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            {winner ? (
              <>
                <h2 style={{
                  color: winner.includes('Ganado!') ? '#00f7ff' : '#ff0077',
                  fontSize: '2rem',
                  margin: 0
                }}>
                  {winner}
                </h2>
                <button
                  onClick={resetGame}
                  style={{
                    backgroundColor: '#5c7e10',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    fontSize: '15px',
                    boxShadow: '0 0 15px rgba(92,126,16,0.6)'
                  }}
                >
                  🔄 Jugar Revancha
                </button>
              </>
            ) : (
              <>
                <h2 style={{ color: '#00f7ff', fontSize: '1.8rem', margin: 0 }}>
                  ⚡ Neon Pong Synthwave
                </h2>
                <p style={{ color: '#c7d5e0', fontSize: '14px', margin: 0 }}>
                  Usa W / S o las flechas arriba y abajo para controlar la paleta izquierda.
                </p>
                <button
                  onClick={() => setIsPlaying(true)}
                  style={{
                    backgroundColor: '#5c7e10',
                    color: '#fff',
                    padding: '12px 32px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    fontSize: '16px',
                    boxShadow: '0 0 16px rgba(92,126,16,0.6)'
                  }}
                >
                  ▶ Iniciar Partida
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', color: '#8f98a0', fontSize: '12px' }}>
        <span>Controles: Flecha Arriba / Abajo o W / S</span>
        {isPlaying && !winner && (
          <button
            onClick={() => setIsPlaying(false)}
            style={{ backgroundColor: '#2a475e', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' }}
          >
            Pausar
          </button>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   COMPONENTE PRINCIPAL PLAY
   ========================================================================= */
const Play = () => {
  const { id } = useParams();
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
        console.error("Error al cargar juego:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#66c0f4' }}>
        <h2>Cargando motor del juego...</h2>
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#fff' }}>Juego no encontrado</h2>
        <Link to="/library" style={{ color: '#66c0f4', textDecoration: 'underline' }}>
          Volver a tu biblioteca
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 20px' }} className="fade-in">
      <Link
        to="/library"
        style={{
          color: '#66c0f4',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        ← Volver a Mi Biblioteca
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ color: '#fff', fontSize: '2.2rem', margin: '0 0 8px', fontWeight: '800' }}>
          {game.title}
        </h1>
        <p style={{ color: '#8f98a0', margin: 0, fontSize: '14px', maxWidth: '600px', marginInline: 'auto' }}>
          {game.description}
        </p>
      </div>

      {/* Renderizado condicional del juego */}
      {id === 'g1' ? (
        <SnakeGame />
      ) : id === 'g2' ? (
        <NeonPongGame />
      ) : (
        <div style={{
          backgroundColor: '#1b2838',
          borderRadius: '8px',
          padding: '60px 24px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>Este juego está en desarrollo activo</h2>
          <p style={{ color: '#8f98a0', lineHeight: '1.6', marginBottom: '24px' }}>
            El equipo de desarrollo de {game.developer || 'SteamLite'} está preparando el lanzamiento de este motor para la versión 2.1.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link
              to="/play/g1"
              style={{
                backgroundColor: '#2a475e',
                color: '#66c0f4',
                padding: '10px 18px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Probar Snake Retro 🐍
            </Link>
            <Link
              to="/play/g2"
              style={{
                backgroundColor: '#5c7e10',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              Probar Neon Pong 🏓
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
