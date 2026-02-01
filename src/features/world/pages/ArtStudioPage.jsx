import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { usePlayer } from '../../../hooks/usePlayer';
import { grassTile } from '../worldAssets';
import './ArtStudioPage.css';

export function ArtStudioPage() {
    const navigate = useNavigate();
    const { pokemonList, squadIds } = usePokemonContext();
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
        <div className="artstudio-page" style={{ 
            backgroundColor: '#2d1810',
            backgroundImage: `url(${grassTile})`,
            backgroundSize: '64px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated'
        }}>
            <div className="studio-header">
                <button className="back-btn btn-kenney" onClick={() => navigate('/world')}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '2px 2px 0 #000' }}>Kunstatelier</h1>
                <div className="studio-controls">
                    <button className="save-btn btn-kenney success" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Opslaan...' : <><Camera size={20} /> Opslaan</>}
                    </button>
                </div>
            </div>

            {savedMessage && (
                <div className="saved-message" style={{ fontFamily: '"Press Start 2P", cursive', backgroundColor: '#22c55e', color: '#fff', padding: '1rem', borderRadius: '8px', border: '4px solid #15803d' }}>
                    {savedMessage}
                </div>
            )}

            <div className="studio-content">
                <div className="sidebar game-panel-dark" style={{ border: '4px solid #4b5563', backgroundColor: '#1f2937', padding: '1rem' }}>
                    <h3 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#fff', marginBottom: '1rem' }}>Modellen</h3>
                    <div className="pokemon-grid">
                        {myPokemon.map(p => (
                            <div
                                key={p.id}
                                className={`pokemon-thumb ${selectedId === p.id ? 'active' : ''}`}
                                onClick={() => setSelectedId(p.id)}
                                style={{ border: selectedId === p.id ? '4px solid #fbbf24' : '2px solid #4b5563', borderRadius: '8px', overflow: 'hidden' }}
                            >
                                <img src={p.image} alt={p.name} style={{ imageRendering: 'pixelated' }} />
                            </div>
                        ))}
                    </div>

                    <h3 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#fff', margin: '1rem 0' }}>Filters</h3>
                    <div className="filter-grid">
                        {filters.map(f => (
                            <button
                                key={f.id}
                                className={`filter-btn btn-kenney ${selectedFilter === f.id ? 'primary' : 'secondary'}`}
                                onClick={() => setSelectedFilter(f.id)}
                                style={{ fontSize: '0.7rem' }}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>

                    <h3 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#fff', margin: '1rem 0' }}>Lijsten</h3>
                    <div className="filter-grid">
                        {frames.map(f => (
                            <button
                                key={f.id}
                                className={`filter-btn btn-kenney ${selectedFrame === f.id ? 'primary' : 'secondary'}`}
                                onClick={() => setSelectedFrame(f.id)}
                                style={{ fontSize: '0.7rem' }}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="canvas-area">
                    <div className={`art-canvas ${selectedFrame !== 'none' ? `frame-${selectedFrame}` : ''}`} style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        {selectedPokemon ? (
                            <div className="canvas-content" style={filters.find(f => f.id === selectedFilter)?.style}>
                                <img src={selectedPokemon.image} alt={selectedPokemon.name} className="art-subject" style={{ imageRendering: 'pixelated', width: '200px', height: '200px' }} />
                            </div>
                        ) : (
                            <div className="empty-state" style={{ fontFamily: '"Press Start 2P", cursive', color: '#9ca3af' }}>
                                Selecteer een Pokémon
                            </div>
                        )}
                        <div className="artist-signature" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.6rem', color: '#6b7280', marginTop: '1rem' }}>
                            Door {playerName || 'Artiest'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
