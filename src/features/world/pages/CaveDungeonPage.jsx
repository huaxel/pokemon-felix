import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useEconomy, useDomainCollection, useData } from '../../../contexts/DomainContexts';
import { useToast } from '../../../hooks/useToast';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { caveEntranceTile } from '../worldAssets';
import { EncounterModal } from '../components/EncounterModal';
import { useEncounter } from '../hooks/useEncounter';
import { PuzzleView } from '../components/PuzzleView';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';
import './CaveDungeonPage.css';

const CAVE_POKEMON = [41, 42, 74, 75, 95, 35, 36];
const BOSS_POKEMON = [150, 144, 145, 146];

const GEOLOGY_FACTS = [
  '🪨 Grotten ontstaan wanneer water rotsen oplost gedurende duizenden jaren.',
  '💎 Sommige grotten bevatten gigantische kristallen!',
  '🦇 Veel vleermuizen leven in grotten omdat ze donker en veilig zijn.',
  '🌡️ De temperatuur in grotten is meestal het hele jaar constant.',
];

const PUZZLES = {
  1: { type: 'push', description: 'Duw het blok naar de X', solution: [0, 1, 0, 1], target: 4 },
  2: { type: 'switch', description: 'Activeer alle schakelaars', switches: 3, target: 3 },
  3: { type: 'dark', description: 'Navigeer in het donker', moves: 5, target: 5 },
  4: { type: 'ice', description: 'Glijd over het ijs naar de uitgang', slides: 4, target: 4 },
};

const CAVE_DUNGEON_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.MOUNTAIN;
    if (y === 3 && xIndex === 4) return TILE_TYPES.CAVE_DUNGEON;
    if (y === 4 && xIndex === 4) return TILE_TYPES.CAVE_DUNGEON;
    if (xIndex === 4) return TILE_TYPES.PATH;
    return TILE_TYPES.SAND;
  }),
);

export function CaveDungeonPage() {
  const { showSuccess, showInfo, showWarning } = useToast();
  const navigate = useNavigate();
  const { addCoins } = useEconomy();
  const { squadIds } = useDomainCollection();
  const { pokemonList } = useData();

  const [floor, setFloor] = useState(1);
  const [puzzleState, setPuzzleState] = useState({ completed: false, progress: 0 });

  const {
    encounter,
    battleMode,
    showReward,
    isBoss,
    setBattleMode,
    triggerEncounter,
    clearEncounter,
    handleCatch,
    handleBattleEnd,
    handleRewardChoice,
  } = useEncounter({});

  const handlePuzzleAction = () => {
    const puzzle = PUZZLES[floor];
    const newProgress = puzzleState.progress + 1;
    if (newProgress >= puzzle.target) {
      completePuzzle();
    } else {
      setPuzzleState({ ...puzzleState, progress: newProgress });
    }
  };

  const completePuzzle = () => {
    setPuzzleState({ completed: true, progress: 0 });
    showSuccess('✅ Puzzel voltooid!');

    const reward = Math.floor(Math.random() * 200) + 100;
    addCoins(reward);
    if (Math.random() > 0.5) {
      triggerEncounter(floor === 5 ? BOSS_POKEMON : CAVE_POKEMON, floor === 5);
    }
  };

  const nextFloor = () => {
    if (floor < 5) {
      setFloor(floor + 1);
      setPuzzleState({ completed: false, progress: 0 });
      showInfo(`Je bent naar verdieping ${floor + 1} gegaan`);
    } else {
      showWarning('🏆 Je hebt de kerker voltooid!');
      setTimeout(() => navigate('/adventure'), 3000);
    }
  };

  const currentPuzzle = PUZZLES[floor];

  return (
    <div
      className="cave-page"
      style={{
        backgroundColor: '#111827',
        backgroundImage: `url(${caveEntranceTile})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        imageRendering: 'pixelated',
      }}
    >
      <WorldPageHeader title="Donkere Kerker" icon="🕳️" />

      <div className="cavedungeon-3d-wrapper">
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
          camera={{ position: [3.5, 4.5, 8], fov: 55 }}
        >
          <WorldScene3DMain
            mapGrid={CAVE_DUNGEON_GRID}
            onObjectClick={undefined}
            isNight={true}
            enableSky={false}
          />
        </Canvas>
      </div>

      <div
        className="cave-info game-panel"
        style={{
          border: '4px solid #4b5563',
          backgroundColor: '#374151',
          padding: '1rem',
          color: '#fff',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div
          className="floor-indicator"
          style={{ fontFamily: '"Press Start 2P", cursive', color: '#fbbf24' }}
        >
          Verdieping {floor}/5
        </div>
        <div className="geology-fact" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
          {GEOLOGY_FACTS[floor - 1] || GEOLOGY_FACTS[0]}
        </div>
      </div>

      <PuzzleView
        puzzle={currentPuzzle}
        puzzleState={puzzleState}
        onAction={handlePuzzleAction}
        onNext={nextFloor}
        floor={floor}
      />

      {encounter && (
        <EncounterModal
          encounter={encounter}
          showReward={showReward}
          battleMode={battleMode}
          isBoss={isBoss}
          onRewardChoice={handleRewardChoice}
          onBattleEnd={handleBattleEnd}
          onCatch={handleCatch}
          onFight={() => setBattleMode(true)}
          onFlee={clearEncounter}
          pokemonList={pokemonList}
          squadIds={squadIds}
        />
      )}
    </div>
  );
}
