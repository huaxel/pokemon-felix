import houseImage from '../../../assets/buildings/house.png';
import treeImage from '../../../assets/buildings/tree.png';

export function MovementControls({
    movePlayer,
    isBuildMode,
    setIsBuildMode,
    selectedBuilding,
    setSelectedBuilding
}) {
    return (
        <div className="controls-panel">
            <div className="d-pad">
                <button onClick={() => movePlayer(0, -1)}>UP</button>
                <div className="d-pad-mid">
                    <button onClick={() => movePlayer(-1, 0)} style={{ marginRight: '60px' }}>LEFT</button>
                    <button onClick={() => movePlayer(1, 0)}>RIGHT</button>
                </div>
                <button onClick={() => movePlayer(0, 1)}>DOWN</button>
            </div>

            <div className="build-controls" style={{ marginTop: '2rem', borderTop: '2px solid rgba(0,0,0,0.1)', paddingTop: '1rem' }}>
                <button
                    className={`btn-kenney ${isBuildMode ? 'danger active' : 'success'}`}
                    onClick={() => setIsBuildMode(!isBuildMode)}
                    style={{ width: '100%', marginBottom: '1rem' }}
                >
                    {isBuildMode ? 'CERRAR BUILD' : 'MODO CONSTRUIR'}
                </button>

                {isBuildMode && (
                    <div className="build-palette" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                            className={`btn-kenney ${selectedBuilding === 'house' ? 'success' : ''}`}
                            onClick={() => setSelectedBuilding('house')}
                            style={{ padding: '0.5rem' }}
                        ><img src={houseImage} alt="house" className="build-icon" style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }} /></button>
                        <button
                            className={`btn-kenney ${selectedBuilding === 'tree' ? 'success' : ''}`}
                            onClick={() => setSelectedBuilding('tree')}
                            style={{ padding: '0.5rem' }}
                        ><img src={treeImage} alt="tree" className="build-icon" style={{ width: '32px', height: '32px', imageRendering: 'pixelated' }} /></button>
                        <button
                            className={`btn-kenney ${selectedBuilding === 'path' ? 'success' : ''}`}
                            onClick={() => setSelectedBuilding('path')}
                            style={{ padding: '0.5rem', fontWeight: 'bold' }}
                        >PATH</button>
                    </div>
                )}
            </div>
        </div>
    );
}
