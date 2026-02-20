import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import { ArrowLeft, Check, Shield, Zap, Heart } from 'lucide-react';
import './ProfilePage.css';

const AVATARS = [
  { id: 'boy_blue', emoji: '👦', color: '#3b82f6', label: 'Trainer Blauw' },
  { id: 'girl_pink', emoji: '👧', color: '#ec4899', label: 'Trainer Roze' },
  { id: 'boy_green', emoji: '👦', color: '#22c55e', label: 'Trainer Groen' },
  { id: 'girl_yellow', emoji: '👧', color: '#eab308', label: 'Trainer Geel' },
  { id: 'ninja', emoji: '🥷', color: '#1e293b', label: 'Pokémon Ninja' },
  { id: 'scientist', emoji: '👨‍🔬', color: '#6366f1', label: 'Wetenschapper' },
  { id: 'explorer', emoji: '🤠', color: '#8b4513', label: 'Verkenner' },
  { id: 'superhero', emoji: '🦸‍♂️', color: '#ef4444', label: 'Super Felix' },
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
          <h1>Je Profiel</h1>
          <div className="header-spacer"></div>
        </header>

        <div className="profile-main-card">
          <div className="avatar-preview-section">
            <div className="avatar-preview-circle" style={{ backgroundColor: currentAvatar.color }}>
              <span className="preview-emoji">{currentAvatar.emoji}</span>
            </div>
            <div className="name-input-group">
              <label>Naam van Trainer</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                maxLength={12}
                placeholder="Escribe tu nombre..."
              />
              <span className="char-count">{tempName.length}/12</span>
            </div>
          </div>

          <div className="avatar-selection-section">
            <h2>Kies je Avatar</h2>
            <div className="avatar-grid">
              {AVATARS.map(avatar => (
                <button
                  key={avatar.id}
                  className={`avatar-option ${tempAvatarId === avatar.id ? 'selected' : ''}`}
                  onClick={() => setTempAvatarId(avatar.id)}
                >
                  <div className="avatar-option-circle" style={{ backgroundColor: avatar.color }}>
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
              <span>Verdediging</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: '70%', backgroundColor: '#3b82f6' }}
                ></div>
              </div>
            </div>
            <div className="stat-item">
              <Zap size={20} color="#eab308" />
              <span>Snelheid</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: '85%', backgroundColor: '#eab308' }}
                ></div>
              </div>
            </div>
            <div className="stat-item">
              <Heart size={20} color="#ef4444" />
              <span>Vriendschap</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{ width: '100%', backgroundColor: '#ef4444' }}
                ></div>
              </div>
            </div>
          </div>

          <button
            className={`save-profile-btn ${isSaving ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={isSaving || tempName.trim().length === 0}
          >
            {isSaving ? 'Opslaan...' : 'Klaar voor Avontuur!'}
          </button>

          <div className="danger-zone">
            <h3>Gevarenzone</h3>
            <p>Wil je opnieuw beginnen?</p>
            <button
              className="reset-game-btn"
              onClick={() => {
                if (
                  window.confirm(
                    'Weet je zeker dat je je spel wilt wissen? Je verliest al je Pokémon en voortgang.'
                  )
                ) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              ⚠️ Spel Wissen en Hernieuwen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
