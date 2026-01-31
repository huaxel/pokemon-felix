import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { usePlayer } from '../../../hooks/usePlayer';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { WorldPageHeader } from '../components/WorldPageHeader';
import shopUrbanImage from '../../../assets/buildings/shop_urban.png';
import './WardrobePage.css';

const OUTFITS = [
    { id: 'default', name: 'Rojo Pasión', color: '#ef4444', price: 0, desc: 'El clásico color de entrenador.' },
    { id: 'cool', name: 'Azul Hielo', color: '#3b82f6', price: 500, desc: 'Fresco y relajado.' },
    { id: 'nature', name: 'Verde Bosque', color: '#22c55e', price: 500, desc: 'Perfecto para explorar.' },
    { id: 'shiny', name: 'Amarillo Rayo', color: '#eab308', price: 1000, desc: '¡Destaca entre la multitud!' },
    { id: 'ninja', name: 'Negro Sombra', color: '#1e293b', price: 1500, desc: 'Sigiloso como un ninja.' },
    { id: 'pink', name: 'Rosa Chic', color: '#ec4899', price: 800, desc: 'Fabuloso y llamativo.' },
];

export function WardrobePage() {
    const { showSuccess, showError } = useToast();
    const { playerColor, setPlayerColor } = usePlayer();
    const { coins, spendCoins } = usePokemonContext();
    const [ownedOutfits, setOwnedOutfits] = useState(['default']); // Simple local state for now

    const handleBuy = (outfit) => {
        if (coins >= outfit.price) {
            if (spendCoins(outfit.price)) {
                setOwnedOutfits([...ownedOutfits, outfit.id]);
                showSuccess(`¡Compraste ${outfit.name}!`);
            }
        } else {
            showError('No tienes suficientes monedas.');
        }
    };

    const handleEquip = (outfitId, color) => {
        setPlayerColor(color);
        showSuccess('¡Te has cambiado de ropa!');
    };

    return (
        <div className="wardrobe-page">
            <WorldPageHeader title="Boutique de Moda" icon="👗" />


            <div className="wardrobe-content">
                <div className="outfit-preview">
                    <img src={shopUrbanImage} alt="Shop" className="shop-bg" />
                    <div className="character-preview" style={{ backgroundColor: playerColor }}>
                        {/* Simple pixel character representation */}
                        <div className="pixel-char"></div>
                    </div>
                </div>

                <div className="outfits-grid">
                    {OUTFITS.map(outfit => {
                        const isOwned = ownedOutfits.includes(outfit.id);
                        const isEquipped = playerColor === outfit.color;

                        return (
                            <div key={outfit.id} className="outfit-card">
                                <div className="color-swatch" style={{ backgroundColor: outfit.color }}></div>
                                <div className="outfit-info">
                                    <h3>{outfit.name}</h3>
                                    <p>{outfit.desc}</p>
                                </div>
                                <div className="outfit-action">
                                    {isOwned ? (
                                        <button
                                            className={`action-btn ${isEquipped ? 'equipped' : 'equip'}`}
                                            onClick={() => !isEquipped && handleEquip(outfit.id, outfit.color)}
                                            disabled={isEquipped}
                                        >
                                            {isEquipped ? <><Check size={16} /> Puesto</> : 'Ponerse'}
                                        </button>
                                    ) : (
                                        <button className="action-btn buy" onClick={() => handleBuy(outfit)}>
                                            <ShoppingBag size={16} /> {outfit.price}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
