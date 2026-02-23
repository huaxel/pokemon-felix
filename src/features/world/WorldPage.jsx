import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEconomy, useCare, useProgress, useDomainCollection } from '../../contexts/DomainContexts';
import { useTownContext } from '../../hooks/useTownContext';
import { useOutfitEffects } from '../../hooks/useOutfitEffects';
import { useGPS } from '../../hooks/useGPS';
import { usePlayer } from '../../hooks/usePlayer';
import { STORAGE_KEYS } from '../../lib/constants';
import { useWorldNavigation } from './hooks/useWorldNavigation';
import { TILE_TYPES, SEASON_STYLES, OUTFIT_COLORS, WORLDS_CONFIG } from './worldConstants';
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
import { WorldView3D } from './components/WorldView3D';
import panelBorder010 from '../../assets/kenney_fantasy-ui-borders/PNG/Default/Border/panel-border-010.png';
import './WorldPage.css';


function getInitialPlayerPos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAYER_POS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') return parsed;
    }
  } catch (err) {
    console.warn('Pos error', err);
  }
  return { x: 0, y: 0 };
}

export function WorldPage() {
  const navigate = useNavigate();
  const { message, navigateWithMessage, clearMessage, showMessage } = useWorldNavigation();
  const { addCoins, addItem } = useEconomy();
  const { healAll } = useCare();
  const { quests } = useProgress();
  const { townObjects, addObject, removeObject } = useTownContext();
  const { playerName } = usePlayer();
  const { getEncounterMultiplier, activeEffect } = useOutfitEffects();
  const { targetPos, generateRandomTarget, calculateDistance, getDirectionHint } = useGPS();
  const { squadIds } = useDomainCollection();

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

  const baseGrid = WORLDS_CONFIG[worldId] || WORLDS_CONFIG.green_valley;

  const [playerPos, setPlayerPos] = useState(getInitialPlayerPos);

  // Intro message tutorialization
  useEffect(() => {
    if (squadIds && squadIds.length === 0) {
      setTimeout(() => {
        showMessage('Welkom! Zoek de eerste Pokéball (rood-wit) op de kaart om te beginnen.', '#3b82f6');
      }, 1000);
    }
  }, [squadIds, showMessage]);

  const [isBuildMode, setIsBuildMode] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('house');
  const [is3DMode, setIs3DMode] = useState(false);
  const [viewMode, setViewMode] = useState('first');

  const mapGrid = useMemo(() => {
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
  }, [baseGrid, townObjects]);

  const handleTileEvent = useWorldEvents({
    playerPos,
    questState: world.questState,
    setQuestState: world.setQuestState,
    treeCount,
    addCoins,
    addItem,
    healAll,
    treasures: world.treasures,
    setTreasures: world.setTreasures,
    pokeballs: world.pokeballs,

    setPokeballs: world.setPokeballs,
    targetPos,
    showMessage,
    navigateWithMessage,
    setShowInterior: world.setShowInterior,
    getEncounterMultiplier,
    generateRandomTarget,
    squadIds,
  });

  const movePlayer = useCallback(
    (dx, dy) => {
      if (isBuildMode) return;
      const nx = playerPos.x + dx,
        ny = playerPos.y + dy;
      if (nx < 0 || nx >= 10 || ny < 0 || ny >= 10) return;
      const tile = mapGrid[ny][nx];
      if (tile === TILE_TYPES.TREE || tile === TILE_TYPES.HOUSE) return;
      setPlayerPos({ x: nx, y: ny });
      localStorage.setItem(STORAGE_KEYS.PLAYER_POS, JSON.stringify({ x: nx, y: ny }));
      clearMessage();
      if (targetPos) {
        setGpsDistance(calculateDistance({ x: nx, y: ny }, targetPos));
        setGpsDirection(getDirectionHint({ x: nx, y: ny }, targetPos));
      }
      handleTileEvent(tile);
    },
    [
      playerPos,
      mapGrid,
      isBuildMode,
      handleTileEvent,
      targetPos,
      calculateDistance,
      getDirectionHint,
      clearMessage,
    ]
  );

  const handleTileClick = useCallback(
    (x, y) => {
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

      if (Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1)
        movePlayer(x - playerPos.x, y - playerPos.y);
    },
    [
      isBuildMode,
      mapGrid,
      townObjects,
      removeObject,
      selectedBuilding,
      addObject,
      playerPos,
      movePlayer,
      world,
    ]
  );

  useEffect(() => {
    const h = e => {
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [movePlayer]);

  return (
    <div
      className={`world-page ${world.isNight ? 'night-mode' : ''} weather-${world.weather}`}
      style={{ backgroundColor: seasonStyle.bg }}
    >

      <WorldWeather weather={world.weather} isNight={world.isNight} />
      <WorldHUD
        seasonIndex={world.seasonIndex}
        prevSeason={world.prevSeason}
        nextSeason={world.nextSeason}
        isNight={world.isNight}
        toggleDayNight={() => world.setIsNight(!world.isNight)}
        autoTime={world.autoTime}
        toggleAutoTime={() => world.setAutoTime(!world.autoTime)}
        navigate={navigate}
        setShowQuestLog={world.setShowQuestLog}
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
      <button
        className="btn-kenney"
        onClick={() => navigate('/safari')}
        style={{
          position: 'absolute',
          top: '130px',
          right: '20px',
          backgroundColor: '#4ade80',
          color: '#064e3b',
          zIndex: 100
        }}
      >
        🏕️ Safari 3D (Beta)
      </button>

      <button
        className="btn-kenney"
        onClick={() => setIs3DMode(!is3DMode)}
        style={{
          position: 'absolute',
          top: '130px',
          left: '20px',
          backgroundColor: is3DMode ? '#60a5fa' : '#fbbf24',
          color: '#1e3a8a',
          zIndex: 100
        }}
      >
        {is3DMode ? '🌐 View 2D' : '🕶️ View 3D'}
      </button>
      {is3DMode && (
        <button
          className="btn-kenney"
          onClick={() => setViewMode(viewMode === 'first' ? 'isometric' : 'first')}
          style={{
            position: 'absolute',
            top: '180px',
            left: '20px',
            backgroundColor: viewMode === 'first' ? '#fbbf24' : '#60a5fa',
            color: '#1e3a8a',
            zIndex: 100
          }}
        >
          {viewMode === 'first' ? '🟦 2.5D' : '🎮 First-Person'}
        </button>
      )
      }

      {activeEffect.name !== 'Normal' && (
        <div
          className="active-effect-hud dialogue-box-sharp"
          style={{
            position: 'absolute',
            top: '180px',
            right: '20px',
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            zIndex: 100,
          }}
        >
          ✨ {activeEffect.name} Activo
        </div>
      )}
      {world.showQuestLog && <QuestLog onClose={() => world.setShowQuestLog(false)} />}
      <div className="world-header">
        {message && (
          <div
            className="event-popup dialogue-box-sharp"
            style={{
              borderImageSource: `url(${panelBorder010})`,
            }}
          >
            {message.text}
          </div>
        )}
        <InteriorModal showInterior={world.showInterior} setShowInterior={world.setShowInterior} />
        <PokeballCollectionModal
          isOpen={world.showPokeballModal}
          onClose={() => world.setShowPokeballModal(false)}
        />
      </div>
      <div className="game-container" style={is3DMode ? { width: '100%', height: 'calc(100vh - 120px)', marginTop: '60px' } : {}}>
        {is3DMode ? (
          <WorldView3D
            playerPos={playerPos}
            mapGrid={mapGrid}
            townObjects={townObjects}
            handleTileClick={handleTileClick}
            viewMode={viewMode}
            isNight={world.isNight}
          />
        ) : (
          <WorldGrid
            mapGrid={mapGrid}
            playerPos={playerPos}
            playerName={playerName}
            playerColor={playerColor}
            treasures={world.treasures}
            pokeballs={world.pokeballs}
            isBuildMode={isBuildMode}
            handleTileClick={handleTileClick}
            seasonStyle={seasonStyle}
          />
        )}
        {!is3DMode && (
          <>
            <SeasonHUD
              seasonIndex={world.seasonIndex}
              onNext={world.nextSeason}
              onPrev={world.prevSeason}
            />
            <MapLegend />
            <MovementControls
              movePlayer={movePlayer}
              isBuildMode={isBuildMode}
              setIsBuildMode={setIsBuildMode}
              selectedBuilding={selectedBuilding}
              setSelectedBuilding={setSelectedBuilding}
            />
          </>
        )}
      </div>
    </div>
  );
}
