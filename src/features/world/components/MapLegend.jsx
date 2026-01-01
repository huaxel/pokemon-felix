import { centerImage, gymImage, marketImage, gachaImage, treeImage, waterImage, pathTile, grassTile } from '../worldAssets';

export function MapLegend() {
    return (
        <div className="map-legend">
            <h4>Mapa</h4>
            <div className="legend-row">
                <span className="legend-chip"><img src={grassTile} alt="grass" /> Prado</span>
                <span className="legend-chip"><img src={pathTile} alt="path" /> Camino</span>
                <span className="legend-chip"><img src={waterImage} alt="water" /> Agua</span>
            </div>
            <div className="legend-row">
                <span className="legend-chip"><img src={centerImage} alt="center" /> Centro</span>
                <span className="legend-chip"><img src={gymImage} alt="gym" /> Gimnasio</span>
                <span className="legend-chip"><img src={marketImage} alt="market" /> Mercado</span>
                <span className="legend-chip"><img src={gachaImage} alt="gacha" /> Gacha</span>
                <span className="legend-chip"><img src={treeImage} alt="tree" /> Árbol / bosque</span>
            </div>
            <p className="legend-hint">Click para moverte (adyacente) o construir en modo Build.</p>
        </div>
    );
}
