import { ArrowRight } from 'lucide-react';

export function BankTransactionSection({
  title,
  description,
  value,
  onChange,
  onAction,
  buttonText,
  disabled,
  className,
  quickActions,
}) {
  return (
    <div
      className="transaction-section game-panel"
      style={{ padding: '1.5rem', marginBottom: '1.5rem' }}
    >
      <h3
        style={{
          fontFamily: 'var(--header-font)',
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <p
        className="section-description"
        style={{ fontSize: '0.8rem', marginBottom: '1rem', color: '#475569' }}
      >
        {description}
      </p>

      {quickActions && (
        <div
          className="quick-actions"
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}
        >
          <button
            className="btn-kenney neutral"
            style={{ fontSize: '0.7rem', padding: '0.5rem' }}
            onClick={() => quickActions(0.25)}
          >
            25%
          </button>
          <button
            className="btn-kenney neutral"
            style={{ fontSize: '0.7rem', padding: '0.5rem' }}
            onClick={() => quickActions(0.5)}
          >
            50%
          </button>
          <button
            className="btn-kenney neutral"
            style={{ fontSize: '0.7rem', padding: '0.5rem' }}
            onClick={() => quickActions(0.75)}
          >
            75%
          </button>
          <button
            className="btn-kenney neutral"
            style={{ fontSize: '0.7rem', padding: '0.5rem' }}
            onClick={() => quickActions(1)}
          >
            Alles
          </button>
        </div>
      )}

      <div className="transaction-form" style={{ display: 'flex', gap: '1rem' }}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={title === 'Storten' ? 'Minimaal 10' : 'Bedrag'}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '2px solid #ccc',
            borderRadius: '4px',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '0.8rem',
          }}
        />
        <button
          onClick={onAction}
          disabled={disabled}
          className={`btn-kenney primary ${className}`}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
        >
          <ArrowRight size={16} />
          {buttonText}
        </button>
      </div>
    </div>
  );
}
