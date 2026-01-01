import { Play, RotateCcw, ArrowUp, CornerUpLeft, CornerUpRight, ArrowBigUp } from 'lucide-react';

export function PorygonControls({
    program,
    limit,
    isRunning,
    onAdd,
    onRemove,
    onRun,
    onReset
}) {
    return (
        <div className="controls-area">
            <div className="program-display">
                <h3>Programa ({program.length}/{limit})</h3>
                <div className="program-list">
                    {program.map((cmd, i) => (
                        <div key={i} className="program-step" onClick={() => onRemove(i)}>
                            {cmd === 'UP' && <ArrowUp size={16} />}
                            {cmd === 'LEFT' && <CornerUpLeft size={16} />}
                            {cmd === 'RIGHT' && <CornerUpRight size={16} />}
                            {cmd === 'JUMP' && <ArrowBigUp size={16} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="command-palette">
                <button className="cmd-btn" onClick={() => onAdd('UP')} disabled={isRunning || program.length >= limit}>
                    <ArrowUp /> Avanzar
                </button>
                <button className="cmd-btn" onClick={() => onAdd('LEFT')} disabled={isRunning || program.length >= limit}>
                    <CornerUpLeft /> Izquierda
                </button>
                <button className="cmd-btn" onClick={() => onAdd('RIGHT')} disabled={isRunning || program.length >= limit}>
                    <CornerUpRight /> Derecha
                </button>
                <button className="cmd-btn" onClick={() => onAdd('JUMP')} disabled={isRunning || program.length >= limit}>
                    <ArrowBigUp /> Saltar
                </button>
            </div>

            <div className="execution-controls">
                <button className="run-btn" onClick={onRun} disabled={isRunning || program.length === 0}>
                    <Play fill="white" /> Ejecutar
                </button>
                <button className="reset-btn" onClick={onReset} disabled={isRunning}>
                    <RotateCcw /> Reiniciar
                </button>
            </div>
        </div>
    );
}
