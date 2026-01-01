import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { useTownContext } from '../../hooks/useTownContext';
import { useOutfitEffects } from '../../hooks/useOutfitEffects';
import { useGPS } from '../../hooks/useGPS';
import { usePlayer } from '../../hooks/usePlayer';
import { STORAGE_KEYS } from '../../lib/constants';
import { useWorldNavigation } from './hooks/useWorldNavigation';
import {
    TILE_TYPES, SEASON_STYLES, TIME_CONFIG, TREASURE_CONFIG,
    OUTFIT_COLORS
} from './worldConstants';
import { QuestLog } from './QuestLog';
import { WorldGrid } from './components/WorldGrid';
import { WorldHUD } from './components/WorldHUD';
import { WorldWeather } from './components/WorldWeather';
import { SeasonHUD } from './components/SeasonHUD';
import { MapLegend } from './components/MapLegend';
import { MovementControls } from './components/MovementControls';
import { InteriorModal } from './components/InteriorModal';
import { useWorldEvents } from './hooks/useWorldEvents';
import './WorldPage.css';

const PLAYER_POS_STORAGE_KEY = 'felix-world-player-pos';

export function WorldPage() {
    const navigate = useNavigate();
    const { message, navigateWithMessage, clearMessage, showMessage } = useWorldNavigation();
    const {
        addCoins,
        healAll,
        quests,
    } = usePokemonContext();
    const { townObjects, addObject, removeObject } = useTownContext();
    const { playerName } = usePlayer();

    const { getEncounterMultiplier, activeEffect } = useOutfitEffects();

    const {
        targetPos,
        generateRandomTarget,
        calculateDistance,
        getDirectionHint
    } = useGPS();

    const [gpsDistance, setGpsDistance] = useState(null);
    const [gpsDirection, setGpsDirection] = useState('');

    // Seizoenen Systeem
    const [seasonIndex, setSeasonIndex] = useState(1); // Begin in de Zomer
    const [showQuestLog, setShowQuestLog] = useState(false);
    const [isNight, setIsNight] = useState(false);
    const [autoTime, setAutoTime] = useState(true); // Auto time based on real clock
    const nextSeason = () => setSeasonIndex((prev) => (prev + 1) % 4);
    const prevSeason = () => setSeasonIndex((prev) => (prev === 0 ? 3 : prev - 1));

    // DAG/NACHT with real-time option
    useEffect(() => {
        if (autoTime) {
            const updateTime = () => {
                const hour = new Date().getHours();
                setIsNight(hour < TIME_CONFIG.NIGHT_END_HOUR || hour >= TIME_CONFIG.NIGHT_START_HOUR);
            };
            updateTime();
            const interval = setInterval(updateTime, TIME_CONFIG.TIME_CHECK_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [autoTime]);

    const toggleDayNight = () => {
        setAutoTime(false);
        setIsNight(!isNight);
    };

    const toggleAutoTime = () => {
        setAutoTime(!autoTime);
        if (!autoTime) {
            const hour = new Date().getHours();
            setIsNight(hour < TIME_CONFIG.NIGHT_END_HOUR || hour >= TIME_CONFIG.NIGHT_START_HOUR);
        }
    };

    // OUTFIT SYSTEEM
    const [playerColor, setPlayerColor] = useState('#ef4444');
    useEffect(() => {
        const outfitId = localStorage.getItem(STORAGE_KEYS.CURRENT_OUTFIT) || 'default';
        setPlayerColor(OUTFIT_COLORS[outfitId] || OUTFIT_COLORS.default);
    }, []);

    // SCHATTEN (✨)
    const [treasures, setTreasures] = useState([{ x: 3, y: 7 }]);

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
            if (treasures.length < TREASURE_CONFIG.MAX_TREASURES && Math.random() < TREASURE_CONFIG.SPAWN_CHANCE) {
                const newX = Math.floor(Math.random() * 10);
                const newY = Math.floor(Math.random() * 10);
                setTreasures(prev => [...prev, { x: newX, y: newY }]);
            }
        }, TREASURE_CONFIG.SPAWN_INTERVAL);
        return () => clearInterval(interval);
    }, [treasures]);

    const getSeasonStyles = () => {
        return SEASON_STYLES[seasonIndex] || SEASON_STYLES[1];
    };

    const seasonStyle = getSeasonStyles();

    // Basis roostersel
    const [baseGrid] = useState([
        [1, 1, 1, 14, 0, 4, 4, 0, 19, 3],
        [1, 12, 1, 13, 0, 4, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 9, 6],
        [4, 4, 0, 0, 1, 0, 23, 10, 10, 18],
        [0, 0, 0, 0, 1, 1, 10, 10, 10, 0],
        [0, 0, 7, 0, 1, 11, 10, 10, 10, 20],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 21],
        [5, 0, 8, 2, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    ]);

    const [playerPos, setPlayerPos] = useState(() => {
        try {
            const saved = localStorage.getItem(PLAYER_POS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
                    return { x: parsed.x, y: parsed.y };
                }
            }
        } catch (err) {
            console.warn('Failed to load player position', err);
        }
        return { x: 0, y: 0 };
    });
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

    const handleTileEvent = useWorldEvents({
        playerPos,
        questState,
        setQuestState,
        treeCount,
        addCoins,
        healAll,
        treasures,
        setTreasures,
        targetPos,
        showMessage,
        navigateWithMessage,
        setShowInterior,
        getEncounterMultiplier,
        generateRandomTarget
    });

    // Beweging logica
    const movePlayer = useCallback((dx, dy) => {
        if (isBuildMode) return;

        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10) return;

        const targetTile = mapGrid[newY][newX];
        if (targetTile === TILE_TYPES.TREE || targetTile === TILE_TYPES.HOUSE) return;

        setPlayerPos({ x: newX, y: newY });
        try {
            localStorage.setItem(PLAYER_POS_STORAGE_KEY, JSON.stringify({ x: newX, y: newY }));
        } catch (err) {
            console.warn('Failed to persist player position', err);
        }
        clearMessage();

        // Update GPS stats
        if (targetPos) {
            setGpsDistance(calculateDistance({ x: newX, y: newY }, targetPos));
            setGpsDirection(getDirectionHint({ x: newX, y: newY }, targetPos));
        }

        handleTileEvent(targetTile);
    }, [playerPos, mapGrid, isBuildMode, handleTileEvent, targetPos, calculateDistance, getDirectionHint, clearMessage]);

    // Click navigation + build placement handler
    const handleTileClick = useCallback((x, y) => {
        if (isBuildMode) {
            const tileType = mapGrid[y][x];
            const existing = townObjects.find(obj => obj.x === x && obj.y === y);

            const isBaseBlocked = !existing && tileType !== TILE_TYPES.GRASS && tileType !== TILE_TYPES.PATH;
            if (isBaseBlocked) return;

            if (existing) {
                removeObject(existing.id);
                if (existing.type === selectedBuilding) return;
            }

            addObject(selectedBuilding, x, y);
            return;
        }

        const dx = x - playerPos.x;
        const dy = y - playerPos.y;
        if (Math.abs(dx) + Math.abs(dy) === 1) {
            movePlayer(dx, dy);
        }
    }, [isBuildMode, mapGrid, townObjects, removeObject, selectedBuilding, addObject, playerPos.x, playerPos.y, movePlayer]);

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

    return (
        <div className={`world-page ${isNight ? 'night-mode' : ''} weather-${weather}`} style={{ backgroundColor: seasonStyle.bg }}>
            <WorldWeather weather={weather} isNight={isNight} />

            <WorldHUD
                seasonIndex={seasonIndex}
                prevSeason={prevSeason}
                nextSeason={nextSeason}
                isNight={isNight}
                toggleDayNight={toggleDayNight}
                autoTime={autoTime}
                toggleAutoTime={toggleAutoTime}
                navigate={navigate}
                setShowQuestLog={setShowQuestLog}
                quests={quests}
                playerPos={playerPos}
                targetPos={targetPos}
                gpsDistance={gpsDistance}
                gpsDirection={gpsDirection}
                generateRandomTarget={generateRandomTarget}
                setGpsDistance={setGpsDistance}
                setGpsDirection={setGpsDirection}
                calculateDistance={calculateDistance}
                getDirectionHint={getDirectionHint}
                showMessage={showMessage}
            />

            {activeEffect.name !== 'Normal' && (
                <div className="active-effect-hud" style={{
                    position: 'absolute', top: '160px', right: '10px',
                    background: 'rgba(0,0,0,0.6)', color: 'white',
                    padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem',
                    pointerEvents: 'none', zIndex: 100
                }}>
                    ✨ {activeEffect.name} Activo
                </div>
            )}

            {showQuestLog && <QuestLog onClose={() => setShowQuestLog(false)} />}

            <div className="world-header">
                {message && (
                    <div className="event-popup" style={{ backgroundColor: message.color }}>
                        {message.text}
                    </div>
                )}

                <InteriorModal
                    showInterior={showInterior}
                    setShowInterior={setShowInterior}
                />
            </div>

            <div className="game-container">
                <WorldGrid
                    mapGrid={mapGrid}
                    playerPos={playerPos}
                    playerName={playerName}
                    playerColor={playerColor}
                    treasures={treasures}
                    isBuildMode={isBuildMode}
                    handleTileClick={handleTileClick}
                    seasonStyle={seasonStyle}
                />

                <SeasonHUD
                    seasonIndex={seasonIndex}
                    onNext={nextSeason}
                    onPrev={prevSeason}
                />

                <MapLegend />

                <MovementControls
                    movePlayer={movePlayer}
                    isBuildMode={isBuildMode}
                    setIsBuildMode={setIsBuildMode}
                    selectedBuilding={selectedBuilding}
                    setSelectedBuilding={setSelectedBuilding}
                />
            </div>
        </div>
    );
}
