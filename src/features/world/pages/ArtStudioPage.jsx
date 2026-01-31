import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { usePlayer } from '../../../hooks/usePlayer';
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
        { id: 'none', name: 'Normal', style: {} },
        { id: 'sepia', name: 'Sepia', style: { filter: 'sepia(100%)' } },
        { id: 'gray', name: 'B&W', style: { filter: 'grayscale(100%)' } },
        { id: 'blur', name: 'Dreamy', style: { filter: 'blur(1px) brightness(1.1)' } },
        { id: 'invert', name: 'Neon', style: { filter: 'invert(100%)' } },
        { id: 'hue', name: 'Alien', style: { filter: 'hue-rotate(90deg)' } },
    ];

    const frames = [
        { id: 'none', name: 'None', class: '' },
        { id: 'gold', name: 'Golden', class: 'frame-gold' },
        { id: 'wood', name: 'Classic', class: 'frame-wood' },
        { id: 'rainbow', name: 'Rainbow', class: 'frame-rainbow' },
        { id: 'modern', name: 'Modern', class: 'frame-modern' },
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSavedMessage('¡Obra Maestra Guardada!');
            setTimeout(() => setSavedMessage(''), 2000);
        }, 1500);
    };

    return (
        <div className="artstudio-page">
            <div className="studio-header">
                <button className="back-btn" onClick={() => navigate('/world')}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Estudio de Arte</h1>
                <div className="studio-controls">
                    <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Guardando...' : <><Camera size={20} /> Guardar</>}
                    </button>
                </div>
            </div>

            {savedMessage && (
                <div className="saved-message">
                    {savedMessage}
                </div>
            )}

            <div className="studio-content">
                <div className="sidebar">
                    <h3>Modelos</h3>
                    <div className="pokemon-grid">
                        {myPokemon.map(p => (
                            <div
                                key={p.id}
                                className={`pokemon-thumb ${selectedId === p.id ? 'active' : ''}`}
                                onClick={() => setSelectedId(p.id)}
                            >
                                <img src={p.image} alt={p.name} />
                            </div>
                        ))}
                    </div>

                    <h3>Filtros</h3>
                    <div className="filter-grid">
                        {filters.map(f => (
                            <button
                                key={f.id}
                                className={`filter-btn ${selectedFilter === f.id ? 'active' : ''}`}
                                onClick={() => setSelectedFilter(f.id)}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>

                    <h3>Marcos</h3>
                    <div className="filter-grid">
                        {frames.map(f => (
                            <button
                                key={f.id}
                                className={`filter-btn ${selectedFrame === f.id ? 'active' : ''}`}
                                onClick={() => setSelectedFrame(f.id)}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="canvas-area">
                    <div className={`art-canvas ${selectedFrame !== 'none' ? `frame-${selectedFrame}` : ''}`}>
                        {selectedPokemon ? (
                            <div className="canvas-content" style={filters.find(f => f.id === selectedFilter)?.style}>
                                <img src={selectedPokemon.image} alt={selectedPokemon.name} className="art-subject" />
                            </div>
                        ) : (
                            <div className="empty-state">
                                Selecciona un Pokémon
                            </div>
                        )}
                        <div className="artist-signature">
                            By {playerName || 'Artist'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
