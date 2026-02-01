import { centerImage, gymImage, marketImage, gachaImage, treeImage, waterImage, pathTile, grassTile } from '../worldAssets';

export function MapLegend() {
    return (
        <div className="map-legend game-panel" style={{ 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '1rem', 
            maxWidth: '100%',
            backgroundColor: '#fff',
            border: '4px solid #334155'
        }}>
            <h4 style={{ 
                marginBottom: '1rem', 
                fontFamily: '"Press Start 2P", cursive', 
                fontSize: '0.8rem', 
                textAlign: 'center',
                color: '#1e293b'
            }}>🗺️ Legenda</h4>
            <div className="legend-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
                gap: '0.5rem' 
            }}>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                    <img src={grassTile} alt="grass" style={{ width: '24px', height: '24px', imageRendering: 'pixelated', border: '1px solid #ccc' }} /> 
                    <span>Gras</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                    <img src={pathTile} alt="path" style={{ width: '24px', height: '24px', imageRendering: 'pixelated', border: '1px solid #ccc' }} /> 
                    <span>Pad</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                    <img src={waterImage} alt="water" style={{ width: '24px', height: '24px', imageRendering: 'pixelated', border: '1px solid #ccc' }} /> 
                    <span>Water</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                    <img src={centerImage} alt="center" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} /> 
                    <span>Centrum</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                    <img src={gymImage} alt="gym" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} /> 
                    <span>Gym</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                    <img src={marketImage} alt="market" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} /> 
                    <span>Markt</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                    <img src={gachaImage} alt="gacha" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} /> 
                    <span>Gacha</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem' }}>
                    <img src={treeImage} alt="tree" style={{ width: '24px', height: '24px', imageRendering: 'pixelated' }} /> 
                    <span>Bos</span>
                </div>
            </div>
            <p className="legend-hint" style={{ 
                marginTop: '1rem', 
                opacity: 0.8, 
                fontSize: '0.7rem', 
                textAlign: 'center', 
                fontStyle: 'italic',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '0.5rem'
            }}>Gebruik pijltjestoetsen of D-Pad om te bewegen.</p>
        </div>
    );
}
