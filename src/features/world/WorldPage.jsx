import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import './WorldPage.css';

// Building Assets
import gachaImage from '../../assets/buildings/gacha_machine.png';
import marketImage from '../../assets/buildings/market_stall.png';
import gymImage from '../../assets/buildings/gym_building.png';
import evoImage from '../../assets/buildings/evo_lab.png';
import houseImage from '../../assets/buildings/house.png';
import centerImage from '../../assets/buildings/pokecenter.png';
import treeImage from '../../assets/buildings/tree.png';
import bagImage from '../../assets/items/bag_icon.png';
import waterEdgeImage from '../../assets/buildings/water_edge.png';
import waterCenterImage from '../../assets/buildings/water_center.png';
import fishermanImage from '../../assets/buildings/fisherman.png';
import cityHallImage from '../../assets/buildings/city_hall.png';
import shopUrbanImage from '../../assets/buildings/shop_urban.png';

// Tegel types: 0=Gras, 1=Pad, 2=Huis, 3=Ziekenhuis, 4=Boom
const TILE_TYPES = {
    GRASS: 0,
    PATH: 1,
    HOUSE: 2,
    CENTER: 3,
    TREE: 4,
    GACHA: 5,
    SQUAD: 6,
    GYM: 7,
    MARKET: 8,
    EVOLUTION: 9,
    WATER: 10,
    FISHERMAN: 11,
    CITY_HALL: 12,
    URBAN_SHOP: 13,
};

const SEASONS = ['Lente', 'Zomer', 'Herfst', 'Winter'];

