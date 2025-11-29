import React from 'react';
import { BattleArena } from './BattleArena';

export function BattlePage({ allPokemon }) {
    return (
        <div className="battle-page">
            <div className="battle-container">
                <h1>Arena de Batalla</h1>
                <p>¡Elige tus Pokémon para luchar!</p>
                <BattleArena allPokemon={allPokemon} />
            </div>
        </div>
    );
}
