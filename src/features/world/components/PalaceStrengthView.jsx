import { Shield, Crown, Zap } from 'lucide-react';

export function PalaceStrengthView({
    playerHP,
    legendaryHP,
    onAttack
}) {
    return (
        <div className="challenge-active strength">
            <h2>Batalla Legendaria ⚔️</h2>
            <div className="battle-field">
                <div className="battler player">
                    <Shield size={48} />
                    <div className="hp-bar">
                        <div className="hp-fill" style={{ width: `${playerHP}%` }} />
                    </div>
                    <span>Tu Equipo: {playerHP} HP</span>
                </div>
                <div className="vs">VS</div>
                <div className="battler legendary">
                    <Crown size={48} />
                    <div className="hp-bar">
                        <div className="hp-fill legendary" style={{ width: `${legendaryHP}%` }} />
                    </div>
                    <span>Legendario: {legendaryHP} HP</span>
                </div>
            </div>
            <button className="attack-button" onClick={onAttack}>
                <Zap size={24} />
                ¡Atacar!
            </button>
        </div>
    );
}
