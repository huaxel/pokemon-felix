import { Trophy } from 'lucide-react';
import bagIcon from '../../../assets/items/bag_icon.png';

export function SchoolResultView({ score, total, onFinish }) {
    return (
        <div className="quiz-result">
            <Trophy size={64} className="trophy-icon" />
            <h2>¡Examen Terminado!</h2>
            <div className="result-stats">
                <p>Puntuación: <strong>{score} / {total}</strong></p>
                <p>Recompensa: <strong><img src={bagIcon} alt="coins" /> {score * 50}</strong></p>
            </div>
            <p>¡Has aprendido mucho hoy, Felix!</p>
            <button className="finish-btn" onClick={onFinish}>Recoger Recompensa</button>
        </div>
    );
}
