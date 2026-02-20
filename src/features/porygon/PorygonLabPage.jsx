import { useState, useEffect } from 'react';
import { useEconomy } from '../../contexts/DomainContexts';
import { PorygonHeader } from './components/PorygonHeader';
import { PorygonBoard } from './components/PorygonBoard';
import { PorygonControls } from './components/PorygonControls';
import './PorygonLabPage.css';

const LEVELS = [
  {
    id: 1,
    name: 'Hola Mundo',
    grid: [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 9, 0], // 1=Path, 9=Goal, 8=Start (visual only)
      [0, 8, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    start: { x: 1, y: 2, dir: 0 },
    limit: 5,
    target: { x: 3, y: 1 },
  },
  {
    id: 2,
    name: 'El Giro',
    grid: [
      [0, 0, 0, 0, 0],
      [0, 8, 1, 1, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 9, 0],
      [0, 0, 0, 0, 0],
    ],
    start: { x: 1, y: 1, dir: 1 },
    limit: 8,
    target: { x: 3, y: 3 },
  },
  {
    id: 3,
    name: 'El Salto',
    grid: [
      [0, 0, 0, 0, 0],
      [0, 8, 1, 0, 9],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
    start: { x: 1, y: 1, dir: 1 },
    limit: 6,
    target: { x: 4, y: 1 },
  },
];

export function PorygonLabPage() {
  const { addCoins, coins } = useEconomy();
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [program, setProgram] = useState([]);
  const [porygonState, setPorygonState] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(null);

  const level = LEVELS.find(l => l.id === currentLevelId);

  useEffect(() => {
    if (level) {
      setPorygonState({ ...level.start });
      setIsRunning(false);
    }
  }, [level, currentLevelId]);

  const addToProgram = command => {
    if (program.length < level.limit && !isRunning) setProgram([...program, command]);
  };

  const runProgram = async () => {
    if (isRunning || program.length === 0) return;
    setIsRunning(true);
    setMessage(null);
    const currentPos = { ...level.start };

    for (const cmd of program) {
      await new Promise(r => setTimeout(r, 600));
      if (cmd === 'LEFT') currentPos.dir = (currentPos.dir + 3) % 4;
      else if (cmd === 'RIGHT') currentPos.dir = (currentPos.dir + 1) % 4;
      else {
        const step = cmd === 'JUMP' ? 2 : 1;
        const dx = [0, 1, 0, -1][currentPos.dir] * step;
        const dy = [-1, 0, 1, 0][currentPos.dir] * step;
        const nx = currentPos.x + dx,
          ny = currentPos.y + dy;

        if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5 && level.grid[ny][nx] >= 1) {
          currentPos.x = nx;
          currentPos.y = ny;
        } else {
          setMessage({ text: cmd === 'JUMP' ? '¡El salto falló!' : '¡Me choqué!', type: 'error' });
          break;
        }
      }
      setPorygonState({ ...currentPos });
      if (currentPos.x === level.target.x && currentPos.y === level.target.y) {
        setMessage({ text: '¡Completado! +50 Monedas', type: 'success' });
        addCoins(50);
        setTimeout(() => {
          if (currentLevelId < LEVELS.length) {
            setCurrentLevelId(prev => prev + 1);
            setProgram([]);
          } else setMessage({ text: '¡Eres un genio!', type: 'success' });
        }, 1500);
        break;
      }
    }
    setIsRunning(false);
  };

  return (
    <div className="porygon-lab">
      <PorygonHeader coins={coins} />
      <div className="lab-content">
        <PorygonBoard level={level} porygonState={porygonState} message={message} />
        <PorygonControls
          program={program}
          limit={level?.limit || 5}
          isRunning={isRunning}
          onAdd={addToProgram}
          onRemove={i => !isRunning && setProgram(program.filter((_, idx) => idx !== i))}
          onRun={runProgram}
          onReset={() => {
            setProgram([]);
            setPorygonState({ ...level.start });
            setMessage(null);
          }}
        />
      </div>
    </div>
  );
}
