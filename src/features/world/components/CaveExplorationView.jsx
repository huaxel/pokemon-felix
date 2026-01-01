export function CaveExplorationView({
    depth,
    onExplore,
    onExit,
    onReturn
}) {
    return (
        <div className="exploration-view">
            <div className="cave-visual">
                <div className={`depth-indicator depth-${Math.min(5, Math.floor(depth / 20))}`}>
                    {depth === 0 ? 'Entrance' : `Depth: ${depth}m`}
                </div>
            </div>

            <div className="cave-actions">
                <button className="explore-btn" onClick={onExplore}>
                    Go Deeper... 🔦
                </button>
                <div className="minor-actions">
                    {depth > 0 && (
                        <button className="return-entrance-btn" onClick={onReturn}>
                            Back to Entrance
                        </button>
                    )}
                    <button className="exit-btn" onClick={onExit}>
                        Leave Cave
                    </button>
                </div>
            </div>

            <p className="cave-hint">
                The deeper you go, the rarer the Pokemon... but it gets harder to find them!
            </p>
        </div>
    );
}
