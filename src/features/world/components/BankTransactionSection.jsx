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
    quickActions
}) {
    return (
        <div className="transaction-section">
            <h3>{title}</h3>
            <p className="section-description">{description}</p>

            {quickActions && (
                <div className="quick-actions">
                    <button onClick={() => quickActions(0.25)}>25%</button>
                    <button onClick={() => quickActions(0.5)}>50%</button>
                    <button onClick={() => quickActions(0.75)}>75%</button>
                    <button onClick={() => quickActions(1)}>Todo</button>
                </div>
            )}

            <div className="transaction-form">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={title === 'Depositar' ? 'Mínimo 10' : 'Cantidad'}
                />
                <button
                    onClick={onAction}
                    disabled={disabled}
                    className={className}
                >
                    <ArrowRight size={20} />
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
