import { useState } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { PiggyBank, TrendingUp, Calendar } from 'lucide-react';
import { BankTransactionSection } from '../components/BankTransactionSection';
import { WorldPageHeader } from '../components/WorldPageHeader';
import './BankPage.css';

const MIN_DEPOSIT = 10;

export function BankPage() {
    const {
        coins, // Keep coins for quick actions calculation
        bankBalance,
        deposit,
        withdraw,
        interestRate,
        showSuccess,
        showError
    } = usePokemonContext();

    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [showInfo, setShowInfo] = useState(false);


    const handleDeposit = () => {
        const amount = parseInt(depositAmount);
        if (deposit(amount)) {
            setDepositAmount('');
            showSuccess(`Has depositado ${amount} monedas`);
        } else {
            showError('No tienes suficientes monedas');
        }
    };

    const handleWithdraw = () => {
        const amount = parseInt(withdrawAmount);
        if (withdraw(amount)) {
            setWithdrawAmount('');
            showSuccess(`Has retirado ${amount} monedas`);
        } else {
            showError('Fondos insuficientes');
        }
    };

    return (
        <div className="bank-page">
            <WorldPageHeader
                title="Banco Pokémon"
                icon={<PiggyBank size={32} />}
            />

            <div className="bank-balance-card">
                <div className="balance-header"><h2>Ahorros</h2><button className="info-button" onClick={() => setShowInfo(!showInfo)}>?</button></div>
                <div className="balance-amount"><PiggyBank size={48} /><span className="amount">{bankBalance}</span></div>
                {showInfo && <div className="info-box"><h3>¿Cómo funciona?</h3><p>💰 Gana {(interestRate * 100).toFixed(0)}% de interés diario</p></div>}
            </div>

            {bankBalance > 0 && (
                <div className="interest-projection">
                    <h3><TrendingUp size={20} /> Ganancias Proyectadas</h3>
                    <div className="projection-grid">
                        <div className="projection-item"><Calendar size={24} /><div><span>Mañana</span><span>+{Math.floor(bankBalance * interestRate)}</span></div></div>
                        <div className="projection-item"><Calendar size={24} /><div><span>Semana</span><span>+{Math.floor(bankBalance * interestRate * 7)}</span></div></div>
                    </div>
                </div>
            )}

            <BankTransactionSection title="Depositar" description={`Interés diario del ${(interestRate * 100).toFixed(0)}%`} value={depositAmount} onChange={setDepositAmount} onAction={handleDeposit} buttonText="Depositar" disabled={!depositAmount || parseInt(depositAmount) < MIN_DEPOSIT} className="deposit-button" quickActions={(pct) => setDepositAmount(Math.floor(coins * pct).toString())} />

            <BankTransactionSection title="Retirar" description="Retira tus ahorros" value={withdrawAmount} onChange={setWithdrawAmount} onAction={handleWithdraw} buttonText="Retirar" disabled={!withdrawAmount || parseInt(withdrawAmount) > bankBalance} className="withdraw-button" />

            <div className="tips-section"><h3>💡 Consejos</h3><div className="tips-grid"><div className="tip-card"><p>Ahorra para metas grandes</p></div><div className="tip-card"><p>El interés compuesto es genial</p></div></div></div>
        </div>
    );
}
