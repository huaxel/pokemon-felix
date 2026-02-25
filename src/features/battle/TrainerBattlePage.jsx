import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDomainCollection, useEconomy, useExperience } from '../../contexts/DomainContexts';
import { BattleArena } from './components/BattleArena';
import { getPokemonDetails } from '../../lib/api';
import { TRAINERS } from '../../lib/trainers';
import { useToast } from '../../hooks/useToast';
import { grassTile } from '../world/worldAssets';
import TrainerChat from '../chat/TrainerChat';
import './TrainerBattlePage.css';

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
    const [battleState, setBattleState] = useState('loading'); // loading, chat, battle, victory, defeat

    const prepareBattle = useCallback(async () => {
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
            setBattleState('chat');
        } catch (error) {
            console.error('Failed to prepare battle:', error);
            setPlayerPokemon(player);
            setOpponentPokemon(signaturePokemon);
            setBattleState('chat');
        }
    }, [allPokemon, squadIds, trainerId, navigate]);

    const startBattle = () => {
        setBattleState('battle');
    };

    useEffect(() => {
        if (allPokemon && allPokemon.length > 0 && squadIds.length > 0) {
            prepareBattle();
        }
    }, [allPokemon, squadIds, prepareBattle]);

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
                className="trainer-battle-page loading"
                style={{
                    backgroundImage: `url(${grassTile})`,
                }}
            >
                Gevecht voorbereiden...
            </div>
        );
    }

    if (battleState === 'chat') {
        return (
            <div
                className="trainer-battle-page chat"
                style={{
                    backgroundImage: `url(${grassTile})`,
                }}
            >
                <div className="trainer-battle-header chat">
                    <h2 className="trainer-battle-title">
                        Ontmoeting met {trainer.name}
                    </h2>
                    <Link to="/trainer-selection" className="close-btn btn-kenney neutral">✕</Link>
                </div>

                <TrainerChat trainer={trainer} onStartBattle={startBattle} />

                <button
                    className="game-button game-button-danger trainer-battle-challenge-btn"
                    onClick={startBattle}
                >
                    Daag uit voor gevecht!
                </button>
            </div>
        );
    }

    if (battleState === 'victory') {
        return (
            <div
                className="trainer-battle-page result"
                style={{
                    backgroundImage: `url(${grassTile})`,
                }}
            >
                <h1 className="trainer-battle-result-title victory">
                    Overwinning!
                </h1>
                <div className="trainer-battle-card game-panel-dark">
                    <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="trainer-battle-avatar"
                    />
                    <p className="trainer-battle-quote">
                        &quot;{trainer.loseQuote}&quot;
                    </p>
                    <div className="trainer-battle-reward">
                        +{trainer.reward} Munten
                    </div>
                    <div className="trainer-battle-exp">
                        +100 EXP
                    </div>
                </div>
                <div className="trainer-battle-actions">
                    <button className="replay-btn btn-kenney primary" onClick={prepareBattle}>
                        Revanche
                    </button>
                    <Link
                        to="/trainer-selection"
                        className="back-btn btn-kenney neutral trainer-battle-back-btn"
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
                className="trainer-battle-page result"
                style={{
                    backgroundImage: `url(${grassTile})`,
                }}
            >
                <h1 className="trainer-battle-result-title defeat">
                    Nederlaag
                </h1>
                <div className="trainer-battle-card game-panel-dark">
                    <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="trainer-battle-avatar"
                    />
                    <p className="trainer-battle-quote">
                        &quot;{trainer.winQuote}&quot;
                    </p>
                </div>
                <div className="trainer-battle-actions">
                    <button className="replay-btn btn-kenney warning" onClick={prepareBattle}>
                        Probeer Opnieuw
                    </button>
                    <Link
                        to="/trainer-selection"
                        className="back-btn btn-kenney neutral trainer-battle-back-btn"
                    >
                        Terug
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="trainer-battle-page"
            style={{
                backgroundImage: `url(${grassTile})`,
            }}
        >
            <div className="trainer-battle-header simple">
                <h2 className="trainer-battle-title">
                    Vs {trainer.name}
                </h2>
                <Link
                    to="/trainer-selection"
                    className="close-btn btn-kenney neutral trainer-battle-close-btn"
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
