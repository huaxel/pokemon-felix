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

  // Determine color class based on percentage
  let barColorClass = 'bg-green-500'; // Default green (handled by CSS usually, but for pixel art we might use classes)
  if (percentage <= 20) barColorClass = 'critical';
  else if (percentage <= 50) barColorClass = 'warning';

  return (
    <div className={`hp-display ${className}`}>
      {label && <span className="hp-label">{label}</span>}
      <div className="stat-bar-pixel">
        <div
          className={`stat-bar-pixel-fill ${barColorClass}`}
          style={{ width: `${percentage}%` }}
        />
        <span className="stat-value">
          {current}/{max}
        </span>
      </div>
    </div>
  );
}