export function WorldPage() {
    const navigate = useNavigate();
    const {
        addCoins,
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

    // WEER SYSTEEM
    const [weather, setWeather] = useState('sunny'); // sunny, rainy, snowy
    useEffect(() => {
        if (seasonIndex === 3) setWeather('snowy');
        else if (seasonIndex === 0 || seasonIndex === 2) {
            setWeather(Math.random() < 0.4 ? 'rainy' : 'sunny');
        } else setWeather('sunny');
    }, [seasonIndex]);

    // QUEST SYSTEEM (3 bomen planten)
    const [questState, setQuestState] = useState('none'); // none, active, complete, rewarded
    const treeCount = townObjects.filter(obj => obj.type === TILE_TYPES.TREE).length;

    // INTERIEUR
    const [showInterior, setShowInterior] = useState(false);

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
        [1, 1, 1, 13, 0, 4, 4, 0, 0, 3],
        [1, 12, 1, 0, 0, 4, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 9, 6],
        [4, 4, 0, 0, 1, 0, 10, 10, 10, 0],
        [0, 0, 0, 0, 1, 1, 10, 10, 10, 0],
        [0, 0, 7, 0, 1, 11, 10, 10, 10, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [5, 0, 8, 2, 0, 0, 0, 0, 0, 0],
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
        if (tileType === TILE_TYPES.HOUSE) {
            setShowInterior(true);
            return;
        }

        // NPC check op (5, 5)
        if (playerPos.x === 5 && playerPos.y === 5) {
                if (questState === 'none') {
                setMessage({ text: "Prof. Eik: 'Felix! Ik heb je hulp nodig. Plant 3 bomen om het dorp mooier te maken!'", color: '#8b5cf6' });
                setQuestState('active');
            } else if (questState === 'active' && treeCount >= 3) {
                setMessage({ text: "Prof. Eik: 'Geweldig! Je hebt 3 bomen geplant. Hier is een Gouden Beloning!'", color: '#fbbf24' });
                addCoins(500);
                setQuestState('rewarded');
            } else if (questState === 'active') {
                setMessage({ text: `Prof. Eik: 'Nog even doorzetten! Je hebt nu ${treeCount}/3 bomen geplant.'`, color: '#8b5cf6' });
            } else {
                setMessage({ text: "Prof. Eik: 'Wat een prachtig groen dorp is dit geworden!'", color: '#8b5cf6' });
            }
            return;
        }

        // Fisherman NPC op (5, 7)
        if (tileType === TILE_TYPES.FISHERMAN || (playerPos.x === 5 && playerPos.y === 7)) {
            setMessage({ text: "De Visser: 'Hee Felix! Wil je een hengel uitwerpen? Soms vang je Pokémon, soms... oude laarzen.'", color: '#0ea5e9' });
            // Start Fishing Mini-game logic could go here
            const rand = Math.random();
            if (rand < 0.3) {
                setMessage({ text: "Je hebt een Magikarp gevangen!", color: '#f87171' });
                // Logic to add pokemon would go here
            } else if (rand < 0.6) {
                setMessage({ text: "Een oude laars... die bewaar ik voor m'n verzameling.", color: '#64748b' });
            } else {
                setMessage({ text: "Geen beet dit keer. Blijf proberen!", color: '#94a3b8' });
            }
            return;
        }

        if (tileType === TILE_TYPES.WATER) {
            setMessage({ text: "Het water ziet er verfrissend uit. Ik zou graag willen zwemmen, maar ik heb mijn zwembroek niet mee!", color: '#0ea5e9' });
            return;
        }

        if (tileType === TILE_TYPES.GACHA) {
            setMessage({ text: "Ik ga kijken in de Poké-Gacha!", color: '#4c1d95' });
            setTimeout(() => navigate('/gacha'), 1000);
            return;
        }
        if (tileType === TILE_TYPES.SQUAD) {
            setMessage({ text: "Ik check even mijn Pokémon team!", color: '#1d4ed8' });
            setTimeout(() => navigate('/squad'), 1000);
            return;
        }
        if (tileType === TILE_TYPES.MARKET) {
            setMessage({ text: "Ik denk dat ik wat Pokémon ga verkopen!", color: '#991b1b' });
            setTimeout(() => navigate('/market'), 1000);
            return;
        }
        if (tileType === TILE_TYPES.EVOLUTION) {
            setMessage({ text: "Ik ga een Pokémon laten evolueren!", color: '#166534' });
            setTimeout(() => navigate('/evolution'), 1000);
            return;
        }
        if (tileType === TILE_TYPES.GYM) {
            setMessage({ text: "Ik ga de Gym Leader verslaan! Ik ben er klaar voor!", color: '#b45309' });
            setTimeout(() => navigate('/gym'), 1000);
            return;
        }

        if (tileType === TILE_TYPES.CENTER) {
            setMessage({ text: "Ik voel me weer super! Pokémon genezen!", color: '#3b82f6' });
            healAll();
            return;
        }

        // Check voor schatten ✨
        const treasureIndex = treasures.findIndex(t => t.x === playerPos.x && t.y === playerPos.y);
        if (treasureIndex !== -1) {
            setMessage({ text: "Wauw! Je hebt een zeldzame schat gevonden! +100 coins", color: '#fbbf24' });
            addCoins(100);
            setTreasures(prev => prev.filter((_, i) => i !== treasureIndex));
            return;
        }

        if (tileType === TILE_TYPES.GRASS) {
            if (Math.random() < 0.3) {
                const rand = Math.random();
                    if (rand < 0.6) {
                    setMessage({ text: "Ik kom een wilde Pokémon tegen!", color: '#ef4444' });
                    setTimeout(() => navigate('/single-battle'), 1000);
                } else if (rand < 0.8) {
                    setMessage({ text: "Geen genade! Ik versla Team Rocket!", color: '#7f1d1d' });
                    // Voor nu naar hetzelfde gevecht, maar de tekst is anders
                    setTimeout(() => navigate('/single-battle'), 1000);
                } else {
                    setMessage({ text: "Wauw, ik heb iets gevonden! +20 coins", color: '#22c55e' });
                    addCoins(20);
                }
            }
        }
    }, [addCoins, healAll, navigate, playerPos.x, playerPos.y, treasures, questState, treeCount, setQuestState, setShowInterior, setMessage, setTreasures]);

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
        if (x === playerPos.x && y === playerPos.y) return 'P';

            // Schat
            if (treasures.some(t => t.x === x && t.y === y)) return 'T';

            // Professor Eik op (5, 5)
            if (x === 5 && y === 5) return 'Prof';

        switch (type) {
            case TILE_TYPES.GRASS: return null;
            case TILE_TYPES.PATH: return null;
            case TILE_TYPES.HOUSE: return <img src={houseImage} className="building-sprite" alt="House" />;
            case TILE_TYPES.CENTER: return <img src={centerImage} className="building-sprite" alt="Center" />;
            case TILE_TYPES.TREE: return <img src={treeImage} className="building-sprite" alt="Tree" />;
            case TILE_TYPES.GACHA: return <img src={gachaImage} className="building-sprite" alt="Gacha" />;
            case TILE_TYPES.SQUAD: return <div className="tile squad">Squad</div>;
            case TILE_TYPES.GYM: return <img src={gymImage} className="building-sprite" alt="Gym" />;
            case TILE_TYPES.MARKET: return <img src={marketImage} className="building-sprite" alt="Markt" />;
            case TILE_TYPES.EVOLUTION: return <img src={evoImage} className="building-sprite" alt="Evolutie" />;
            case TILE_TYPES.WATER: return <img src={mapGrid[y][x - 1] === TILE_TYPES.WATER ? waterCenterImage : waterEdgeImage} className="water-sprite" alt="Water" />;
            case TILE_TYPES.FISHERMAN: return <img src={fishermanImage} className="building-sprite" alt="Fisherman" />;
            case TILE_TYPES.CITY_HALL: return <img src={cityHallImage} className="building-sprite" alt="City Hall" />;
            case TILE_TYPES.URBAN_SHOP: return <img src={shopUrbanImage} className="building-sprite" alt="Urban Shop" />;
            default: return null;
        }
    };

    return (
        <div className={`world-page ${isNight ? 'night-mode' : ''} weather-${weather}`} style={{ backgroundColor: seasonStyle.bg }}>

            {weather === 'rainy' && <div className="rain-overlay"></div>}
            {weather === 'snowy' && <div className="snow-overlay"></div>}

            <div className="season-hud">
                <button className="arrow-btn" onClick={prevSeason}>&lt;</button>
                <div className="season-display">
                    <span className="season-name">{SEASONS[seasonIndex]}</span>
                </div>
                <button className="arrow-btn" onClick={nextSeason}>&gt;</button>

                <button className={`day-night-toggle ${isNight ? 'night' : 'day'}`} onClick={toggleDayNight}>
                    {isNight ? 'Night' : 'Day'}
                </button>

                <button className="pokedex-hud-btn" onClick={() => navigate('/pokedex')}>Pokédex</button>
                <button className="bag-hud-btn" onClick={() => navigate('/bag')}>
                    <img src={bagImage} alt="Bag" />
                </button>
            </div>

            <div className="world-header">
                {message && (
                    <div className="event-popup" style={{ backgroundColor: message.color }}>
                        {message.text}
                    </div>
                )}
                {/* Binnenkijken Modal */}
                {showInterior && (
                    <div className="interior-modal">
                        <div className="room-content">
                            <h2>Felix zijn Kamer</h2>
                            <div className="pixel-bed">Bed</div>
                            <div className="pixel-tv">TV</div>
                            <p>Lekker knus! Hier kan Felix uitrusten na het avontuur.</p>
                            <button className="close-room-btn" onClick={() => setShowInterior(false)}>Naar Buiten</button>
                        </div>
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
                        <button onClick={() => movePlayer(0, -1)}>Up</button>
                        <div className="d-pad-mid">
                            <button onClick={() => movePlayer(-1, 0)}>Left</button>
                            <button onClick={() => movePlayer(1, 0)}>Right</button>
                        </div>
                        <button onClick={() => movePlayer(0, 1)}>Down</button>
                    </div>

                    <div className="build-controls">
                        <button
                            className={`mode-btn ${isBuildMode ? 'active' : ''}`}
                            onClick={() => setIsBuildMode(!isBuildMode)}
                        >
                            {isBuildMode ? 'Klaar met Bouwen' : 'Bouwen'}
                        </button>

                        {isBuildMode && (
                            <div className="build-palette">
                                <button
                                    className={selectedBuilding === 'house' ? 'active' : ''}
                                    onClick={() => setSelectedBuilding('house')}
                                ><img src={houseImage} alt="house" className="build-icon" /></button>
                                <button
                                    className={selectedBuilding === 'tree' ? 'active' : ''}
                                    onClick={() => setSelectedBuilding('tree')}
                                ><img src={treeImage} alt="tree" className="build-icon" /></button>
                                <button
                                    className={selectedBuilding === 'path' ? 'active' : ''}
                                    onClick={() => setSelectedBuilding('path')}
                                >Path</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
