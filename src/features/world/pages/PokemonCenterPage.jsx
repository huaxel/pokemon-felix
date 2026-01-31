import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { WorldPageHeader } from '../components/WorldPageHeader';
import nurseJoyImage from '../../../assets/nurse_joy.png';
import healingMachineImage from '../../../assets/healing_machine.png';
import './PokemonCenterPage.css';

export function PokemonCenterPage() {
    const navigate = useNavigate();
    const { healAll } = usePokemonContext();
    const [healingState, setHealingState] = useState('idle'); // idle, healing, finished
    const [message, setMessage] = useState("¡Bienvenido al Centro Pokémon! ¿Deseas curar a tu equipo?");

    const handleHeal = () => {
        setHealingState('healing');
        setMessage("¡Por favor espera un momento!");

        // Animation sequence
        setTimeout(() => {
            setMessage("Ding... Ding... Ding... Dong! 🎵");
            healAll();
            setHealingState('finished');

            setTimeout(() => {
                setMessage("¡Tu equipo está recuperado! ¡Vuelve pronto!");
                setHealingState('done');
            }, 1500);
        }, 3000);
    };

    return (
        <div className="pokemon-center-page">
            <WorldPageHeader title="Centro Pokémon" icon="🏥" />

            <div className="center-content">
                <div className="healing-machine-container">
                    <img src={healingMachineImage} alt="Machine" className={`healing-machine ${healingState === 'healing' ? 'active' : ''}`} />
                    <div className="pokeballs-overlay">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={`pokeball-light ${healingState === 'healing' ? `animate-${i}` : ''}`}></div>
                        ))}
                    </div>
                </div>

                <div className="nurse-counter">
                    <img src={nurseJoyImage} alt="Nurse Joy" className="nurse-joy" />
                    <div className="dialog-box">
                        <p>{message}</p>
                        {healingState === 'idle' && (
                            <button className="heal-btn" onClick={handleHeal}>
                                <Heart fill="white" size={20} /> Curar Equipo
                            </button>
                        )}
                        {healingState === 'done' && (
                            <button className="heal-btn" onClick={() => navigate('/world')}>
                                ¡Gracias! (Salir)
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
