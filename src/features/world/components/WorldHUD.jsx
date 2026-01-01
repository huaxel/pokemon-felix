
import { Trophy, MapPin, Navigation, Compass } from 'lucide-react';
import { SEASONS } from '../worldConstants';
import bagImage from '../../../assets/items/bag_icon.png';

export function WorldHUD({
    seasonIndex,
    prevSeason,
    nextSeason,
    isNight,
    toggleDayNight,
    autoTime,
    toggleAutoTime,
    navigate,
    setShowQuestLog,
    quests,
    playerPos,
    targetPos,
    gpsDistance,
    gpsDirection,
    generateRandomTarget,
    setGpsDistance,
    setGpsDirection,
    calculateDistance,
    getDirectionHint,
    showMessage
}) {
    return (
        <div className="season-hud">
            <button className="arrow-btn" onClick={prevSeason}>&lt;</button>
            <div className="season-display">
                <span className="season-name">{SEASONS[seasonIndex]}</span>
            </div>
            <button className="arrow-btn" onClick={nextSeason}>&gt;</button>

            <button
                className={`day-night-toggle ${isNight ? 'night' : 'day'} ${autoTime ? 'auto' : ''}`}
                onClick={toggleDayNight}
                title={autoTime ? 'Auto (Real Time)' : 'Manual Toggle'}
            >
                {isNight ? '🌙' : '☀️'}
            </button>

            <button
                className={`auto-time-btn ${autoTime ? 'active' : ''}`}
                onClick={toggleAutoTime}
                title="Toggle Real-Time Clock"
            >
                {autoTime ? '🕐 Auto' : '⏸️ Manual'}
            </button>

            <button className="pokedex-hud-btn" onClick={() => navigate('/pokedex')}>Pokédex</button>
            <button className="bag-hud-btn" onClick={() => navigate('/bag')}>
                <img src={bagImage} alt="Bag" />
            </button>
            <button className="quest-hud-btn" onClick={() => setShowQuestLog(true)}>
                <Trophy size={20} color="#92400e" />
                {quests && quests.some(q => !q.completed && q.progress >= q.target) && (
                    <span className="quest-dot">!</span>
                )}
            </button>

            <div className="gps-coordinate-display">
                <MapPin size={16} />
                <span>X: {playerPos.x}, Y: {playerPos.y}</span>
            </div>

            <div className="gps-tracker-hud">
                {targetPos ? (
                    <div className="gps-active">
                        <Navigation size={16} className="gps-icon pulse" />
                        <div className="gps-info">
                            <span className="gps-distance">{gpsDistance}m</span>
                            <span className="gps-hint">{gpsDirection}</span>
                        </div>
                    </div>
                ) : (
                    <button className="gps-start-btn" onClick={() => {
                        const target = generateRandomTarget(playerPos);
                        setGpsDistance(calculateDistance(playerPos, target));
                        setGpsDirection(getDirectionHint(playerPos, target));
                        showMessage(`Zoek de schat op X: ${target.x}, Y: ${target.y}!`, '#3b82f6');
                    }}>
                        <Compass size={18} />
                        <span>GPS Quest</span>
                    </button>
                )}
            </div>
        </div>
    );
}
