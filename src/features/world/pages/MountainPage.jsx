import { useState } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../../lib/api';
import { MountainEntryView } from '../components/MountainEntryView';
import { MountainHikeView } from '../components/MountainHikeView';
import { ALTITUDE_STAGES } from '../mountainConfig';
import './MountainPage.css';

export function MountainPage() {
    const { inventory, addItem, addCoins } = usePokemonContext();
    const [stage, setStage] = useState('entry');
    const [altitude, setAltitude] = useState(0);
    const [tiredness, setTiredness] = useState(0);
    const [foundPokemon, setFoundPokemon] = useState(null);
    const [message, setMessage] = useState('');

    const handleClimb = async () => {
        const idx = Math.floor(altitude / 500);
        if (idx >= ALTITUDE_STAGES.length) return setStage('summit');
        const nextAlt = (idx + 1) * 500;
        const newTired = Math.min(100, tiredness + Math.floor(Math.random() * 30) + 15);
        setAltitude(nextAlt); setTiredness(newTired);
        if (Math.random() < 0.4) {
            const p = await getPokemonDetails(ALTITUDE_STAGES[idx].pokemon[Math.floor(Math.random() * ALTITUDE_STAGES[idx].pokemon.length)]);
            setFoundPokemon(p); setMessage(`🔔 ¡Encontraste un ${p.name}!`);
        } else setMessage(`📍 Escalaste a ${nextAlt}m`);
        if (newTired >= 100) setStage('resting');
    };

    const handleExit = () => { setStage('entry'); setAltitude(0); setTiredness(0); setFoundPokemon(null); setMessage(''); };

    if (stage === 'entry') return <MountainEntryView hasBoots={inventory?.hiking_boots} zones={ALTITUDE_STAGES} onStartHike={() => setStage('hiking')} />;
    if (stage === 'hiking') return <MountainHikeView altitude={altitude} tiredness={tiredness} currentStage={ALTITUDE_STAGES[Math.floor(altitude / 500)]} foundPokemon={foundPokemon} message={message} onExit={handleExit} onClimb={handleClimb} onRest={() => setStage('resting')} onCatch={() => { addItem('pokeball', -1); addCoins(100); setFoundPokemon(null); }} onPass={() => setFoundPokemon(null)} />;

    if (stage === 'resting') return (
        <div className="mountain-page resting">
            <div className="rest-scene">
                <h2>😴 Descansando</h2>
                <div className="rest-progress"><div className="rest-bar"><div className="rest-fill" style={{ width: `${100 - tiredness}%` }}></div></div></div>
                <button onClick={() => setTiredness(t => Math.max(0, t - 30))}>⏳ Descansar más</button>
                {tiredness <= 30 && <button onClick={() => setStage('hiking')}>✨ Continuar</button>}
            </div>
        </div>
    );

    if (stage === 'summit') return (
        <div className="mountain-page summit">
            <div className="summit-scene">
                <h1>🏔️ ¡Cima Alcanzada!</h1>
                <div className="rewards"><div className="reward">💰 1000</div><div className="reward">🍭 Rare Candy</div></div>
                <button onClick={handleExit}>🌄 Descender</button>
            </div>
        </div>
    );
}
