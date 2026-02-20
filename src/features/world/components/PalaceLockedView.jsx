import { Crown, Trophy } from 'lucide-react';
import { WorldPageHeader } from './WorldPageHeader';
import { grassTile } from '../worldAssets';

export function PalaceLockedView({ ownedCount }) {
  return (
    <div
      className="palace-page locked"
      style={{ backgroundImage: `url(${grassTile})`, imageRendering: 'pixelated' }}
    >
      <WorldPageHeader title="Paleis van de Kampioen" icon="👑" />

      <div className="locked-content">
        <Crown size={120} className="locked-icon" />
        <h2>Paleis Gesloten</h2>
        <p>Alleen kampioenen mogen deze heilige plaats betreden.</p>
        <div className="requirement">
          <Trophy size={24} />
          <span>Vang minstens 50 Pokémon</span>
        </div>
        <div className="progress">
          <span>{ownedCount} / 50</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (ownedCount / 50) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
