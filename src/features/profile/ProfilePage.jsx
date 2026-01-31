import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import { ArrowLeft, Check, Shield, Zap, Heart } from 'lucide-react';
import './ProfilePage.css';

const AVATARS = [
    { id: 'boy_blue', emoji: '👦', color: '#3b82f6', label: 'Entrenador Azul' },
    { id: 'girl_pink', emoji: '👧', color: '#ec4899', label: 'Entrenadora Rosa' },
    { id: 'boy_green', emoji: '👦', color: '#22c55e', label: 'Entrenador Verde' },
    { id: 'girl_yellow', emoji: '👧', color: '#eab308', label: 'Entrenadora Amarilla' },
    { id: 'ninja', emoji: '🥷', color: '#1e293b', label: 'Ninja Pokémon' },
    { id: 'scientist', emoji: '👨‍🔬', color: '#6366f1', label: 'Científico' },
    { id: 'explorer', emoji: '🤠', color: '#8b4513', label: 'Explorador' },
    { id: 'superhero', emoji: '🦸‍♂️', color: '#ef4444', label: 'Súper Félix' },
];

export function ProfilePage() {
    const navigate = useNavigate();
    const { playerName, avatarId, updateProfile } = usePlayer();
    const [tempName, setTempName] = useState(playerName);
    const [tempAvatarId, setTempAvatarId] = useState(avatarId);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateProfile(tempName, tempAvatarId);
            setIsSaving(false);
            navigate('/adventure');
        }, 800);
    };

    const currentAvatar = AVATARS.find(a => a.id === tempAvatarId) || AVATARS[0];

    return (
        <div className="profile-page">
            <div className="profile-container">
                <header className="profile-header">
                    <button className="back-btn" onClick={() => navigate('/adventure')}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1>Tu Perfil</h1>
                    <div className="header-spacer"></div>
                </header>

                <div className="profile-main-card">
                    <div className="avatar-preview-section">
                        <div
                            className="avatar-preview-circle"
                            style={{ backgroundColor: currentAvatar.color }}
                        >
                            <span className="preview-emoji">{currentAvatar.emoji}</span>
                        </div>
                        <div className="name-input-group">
                            <label>Nombre del Entrenador</label>
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                maxLength={12}
                                placeholder="Escribe tu nombre..."
                            />
                            <span className="char-count">{tempName.length}/12</span>
                        </div>
                    </div>

                    <div className="avatar-selection-section">
                        <h2>Elige tu Avatar</h2>
                        <div className="avatar-grid">
                            {AVATARS.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    className={`avatar-option ${tempAvatarId === avatar.id ? 'selected' : ''}`}
                                    onClick={() => setTempAvatarId(avatar.id)}
                                >
                                    <div
                                        className="avatar-option-circle"
                                        style={{ backgroundColor: avatar.color }}
                                    >
                                        <span className="option-emoji">{avatar.emoji}</span>
                                    </div>
                                    <span className="option-label">{avatar.label}</span>
                                    {tempAvatarId === avatar.id && (
                                        <div className="check-badge">
                                            <Check size={12} color="white" strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="stats-preview">
                        <div className="stat-item">
                            <Shield size={20} color="#3b82f6" />
                            <span>Defensa</span>
                            <div className="stat-bar"><div className="stat-fill" style={{ width: '70%', backgroundColor: '#3b82f6' }}></div></div>
                        </div>
                        <div className="stat-item">
                            <Zap size={20} color="#eab308" />
                            <span>Velocidad</span>
                            <div className="stat-bar"><div className="stat-fill" style={{ width: '85%', backgroundColor: '#eab308' }}></div></div>
                        </div>
                        <div className="stat-item">
                            <Heart size={20} color="#ef4444" />
                            <span>Amistad</span>
                            <div className="stat-bar"><div className="stat-fill" style={{ width: '100%', backgroundColor: '#ef4444' }}></div></div>
                        </div>
                    </div>

                    <button
                        className={`save-profile-btn ${isSaving ? 'loading' : ''}`}
                        onClick={handleSave}
                        disabled={isSaving || tempName.trim().length === 0}
                    >
                        {isSaving ? 'Guardando...' : '¡Listo para la Aventura!'}
                    </button>

                    <div className="danger-zone">
                        <h3>Zona de Peligro</h3>
                        <p>¿Quieres empezar de cero?</p>
                        <button
                            className="reset-game-btn"
                            onClick={() => {
                                if (window.confirm('¿Estás seguro? Esto borrará TODO tu progreso (Pokémon, monedas, medallas).')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                        >
                            ⚠️ Borrar Partida y Reiniciar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
