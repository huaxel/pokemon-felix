import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDomainCollection, useEconomy, useExperience } from '../../contexts/DomainContexts';
import { BattleArena } from './components/BattleArena';
import { getPokemonDetails } from '../../lib/api';
import { TRAINERS } from '../../lib/trainers';
import { useToast } from '../../hooks/useToast';
import { grassTile } from '../world/worldAssets';
import './SingleBattlePage.css';

export function TrainerBattlePage({ allPokemon }) {
    const { trainerId } = useParams();
    const navigate = useNavigate();
    const { squadIds } = useDomainCollection();
    const { addCoins } = useEconomy();
    const { gainExperience } = useExperience();
    const { addToast } = useToast();

    const [trainer, setTrainer] = useState(null);
    const [opponentPokemon, setOpponentPokemon] = useState(null);
    const [playerPokemon, setPlayerPokemon] = useState(null);
    const [battleState, setBattleState] = useState('loading'); // loading, battle, victory, defeat

    const startBattle = useCallback(async () => {
        const selectedTrainer = TRAINERS.find(t => t.id === trainerId);
        if (!selectedTrainer) {
            navigate('/trainer-selection');
            return;
        }
        setTrainer(selectedTrainer);

        // Get user's first squad member
        const userSquad = allPokemon.filter(p => squadIds.includes(p.id));
        const player = userSquad[0];

        // Get trainer's signature pokemon
        const signaturePokemon = allPokemon.find(p => p.id === selectedTrainer.pokemonId) ||
            allPokemon.find(p => p.id === 25); // Pikachu fallback

        if (!player || !signaturePokemon) return;

        try {
            const [playerDetails, opponentDetails] = await Promise.all([
                getPokemonDetails(player.id),
                getPokemonDetails(signaturePokemon.id),
            ]);

            setPlayerPokemon(playerDetails);
            setOpponentPokemon(opponentDetails);
            setBattleState('battle');
        } catch (error) {
            console.error('Failed to start battle:', error);
            setPlayerPokemon(player);
            setOpponentPokemon(signaturePokemon);
            setBattleState('battle');
        }
    }, [allPokemon, squadIds, trainerId, navigate]);

    useEffect(() => {
        if (allPokemon && allPokemon.length > 0 && squadIds.length > 0) {
            startBattle();
        }
    }, [allPokemon, squadIds, startBattle]);

    const handleBattleEnd = winner => {
        if (winner.id === playerPokemon.id) {
            addCoins(trainer.reward);
            const { leveledUp, newLevel } = gainExperience(playerPokemon.id, 100);
            if (leveledUp) addToast(`¡${playerPokemon.name} is nu level ${newLevel}!`, 'success');
            setBattleState('victory');
        } else {
            setBattleState('defeat');
        }
    };

    if (battleState === 'loading' || !playerPokemon || !opponentPokemon || !trainer) {
        return (
            <div
                className="single-battle-page loading"
                style={{
                    backgroundColor: '#2d1810',
                    backgroundImage: 'url(${grassTile})',
                    backgroundSize: '64px',
                    backgroundRepeat: 'repeat',
                    imageRendering: 'pixelated',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    color: 'white',
                    fontFamily: '"Press Start 2P", cursive',
                }}
            >
                Gevecht voorbereiden...
            </div>
        );
    }

    if (battleState === 'victory') {
        return (
            <div
                className="single-battle-page result victory"
                style={{
                    backgroundColor: '#2d1810',
                    backgroundImage: 'url(${grassTile})',
                    backgroundSize: '64px',
                    backgroundRepeat: 'repeat',
                    imageRendering: 'pixelated',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    gap: '2rem',
                }}
            >
                <h1
                    style={{
                        fontFamily: '"Press Start 2P", cursive',
                        textShadow: '2px 2px 0 #000',
                        color: '#fbbf24',
                        fontSize: '3rem',
                    }}
                >
                    Overwinning!
                </h1>
                <div
                    className="result-card game-panel-dark"
                    style={{ textAlign: 'center', padding: '2rem' }}
                >
                    <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        style={{ width: '128px', height: '128px', objectFit: 'contain', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
                    />
                    <p
                        style={{
                            fontFamily: '"Press Start 2P", cursive',
                            marginTop: '1rem',
                            fontSize: '1rem',
                            color: '#d1d5db'
                        }}
                    >
                        "{trainer.loseQuote}"
                    </p>
                    <div
                        className="reward-badge"
                        style={{ marginTop: '1rem', color: '#fbbf24', fontFamily: '"Press Start 2P", cursive' }}
                    >
                        +{trainer.reward} Munten
                    </div>
                    <div
                        className="reward-badge exp"
                        style={{ color: '#60a5fa', fontFamily: '"Press Start 2P", cursive' }}
                    >
                        +100 EXP
                    </div>
                </div>
                <div className="actions" style={{ display: 'flex', gap: '1rem' }}>
                    <button className="replay-btn btn-kenney primary" onClick={startBattle}>
                        Revanche
                    </button>
                    <Link
                        to="/trainer-selection"
                        className="back-btn btn-kenney neutral"
                        style={{ textDecoration: 'none' }}
                    >
                        Terug
                    </Link>
                </div>
            </div>
        );
    }

    if (battleState === 'defeat') {
        return (
            <div
                className="single-battle-page result defeat"
                style={{
                    backgroundColor: '#2d1810',
                    backgroundImage: 'url(${grassTile})',
                    backgroundSize: '64px',
                    backgroundRepeat: 'repeat',
                    imageRendering: 'pixelated',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    gap: '2rem',
                }}
            >
                <h1
                    style={{
                        fontFamily: '"Press Start 2P", cursive',
                        textShadow: '2px 2px 0 #000',
                        color: '#ef4444',
                        fontSize: '3rem',
                    }}
                >
                    Nederlaag
                </h1>
                <div
                    className="result-card game-panel-dark"
                    style={{ textAlign: 'center', padding: '2rem' }}
                >
                    <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        style={{ width: '128px', height: '128px', objectFit: 'contain', filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.5))' }}
                    />
                    <p
                        style={{
                            fontFamily: '"Press Start 2P", cursive',
                            marginTop: '1rem',
                            fontSize: '1rem',
                            color: '#d1d5db'
                        }}
                    >
                        "{trainer.winQuote}"
                    </p>
                </div>
                <div className="actions" style={{ display: 'flex', gap: '1rem' }}>
                    <button className="replay-btn btn-kenney warning" onClick={startBattle}>
                        Probeer Opnieuw
                    </button>
                    <Link
                        to="/trainer-selection"
                        className="back-btn btn-kenney neutral"
                        style={{ textDecoration: 'none' }}
                    >
                        Terug
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="single-battle-page"
            style={{
                backgroundColor: '#2d1810',
                backgroundImage: 'url(${grassTile})',
                backgroundSize: '64px',
                backgroundRepeat: 'repeat',
                imageRendering: 'pixelated',
                minHeight: '100vh',
            }}
        >
            <div className="battle-header-simple" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontFamily: '"Press Start 2P", cursive', color: 'white', textShadow: '2px 2px 0 #000', fontSize: '1.2rem', margin: 0 }}>
                    Vs {trainer.name}
                </h2>
                <Link
                    to="/trainer-selection"
                    className="close-btn btn-kenney neutral"
                    style={{
                        textDecoration: 'none',
                        display: 'inline-flex',
                        width: '40px',
                        height: '40px',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    ✕
                </Link>
            </div>
            <BattleArena
                key={`${playerPokemon.id}-${opponentPokemon.id}`}
                initialFighter1={playerPokemon}
                initialFighter2={opponentPokemon}
                onBattleEnd={handleBattleEnd}
            />
        </div>
    );
}
