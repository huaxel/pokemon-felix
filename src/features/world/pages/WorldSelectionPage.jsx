import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Compass } from 'lucide-react';
import './WorldSelectionPage.css';

const WORLDS = [
    {
        id: 'green_valley',
        name: 'Valle Verde',
        description: 'Un valle exuberante lleno de vida y entrenadores.',
        type: 'grass',
        color: '#4ade80',
        icon: '🌳'
    },
    {
        id: 'desert_oasis',
        name: 'Oasis Desértico',
        description: 'Dunas de arena antigua y secretos ocultos.',
        type: 'sand',
        color: '#f59e0b',
        icon: '🌵'
    },
    {
        id: 'frozen_peak',
        name: 'Pico Helado',
        description: 'Montañas nevadas donde residen Pokémon de hielo.',
        type: 'snow',
        color: '#38bdf8',
        icon: '❄️'
    }
];

export function WorldSelectionPage() {
    const navigate = useNavigate();
    const [selectedWorld, setSelectedWorld] = useState(null);

    const handleEnterWorld = (worldId) => {
        navigate(`/adventure?world=${worldId}`);
    };

    return (
        <div className="world-selection-page">
            <header className="selection-header">
                <h1><Globe size={40} className="spinning-globe" /> Selector de Mundo</h1>
                <p>¿A dónde quieres viajar hoy, Félix?</p>
            </header>

            <div className="worlds-container">
                {WORLDS.map(world => (
                    <div
                        key={world.id}
                        className={`world-card ${selectedWorld === world.id ? 'selected' : ''}`}
                        onClick={() => setSelectedWorld(world.id)}
                        style={{ borderColor: world.color }}
                    >
                        <div className="world-icon">{world.icon}</div>
                        <div className="world-info">
                            <h2>{world.name}</h2>
                            <p>{world.description}</p>
                        </div>
                        <button
                            className="travel-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEnterWorld(world.id);
                            }}
                        >
                            <Compass size={18} /> Viajar
                        </button>
                    </div>
                ))}
            </div>

            <div className="globe-decoration">
                <div className="orbit-c1"></div>
                <div className="orbit-c2"></div>
            </div>
        </div>
    );
}
