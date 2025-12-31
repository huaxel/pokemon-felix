import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Play, RotateCcw, ArrowUp, CornerUpLeft, CornerUpRight, ArrowBigUp } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import './PorygonLabPage.css';

const LEVELS = [
    {
        id: 1,
        name: "Hola Mundo",
        grid: [
            [0, 0, 0, 0, 0],
            [0, 1, 1, 9, 0],
            [0, 8, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        start: { x: 1, y: 2, dir: 1 }, // dir: 0=N, 1=E, 2=S, 3=W
        limit: 5,
        target: { x: 3, y: 1 }
    },
    {
        id: 2,
        name: "El Giro",
        grid: [
            [0, 0, 0, 0, 0],
            [0, 8, 1, 1, 0],
            [0, 0, 0, 1, 0],
            [0, 0, 0, 9, 0],
            [0, 0, 0, 0, 0]
        ],
        start: { x: 1, y: 1, dir: 1 },
        limit: 8,
        target: { x: 3, y: 3 }
    },
    {
        id: 3,
        name: "El Salto",
        grid: [
            [0, 0, 0, 0, 0],
            [0, 8, 1, 0, 9],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        start: { x: 1, y: 1, dir: 1 },
        limit: 6,
        target: { x: 4, y: 1 }
    }
];

export function PorygonLabPage() {
    const { addCoins, coins } = usePokemonContext();
    const [currentLevelId, setCurrentLevelId] = useState(1);
    const [program, setProgram] = useState([]);
    const [porygonState, setPorygonState] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState(null);

    const level = LEVELS.find(l => l.id === currentLevelId);

    // Initialize/Reset Porygon
    useEffect(() => {
        if (level) {
            setPorygonState({ ...level.start });
            setIsRunning(false);
            if (!isRunning) setMessage(null); // Clear message only if not just finished run
        }
    }, [level, currentLevelId, isRunning]);

    const addToProgram = (command) => {
        if (program.length < level.limit && !isRunning) {
            setProgram([...program, command]);
        }
    };

    const removeFromProgram = (index) => {
        if (!isRunning) {
            setProgram(program.filter((_, i) => i !== index));
        }
    };

    const runProgram = async () => {
        if (isRunning || program.length === 0) return;
        setIsRunning(true);
        setMessage(null);

        let currentState = { ...level.start };

        // Execute steps with delay
        for (const cmd of program) {
            await new Promise(r => setTimeout(r, 600));

            if (cmd === 'UP') {
                const dx = [0, 1, 0, -1][currentState.dir];
                const dy = [-1, 0, 1, 0][currentState.dir];
                const nextX = currentState.x + dx;
                const nextY = currentState.y + dy;

                // Check bounds and valid path (1 or 9)
                if (
                    nextX >= 0 && nextX < 5 &&
                    nextY >= 0 && nextY < 5 &&
                    (level.grid[nextY][nextX] === 1 || level.grid[nextY][nextX] === 9 || level.grid[nextY][nextX] === 8)
                ) {
                    currentState.x = nextX;
                    currentState.y = nextY;
                } else {
                    // Bonk!
                    setMessage({ text: "¡Auch! ¡Me choqué!", type: "error" });
                    break;
                }
            } else if (cmd === 'LEFT') {
                currentState.dir = (currentState.dir + 3) % 4;
            } else if (cmd === 'RIGHT') {
                currentState.dir = (currentState.dir + 1) % 4;
            } else if (cmd === 'JUMP') {
                const dx = [0, 1, 0, -1][currentState.dir];
                const dy = [-1, 0, 1, 0][currentState.dir];
                const nextX = currentState.x + (dx * 2);
                const nextY = currentState.y + (dy * 2);

                if (
                    nextX >= 0 && nextX < 5 &&
                    nextY >= 0 && nextY < 5 &&
                    (level.grid[nextY][nextX] === 1 || level.grid[nextY][nextX] === 9)
                ) {
                    currentState.x = nextX;
                    currentState.y = nextY;
                } else {
                    setMessage({ text: "¡El salto falló!", type: "error" });
                    break;
                }
            }

            setPorygonState({ ...currentState });

            // Check Win
            if (currentState.x === level.target.x && currentState.y === level.target.y) {
                setMessage({ text: "¡Nivel Completado! +50 Monedas", type: "success" });
                addCoins(50);
                setTimeout(() => {
                    if (currentLevelId < LEVELS.length) {
                        setCurrentLevelId(prev => prev + 1);
                        setProgram([]);
                    } else {
                        setMessage({ text: "¡Todos los niveles completados! Eres un genio.", type: "success" });
                    }
                }, 1500);
                break;
            }
        }
        setIsRunning(false);
    };

    const getRotation = (dir) => {
        return dir * 90;
    };

    return (
        <div className="porygon-lab">
            <header className="lab-header">
                <Link to="/school" className="back-btn">Terug naar School</Link>
                <h1>🖥️ Laboratorio Porygon</h1>
                <div className="coin-display"><img src={bagIcon} alt="coins" /> {coins}</div>
            </header>

            <div className="lab-content">
                <div className="game-board">
                    {level && level.grid.map((row, y) => (
                        <div key={y} className="board-row">
                            {row.map((cell, x) => (
                                <div key={`${x}-${y}`} className={`board-cell type-${cell}`}>
                                    {/* Render Porygon */}
                                    {porygonState && porygonState.x === x && porygonState.y === y && (
                                        <div
                                            className="porygon-sprite"
                                            style={{ transform: `rotate(${getRotation(porygonState.dir)}deg)` }}
                                        >
                                            🦆
                                        </div>
                                    )}
                                    {cell === 9 && <div className="target-flag">🏁</div>}
                                </div>
                            ))}
                        </div>
                    ))}
                    {message && (
                        <div className={`level-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                </div>

                <div className="controls-area">
                    <div className="program-display">
                        <h3>Programa ({program.length}/{level.limit})</h3>
                        <div className="program-list">
                            {program.map((cmd, i) => (
                                <div key={i} className="program-step" onClick={() => removeFromProgram(i)}>
                                    {cmd === 'UP' && <ArrowUp size={16} />}
                                    {cmd === 'LEFT' && <CornerUpLeft size={16} />}
                                    {cmd === 'RIGHT' && <CornerUpRight size={16} />}
                                    {cmd === 'JUMP' && <ArrowBigUp size={16} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="command-palette">
                        <button className="cmd-btn" onClick={() => addToProgram('UP')} disabled={isRunning || program.length >= level.limit}>
                            <ArrowUp /> Avanzar
                        </button>
                        <button className="cmd-btn" onClick={() => addToProgram('LEFT')} disabled={isRunning || program.length >= level.limit}>
                            <CornerUpLeft /> Izquierda
                        </button>
                        <button className="cmd-btn" onClick={() => addToProgram('RIGHT')} disabled={isRunning || program.length >= level.limit}>
                            <CornerUpRight /> Derecha
                        </button>
                        <button className="cmd-btn" onClick={() => addToProgram('JUMP')} disabled={isRunning || program.length >= level.limit}>
                            <ArrowBigUp /> Saltare
                        </button>
                    </div>

                    <div className="execution-controls">
                        <button className="run-btn" onClick={runProgram} disabled={isRunning || program.length === 0}>
                            <Play fill="white" /> Ejecutar
                        </button>
                        <button className="reset-btn" onClick={() => {
                            setProgram([]);
                            setPorygonState({ ...level.start });
                            setMessage(null);
                        }} disabled={isRunning}>
                            <RotateCcw /> Reiniciar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
