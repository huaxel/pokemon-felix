import React from 'react';
import { Link } from 'react-router-dom';
import './BattleSelectionPage.css';

export function BattleSelectionPage() {
    return (
        <div className="battle-selection-page">
            <div className="battle-header">
                <h1>Modos de Batalla</h1>
                <p>Elige tu desafío</p>
            </div>

            <div className="battle-modes-container">
                <Link to="/tournament" className="battle-mode-card tournament">
                    <div className="mode-icon">🏆</div>
                    <div className="mode-content">
                        <h2>Torneo</h2>
                        <p>Enfréntate a 8 entrenadores en un torneo de eliminación directa.</p>
                        <div className="mode-rewards">
                            <span className="reward-label">Recompensa:</span>
                            <span className="reward-value">200 🪙</span>
                        </div>
                    </div>
                    <div className="mode-action">
                        Entrar al Torneo
                    </div>
                </Link>

                <Link to="/single-battle" className="battle-mode-card quick-battle">
                    <div className="mode-icon">⚔️</div>
                    <div className="mode-content">
                        <h2>Batalla Rápida</h2>
                        <p>Un combate rápido contra un oponente aleatorio.</p>
                        <div className="mode-rewards">
                            <span className="reward-label">Recompensa:</span>
                            <span className="reward-value">50 🪙</span>
                        </div>
                    </div>
                    <div className="mode-action">
                        Luchar Ahora
                    </div>
                </Link>
            </div>
        </div>
    );
}
