import './HPBar.css';

/**
 * Reusable HP Bar component
 * Extracted from CardBattle to follow DRY principle
 * 
 * @param {number} current - Current HP value
 * @param {number} max - Maximum HP value
 * @param {string} label - Optional label to display
 * @param {string} className - Optional additional CSS class
 */
export function HPBar({ current, max, label, className = '' }) {
    const percentage = max > 0 ? (current / max) * 100 : 0;

    return (
        <div className={`hp-display ${className}`}>
            {label && <span className="hp-label">{label}</span>}
            <span className="hp-text">{current}/{max} HP</span>
            <div className="hp-bar">
                <div
                    className="hp-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
