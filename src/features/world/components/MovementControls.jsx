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
                <button onClick={() => movePlayer(0, -1)}>Up</button>
                <div className="d-pad-mid">
                    <button onClick={() => movePlayer(-1, 0)}>Left</button>
                    <button onClick={() => movePlayer(1, 0)}>Right</button>
                </div>
                <button onClick={() => movePlayer(0, 1)}>Down</button>
            </div>

            <div className="build-controls">
                <button
                    className={`mode-btn ${isBuildMode ? 'active' : ''}`}
                    onClick={() => setIsBuildMode(!isBuildMode)}
                >
                    {isBuildMode ? 'Klaar met Bouwen' : 'Bouwen'}
                </button>

                {isBuildMode && (
                    <div className="build-palette">
                        <button
                            className={selectedBuilding === 'house' ? 'active' : ''}
                            onClick={() => setSelectedBuilding('house')}
                        ><img src={houseImage} alt="house" className="build-icon" /></button>
                        <button
                            className={selectedBuilding === 'tree' ? 'active' : ''}
                            onClick={() => setSelectedBuilding('tree')}
                        ><img src={treeImage} alt="tree" className="build-icon" /></button>
                        <button
                            className={selectedBuilding === 'path' ? 'active' : ''}
                            onClick={() => setSelectedBuilding('path')}
                        >Path</button>
                    </div>
                )}
            </div>
        </div>
    );
}
