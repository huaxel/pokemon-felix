import { useState } from 'react';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { getPokemonDetails } from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { CaveLockedView } from './components/CaveLockedView';
import { CaveExplorationView } from './components/CaveExplorationView';
import { CaveEncounterView } from './components/CaveEncounterView';
import bagIcon from '../../assets/items/bag_icon.png';
import './SecretCavePage.css';

export function SecretCavePage() {
    const navigate = useNavigate();
    const { ownedIds, toggleOwned, addCoins } = usePokemonContext();
    const [discovered, setDiscovered] = useState(false);
    const [depth, setDepth] = useState(0);
    const [encounter, setEncounter] = useState(null);
    const [catching, setCatching] = useState(false);
    const [catchMessage, setCatchMessage] = useState('');

    const hasRareCandy = ownedIds.length >= 10; // Simple requirement for now

    const handleDiscover = () => {
        setDiscovered(true);
    };

    const handleExplore = async () => {
        const newDepth = depth + Math.floor(Math.random() * 15) + 5;
        setDepth(newDepth);

        const encounterChance = 0.2 + (newDepth / 500); // Chance increases with depth
        if (Math.random() < encounterChance) {
            const rarity = Math.random();
            let targetId;

            if (rarity < 0.05 && newDepth > 100) { // Legendary
                const legendaries = [144, 145, 146, 150, 151];
                targetId = legendaries[Math.floor(Math.random() * legendaries.length)];
            } else if (rarity < 0.3) { // Rare
                const rares = [131, 143, 147, 142];
                targetId = rares[Math.floor(Math.random() * rares.length)];
            } else { // Common cave dwellers
                const commons = [41, 74, 111, 27];
                targetId = commons[Math.floor(Math.random() * commons.length)];
            }

            const details = await getPokemonDetails(targetId);
            setEncounter(details);
        }
    };

    const handleCatch = () => {
        setCatching(true);
        setCatchMessage('You threw a PokeBall...');

        setTimeout(() => {
            const success = Math.random() > 0.4;
            if (success) {
                setCatchMessage(`Gotcha! ${encounter.name} was caught!`);
                setOwnedIds(prev => [...prev, encounter.id]);
                setTimeout(() => {
                    setEncounter(null);
                    setCatching(false);
                    setCatchMessage('');
                }, 2000);
            } else {
                setCatchMessage(`${encounter.name} broke free!`);
                setTimeout(() => {
                    setCatching(false);
                    setCatchMessage('');
                }, 1500);
            }
        }, 1500);
    };

    if (!hasRareCandy && !discovered) {
        return <CaveLockedView />;
    }

    if (!discovered) {
        return (
            <div className="cave-page entry">
                <header className="cave-header">
                    <Link to="/world" className="back-button">
                        <img src={bagIcon} alt="Back" />
                    </Link>
                    <h1>Secret Cave</h1>
                </header>
                <div className="discovery-screen">
                    <div className="discovery-visual">🕳️</div>
                    <h2>You found a hidden entrance!</h2>
                    <p>The air feels cool and mysterious inside...</p>
                    <button className="discover-btn" onClick={handleDiscover}>Enter Cave</button>
                    <Link to="/world" className="cancel-btn">Leave it alone</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cave-page active">
            <header className="cave-header">
                <button className="back-button" onClick={() => (encounter ? setEncounter(null) : navigate('/world'))}>
                    <img src={bagIcon} alt="Back" />
                </button>
                <h1>Secret Cave</h1>
            </header>

            <main className="cave-main">
                {encounter ? (
                    <CaveEncounterView
                        pokemon={encounter}
                        catching={catching}
                        catchMessage={catchMessage}
                        onCatch={handleCatch}
                        onFlee={() => setEncounter(null)}
                    />
                ) : (
                    <CaveExplorationView
                        depth={depth}
                        onExplore={handleExplore}
                        onExit={() => navigate('/world')}
                        onReturn={() => setDepth(0)}
                    />
                )}
            </main>
        </div>
    );
}
