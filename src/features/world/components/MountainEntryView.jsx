
export function MountainEntryView({ hasBoots, zones, onStartHike }) {
    return (
        <div className="mountain-page">
            <div className="mountain-header">
                <h1>⛰️ Mystieke Berg</h1>
                <p>Een legendarische top waar zeldzame Pokémon wonen</p>
            </div>

            {!hasBoots ? (
                <div className="mountain-warning">
                    <h2>🚫 Je hebt wandelschoenen nodig!</h2>
                    <p>Je moet wandelschoenen vinden en verzamelen voordat je de berg kunt beklimmen.</p>
                    <p className="tip">💡 Wandelschoenen zijn te vinden op speciale locaties of te koop in de winkel.</p>
                </div>
            ) : (
                <div className="mountain-intro">
                    <h2>Klaar om te klimmen?</h2>
                    <p>
                        De berg heeft 4 hoogtezones. Elke zone is moeilijker maar heeft zeldzamere Pokémon!
                    </p>

                    <div className="altitude-zones">
                        {zones.map((zone, idx) => (
                            <div key={idx} className="zone-card">
                                <h3>{zone.name}</h3>
                                <p>{zone.description}</p>
                                <div className="zone-stats">
                                    <span>Gevaar: {zone.danger}</span>
                                    <span className="pokemon-preview">
                                        {zone.pokemon.slice(0, 2).map(p => `${p} `)}
                                        {zone.pokemon.length > 2 && `+ ${zone.pokemon.length - 2} meer`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mountain-tips">
                        <h3>📚 Voordat je gaat:</h3>
                        <ul>
                            <li>🥾 Je hebt wandelschoenen aan</li>
                            <li>⛅ De berg wordt moeilijker naarmate je hoger klimt</li>
                            <li>😴 Rust uit als je moe bent om verder te klimmen</li>
                            <li>💰 Bereik de top voor 1000 munten!</li>
                            <li>🔔 Vang Pokémon op elke hoogte</li>
                        </ul>
                    </div>

                    <button className="start-hike-btn btn-kenney primary" onClick={onStartHike}>
                        🥾 Start Klimmen
                    </button>
                </div>
            )}
        </div>
    );
}
