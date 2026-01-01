import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { STORAGE_KEYS } from '../../lib/constants';
import { PiggyBank, TrendingUp, Coins, ArrowRight, Calendar } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import './BankPage.css';

const INTEREST_RATE = 0.02; // 2% interest per day
const MIN_DEPOSIT = 10;

export function BankPage() {
    const { coins, addCoins, removeCoins } = usePokemonContext();
    const [bankBalance, setBankBalance] = useState(0);
    const [lastInterestDate, setLastInterestDate] = useState(null);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [message, setMessage] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    // Load bank data from localStorage
    useEffect(() => {
        const savedBalance = parseInt(localStorage.getItem(STORAGE_KEYS.BANK_BALANCE) || '0');
        const savedDate = localStorage.getItem(STORAGE_KEYS.BANK_LAST_INTEREST);
        setBankBalance(savedBalance);
        setLastInterestDate(savedDate);
    }, []);

    // Calculate and apply interest if a day has passed
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
                    showMessage(`¡Interés ganado! +${interest} monedas`, 'success');
                }
            }
        }
    }, [bankBalance, lastInterestDate]);

    const showMessage = (msg, type = 'info') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleDeposit = () => {
        const amount = parseInt(depositAmount);
        
        if (isNaN(amount) || amount < MIN_DEPOSIT) {
            showMessage(`El depósito mínimo es ${MIN_DEPOSIT} monedas`, 'error');
            return;
        }

        if (amount > coins) {
            showMessage('No tienes suficientes monedas', 'error');
            return;
        }

        // Transfer coins to bank
        removeCoins(amount);
        const newBalance = bankBalance + amount;
        setBankBalance(newBalance);
        localStorage.setItem(STORAGE_KEYS.BANK_BALANCE, newBalance.toString());
        
        // Set interest date if first deposit
        if (!lastInterestDate) {
            const today = new Date().toDateString();
            localStorage.setItem(STORAGE_KEYS.BANK_LAST_INTEREST, today);
            setLastInterestDate(today);
        }

        showMessage(`Depositado: ${amount} monedas`, 'success');
        setDepositAmount('');
    };

    const handleWithdraw = () => {
        const amount = parseInt(withdrawAmount);
        
        if (isNaN(amount) || amount <= 0) {
            showMessage('Ingresa una cantidad válida', 'error');
            return;
        }

        if (amount > bankBalance) {
            showMessage('Saldo insuficiente en el banco', 'error');
            return;
        }

        // Transfer from bank to wallet
        addCoins(amount);
        const newBalance = bankBalance - amount;
        setBankBalance(newBalance);
        localStorage.setItem(STORAGE_KEYS.BANK_BALANCE, newBalance.toString());

        showMessage(`Retirado: ${amount} monedas`, 'success');
        setWithdrawAmount('');
    };

    const calculateNextDayInterest = () => {
        return Math.floor(bankBalance * INTEREST_RATE);
    };

    const calculateWeeklyInterest = () => {
        return Math.floor(bankBalance * INTEREST_RATE * 7);
    };

    const quickDeposit = (percentage) => {
        const amount = Math.floor(coins * percentage);
        if (amount >= MIN_DEPOSIT) {
            setDepositAmount(amount.toString());
        } else {
            showMessage(`Necesitas al menos ${MIN_DEPOSIT} monedas`, 'error');
        }
    };

    return (
        <div className="bank-page">
            <header className="bank-header">
                <Link to="/world" className="back-button">
                    <img src={bagIcon} alt="Mochila" />
                </Link>
                <h1>
                    <PiggyBank size={32} />
                    Banco Pokémon
                </h1>
                <div className="wallet-info">
                    <Coins size={20} />
                    <span>{coins}</span>
                </div>
            </header>

            {message && (
                <div className={`bank-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Bank Balance Card */}
            <div className="bank-balance-card">
                <div className="balance-header">
                    <h2>Tu Cuenta de Ahorros</h2>
                    <button 
                        className="info-button"
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        ?
                    </button>
                </div>
                <div className="balance-amount">
                    <PiggyBank size={48} />
                    <span className="amount">{bankBalance}</span>
                    <span className="label">monedas guardadas</span>
                </div>
                
                {showInfo && (
                    <div className="info-box">
                        <h3>¿Cómo funciona?</h3>
                        <p>💰 Guarda tus monedas aquí y gana interés diario</p>
                        <p>📈 Interés: {(INTEREST_RATE * 100).toFixed(0)}% cada día</p>
                        <p>🎯 Cuanto más tiempo ahorres, ¡más ganas!</p>
                        <p>💡 Aprende sobre ahorro y paciencia</p>
                    </div>
                )}
            </div>

            {/* Interest Projection */}
            {bankBalance > 0 && (
                <div className="interest-projection">
                    <h3>
                        <TrendingUp size={20} />
                        Ganancias Proyectadas
                    </h3>
                    <div className="projection-grid">
                        <div className="projection-item">
                            <Calendar size={24} />
                            <div>
                                <span className="projection-label">Mañana</span>
                                <span className="projection-value">+{calculateNextDayInterest()}</span>
                            </div>
                        </div>
                        <div className="projection-item">
                            <Calendar size={24} />
                            <div>
                                <span className="projection-label">En 7 días</span>
                                <span className="projection-value">+{calculateWeeklyInterest()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Deposit Section */}
            <div className="transaction-section">
                <h3>Depositar</h3>
                <p className="section-description">
                    Guarda monedas y gana {(INTEREST_RATE * 100).toFixed(0)}% de interés cada día
                </p>
                
                <div className="quick-actions">
                    <button onClick={() => quickDeposit(0.25)}>25%</button>
                    <button onClick={() => quickDeposit(0.5)}>50%</button>
                    <button onClick={() => quickDeposit(0.75)}>75%</button>
                    <button onClick={() => quickDeposit(1)}>Todo</button>
                </div>

                <div className="transaction-form">
                    <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={`Mínimo ${MIN_DEPOSIT}`}
                        min={MIN_DEPOSIT}
                    />
                    <button 
                        onClick={handleDeposit}
                        disabled={!depositAmount || parseInt(depositAmount) < MIN_DEPOSIT}
                        className="deposit-button"
                    >
                        <ArrowRight size={20} />
                        Depositar
                    </button>
                </div>
            </div>

            {/* Withdraw Section */}
            <div className="transaction-section">
                <h3>Retirar</h3>
                <p className="section-description">
                    Retira tus ahorros cuando los necesites
                </p>

                <div className="transaction-form">
                    <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Cantidad a retirar"
                        min="1"
                        max={bankBalance}
                    />
                    <button 
                        onClick={handleWithdraw}
                        disabled={!withdrawAmount || parseInt(withdrawAmount) > bankBalance}
                        className="withdraw-button"
                    >
                        <ArrowRight size={20} />
                        Retirar
                    </button>
                </div>
            </div>

            {/* Educational Tips */}
            <div className="tips-section">
                <h3>💡 Consejos de Ahorro</h3>
                <div className="tips-grid">
                    <div className="tip-card">
                        <span className="tip-icon">🎯</span>
                        <p>Ahorra para metas grandes, como comprar un Ultra Ball</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">⏰</span>
                        <p>Cuanto más tiempo dejes tu dinero, más crece</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">📊</span>
                        <p>El interés compuesto hace crecer tu dinero más rápido</p>
                    </div>
                    <div className="tip-card">
                        <span className="tip-icon">💪</span>
                        <p>Ahorrar requiere paciencia, ¡pero vale la pena!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
