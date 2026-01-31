import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { usePokemonContext } from '../../../hooks/usePokemonContext';
import { useToast } from '../../../hooks/useToast';
import { WorldPageHeader } from '../components/WorldPageHeader';
import shopUrbanImage from '../../../assets/buildings/shop_urban.png';
import './DecorShopPage.css';

const DECOR_ITEMS = [
    { id: 'plant', name: 'Planta Tropical', price: 200, icon: '🌿', desc: 'Da vida a tu hogar.' },
    { id: 'rug', name: 'Alfombra Persa', price: 400, icon: '🧶', desc: 'Suave y elegante.' },
    { id: 'lamp', name: 'Lámpara Lava', price: 350, icon: '💡', desc: 'Iluminación retro.' },
    { id: 'poster', name: 'Póster Pikachu', price: 150, icon: '🖼️', desc: '¡Pika pika!' },
    { id: 'chair', name: 'Sillón Gamer', price: 800, icon: '💺', desc: 'Máxima comodidad.' },
    { id: 'fishtank', name: 'Pecera Magikarp', price: 1200, icon: '🐟', desc: 'Relajante observación.' },
];

export function DecorShopPage() {
    const { coins, spendCoins } = usePokemonContext();
    const { showSuccess, showError } = useToast();

    const handleBuy = (item) => {
        if (coins >= item.price) {
            if (spendCoins(item.price)) {
                showSuccess(`¡Compraste ${item.name}! (Enviado a casa)`);
            }
        } else {
            showError('No tienes suficientes monedas.');
        }
    };

    return (
        <div className="decor-shop-page">
            <WorldPageHeader title="Muebles & Decoración" icon="🛋️" />


            <div className="decor-intro">
                <img src={shopUrbanImage} alt="Shop" className="shop-img" />
                <p>¡Decora tu base secreta con los mejores muebles!</p>
            </div>

            <div className="catalog-grid">
                {DECOR_ITEMS.map(item => (
                    <div key={item.id} className="catalog-item">
                        <div className="item-icon">{item.icon}</div>
                        <h3>{item.name}</h3>
                        <p>{item.desc}</p>
                        <div className="price-tag">{item.price} monedas</div>
                        <button className="buy-decor-btn" onClick={() => handleBuy(item)}>
                            <ShoppingCart size={18} /> Comprar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
