import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { STORAGE_KEYS } from '../../lib/constants';
import { PiggyBank, TrendingUp, Coins, Calendar } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import { BankTransactionSection } from './components/BankTransactionSection';
import './BankPage.css';

const INTEREST_RATE = 0.02;
const MIN_DEPOSIT = 10;

export function BankPage() {
    const { coins, addCoins, removeCoins } = usePokemonContext();
    const [bankBalance, setBankBalance] = useState(0);
    const [lastInterestDate, setLastInterestDate] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [message, setMessage] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        setBankBalance(parseInt(localStorage.getItem(STORAGE_KEYS.BANK_BALANCE) || '0'));
        setLastInterestDate(localStorage.getItem(STORAGE_KEYS.BANK_LAST_INTEREST));
    }, []);

    useEffect(() => {
        if (bankBalance > 0 && lastInterestDate) {
            const today = new Date().toDateString();
            if (lastInterestDate !== today) {
                const interest = Math.floor(bankBalance * INTEREST_RATE);
                if (interest > 0) {
                    const newBalance = bankBalance + interest;
                    setBankBalance(newBalance);
                    localStorage.setItem(STORAGE_KEYS.BANK_BALANCE, newBalance.toString());
                    localStorage.setItem(STORAGE_KEYS.BANK_LAST_INTEREST, today);
                    setLastInterestDate(today);
                    setMessage({ text: `¡Interés ganado! +${interest}`, type: 'success' });
                    setTimeout(() => setMessage(null), 3000);
                }
            }
        }
    }, [bankBalance, lastInterestDate]);

    const handleDeposit = () => {
        const amount = parseInt(depositAmount);
        if (amount > coins) { setMessage({ text: 'No tienes monedas', type: 'error' }); return; }
        removeCoins(amount);
        const newBalance = bankBalance + amount;
        setBankBalance(newBalance);
        localStorage.setItem(STORAGE_KEYS.BANK_BALANCE, newBalance.toString());
        if (!lastInterestDate) {
            const today = new Date().toDateString();
            localStorage.setItem(STORAGE_KEYS.BANK_LAST_INTEREST, today);
            setLastInterestDate(today);
        }
        setDepositAmount('');
    };

    const handleWithdraw = () => {
        const amount = parseInt(withdrawAmount);
        if (amount > bankBalance) { setMessage({ text: 'Saldo insuficiente', type: 'error' }); return; }
        addCoins(amount);
        const newBalance = bankBalance - amount;
        setBankBalance(newBalance);
        localStorage.setItem(STORAGE_KEYS.BANK_BALANCE, newBalance.toString());
        setWithdrawAmount('');
    };

    return (
        <div className="bank-page">
            <header className="bank-header">
                <Link to="/world" className="back-button"><img src={bagIcon} alt="Mochila" /></Link>
                <h1><PiggyBank size={32} /> Banco Pokémon</h1>
                <div className="wallet-info"><Coins size={20} /><span>{coins}</span></div>
            </header>

            {message && <div className={`bank-message ${message.type}`}>{message.text}</div>}

            <div className="bank-balance-card">
                <div className="balance-header"><h2>Ahorros</h2><button className="info-button" onClick={() => setShowInfo(!showInfo)}>?</button></div>
                <div className="balance-amount"><PiggyBank size={48} /><span className="amount">{bankBalance}</span></div>
                {showInfo && <div className="info-box"><h3>¿Cómo funciona?</h3><p>💰 Gana {(INTEREST_RATE * 100).toFixed(0)}% de interés diario</p></div>}
            </div>

            {bankBalance > 0 && (
                <div className="interest-projection">
                    <h3><TrendingUp size={20} /> Ganancias Proyectadas</h3>
                    <div className="projection-grid">
                        <div className="projection-item"><Calendar size={24} /><div><span>Mañana</span><span>+{Math.floor(bankBalance * INTEREST_RATE)}</span></div></div>
                        <div className="projection-item"><Calendar size={24} /><div><span>Semana</span><span>+{Math.floor(bankBalance * INTEREST_RATE * 7)}</span></div></div>
                    </div>
                </div>
            )}

            <BankTransactionSection title="Depositar" description={`Interés diario del ${(INTEREST_RATE * 100).toFixed(0)}%`} value={depositAmount} onChange={setDepositAmount} onAction={handleDeposit} buttonText="Depositar" disabled={!depositAmount || parseInt(depositAmount) < MIN_DEPOSIT} className="deposit-button" quickActions={(pct) => setDepositAmount(Math.floor(coins * pct).toString())} />

            <BankTransactionSection title="Retirar" description="Retira tus ahorros" value={withdrawAmount} onChange={setWithdrawAmount} onAction={handleWithdraw} buttonText="Retirar" disabled={!withdrawAmount || parseInt(withdrawAmount) > bankBalance} className="withdraw-button" />

            <div className="tips-section"><h3>💡 Consejos</h3><div className="tips-grid"><div className="tip-card"><p>Ahorra para metas grandes</p></div><div className="tip-card"><p>El interés compuesto es genial</p></div></div></div>
        </div>
    );
}
