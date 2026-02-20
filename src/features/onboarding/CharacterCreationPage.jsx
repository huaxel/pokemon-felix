import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../hooks/usePlayer';
import { Check } from 'lucide-react';
import { grassTile, roguelikeSheet } from '../world/worldAssets';
import './CharacterCreationPage.css';

const AVATARS = [
  { id: 'boy_blue', pos: '0 0', label: 'Trainer Blauw' },
  { id: 'girl_pink', pos: '-16px 0', label: 'Trainer Roze' },
  { id: 'boy_green', pos: '-32px 0', label: 'Trainer Groen' },
  { id: 'girl_yellow', pos: '-48px 0', label: 'Trainer Geel' },
  { id: 'ninja', pos: '0 -16px', label: 'Ninja' },
  { id: 'scientist', pos: '-16px -16px', label: 'Wetenschapper' },
  { id: 'explorer', pos: '-32px -16px', label: 'Avonturier' },
  { id: 'superhero', pos: '-48px -16px', label: 'Superheld' },
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
    <div
      className="character-creation-page"
      style={{
        backgroundImage: `url(${grassTile})`,
        backgroundSize: '64px',
        imageRendering: 'pixelated',
        fontFamily: '"Press Start 2P", cursive',
      }}
    >
      <div className="character-creation-container">
        <header className="creation-header">
          <h1 style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '2px 2px 0 #000' }}>
            Maak je Karakter!
          </h1>
          <p style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
            Voordat we beginnen, vertel ons wie je bent.
          </p>
        </header>

        <div className="creation-card game-panel">
          <div className="avatar-preview-section">
            <div className="avatar-preview-box">
              <div
                className="avatar-sprite-large"
                style={{
                  backgroundImage: `url(${roguelikeSheet})`,
                  backgroundPosition: currentAvatar.pos,
                  backgroundSize: '912px 368px',
                  imageRendering: 'pixelated',
                }}
              />
            </div>
            <div className="name-input-group">
              <label style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem' }}>
                Jouw Naam
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={12}
                placeholder="Typ je naam..."
                autoFocus
                style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}
              />
              <span
                className="char-count"
                style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.6rem' }}
              >
                {name.length}/12
              </span>
            </div>
          </div>

          <div className="avatar-selection-section">
            <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem' }}>
              Kies je Avatar
            </h2>
            <div className="avatar-grid">
              {AVATARS.map(avatar => (
                <button
                  key={avatar.id}
                  className={`avatar-option ${avatarId === avatar.id ? 'selected' : ''}`}
                  onClick={() => setAvatarId(avatar.id)}
                >
                  <div className="avatar-option-box">
                    <div
                      className="avatar-sprite-small"
                      style={{
                        backgroundImage: `url(${roguelikeSheet})`,
                        backgroundPosition: avatar.pos,
                        backgroundSize: '912px 368px',
                        imageRendering: 'pixelated',
                      }}
                    />
                  </div>
                  <span
                    className="option-label"
                    style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.5rem' }}
                  >
                    {avatar.label}
                  </span>
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
            className={`start-adventure-btn btn-kenney ${isSaving ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={isSaving || name.trim().length === 0}
            style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.9rem' }}
          >
            {isSaving ? 'Opslaan...' : 'Start Avontuur!'}
          </button>
        </div>
      </div>
    </div>
  );
}
