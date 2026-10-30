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
        if (state.keys.ArrowUp && state.playerY > 0) {
          state.playerY -= state.paddleSpeed;
        }
        if (state.keys.ArrowDown && state.playerY < state.height - state.paddleHeight) {
          state.playerY += state.paddleSpeed;
        }

        const aiCenter = state.aiY + state.paddleHeight / 2;
        if (aiCenter < state.ballY - 12 && state.aiY < state.height - state.paddleHeight) {
          state.aiY += 4.5;
        } else if (aiCenter > state.ballY + 12 && state.aiY > 0) {
          state.aiY -= 4.5;
        }

        state.ballX += state.ballSpeedX;
        state.ballY += state.ballSpeedY;

        if (state.ballY - state.ballRadius <= 0 || state.ballY + state.ballRadius >= state.height) {
          state.ballSpeedY = -state.ballSpeedY;
        }

        if (
          state.ballX - state.ballRadius <= 25 + state.paddleWidth &&
          state.ballX - state.ballRadius >= 20 &&
          state.ballY >= state.playerY &&
          state.ballY <= state.playerY + state.paddleHeight
        ) {
          state.ballSpeedX = Math.abs(state.ballSpeedX) * 1.05;
          const deltaY = state.ballY - (state.playerY + state.paddleHeight / 2);
          state.ballSpeedY = deltaY * 0.22;
        }

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

        if (state.ballX > state.width) {
          setPlayerScore(p => {
            const next = p + 1;
            if (next >= 5) setWinner('¡Has Ganado!');
            return next;
          });
          resetBall(false);
        }

        if (state.ballX < 0) {
          setAiScore(a => {
            const next = a + 1;
            if (next >= 5) setWinner('La IA Ha Ganado');
            return next;
          });
          resetBall(true);
        }
      }

      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, state.width, state.height);

      ctx.strokeStyle = 'rgba(102, 192, 244, 0.2)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(state.width / 2, 0);
      ctx.lineTo(state.width / 2, state.height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#00f7ff';
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 12;
      ctx.fillRect(25, state.playerY, state.paddleWidth, state.paddleHeight);

      ctx.fillStyle = '#ff0077';
      ctx.shadowColor = '#ff0077';
      ctx.shadowBlur = 12;
      ctx.fillRect(state.width - 25 - state.paddleWidth, state.aiY, state.paddleWidth, state.paddleHeight);

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

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

      <div style={{ position: 'relative', width: '600px', height: '380px', margin: '0 auto', borderRadius: '6px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={380}
          style={{ display: 'block', border: '1px solid #2a475e' }}
        />

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
   MINIJUEGO 3: SPACE DEFENDER (RETRO GALAXY ARCADE SHOOTER)
   ========================================================================= */
const SpaceDefenderGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStateStatus, setGameStateStatus] = useState('ready'); // 'ready', 'playing', 'gameover', 'victory'

  const gameRef = useRef({
    width: 600,
    height: 420,
    player: { x: 280, y: 375, width: 36, height: 20, speed: 6 },
    lasers: [],
    alienLasers: [],
    aliens: [],
    alienDir: 1,
    alienSpeed: 1.2,
    stars: [],
    keys: { left: false, right: false, space: false },
    lastShot: 0
  });

  const initAliens = useCallback(() => {
    const aliens = [];
    const rows = 3;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        aliens.push({
          x: 80 + c * 75,
          y: 40 + r * 45,
          width: 32,
          height: 22,
          alive: true,
          color: r === 0 ? '#ff0055' : r === 1 ? '#ffaa00' : '#00ffcc'
        });
      }
    }
    return aliens;
  }, []);

  const initStars = useCallback(() => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * 600,
        y: Math.random() * 420,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 1.5 + 0.5
      });
    }
    return stars;
  }, []);

  const startGame = () => {
    const state = gameRef.current;
    state.aliens = initAliens();
    state.stars = initStars();
    state.lasers = [];
    state.alienLasers = [];
    state.player.x = 280;
    state.alienDir = 1;
    setScore(0);
    setLives(3);
    setGameStateStatus('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameRef.current.keys.right = true;
      }
      if (e.key === ' ') {
        gameRef.current.keys.space = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameRef.current.keys.right = false;
      }
      if (e.key === ' ') {
        gameRef.current.keys.space = false;
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
    let animationId;

    const loop = () => {
      const state = gameRef.current;

      // Actualizar estrellas de fondo
      state.stars.forEach(star => {
        star.y += star.speed;
        if (star.y > state.height) star.y = 0;
      });

      if (gameStateStatus === 'playing') {
        // Mover jugador
        if (state.keys.left && state.player.x > 10) {
          state.player.x -= state.player.speed;
        }
        if (state.keys.right && state.player.x < state.width - state.player.width - 10) {
          state.player.x += state.player.speed;
        }

        // Disparo jugador
        const now = Date.now();
        if (state.keys.space && now - state.lastShot > 220) {
          state.lasers.push({
            x: state.player.x + state.player.width / 2 - 2,
            y: state.player.y - 8,
            width: 4,
            height: 12,
            speed: 8
          });
          state.lastShot = now;
        }

        // Mover lásers jugador
        state.lasers.forEach(laser => { laser.y -= laser.speed; });
        state.lasers = state.lasers.filter(l => l.y > -20);

        // Mover lásers alien
        state.alienLasers.forEach(al => { al.y += al.speed; });
        state.alienLasers = state.alienLasers.filter(al => al.y < state.height + 20);

        // Mover alienígenas
        let hitWall = false;
        const activeAliens = state.aliens.filter(a => a.alive);

        activeAliens.forEach(alien => {
          alien.x += state.alienDir * state.alienSpeed;
          if (alien.x <= 15 || alien.x + alien.width >= state.width - 15) {
            hitWall = true;
          }
          // Si alcanzan la nave
          if (alien.y + alien.height >= state.player.y) {
            setGameStateStatus('gameover');
          }
        });

        if (hitWall) {
          state.alienDir *= -1;
          activeAliens.forEach(alien => {
            alien.y += 14;
          });
        }

        // Disparo aleatorio alien
        if (activeAliens.length > 0 && Math.random() < 0.02) {
          const shooter = activeAliens[Math.floor(Math.random() * activeAliens.length)];
          state.alienLasers.push({
            x: shooter.x + shooter.width / 2 - 2,
            y: shooter.y + shooter.height,
            width: 4,
            height: 10,
            speed: 4
          });
        }

        // Colisión láser jugador con aliens
        state.lasers.forEach(laser => {
          activeAliens.forEach(alien => {
            if (
              laser.x < alien.x + alien.width &&
              laser.x + laser.width > alien.x &&
              laser.y < alien.y + alien.height &&
              laser.y + laser.height > alien.y
            ) {
              alien.alive = false;
              laser.y = -999; // Destruir láser
              setScore(s => s + 25);
            }
          });
        });

        // Victoria si no quedan aliens
        if (state.aliens.length > 0 && activeAliens.length === 0) {
          setGameStateStatus('victory');
        }

        // Colisión láser alien con jugador
        state.alienLasers.forEach(al => {
          if (
            al.x < state.player.x + state.player.width &&
            al.x + al.width > state.player.x &&
            al.y < state.player.y + state.player.height &&
            al.y + al.height > state.player.y
          ) {
            al.y = 9999;
            setLives(prev => {
              const next = prev - 1;
              if (next <= 0) setGameStateStatus('gameover');
              return next;
            });
          }
        });
      }

      // --- DIBUJADO EN CANVAS ---
      ctx.fillStyle = '#05070c';
      ctx.fillRect(0, 0, state.width, state.height);

      // Dibujar estrellas
      ctx.fillStyle = '#ffffff';
      state.stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Dibujar nave jugador (Triángulo futurista)
      ctx.fillStyle = '#00f7ff';
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(state.player.x + state.player.width / 2, state.player.y);
      ctx.lineTo(state.player.x, state.player.y + state.player.height);
      ctx.lineTo(state.player.x + state.player.width, state.player.y + state.player.height);
      ctx.closePath();
      ctx.fill();

      // Dibujar lásers jugador
      ctx.fillStyle = '#66c0f4';
      ctx.shadowColor = '#66c0f4';
      ctx.shadowBlur = 8;
      state.lasers.forEach(l => {
        ctx.fillRect(l.x, l.y, l.width, l.height);
      });

      // Dibujar aliens
      state.aliens.forEach(a => {
        if (!a.alive) return;
        ctx.fillStyle = a.color;
        ctx.shadowColor = a.color;
        ctx.shadowBlur = 8;
        // Invasor estilo retro
        ctx.fillRect(a.x + 4, a.y, a.width - 8, a.height - 6);
        ctx.fillRect(a.x, a.y + 6, a.width, a.height - 10);
        ctx.fillRect(a.x + 2, a.y + a.height - 4, 6, 4);
        ctx.fillRect(a.x + a.width - 8, a.y + a.height - 4, 6, 4);
      });

      // Dibujar lásers alien
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 8;
      state.alienLasers.forEach(al => {
        ctx.fillRect(al.x, al.y, al.width, al.height);
      });

      ctx.shadowBlur = 0; // reset
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameStateStatus, initAliens, initStars]);

  return (
    <div style={{
      backgroundColor: '#1b2838',
      padding: '24px',
      borderRadius: '8px',
      maxWidth: '660px',
      margin: '0 auto',
      boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
      border: '1px solid rgba(102, 192, 244, 0.3)'
    }}>
      {/* Top Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div>
          <span style={{ color: '#8f98a0', fontSize: '12px', display: 'block' }}>PUNTOS</span>
          <span style={{ color: '#66c0f4', fontSize: '1.4rem', fontWeight: '800' }}>{score}</span>
        </div>

        <div>
          <span style={{ color: '#8f98a0', fontSize: '12px', display: 'block', textAlign: 'center' }}>VIDAS</span>
          <span style={{ color: '#ff4d4d', fontSize: '1.3rem' }}>
            {'❤️ '.repeat(Math.max(0, lives))}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative', width: '600px', height: '420px', margin: '0 auto', borderRadius: '6px', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={420}
          style={{ display: 'block', border: '1px solid #2a475e' }}
        />

        {/* Modal / Screens */}
        {gameStateStatus !== 'playing' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 7, 12, 0.88)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            {gameStateStatus === 'ready' && (
              <>
                <h2 style={{ color: '#00f7ff', fontSize: '2rem', margin: 0 }}>
                  🚀 Space Defender Arcade
                </h2>
                <p style={{ color: '#c7d5e0', fontSize: '14px', margin: 0 }}>
                  Usa A / D o las flechas para moverte y la <b>Barra Espaciadora</b> para disparar.
                </p>
                <button
                  onClick={startGame}
                  style={{
                    backgroundColor: '#5c7e10',
                    color: '#fff',
                    padding: '12px 32px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    fontSize: '15px',
                    boxShadow: '0 0 15px rgba(92,126,16,0.6)'
                  }}
                >
                  ▶ Despegar
                </button>
              </>
            )}

            {gameStateStatus === 'gameover' && (
              <>
                <h2 style={{ color: '#ff0055', fontSize: '2rem', margin: 0 }}>
                  💥 ¡Misión Fallida!
                </h2>
                <p style={{ color: '#c7d5e0', margin: 0 }}>Los invasores destruyeron tu nave espacial.</p>
                <span style={{ color: '#66c0f4', fontSize: '1.2rem', fontWeight: 'bold' }}>Puntuación: {score}</span>
                <button
                  onClick={startGame}
                  style={{
                    backgroundColor: '#5c7e10',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}
                >
                  🔄 Intentar de Nuevo
                </button>
              </>
            )}

            {gameStateStatus === 'victory' && (
              <>
                <h2 style={{ color: '#00ffcc', fontSize: '2rem', margin: 0 }}>
                  🎉 ¡Victoria Galáctica!
                </h2>
                <p style={{ color: '#c7d5e0', margin: 0 }}>¡Eliminaste a toda la flota alienígena!</p>
                <span style={{ color: '#a4d007', fontSize: '1.3rem', fontWeight: 'bold' }}>Puntuación Final: {score}</span>
                <button
                  onClick={startGame}
                  style={{
                    backgroundColor: '#5c7e10',
                    color: '#fff',
                    padding: '12px 28px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}
                >
                  🔄 Jugar Otra Partida
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', color: '#8f98a0', fontSize: '12px' }}>
        <span>Controles: Flechas Izq/Der o A/D para mover | Espacio para disparar</span>
        {gameStateStatus === 'playing' && (
          <button
            onClick={() => setGameStateStatus('ready')}
            style={{ backgroundColor: '#2a475e', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px' }}
          >
            Reiniciar
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
      ) : id === 'g3' ? (
        <SpaceDefenderGame />
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
            El equipo de desarrollo de {game.developer || 'SteamLite'} está preparando el lanzamiento de este motor para la próxima versión.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                backgroundColor: '#2a475e',
                color: '#00f7ff',
                padding: '10px 18px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Probar Neon Pong 🏓
            </Link>
            <Link
              to="/play/g3"
              style={{
                backgroundColor: '#5c7e10',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '700'
              }}
            >
              Probar Space Defender 🚀
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
