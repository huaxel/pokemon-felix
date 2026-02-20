import { useState } from 'react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { PiggyBank, TrendingUp, Calendar } from 'lucide-react';
import { BankTransactionSection } from '../components/BankTransactionSection';
import { WorldPageHeader } from '../components/WorldPageHeader';
import { grassTile, bagIcon } from '../worldAssets';
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
    showError,
  } = usePokemonContext();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (deposit(amount)) {
      setDepositAmount('');
      showSuccess(`${amount} munten gestort`);
    } else {
      showError('Niet genoeg munten');
    }
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (withdraw(amount)) {
      setWithdrawAmount('');
      showSuccess(`${amount} munten opgenomen`);
    } else {
      showError('Saldo ontoereikend');
    }
  };

  return (
    <div
      className="bank-page"
      style={{
        backgroundColor: '#2d1810',
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
        minHeight: '100vh',
      }}
    >
      <WorldPageHeader title="Pokémon Bank" icon={<PiggyBank size={24} />} />

      <div
        className="bank-content"
        style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}
      >
        <div
          className="bank-balance-card game-panel-dark"
          style={{
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'center',
            border: '4px solid #000',
          }}
        >
          <div
            className="balance-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '1rem',
                color: '#fbbf24',
              }}
            >
              Spaarrekening
            </h2>
            <button
              className="btn-kenney neutral"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
              onClick={() => setShowInfo(!showInfo)}
            >
              ?
            </button>
          </div>
          <div
            className="balance-amount"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              fontSize: '2rem',
              color: '#fff',
              fontFamily: '"Press Start 2P", cursive',
            }}
          >
            <PiggyBank size={48} />
            <span className="amount">{bankBalance}</span>
          </div>
          {showInfo && (
            <div
              className="info-box"
              style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            >
              <h3 style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Hoe werkt het?</h3>
              <p
                style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <img
                  src={bagIcon}
                  alt="coins"
                  style={{ width: '16px', height: '16px', imageRendering: 'pixelated' }}
                />
                Verdien {(interestRate * 100).toFixed(0)}% rente per dag
              </p>
            </div>
          )}
        </div>

        {bankBalance > 0 && (
          <div
            className="interest-projection game-panel"
            style={{ padding: '1.5rem', marginBottom: '2rem' }}
          >
            <h3
              style={{
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <TrendingUp size={20} /> Verwachte Winst
            </h3>
            <div
              className="projection-grid"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
            >
              <div
                className="projection-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                }}
              >
                <Calendar size={24} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Morgen</span>
                  <span
                    style={{
                      fontFamily: '"Press Start 2P", cursive',
                      fontSize: '0.8rem',
                      color: '#16a34a',
                    }}
                  >
                    +{Math.floor(bankBalance * interestRate)}
                  </span>
                </div>
              </div>
              <div
                className="projection-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                }}
              >
                <Calendar size={24} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Deze week</span>
                  <span
                    style={{
                      fontFamily: '"Press Start 2P", cursive',
                      fontSize: '0.8rem',
                      color: '#16a34a',
                    }}
                  >
                    +{Math.floor(bankBalance * interestRate * 7)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <BankTransactionSection
          title="Storten"
          description={`Dagelijkse rente van ${(interestRate * 100).toFixed(0)}%`}
          value={depositAmount}
          onChange={setDepositAmount}
          onAction={handleDeposit}
          buttonText="Storten"
          disabled={!depositAmount || parseInt(depositAmount) < MIN_DEPOSIT}
          className="deposit-button"
          quickActions={pct => setDepositAmount(Math.floor(coins * pct).toString())}
        />

        <BankTransactionSection
          title="Opnemen"
          description="Neem je spaargeld op"
          value={withdrawAmount}
          onChange={setWithdrawAmount}
          onAction={handleWithdraw}
          buttonText="Opnemen"
          disabled={!withdrawAmount || parseInt(withdrawAmount) > bankBalance}
          className="withdraw-button"
        />

        <div className="tips-section game-panel" style={{ padding: '1.5rem' }}>
          <h3
            style={{
              fontFamily: '"Press Start 2P", cursive',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            💡 Tips
          </h3>
          <div
            className="tips-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
          >
            <div
              className="tip-card"
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '0.8rem',
              }}
            >
              <p>Spaar voor grote doelen</p>
            </div>
            <div
              className="tip-card"
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '0.8rem',
              }}
            >
              <p>Rente op rente is geweldig</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
