import { useState, useEffect, useCallback, useRef } from 'react';

type Game = 'menu' | 'snake';

const RetroArcade = () => {
  const [game, setGame] = useState<Game>('menu');

  if (game === 'menu') {
    return (
      <div className="h-full bg-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2 font-mono">🎮 RETRO ARCADE</h1>
        <p className="text-gray-400 text-sm mb-8">Choose a game</p>
        <div className="space-y-3">
          <button onClick={() => setGame('snake')} className="block w-48 px-6 py-3 bg-green-600 text-white rounded font-mono hover:bg-green-500">
            🐍 Snake
          </button>
        </div>
      </div>
    );
  }

  return <SnakeGame onBack={() => setGame('menu')} />;
};

const GRID = 20;
const CELL = 16;

const SnakeGame = ({ onBack }: { onBack: () => void }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const dirRef = useRef(dir);

  useEffect(() => { dirRef.current = dir; }, [dir]);

  const spawnFood = useCallback(() => {
    setFood({ x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if (e.key === 'ArrowUp' && d.y !== 1) setDir({ x: 0, y: -1 });
      else if (e.key === 'ArrowDown' && d.y !== -1) setDir({ x: 0, y: 1 });
      else if (e.key === 'ArrowLeft' && d.x !== 1) setDir({ x: -1, y: 0 });
      else if (e.key === 'ArrowRight' && d.x !== -1) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!running || gameOver) return;
    const id = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          spawnFood();
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(id);
  }, [running, gameOver, food, spawnFood]);

  const restart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setRunning(true);
    spawnFood();
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col items-center justify-center">
      <div className="flex items-center gap-4 mb-3">
        <button onClick={onBack} className="text-gray-400 text-sm hover:text-white">← Back</button>
        <span className="text-green-400 font-mono">Score: {score}</span>
      </div>
      <div className="relative border border-green-800" style={{ width: GRID * CELL, height: GRID * CELL, background: '#111' }}>
        {snake.map((s, i) => (
          <div key={i} className="absolute bg-green-400" style={{ left: s.x * CELL, top: s.y * CELL, width: CELL - 1, height: CELL - 1, borderRadius: i === 0 ? 4 : 2 }} />
        ))}
        <div className="absolute bg-red-500 rounded-full" style={{ left: food.x * CELL + 2, top: food.y * CELL + 2, width: CELL - 4, height: CELL - 4 }} />
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <p className="text-red-400 text-xl font-mono mb-2">GAME OVER</p>
            <p className="text-gray-400 mb-4">Score: {score}</p>
            <button onClick={restart} className="px-4 py-2 bg-green-600 text-white rounded font-mono">Restart</button>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-xs mt-2">Use arrow keys to move</p>
    </div>
  );
};

export default RetroArcade;
