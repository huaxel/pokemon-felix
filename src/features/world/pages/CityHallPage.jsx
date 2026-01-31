import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { usePlayer } from '../../../hooks/usePlayer';
import { WorldPageHeader } from '../components/WorldPageHeader';
import './CityHallPage.css';

export function CityHallPage() {
    const navigate = useNavigate();
    const { ownedIds, coins, dailyReward } = usePokemonContext();
    const { playerName } = usePlayer();
    const { canClaim, handleClaimDailyReward } = dailyReward;

    const onClaim = () => {
        handleClaimDailyReward();
    };

    // Stats
    const battlesWon = localStorage.getItem('battles_won') || 0;


    return (
        <div className="city-hall-page">
            <WorldPageHeader title="Ayuntamiento" icon="🏛️" />

            <main className="hall-content">
                <div className="mayor-desk">
                    <div className="mayor-npc">👴</div>
                    <div className="mayor-dialogue-box">
                        <p><strong>Alcalde:</strong> ¡Bienvenido, <strong>{playerName}</strong>!</p>
                        <p>La ciudad prospera gracias a entrenadores como tú.</p>
                        {canClaim ? (
                            <button className="claim-btn" onClick={onClaim}>
                                🎁 Reclamar Subsidio Diario (100)
                            </button>
                        ) : (
                            <p className="come-back-msg">Vuelve mañana para tu subsidio.</p>
                        )}
                    </div>
                </div>

                <div className="hall-services">
                    <div className="service-card records">
                        <h2>📊 Tus Registros</h2>
                        <div className="stats-grid">
                            <div className="stat">
                                <span className="stat-label">Pokémon</span>
                                <span className="stat-value">{ownedIds.length}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Batallas Ganadas</span>
                                <span className="stat-value">{battlesWon}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Dinero Actual</span>
                                <span className="stat-value">{coins}</span>
                            </div>
                        </div>
                    </div>

                    <div className="service-card registry">
                        <h2>📝 Registro Civil</h2>
                        <p>Identificación oficial de entrenador.</p>
                        <button className="registry-btn" onClick={() => navigate('/profile')}>
                            Ver Pasaporte
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
