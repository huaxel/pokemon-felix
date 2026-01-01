import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { TreasureTutorial } from './components/TreasureTutorial';
import { TreasureHuntingView } from './components/TreasureHuntingView';
import { TreasureSuccessView } from './components/TreasureSuccessView';
import { TreasureFailedView } from './components/TreasureFailedView';
import './TreasureHuntPage.css';

const TREASURE_HUNTS = [
    { id: 1, difficulty: 'Easy', target: { x: 5, y: 5 }, clue: "The treasure is at the center of the town, where Professor Oak often stands!", reward: 300, pokemonReward: 'pikachu' },
    { id: 2, difficulty: 'Easy', target: { x: 8, y: 8 }, clue: "Look in the southeast corner, near the Gacha machine!", reward: 350, pokemonReward: 'eevee' },
    { id: 3, difficulty: 'Medium', target: { x: 3, y: 7 }, clue: "The treasure is west of the path, near the Gym building!", reward: 500, pokemonReward: 'bulbasaur' },
    { id: 4, difficulty: 'Medium', target: { x: 9, y: 4 }, clue: "Search the eastern water area, by the Fountain Plaza!", reward: 550, pokemonReward: 'squirtle' },
    { id: 5, difficulty: 'Hard', target: { x: 1, y: 1 }, clue: "In the northwest corner of the world, where few travelers go...", reward: 800, pokemonReward: 'charmander' },
    { id: 6, difficulty: 'Hard', target: { x: 6, y: 9 }, clue: "At the southern boundary, near the Evolution Hall!", reward: 850, pokemonReward: 'dratini' },
    { id: 7, difficulty: 'Expert', target: { x: 9, y: 7 }, clue: "High in the mountains, where the air is thin...", reward: 1200, pokemonReward: 'larvitar' },
    { id: 8, difficulty: 'Expert', target: { x: 0, y: 0 }, clue: "The most northwestern point of the entire world!", reward: 1500, pokemonReward: 'beldum' }
];

export function TreasureHuntPage() {
    const navigate = useNavigate();
    const { addCoins, getPokemonDetails } = usePokemonContext();
    const [stage, setStage] = useState('tutorial');
    const [currentHunt, setCurrentHunt] = useState(null);
    const [huntsCompleted, setHuntsCompleted] = useState(0);
    const [playerGuess, setPlayerGuess] = useState({ x: '', y: '' });
    const [attempts, setAttempts] = useState(0);
    const [distance, setDistance] = useState(null);
    const [message, setMessage] = useState('');
    const [rewardPokemon, setRewardPokemon] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('treasure_hunts_completed');
        if (saved) setHuntsCompleted(parseInt(saved));
    }, []);

    const calculateDistance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const getDirectionHint = (guessX, guessY, targetX, targetY) => {
        const dx = targetX - guessX;
        const dy = targetY - guessY;
        let direction = '';
        if (Math.abs(dy) > 0.5) direction += dy < 0 ? 'North' : 'South';
        if (Math.abs(dx) > 0.5) direction += dx < 0 ? 'West' : 'East';
        return direction || 'Very close!';
    };

    const startNewHunt = () => {
        const availableHunts = TREASURE_HUNTS.filter(h => h.id > huntsCompleted);
        if (availableHunts.length === 0) {
            setMessage("🎉 You've completed all treasure hunts! Amazing!");
            return;
        }
        setCurrentHunt(availableHunts[0]);
        setStage('hunting');
        setAttempts(0);
        setDistance(null);
        setPlayerGuess({ x: '', y: '' });
        setMessage('');
    };

    const handleGuess = async () => {
        const guessX = parseInt(playerGuess.x);
        const guessY = parseInt(playerGuess.y);
        if (isNaN(guessX) || isNaN(guessY)) {
            setMessage('❌ Please enter valid numbers!');
            return;
        }
        if (guessX < 0 || guessX > 9 || guessY < 0 || guessY > 9) {
            setMessage('❌ Coordinates must be between 0 and 9!');
            return;
        }

        setAttempts(prev => prev + 1);
        if (guessX === currentHunt.target.x && guessY === currentHunt.target.y) {
            const pokemon = await getPokemonDetails(currentHunt.pokemonReward);
            setRewardPokemon(pokemon);
            setStage('success');
            addCoins(currentHunt.reward);
            const newCompleted = huntsCompleted + 1;
            setHuntsCompleted(newCompleted);
            localStorage.setItem('treasure_hunts_completed', newCompleted.toString());
            setMessage(`🎉 Treasure found!`);
        } else {
            const dist = calculateDistance(guessX, guessY, currentHunt.target.x, currentHunt.target.y);
            setDistance(dist);
            const direction = getDirectionHint(guessX, guessY, currentHunt.target.x, currentHunt.target.y);
            if (dist < 2) setMessage(`🔥 Very close! Try going ${direction}!`);
            else if (dist < 4) setMessage(`⚠️ Getting warmer! Head ${direction}!`);
            else setMessage(`❄️ Still far away. Go ${direction}!`);
            if (attempts >= 9) {
                setStage('failed');
                setMessage(`😔 Out of attempts!`);
            }
        }
    };

    if (stage === 'tutorial') {
        return <TreasureTutorial huntsCompleted={huntsCompleted} totalHunts={TREASURE_HUNTS.length} onStart={startNewHunt} onBack={() => navigate('/adventure')} />;
    }

    if (stage === 'hunting') {
        return <TreasureHuntingView
            onBack={() => navigate('/adventure')}
            currentHunt={currentHunt}
            attempts={attempts}
            distance={distance}
            message={message}
            playerGuess={playerGuess}
            setPlayerGuess={setPlayerGuess}
            onGuess={handleGuess}
        />;
    }

    if (stage === 'success') {
        return <TreasureSuccessView
            currentHunt={currentHunt}
            attempts={attempts}
            rewardPokemon={rewardPokemon}
            onNext={startNewHunt}
        />;
    }

    if (stage === 'failed') {
        return <TreasureFailedView
            currentHunt={currentHunt}
            onRestart={() => setStage('hunting')}
            onBack={() => navigate('/adventure')}
        />;
    }

    return null;
}
