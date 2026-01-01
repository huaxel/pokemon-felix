export function WaterIntroView({ onLearn, onExit }) {
    return (
        <div className="water-route-page intro">
            <div className="surf-lesson">
                <h1>🌊 Water Route</h1>
                <div className="water-scene"><div className="water-animation" /><p className="water-text">A vast expanse of water blocks your path...</p></div>
                <div className="surf-info">
                    <h2>Learn SURF?</h2>
                    <p>Surf allows you to travel across water and discover new areas!</p>
                    <ul><li>🌊 Encounter water-type Pokemon</li><li>💎 Find hidden treasures</li><li>🗺️ Explore new locations</li></ul>
                </div>
                <button className="learn-surf-btn" onClick={onLearn}>🏄 Learn SURF</button>
                <button className="back-btn" onClick={onExit}>← Back</button>
            </div>
        </div>
    );
}
