export function FountainVisual({ animation }) {
    return (
        <div className={`fountain-visual ${animation ? 'wishing' : ''}`}>
            <div className="fountain-base">
                <div className="water-surface"></div>
                <div className="fountain-sparkle sparkle-1">✨</div>
                <div className="fountain-sparkle sparkle-2">💫</div>
                <div className="fountain-sparkle sparkle-3">⭐</div>
            </div>
            <p className="fountain-legend">
                Arroja una moneda y pide un deseo...
            </p>
        </div>
    );
}
