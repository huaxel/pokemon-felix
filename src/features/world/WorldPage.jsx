import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { useTownContext } from '../../hooks/useTownContext';
import { useOutfitEffects } from '../../hooks/useOutfitEffects';
import { useGPS } from '../../hooks/useGPS';
import { usePlayer } from '../../hooks/usePlayer';
import { STORAGE_KEYS } from '../../lib/constants';
import { useWorldNavigation } from './hooks/useWorldNavigation';
import {
    TILE_TYPES, SEASON_STYLES, OUTFIT_COLORS
} from './worldConstants';
import { QuestLog } from './QuestLog';
import { WorldGrid } from './components/WorldGrid';
import { WorldHUD } from './components/WorldHUD';
import { WorldWeather } from './components/WorldWeather';
import { SeasonHUD } from './components/SeasonHUD';
import { MapLegend } from './components/MapLegend';
import { MovementControls } from './components/MovementControls';
import { InteriorModal } from './components/InteriorModal';
import { PokeballCollectionModal } from './components/PokeballCollectionModal';
import { useWorldEvents } from './hooks/useWorldEvents';
import { useWorldState } from './hooks/useWorldState';
import './WorldPage.css';

const PLAYER_POS_STORAGE_KEY = 'felix-world-player-pos';

export function WorldPage() {
    const navigate = useNavigate();
    const { message, navigateWithMessage, clearMessage, showMessage } = useWorldNavigation();
    const { addCoins, addItem, healAll, quests } = usePokemonContext();
    const { townObjects, addObject, removeObject } = useTownContext();
    const { playerName } = usePlayer();
    const { getEncounterMultiplier, activeEffect } = useOutfitEffects();
    const { targetPos, generateRandomTarget, calculateDistance, getDirectionHint } = useGPS();

    const world = useWorldState();
    const [gpsDistance, setGpsDistance] = useState(null);
    const [gpsDirection, setGpsDirection] = useState('');
    const [playerColor, setPlayerColor] = useState('#ef4444');

    useEffect(() => {
        const outfitId = localStorage.getItem(STORAGE_KEYS.CURRENT_OUTFIT) || 'default';
        setPlayerColor(OUTFIT_COLORS[outfitId] || OUTFIT_COLORS.default);
    }, []);

    const treeCount = townObjects.filter(obj => obj.type === TILE_TYPES.TREE).length;
    const seasonStyle = SEASON_STYLES[world.seasonIndex] || SEASON_STYLES[1];

    const [searchParams] = useSearchParams();
    const worldId = searchParams.get('world') || 'green_valley';

    const WORLDS_CONFIG = useMemo(() => ({
        'green_valley': [
            [1, 1, 1, 14, 0, 4, 4, 0, 19, 3],
            [1, 12, 1, 13, 16, 17, 4, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 25, 1, 1],
            [0, 0, 0, 0, 1, 0, 0, 0, 9, 6],
            [4, 4, 0, 0, 1, 0, 23, 10, 10, 18],
            [0, 0, 0, 0, 1, 1, 10, 10, 10, 0],
            [0, 0, 7, 0, 1, 11, 10, 10, 10, 20],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 21],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 21],
            [5, 0, 26, 2, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 24, 1, 0, 0, 0, 0, 0],
        ],
        'desert_oasis': [
            [27, 27, 27, 1, 27, 27, 27, 28, 28, 28],
            [27, 1, 1, 1, 27, 27, 27, 27, 28, 27],
            [27, 1, 25, 1, 27, 10, 10, 27, 27, 27],
            [27, 1, 1, 1, 27, 10, 11, 10, 27, 27],
            [27, 27, 27, 27, 27, 10, 10, 27, 27, 27],
            [28, 28, 27, 27, 27, 27, 27, 27, 27, 27],
            [28, 28, 28, 27, 4, 4, 27, 27, 5, 27],
            [27, 27, 27, 27, 4, 4, 27, 27, 27, 27],
            [27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
            [27, 3, 27, 27, 27, 27, 24, 27, 27, 27], // 24 is Portal
            [27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
        ],
        'frozen_peak': [
            [28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
            [28, 1, 1, 1, 28, 28, 28, 28, 28, 28],
            [28, 1, 7, 1, 28, 28, 28, 28, 28, 28],
            [28, 1, 1, 1, 28, 28, 28, 28, 28, 28],
            [28, 28, 28, 28, 28, 10, 10, 28, 28, 28],
            [28, 28, 28, 28, 28, 10, 10, 28, 28, 28],
            [28, 4, 4, 28, 28, 28, 28, 28, 28, 28],
            [28, 4, 4, 28, 28, 3, 28, 28, 28, 28],
            [28, 28, 28, 28, 28, 1, 28, 28, 28, 28],
            [28, 28, 28, 5, 28, 1, 28, 21, 28, 28], // 21 is Portal
            [28, 28, 28, 28, 28, 1, 28, 28, 28, 28],
        ]
    }), []);

    const baseGrid = WORLDS_CONFIG[worldId] || WORLDS_CONFIG['green_valley'];

    const [playerPos, setPlayerPos] = useState(() => {
        try {
            const saved = localStorage.getItem(PLAYER_POS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') return parsed;
            }
        } catch (err) { console.warn('Pos error', err); }
        return { x: 0, y: 0 };
    });

    const [isBuildMode, setIsBuildMode] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState('house');

    const mapGrid = useCallback(() => {
        const grid = baseGrid.map(row => [...row]);
        townObjects.forEach(obj => {
            if (obj.y < 10 && obj.x < 10) {
                let tid = TILE_TYPES.HOUSE;
                if (obj.type === 'tree') tid = TILE_TYPES.TREE;
                else if (obj.type === 'path') tid = TILE_TYPES.PATH;
                else if (obj.type === 'pokeball') tid = TILE_TYPES.CENTER;
                grid[obj.y][obj.x] = tid;
            }
        });
        return grid;
    }, [baseGrid, townObjects])();

    const handleTileEvent = useWorldEvents({
        playerPos, questState: world.questState, setQuestState: world.setQuestState,
        treeCount, addCoins, addItem, healAll, treasures: world.treasures,
        setTreasures: world.setTreasures, pokeballs: world.pokeballs,

        setPokeballs: world.setPokeballs, targetPos, showMessage,
        navigateWithMessage, setShowInterior: world.setShowInterior,
        getEncounterMultiplier, generateRandomTarget
    });

    const movePlayer = useCallback((dx, dy) => {
        if (isBuildMode) return;
        const nx = playerPos.x + dx, ny = playerPos.y + dy;
        if (nx < 0 || nx >= 10 || ny < 0 || ny >= 10) return;
        const tile = mapGrid[ny][nx];
        if (tile === TILE_TYPES.TREE || tile === TILE_TYPES.HOUSE) return;
        setPlayerPos({ x: nx, y: ny });
        localStorage.setItem(PLAYER_POS_STORAGE_KEY, JSON.stringify({ x: nx, y: ny }));
        clearMessage();
        if (targetPos) {
            setGpsDistance(calculateDistance({ x: nx, y: ny }, targetPos));
            setGpsDirection(getDirectionHint({ x: nx, y: ny }, targetPos));
        }
        handleTileEvent(tile);
    }, [playerPos, mapGrid, isBuildMode, handleTileEvent, targetPos, calculateDistance, getDirectionHint, clearMessage]);

    const handleTileClick = useCallback((x, y) => {
        if (isBuildMode) {
            const tileType = mapGrid[y][x];
            const existing = townObjects.find(obj => obj.x === x && obj.y === y);
            if (!existing && tileType !== TILE_TYPES.GRASS && tileType !== TILE_TYPES.PATH) return;
            if (existing) {
                removeObject(existing.id);
                if (existing.type === selectedBuilding) return;
            }
            addObject(selectedBuilding, x, y);
            return;
        }

        const pokeball = world.pokeballs.find(p => p.x === x && p.y === y);
        if (pokeball) {
            world.setShowPokeballModal(true);
            world.setPokeballs(prev => prev.filter(pb => pb !== pokeball));
            return;
        }

        if (Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1) movePlayer(x - playerPos.x, y - playerPos.y);
    }, [isBuildMode, mapGrid, townObjects, removeObject, selectedBuilding, addObject, playerPos, movePlayer, world]);

    useEffect(() => {
        const h = (e) => {
            if (e.key === 'ArrowUp') movePlayer(0, -1);
            if (e.key === 'ArrowDown') movePlayer(0, 1);
            if (e.key === 'ArrowLeft') movePlayer(-1, 0);
            if (e.key === 'ArrowRight') movePlayer(1, 0);
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [movePlayer]);

    return (
        <div className={`world-page ${world.isNight ? 'night-mode' : ''} weather-${world.weather}`} style={{ backgroundColor: seasonStyle.bg }}>
            <button
                className="exit-world-btn"
                onClick={() => navigate('/world-select')}
                style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 100, padding: '5px 10px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                🌍 Mundo
            </button>
            <WorldWeather weather={world.weather} isNight={world.isNight} />
            <WorldHUD
                seasonIndex={world.seasonIndex} prevSeason={world.prevSeason} nextSeason={world.nextSeason}
                isNight={world.isNight} toggleDayNight={() => world.setIsNight(!world.isNight)}
                autoTime={world.autoTime} toggleAutoTime={() => world.setAutoTime(!world.autoTime)}
                navigate={navigate} setShowQuestLog={world.setShowQuestLog} quests={quests}
                playerPos={playerPos} targetPos={targetPos} gpsDistance={gpsDistance}
                gpsDirection={gpsDirection} generateRandomTarget={generateRandomTarget}
                setGpsDistance={setGpsDistance} setGpsDirection={setGpsDirection}
                calculateDistance={calculateDistance} getDirectionHint={getDirectionHint}
                showMessage={showMessage}
            />
            {activeEffect.name !== 'Normal' && <div className="active-effect-hud" style={{ position: 'absolute', top: '160px', right: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', zIndex: 100 }}>✨ {activeEffect.name} Activo</div>}
            {world.showQuestLog && <QuestLog onClose={() => world.setShowQuestLog(false)} />}
            <div className="world-header">
                {message && <div className="event-popup" style={{ backgroundColor: message.color }}>{message.text}</div>}
                <InteriorModal showInterior={world.showInterior} setShowInterior={world.setShowInterior} />
                <PokeballCollectionModal isOpen={world.showPokeballModal} onClose={() => world.setShowPokeballModal(false)} />
            </div>
            <div className="game-container">
                <WorldGrid mapGrid={mapGrid} playerPos={playerPos} playerName={playerName} playerColor={playerColor} treasures={world.treasures} pokeballs={world.pokeballs} isBuildMode={isBuildMode} handleTileClick={handleTileClick} seasonStyle={seasonStyle} />
                <SeasonHUD seasonIndex={world.seasonIndex} onNext={world.nextSeason} onPrev={world.prevSeason} />
                <MapLegend />
                <MovementControls movePlayer={movePlayer} isBuildMode={isBuildMode} setIsBuildMode={setIsBuildMode} selectedBuilding={selectedBuilding} setSelectedBuilding={setSelectedBuilding} />
            </div>
        </div>
    );
}
