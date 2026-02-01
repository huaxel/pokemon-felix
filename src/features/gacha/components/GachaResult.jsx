import { Link } from 'react-router-dom';

export function GachaResult({ result, autoEquipped, onReset }) {
    if (!result) return null;

    return (
        <div className={`result-container game-panel-dark ${result.rarity || 'common'}`}>
            <div className="result-glow"></div>
            {result.type === 'item' ? (
                <img src={result.image} alt="" className="result-item-img" style={{ imageRendering: 'pixelated' }} />
            ) : (
                <img
                    src={result.sprites.front_default}
                    alt={result.name}
                    className={`result-pokemon ${result.isShiny ? 'shiny-effect' : ''}`}
                    style={{ imageRendering: 'pixelated', width: '128px', height: '128px' }}
                />
            )}
            <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', marginTop: '1rem', textShadow: '2px 2px 0 #000' }}>{result.name}</h2>
            {result.description && <p className="result-desc">{result.description}</p>}
            <span className="rarity-badge" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.6rem' }}>{result.rarity || 'Gevonden!'}</span>

            {autoEquipped && (
                <div className="auto-equip-msg" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.6rem' }}>
                    Toegevoegd aan je team!
                </div>
            )}

            <div className="gacha-actions">
                <button className="reset-gacha-btn btn-kenney primary" onClick={onReset}>
                    Opnieuw proberen
                </button>
                <Link to="/adventure" className="squad-link-btn btn-kenney neutral" style={{ textDecoration: 'none' }}>
                    Wereld
                </Link>
            </div>
        </div>
    );
}
