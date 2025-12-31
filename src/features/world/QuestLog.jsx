import { usePokemonContext } from '../../hooks/usePokemonContext';
import { Trophy, CheckCircle } from 'lucide-react';
import bagIcon from '../../assets/items/bag_icon.png';
import './QuestLog.css';

export function QuestLog({ onClose }) {
    const { quests, completeQuest } = usePokemonContext();

    // Sort: Active first, then completed
    const sortedQuests = [...quests].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    return (
        <div className="quest-log-overlay">
            <div className="quest-log-modal">
                <header className="quest-header">
                    <h2><Trophy /> Diario de Misiones</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </header>

                <div className="quest-list">
                    {sortedQuests.map(quest => {
                        const isReadyToClaim = !quest.completed && quest.progress >= quest.target;
                        const progressPercent = Math.min(100, (quest.progress / quest.target) * 100);

                        return (
                            <div key={quest.id} className={`quest-card ${quest.completed ? 'completed' : ''} ${isReadyToClaim ? 'claimable' : ''}`}>
                                <div className="quest-icon">
                                    {quest.completed ? <CheckCircle color="#10b981" /> : quest.icon}
                                </div>
                                <div className="quest-content">
                                    <h3>{quest.title}</h3>
                                    <p className="quest-desc">{quest.description}</p>

                                    <div className="quest-progress-bar">
                                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                                        <span className="progress-text">{quest.progress} / {quest.target}</span>
                                    </div>

                                    {quest.completed ? (
                                        <div className="quest-status done">¡Completado!</div>
                                    ) : isReadyToClaim ? (
                                        <button className="claim-btn" onClick={() => completeQuest(quest.id)}>
                                            Reclamar <img src={bagIcon} alt="c" className="inline-coin" /> {quest.reward.coins}
                                        </button>
                                    ) : (
                                        <div className="quest-reward-preview">
                                            Premio: {quest.reward.coins} monedas
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
