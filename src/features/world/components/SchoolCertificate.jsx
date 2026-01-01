import { Award } from 'lucide-react';

export function SchoolCertificate({ quiz, score, onClose }) {
    if (!quiz) return null;

    return (
        <div className="certificate-overlay" onClick={onClose}>
            <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
                <div className="certificate-header">
                    <Award size={48} color="#eab308" />
                    <h2>¡CERTIFICADO DE MÉRITO!</h2>
                </div>
                <div className="certificate-body">
                    <p className="cert-text">Se otorga el presente diploma a</p>
                    <h1 className="cert-name">FELIX</h1>
                    <p className="cert-text">Por haber completado con éxito:</p>
                    <h3 className="cert-course">{quiz.title}</h3>
                    <div className="cert-score">
                        <p>Puntuación: {score}/{quiz.questions.length}</p>
                        <p>Recompensa: {score * 50} monedas</p>
                    </div>
                    <div className="cert-seal">🎖️</div>
                </div>
                <button className="cert-close-btn" onClick={onClose}>¡Gracias Profe!</button>
            </div>
        </div>
    );
}
