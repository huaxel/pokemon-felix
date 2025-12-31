import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../contexts/PokemonContext';
import './WorldPage.css';

// Tegel types: 0=Gras, 1=Pad, 2=Huis, 3=Ziekenhuis, 4=Boom
const TILE_TYPES = {
    GRASS: 0,
    PATH: 1,
    HOUSE: 2,
    CENTER: 3,
    TREE: 4,
};

const SEASONS = ['Lente', 'Zomer', 'Herfst', 'Winter'];
const SEASON_ICONS = ['🌸', '☀️', '🍂', '❄️'];

export function WorldPage() {
    const navigate = useNavigate();
    const {
        addCoins,
        spendCoins,
        healAll,
        townObjects,
        addObject,
        removeObject,
    } = usePokemonContext();

    // Seizoenen Systeem
    const [seasonIndex, setSeasonIndex] = useState(1); // Begin in de Zomer

    const nextSeason = () => setSeasonIndex((prev) => (prev + 1) % 4);
    const prevSeason = () => setSeasonIndex((prev) => (prev === 0 ? 3 : prev - 1));

    // DAG/NACHT
    const [isNight, setIsNight] = useState(false);
    const toggleDayNight = () => setIsNight(!isNight);

    // SCHATTEN (✨)
    const [treasures, setTreasures] = useState([{ x: 3, y: 7 }]); // Start met één schat

    useEffect(() => {
        const interval = setInterval(() => {
            if (treasures.length < 3 && Math.random() < 0.3) {
                const newX = Math.floor(Math.random() * 10);
                const newY = Math.floor(Math.random() * 10);
                // Niet op de speler of op onbegaanbare tegels
                setTreasures(prev => [...prev, { x: newX, y: newY }]);
            }
        }, 10000); // Elke 10 seconden kans op nieuwe schat
        return () => clearInterval(interval);
    }, [treasures]);

    const getSeasonStyles = () => {
        switch (seasonIndex) {
            case 3: // Winter ❄️
                return { grass: '#f1f5f9', tree: '#94a3b8', bg: '#e2e8f0', tile: '#f8fafc' };
            case 2: // Herfst 🍂
                return { grass: '#fef3c7', tree: '#d97706', bg: '#fffbeb', tile: '#fde68a' };
            case 0: // Lente 🌸
                return { grass: '#bbf7d0', tree: '#f472b6', bg: '#f0fdf4', tile: '#dcfce7' };
            default: // Zomer ☀️
                return { grass: '#4ade80', tree: '#166534', bg: '#dcfce7', tile: '#bbf7d0' };
        }
    };

    const seasonStyle = getSeasonStyles();

    // Basis roostersel
    const [baseGrid] = useState([
        [1, 1, 1, 0, 0, 4, 4, 0, 0, 3],
        [1, 2, 1, 0, 0, 4, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [4, 4, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 2, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    ]);

    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
    const [message, setMessage] = useState(null);
    const [isBuildMode, setIsBuildMode] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState('house'); // house, tree, path

    // Combineer baseGrid met townObjects voor weergave
    const getEffectiveGrid = useCallback(() => {
        const grid = baseGrid.map(row => [...row]);
        townObjects.forEach(obj => {
            if (obj.y < 10 && obj.x < 10) {
                let typeId;
                if (obj.type === 'house') typeId = TILE_TYPES.HOUSE;
                else if (obj.type === 'tree') typeId = TILE_TYPES.TREE;
                else if (obj.type === 'path') typeId = TILE_TYPES.PATH;
                else if (obj.type === 'pokeball') typeId = TILE_TYPES.CENTER;
                grid[obj.y][obj.x] = typeId;
            }
        });
        return grid;
    }, [baseGrid, townObjects]);

    const mapGrid = getEffectiveGrid();

    const handleTileEvent = useCallback((tileType) => {
        // NPC check op (5, 5)
        if (playerPos.x === 5 && playerPos.y === 5) {
            setMessage({ text: "👴 Prof. Eik: 'Hallo Felix! Wat een mooi dorp heb je gebouwd! Hier zijn 50 munten.'", color: '#8b5cf6' });
            addCoins(50);
            return;
        }

        if (tileType === TILE_TYPES.CENTER) {
            setMessage({ text: "🏥 Pokémon genezen!", color: '#3b82f6' });
            healAll();
            return;
        }

        if (tileType === TILE_TYPES.HOUSE) {
            setMessage({ text: "🏠 Welkom thuis, Felix! Rust even lekker uit.", color: '#10b981' });
            return;
        }

        // Check voor schatten ✨
        const treasureIndex = treasures.findIndex(t => t.x === playerPos.x && t.y === playerPos.y);
        if (treasureIndex !== -1) {
            setMessage({ text: "✨ Wauw! Je hebt een zeldzame schat gevonden! +100 🪙", color: '#fbbf24' });
            addCoins(100);
            setTreasures(prev => prev.filter((_, i) => i !== treasureIndex));
            return;
        }

        if (tileType === TILE_TYPES.GRASS) {
            if (Math.random() < 0.3) {
                const rand = Math.random();
                if (rand < 0.6) {
                    setMessage({ text: "⚔️ Wilde Pokémon!", color: '#ef4444' });
                    setTimeout(() => navigate('/single-battle'), 1000);
                } else if (rand < 0.8) {
                    setMessage({ text: "🦹 Team Rocket! Bereid je voor op een gevecht!", color: '#7f1d1d' });
                    // Voor nu naar hetzelfde gevecht, maar de tekst is anders
                    setTimeout(() => navigate('/single-battle'), 1000);
                } else {
                    setMessage({ text: "🍎 Je vond iets! +20 🪙", color: '#22c55e' });
                    addCoins(20);
                }
            }
        }
    }, [addCoins, healAll, navigate, playerPos.x, playerPos.y, treasures]);

    // Beweging logica
    const movePlayer = useCallback((dx, dy) => {
        if (isBuildMode) return;

        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10) return;

        const targetTile = mapGrid[newY][newX];
        // Kan niet door bomen of huizen lopen
        if (targetTile === TILE_TYPES.TREE || targetTile === TILE_TYPES.HOUSE) return;

        setPlayerPos({ x: newX, y: newY });
        setMessage(null);
        handleTileEvent(targetTile);
    }, [playerPos, mapGrid, isBuildMode, handleTileEvent]);

    // Toetsenbord besturing
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') movePlayer(0, -1);
            if (e.key === 'ArrowDown') movePlayer(0, 1);
            if (e.key === 'ArrowLeft') movePlayer(-1, 0);
            if (e.key === 'ArrowRight') movePlayer(1, 0);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer]);

    const handleTileClick = (x, y) => {
        if (!isBuildMode) return;
        if (x === playerPos.x && y === playerPos.y) return;

        // Zoek of er al een gebouwd object staat
        const existing = townObjects.find(obj => obj.x === x && obj.y === y);
        if (existing) {
            removeObject(existing.id);
        } else {
            addObject(selectedBuilding, x, y);
        }
    };

    const getTileContent = (type, x, y) => {
        if (x === playerPos.x && y === playerPos.y) return '🏃';

        // Schat ✨
        if (treasures.some(t => t.x === x && t.y === y)) return '✨';

        // Professor Eik op (5, 5)
        if (x === 5 && y === 5) return '👴';

        switch (type) {
            case TILE_TYPES.GRASS: return seasonIndex === 3 ? '❄️' : (seasonIndex === 2 ? '🍂' : '🌿');
            case TILE_TYPES.PATH: return '';
            case TILE_TYPES.HOUSE: return '🏠';
            case TILE_TYPES.CENTER: return '🏥';
            case TILE_TYPES.TREE: return '🌲';
            default: return '';
        }
    };

    return (
        <div className={`world-page ${isNight ? 'night-mode' : ''}`} style={{ backgroundColor: seasonStyle.bg }}>

            <div className="season-hud">
                <button className="arrow-btn" onClick={prevSeason}>⬅️</button>
                <div className="season-display">
                    <span className="season-icon">{SEASON_ICONS[seasonIndex]}</span>
                    <span className="season-name">{SEASONS[seasonIndex]}</span>
                </div>
                <button className="arrow-btn" onClick={nextSeason}>➡️</button>

                <button className={`day-night-toggle ${isNight ? 'night' : 'day'}`} onClick={toggleDayNight}>
                    {isNight ? '🌙' : '☀️'}
                </button>
            </div>

            <div className="world-header">
                {message && (
                    <div className="event-popup" style={{ backgroundColor: message.color }}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="game-container">
                <div className="map-grid" style={{ backgroundColor: seasonStyle.grass, borderColor: '#475569' }}>
                    {mapGrid.map((row, y) => (
                        <div key={y} className="map-row">
                            {row.map((tile, x) => (
                                <div
                                    key={`${x}-${y}`}
                                    className={`tile type-${tile} ${isBuildMode ? 'buildable' : ''}`}
                                    onClick={() => handleTileClick(x, y)}
                                    style={
                                        tile === TILE_TYPES.TREE ? { color: seasonStyle.tree } :
                                            tile === TILE_TYPES.GRASS ? { color: seasonStyle.tree } : {}
                                    }
                                >
                                    {getTileContent(tile, x, y)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="controls-panel">
                    <div className="d-pad">
                        <button onClick={() => movePlayer(0, -1)}>⬆️</button>
                        <div className="d-pad-mid">
                            <button onClick={() => movePlayer(-1, 0)}>⬅️</button>
                            <button onClick={() => movePlayer(1, 0)}>➡️</button>
                        </div>
                        <button onClick={() => movePlayer(0, 1)}>⬇️</button>
                    </div>

                    <div className="build-controls">
                        <button
                            className={`mode-btn ${isBuildMode ? 'active' : ''}`}
                            onClick={() => setIsBuildMode(!isBuildMode)}
                        >
                            {isBuildMode ? 'Klaar met Bouwen' : '🔨 Bouwen'}
                        </button>

                        {isBuildMode && (
                            <div className="build-palette">
                                <button
                                    className={selectedBuilding === 'house' ? 'active' : ''}
                                    onClick={() => setSelectedBuilding('house')}
                                >🏠</button>
                                <button
                                    className={selectedBuilding === 'tree' ? 'active' : ''}
                                    onClick={() => setSelectedBuilding('tree')}
                                >🌲</button>
                                <button
                                    className={selectedBuilding === 'path' ? 'active' : ''}
                                    onClick={() => setSelectedBuilding('path')}
                                >🟫</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
