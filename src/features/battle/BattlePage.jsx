import { BattleArena } from './components/BattleArena';
import { grassTile } from '../world/worldAssets';

export function BattlePage({ allPokemon, onLoadMore }) {
    return (
        <div className="battle-page" style={{ 
            backgroundColor: '#2d1810',
            backgroundImage: `url(${grassTile})`,
            backgroundSize: '64px', // Scale up for retro look
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated'
        }}>
            <div className="battle-container">
                <h1 style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '2px 2px 0 #000' }}>Gevechtsarena</h1>
                <p style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem', color: '#fbbf24' }}>Kies je Pokémon om te vechten!</p>
                <BattleArena allPokemon={allPokemon} onLoadMore={onLoadMore} />
            </div>
        </div>
    );
}
