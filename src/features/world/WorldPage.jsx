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

    const handleTileEvent = useCallback((tileType) => {
        if (tileType === TILE_TYPES.HOUSE) {
            setShowInterior(true);
            return;
        }

        // NPC check op (5, 5)
        if (playerPos.x === 5 && playerPos.y === 5) {
            if (questState === 'none') {
                showMessage("Prof. Eik: 'Felix! Ik heb je hulp nodig. Plant 3 bomen om het dorp mooier te maken!'", '#8b5cf6');
                setQuestState('active');
            } else if (questState === 'active' && treeCount >= 3) {
                showMessage("Prof. Eik: 'Geweldig! Je hebt 3 bomen geplant. Hier is een Gouden Beloning!'", '#fbbf24');
                addCoins(500);
                setQuestState('rewarded');
            } else if (questState === 'active') {
                showMessage(`Prof. Eik: 'Nog even doorzetten! Je hebt nu ${treeCount}/3 bomen geplant.'`, '#8b5cf6');
            } else {
                showMessage("Prof. Eik: 'Wat een prachtig groen dorp is dit geworden!'", '#8b5cf6');
            }
            return;
        }

        // Fisherman NPC op (5, 7)
        if (tileType === TILE_TYPES.FISHERMAN || (playerPos.x === 5 && playerPos.y === 7)) {
            showMessage("De Visser: 'Hee Felix! Wil je een hengel uitwerpen? Soms vang je Pokémon, soms... oude laarzen.'", '#0ea5e9');
            // Start Fishing Mini-game logic could go here
            const rand = Math.random();
            if (rand < 0.3) {
                showMessage("Je hebt een Magikarp gevangen!", '#f87171');
                // Logic to add pokemon would go here
            } else if (rand < 0.6) {
                showMessage("Een oude laars... die bewaar ik voor m'n verzameling.", '#64748b');
            } else {
                showMessage("Geen beet dit keer. Blijf proberen!", '#94a3b8');
            }
            return;
        }

        if (tileType === TILE_TYPES.WATER) {
            showMessage("Het water ziet er verfrissend uit. Ik zou graag willen zwemmen, maar ik heb mijn zwembroek niet mee!", '#0ea5e9');
            return;
        }

        if (tileType === TILE_TYPES.GACHA) {
            navigateWithMessage("Ik ga kijken in de Poké-Gacha!", '/gacha', '#4c1d95');
            return;
        }
        if (tileType === TILE_TYPES.SQUAD) {
            navigateWithMessage("Ik check even mijn Pokémon team!", '/squad', '#1d4ed8');
            return;
        }
        if (tileType === TILE_TYPES.MARKET) {
            navigateWithMessage("Ik denk dat ik wat Pokémon ga verkopen!", '/market', '#991b1b');
            return;
        }
        if (tileType === TILE_TYPES.EVOLUTION) {
            navigateWithMessage("Ik ga een Pokémon laten evolueren!", '/evolution', '#166534');
            return;
        }
        if (tileType === TILE_TYPES.GYM) {
            navigateWithMessage("Ik ga de Gym Leader verslaan! Ik ben er klaar voor!", '/gym', '#b45309');
            return;
        }
        if (tileType === TILE_TYPES.SCHOOL) {
            navigateWithMessage("Ik ga naar school om te leren! 📚", '/school', '#166534');
            return;
        }
        if (tileType === TILE_TYPES.WARDROBE) {
            navigateWithMessage("Tijd voor een nieuwe outfit! 👕", '/wardrobe', '#db2777');
            return;
        }
        if (tileType === TILE_TYPES.BANK) {
            navigateWithMessage("Tijd om mijn geld te sparen! 💰", '/bank', '#7c3aed');
            return;
        }
        if (tileType === TILE_TYPES.POTION_LAB) {
            navigateWithMessage("Tijd om pociones te maken! 🧪", '/potion-lab', '#8b5cf6');
            return;
        }
        if (tileType === TILE_TYPES.FOUNTAIN) {
            navigateWithMessage("¡La Fuente de los Deseos brilla mágicamente! ✨", '/fountain', '#06b6d4');
            return;
        }
        if (tileType === TILE_TYPES.PALACE) {
            navigateWithMessage("El majestuoso palacio se eleva ante ti... 👑", '/palace', '#7c3aed');
            return;
        }
        if (tileType === TILE_TYPES.EVOLUTION_HALL) {
            navigateWithMessage("El Salón de Evolución brilla con energía mística... ⚡", '/evolution-hall', '#d946ef');
            return;
        }

        if (tileType === TILE_TYPES.MOUNTAIN) {
            navigateWithMessage("⛰️ The mystical mountain looms ahead...", '/mountain', '#8b7355');
            return;
        }

        if (tileType === TILE_TYPES.SECRET_CAVE) {
            navigateWithMessage("🕳️ A mysterious cave entrance beckons...", '/secret-cave', '#8b5cf6');
            return;
        }

        if (tileType === TILE_TYPES.WATER_ROUTE) {
            navigateWithMessage("🌊 The sparkling water route awaits! Ready to surf?", '/water-route', '#06b6d4');
            return;
        }

        if (tileType === TILE_TYPES.CENTER) {
            showMessage("Ik voel me weer super! Pokémon genezen!", '#3b82f6');
            healAll();
            return;
        }

        // Check voor schatten ✨
        const treasureIndex = treasures.findIndex(t => t.x === playerPos.x && t.y === playerPos.y);
        if (treasureIndex !== -1) {
            showMessage("Wauw! Je hebt een zeldzame schat gevonden! +100 coins", '#fbbf24');
            addCoins(100);
            setTreasures(prev => prev.filter((_, i) => i !== treasureIndex));
            return;
        }

        // Check voor GPS Treasure 🧭
        if (targetPos && playerPos.x === targetPos.x && playerPos.y === targetPos.y) {
            showMessage("GEWELDIG! Je hebt de verborgen schat gevonden met je GPS! +500 coins", '#10b981');
            addCoins(500);
            generateRandomTarget(null); // Clear or set new target if desired, setting null for now
            return;
        }

        if (tileType === TILE_TYPES.GRASS) {
            // Apply Stealth effect (Ninja)
            const encounterChance = 0.3 * getEncounterMultiplier();

            if (Math.random() < encounterChance) {
                const rand = Math.random();
                if (rand < 0.6) {
                    navigateWithMessage("Ik kom een wilde Pokémon tegen!", '/single-battle', '#ef4444');
                } else if (rand < 0.8) {
                    navigateWithMessage("Geen genade! Ik versla Team Rocket!", '/single-battle', '#7f1d1d');
                } else {
                    // Apply Nature effect (Explorer)
                    // const itemChance = 0.2 * getItemChanceMultiplier();
                    // Just a check, logic below was else, so it was "remaining probability".
                    // Let's make it explicitly check for item if not battle.
                    showMessage("Wauw, ik heb iets gevonden! +20 coins", '#22c55e');
                    addCoins(20);
                }
            }
        }
    }, [addCoins, healAll, playerPos.x, playerPos.y, treasures, questState, treeCount, setQuestState, setShowInterior, showMessage, navigateWithMessage, setTreasures, getEncounterMultiplier, generateRandomTarget, targetPos]);

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

            // Block placement on non-walkable base tiles (unless it's an existing build we are toggling)
            const isBaseBlocked = !existing && tileType !== TILE_TYPES.GRASS && tileType !== TILE_TYPES.PATH;
            if (isBaseBlocked) return;

            if (existing) {
                removeObject(existing.id);
                // Toggle off if clicking same type
                if (existing.type === selectedBuilding) return;
            }

            addObject(selectedBuilding, x, y);
            return;
        }

        // Move by clicking an adjacent tile (keeps movement rules consistent)
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
                    pointerEvents: 'none'
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

                {/* DE SEIZOENSWIJZER */}
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
