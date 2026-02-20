import { Link } from 'react-router-dom';
import { TRAINERS } from '../../lib/trainers';
import bagIcon from '../../assets/items/bag_icon.png';
import './TrainerSelectionPage.css';

export function TrainerSelectionPage() {
    return (
        <div
            className="trainer-selection-page"
            style={{
                backgroundColor: '#2d1810',
                backgroundImage: 'url(../../assets/kenney_tiny-town/Tiles/tile_0000.png)',
                backgroundSize: '64px',
                backgroundRepeat: 'repeat',
                imageRendering: 'pixelated',
                minHeight: '100vh',
                padding: '2rem'
            }}
        >
            <div className="battle-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1
                    style={{
                        fontFamily: '"Press Start 2P", cursive',
                        textShadow: '2px 2px 0 #000',
                        color: 'white',
                    }}
                >
                    Trainers
                </h1>
                <p
                    style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#fbbf24', marginTop: '1rem' }}
                >
                    Daag je vrienden en rivalen uit
                </p>
            </div>

            <div className="trainers-grid">
                {TRAINERS.map(trainer => (
                    <div key={trainer.id} className="trainer-card game-panel">
                        <div className="trainer-avatar-container">
                            <img src={trainer.avatar} alt={trainer.name} className="trainer-avatar" />
                            <div className={`trainer-type-badge ${trainer.type}`}>
                                {trainer.type === 'friend' ? 'Vriend' : 'Rivaal'}
                            </div>
                        </div>
                        <div className="trainer-info">
                            <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem', marginBottom: '0.5rem' }}>
                                {trainer.name}
                            </h2>
                            <p className="trainer-quote">"{trainer.quote}"</p>

                            <div className="mode-rewards" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span className="reward-label" style={{ fontWeight: 'bold' }}>Beloning:</span>
                                <span className="reward-value" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                                    <img src={bagIcon} alt="coins" className="coin-icon" style={{ width: '16px', imageRendering: 'pixelated' }} />
                                    {trainer.reward}
                                </span>
                            </div>
                        </div>

                        <div className="trainer-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                            <Link to={`/trainer-chat/${trainer.id}`} className="btn-kenney success" style={{ textDecoration: 'none', textAlign: 'center', padding: '0.5rem' }}>
                                💬 Praten
                            </Link>
                            <Link to={`/trainer-battle/${trainer.id}`} className="btn-kenney primary" style={{ textDecoration: 'none', textAlign: 'center', padding: '0.5rem' }}>
                                ⚔️ Uitdagen
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link
                    to="/battle-modes"
                    className="btn-kenney neutral"
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                    ⬅️ Terug
                </Link>
            </div>
        </div>
    );
}
