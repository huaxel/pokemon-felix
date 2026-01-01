import { Link } from 'react-router-dom';

export function GachaResult({ result, autoEquipped, onReset }) {
    if (!result) return null;

    return (
        <div className={`result-container ${result.rarity || 'common'}`}>
            <div className="result-glow"></div>
            {result.type === 'item' ? (
                <img src={result.image} alt="" className="result-item-img" />
            ) : (
                <img
                    src={result.sprites.front_default}
                    alt={result.name}
                    className={`result-pokemon ${result.isShiny ? 'shiny-effect' : ''}`}
                />
            )}
            <h2>{result.name}</h2>
            {result.description && <p className="result-desc">{result.description}</p>}
            <span className="rarity-badge">{result.rarity || 'Gevonden!'}</span>

            {autoEquipped && (
                <div className="auto-equip-msg">
                    ¡Añadido a tu equipo!
                </div>
            )}

            <div className="gacha-actions">
                <button className="reset-gacha-btn" onClick={onReset}>
                    Opnieuw proberen
                </button>
                <Link to="/adventure" className="squad-link-btn">
                    Wereld
                </Link>
            </div>
        </div>
    );
}
