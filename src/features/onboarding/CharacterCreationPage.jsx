import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import { Check } from 'lucide-react';
import './CharacterCreationPage.css';

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

export function CharacterCreationPage() {
    const navigate = useNavigate();
    const { updateProfile } = usePlayer();
    const [name, setName] = useState('');
    const [avatarId, setAvatarId] = useState(AVATARS[0].id);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!name.trim()) return;

        setIsSaving(true);
        setTimeout(() => {
            updateProfile(name, avatarId);
            setIsSaving(false);
            navigate('/');
        }, 800);
    };

    const currentAvatar = AVATARS.find(a => a.id === avatarId) || AVATARS[0];

    return (
        <div className="character-creation-page">
            <div className="character-creation-container">
                <header className="creation-header">
                    <h1>¡Crea tu Personaje!</h1>
                    <p>Antes de comenzar, dinos quién eres.</p>
                </header>

                <div className="creation-card">
                    <div className="avatar-preview-section">
                        <div
                            className="avatar-preview-circle"
                            style={{ backgroundColor: currentAvatar.color }}
                        >
                            <span className="preview-emoji">{currentAvatar.emoji}</span>
                        </div>
                        <div className="name-input-group">
                            <label>Tu Nombre</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={12}
                                placeholder="Escribe tu nombre..."
                                autoFocus
                            />
                            <span className="char-count">{name.length}/12</span>
                        </div>
                    </div>

                    <div className="avatar-selection-section">
                        <h2>Elige tu Avatar</h2>
                        <div className="avatar-grid">
                            {AVATARS.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    className={`avatar-option ${avatarId === avatar.id ? 'selected' : ''}`}
                                    onClick={() => setAvatarId(avatar.id)}
                                >
                                    <div
                                        className="avatar-option-circle"
                                        style={{ backgroundColor: avatar.color }}
                                    >
                                        <span className="option-emoji">{avatar.emoji}</span>
                                    </div>
                                    <span className="option-label">{avatar.label}</span>
                                    {avatarId === avatar.id && (
                                        <div className="check-badge">
                                            <Check size={12} color="white" strokeWidth={4} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className={`start-adventure-btn ${isSaving ? 'loading' : ''}`}
                        onClick={handleSave}
                        disabled={isSaving || name.trim().length === 0}
                    >
                        {isSaving ? 'Guardando...' : '¡Comenzar Aventura!'}
                    </button>
                </div>
            </div>
        </div>
    );
}
