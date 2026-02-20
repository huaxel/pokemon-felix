import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import './WorldSelectionPage.css';

// Continent Data with simplified paths for a 1000x500 map
const CONTINENTS = [
  {
    id: 'na',
    name: 'Noord-Amerika',
    color: '#86efac', // Green-ish
    path: 'M 50,40 L 250,30 L 350,50 L 400,150 L 300,250 L 250,230 L 200,350 L 100,200 L 20,100 Z',
    description: 'Verken de uitgestrekte steden en wilde natuur.',
  },
  {
    id: 'sa',
    name: 'Zuid-Amerika',
    color: '#4ade80', // Jungle Green
    path: 'M 220,350 L 320,330 L 400,400 L 350,550 L 280,580 L 220,450 Z',
    description: 'Ontdek de mysterieuze regenwouden en oude ruïnes.',
  },
  {
    id: 'eu',
    name: 'Europa',
    color: '#c084fc', // Purple/Royal
    path: 'M 420,80 L 550,60 L 600,150 L 550,180 L 480,180 L 420,150 Z',
    description: "Bezoek historische kastelen en moderne arena's.",
  },
  {
    id: 'af',
    name: 'Afrika',
    color: '#fcd34d', // Desert Yellow
    path: 'M 420,200 L 580,200 L 650,350 L 550,550 L 450,500 L 400,300 Z',
    description: 'Reis door de woestijn en savanne vol wilde Pokémon.',
  },
  {
    id: 'as',
    name: 'Azië',
    color: '#f87171', // Red
    path: 'M 600,60 L 900,60 L 950,250 L 850,350 L 750,300 L 650,250 L 600,150 Z',
    description: 'Beklim heilige bergen en bezoek bruisende markten.',
  },
  {
    id: 'oc',
    name: 'Australië/Oceanië',
    color: '#60a5fa', // Ocean Blue
    path: 'M 750,380 L 900,350 L 950,480 L 800,520 L 700,450 Z',
    description: 'Duik in het rif en verken de outback.',
  },
];

export function WorldSelectionPage() {
  const navigate = useNavigate();
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);

  // Initialize simplified audio (placeholder)
  useEffect(() => {
    // In a real app, we would load an actual audio file here
    // audioRef.current = new Audio('/assets/music/map-theme.mp3');
    // if (soundEnabled) audioRef.current.play().catch(e => console.log('Autoplay blocked'));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playClickSound = () => {
    if (!soundEnabled) return;
    // Simple synth beep for feedback
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 440;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      // Ignore audio errors
    }
  };

  const handleSelect = id => {
    playClickSound();
    setSelectedContinent(id);
  };

  const handleTravel = () => {
    playClickSound();
    if (selectedContinent) {
      navigate(`/adventure?world=${selectedContinent}`);
    }
  };

  const selectedData = CONTINENTS.find(c => c.id === selectedContinent);

  return (
    <div className="world-selection-page">
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>

      <header className="selection-header">
        <h1>
          <Globe className="spinning-globe" color="#ffcb05" size={48} /> Pokémon Wereldkaart
        </h1>
        <p>Kies een continent voor je volgende avontuur!</p>
      </header>

      <div className="sound-controls" onClick={() => setSoundEnabled(!soundEnabled)}>
        {soundEnabled ? <Volume2 color="white" /> : <VolumeX color="white" />}
      </div>

      <div className="world-map-container">
        <svg className="interactive-map" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
          {/* Ocean/Background Circle for Globe effect */}
          <circle cx="500" cy="300" r="280" fill="#3b82f6" opacity="0.3" className="globe-bg" />

          {/* Continents */}
          {CONTINENTS.map(continent => (
            <path
              key={continent.id}
              d={continent.path}
              className={`continent-path continent-${continent.id} ${selectedContinent === continent.id ? 'selected' : ''}`}
              onClick={() => handleSelect(continent.id)}
            />
          ))}
        </svg>

        {/* Visual overlay to make it look spherical */}
        <div className="globe-overlay"></div>
      </div>

      {selectedData && (
        <div className="confirmation-modal">
          <h2>{selectedData.name}</h2>
          <p>{selectedData.description}</p>
          <div className="btn-group">
            <button className="btn-cancel" onClick={() => setSelectedContinent(null)}>
              Annuleren
            </button>
            <button className="btn-travel" onClick={handleTravel}>
              Naar {selectedData.name} 🚀
            </button>
          </div>
        </div>
      )}

      <button
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={32} />
      </button>
    </div>
  );
}
