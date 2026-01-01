import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { ShoppingBag, Check } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import './WardrobePage.css';

const OUTFITS = [
    { id: 'default', name: 'Clásico', price: 0, color: '#ef4444' },
    { id: 'cool', name: 'Estilo Azul', price: 100, color: '#3b82f6' },
    { id: 'nature', name: 'Explorador', price: 150, color: '#22c55e' },
    { id: 'shiny', name: 'Dorado Especial', price: 500, color: '#eab308' },
    { id: 'ninja', name: 'Ninja Sombra', price: 300, color: '#1e293b' }
];

export function WardrobePage() {
    const { coins, spendCoins } = usePokemonContext();
    const [ownedOutfits, setOwnedOutfits] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.OWNED_OUTFITS);
        return saved ? JSON.parse(saved) : ['default'];
    });
    const [currentOutfit, setCurrentOutfit] = useState(() => {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_OUTFIT) || 'default';
    });
    const [message, setMessage] = useState(null);

    const handlePurchase = (outfit) => {
        if (ownedOutfits.includes(outfit.id)) {
            // Equip
            setCurrentOutfit(outfit.id);
            localStorage.setItem(STORAGE_KEYS.CURRENT_OUTFIT, outfit.id);
            window.dispatchEvent(new Event('outfit_changed'));
            setMessage(`¡Te has puesto el traje: ${outfit.name}!`);
        } else {
            // Buy
            if (coins >= outfit.price) {
                if (spendCoins(outfit.price)) {
                    const newOwned = [...ownedOutfits, outfit.id];
                    setOwnedOutfits(newOwned);
                    localStorage.setItem(STORAGE_KEYS.OWNED_OUTFITS, JSON.stringify(newOwned));
                    setCurrentOutfit(outfit.id);
                    localStorage.setItem(STORAGE_KEYS.CURRENT_OUTFIT, outfit.id);
                    window.dispatchEvent(new Event('outfit_changed'));
                    setMessage(`¡Has comprado el traje: ${outfit.name}! 👕`);
                }
            } else {
                setMessage('❌ ¡No tienes suficientes monedas!');
            }
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const selectedOutfitData = OUTFITS.find(o => o.id === currentOutfit);

    return (
        <div className="wardrobe-page">
            <header className="wardrobe-header">
                <Link to="/adventure" className="back-btn">Terug naar Wereld</Link>
                <h1><ShoppingBag /> Boutique de Felix</h1>
                <div className="coin-balance"><img src={bagIcon} alt="coins" /> {coins}</div>
            </header>

            {message && <div className="wardrobe-message">{message}</div>}

            <div className="preview-section">
                <div className="avatar-preview" style={{ backgroundColor: selectedOutfitData?.color }}>
                    <span className="avatar-char">P</span>
                </div>
                <h2>Vista Previa: {selectedOutfitData?.name}</h2>
            </div>

            <div className="outfit-grid">
                {OUTFITS.map(outfit => {
                    const isOwned = ownedOutfits.includes(outfit.id);
                    const isEquipped = currentOutfit === outfit.id;

                    return (
                        <div key={outfit.id} className={`outfit-card ${isEquipped ? 'equipped' : ''}`}>
                            <div className="outfit-color-box" style={{ backgroundColor: outfit.color }}>
                                {isEquipped && <Check size={32} color="white" />}
                            </div>
                            <h3>{outfit.name}</h3>
                            <button
                                className={`buy-equip-btn ${isEquipped ? 'active' : ''}`}
                                onClick={() => handlePurchase(outfit)}
                            >
                                {isEquipped ? 'Equipado' : isOwned ? 'Equipar' : `${outfit.price} Coins`}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
