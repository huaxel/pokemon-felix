
export function InteriorModal({ showInterior, setShowInterior }) {
    if (!showInterior) return null;

    return (
        <div className="interior-modal">
            <div className="room-content">
                <h2>Felix zijn Kamer</h2>
                <div className="pixel-bed">Bed</div>
                <div className="pixel-tv">TV</div>
                <p>Lekker knus! Hier kan Felix uitrusten na het avontuur.</p>
                <button className="close-room-btn" onClick={() => setShowInterior(false)}>Naar Buiten</button>
            </div>
        </div>
    );
}
