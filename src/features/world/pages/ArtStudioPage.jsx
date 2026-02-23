import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useData, useDomainCollection } from '../../../contexts/DomainContexts';
import { usePlayer } from '../../../hooks/usePlayer';
import { WorldScene3DMain } from '../components/WorldScene3DMain';
import { TILE_TYPES } from '../worldConstants';
import { grassTile } from '../worldAssets';
import './ArtStudioPage.css';

const ART_STUDIO_GRID = Array.from({ length: 8 }, (_, y) =>
  Array.from({ length: 8 }, (_x, xIndex) => {
    if (y === 0 || y === 7 || xIndex === 0 || xIndex === 7) return TILE_TYPES.GRASS;
    if (y === 3 && xIndex === 4) return TILE_TYPES.ART_STUDIO;
    if (y === 4 && xIndex === 4) return TILE_TYPES.ART_STUDIO;
    if (xIndex === 4) return TILE_TYPES.PATH;
    if (y === 5 && (xIndex === 2 || xIndex === 6)) return TILE_TYPES.TREE;
    return TILE_TYPES.GRASS;
  }),
);

export function ArtStudioPage() {
  const navigate = useNavigate();
  const { pokemonList } = useData();
  const { squadIds } = useDomainCollection();
  const { playerName } = usePlayer();

  // Get squad members
  const myPokemon = pokemonList.filter(p => squadIds.includes(p.id));

  const [selectedId, setSelectedId] = useState(myPokemon[0]?.id || null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const selectedPokemon = myPokemon.find(p => p.id === selectedId);

  const filters = [
    { id: 'none', name: 'Normaal', style: {} },
    { id: 'sepia', name: 'Sepia', style: { filter: 'sepia(100%)' } },
    { id: 'gray', name: 'Zwart-wit', style: { filter: 'grayscale(100%)' } },
    { id: 'blur', name: 'Dromerig', style: { filter: 'blur(1px) brightness(1.1)' } },
    { id: 'invert', name: 'Neon', style: { filter: 'invert(100%)' } },
    { id: 'hue', name: 'Alien', style: { filter: 'hue-rotate(90deg)' } },
  ];

  const frames = [
    { id: 'none', name: 'Geen', class: '' },
    { id: 'gold', name: 'Gouden', class: 'frame-gold' },
    { id: 'wood', name: 'Klassiek', class: 'frame-wood' },
    { id: 'rainbow', name: 'Regenboog', class: 'frame-rainbow' },
    { id: 'modern', name: 'Modern', class: 'frame-modern' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedMessage('Meesterwerk Opgeslagen!');
      setTimeout(() => setSavedMessage(''), 2000);
    }, 1500);
  };

  return (
    <div
      className="artstudio-page studio-environment-bg"
      style={{ backgroundImage: `url(${grassTile})` }}
    >
      <div className="studio-header">
        <button className="back-btn btn-kenney" onClick={() => navigate('/adventure')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="studio-title">
          Kunstatelier
        </h1>
        <div className="studio-controls">
          <button className="save-btn btn-kenney success" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              'Opslaan...'
            ) : (
              <>
                <Camera size={20} /> Opslaan
              </>
            )}
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="saved-message studio-saved-overlay">
          {savedMessage}
        </div>
      )}

      <div className="studio-3d-wrapper">
        <Canvas
          shadows={false}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'low-power', antialias: false, alpha: false }}
          camera={{ position: [3.5, 4.5, 8], fov: 55 }}
        >
          <WorldScene3DMain
            mapGrid={ART_STUDIO_GRID}
            onObjectClick={undefined}
            isNight={false}
            enableSky={false}
          />
        </Canvas>
      </div>

      <div className="studio-content">
        <div className="sidebar game-panel-dark studio-sidebar-panel">
          <h3 className="studio-sidebar-title">
            Modellen
          </h3>
          <div className="pokemon-grid">
            {myPokemon.map(p => (
              <div
                key={p.id}
                className={`pokemon-thumb ${selectedId === p.id ? 'active' : ''}`}
                onClick={() => setSelectedId(p.id)}
              >
                <img src={p.image} alt={p.name} className="studio-pixelated-img" />
              </div>
            ))}
          </div>

          <h3 className="studio-sidebar-title">
            Filters
          </h3>
          <div className="filter-grid">
            {filters.map(f => (
              <button
                key={f.id}
                className={`filter-btn btn-kenney ${selectedFilter === f.id ? 'primary' : 'secondary'}`}
                onClick={() => setSelectedFilter(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>

          <h3 className="studio-sidebar-title">
            Lijsten
          </h3>
          <div className="filter-grid">
            {frames.map(f => (
              <button
                key={f.id}
                className={`filter-btn btn-kenney ${selectedFrame === f.id ? 'primary' : 'secondary'}`}
                onClick={() => setSelectedFrame(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div className="canvas-area">
          <div className={`art-canvas studio-canvas-box ${selectedFrame !== 'none' ? `frame-${selectedFrame}` : ''}`}>
            {selectedPokemon ? (
              <div
                className="canvas-content"
                style={filters.find(f => f.id === selectedFilter)?.style}
              >
                <img
                  src={selectedPokemon.image}
                  alt={selectedPokemon.name}
                  className="art-subject studio-art-subject"
                />
              </div>
            ) : (
              <div className="empty-state studio-empty-state">
                Selecteer een Pokémon
              </div>
            )}
            <div className="artist-signature studio-artist-signature">
              Door {playerName || 'Artiest'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
