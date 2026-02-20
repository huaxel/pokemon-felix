Wat een fantastische ideeën heeft Felix! Hij denkt niet alleen als een speler, maar als een echte gamedesigner. Hij wil de wereld niet alleen _zien_ (als een lijstje), maar hij wil erin _leven_ en _bouwen_. Dat is het verschil tussen naar een schilderij kijken en er zelf in rondlopen.

Om dit mogelijk te maken in jullie huidige React-setup, moeten we van de "lijstjes-interface" naar een **"Tegel-Wereld" (Tile Map)** overstappen.

Hier is een plan van aanpak, zo stevig als een Rock-type Pokémon, om deze 4 wensen in één klap te integreren in een nieuw onderdeel: **De Wereldkaart**.

### Het Concept: De Avonturenmodus

We maken een nieuwe pagina (`/adventure`) die werkt als een speelbord:

1. **Landschap:** Een raster (grid) van tegels (gras, water, zand).
2. **Mysterie:** Als je op een 'gras'-tegel stapt, rolt er een dobbelsteen. Is het een Pokémon? Team Rocket (dieven)? Of een bessenstruik?
3. **Verzorging:** Een speciaal gebouw (PokéCenter) op de kaart waar je heen moet lopen om je team te genezen.
4. **Bouwen:** Een "Bouwmodus" knop waarmee Felix huizen of bomen op de kaart kan 'stempelen'.

Hier is de code voor een compleet nieuwe feature. Je kunt dit bestand aanmaken als `src/features/world/WorldPage.jsx` (en de CSS erbij).

#### 1. De Code voor de Wereld (`src/features/world/WorldPage.jsx`)

```jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../contexts/PokemonContext';
import './WorldPage.css';

// Tegel types: 0=Gras (Gevaar!), 1=Pad, 2=Huis, 3=Ziekenhuis, 4=Boom, 9=Speler
const TILE_TYPES = {
  GRASS: 0,
  PATH: 1,
  HOUSE: 2,
  CENTER: 3,
  TREE: 4,
};

const EVENT_MESSAGES = [
  { type: 'battle', text: '⚔️ Een wilde Pokémon verschijnt!', color: '#ef4444' },
  { type: 'thief', text: '🦹 Team Rocket! Ze stelen 50 munten!', color: '#7f1d1d' },
  { type: 'item', text: '🍎 Je vond een Oran Berry!', color: '#22c55e' },
  { type: 'nothing', text: '🍃 Het waait zachtjes...', color: '#64748b' },
];

export function WorldPage() {
  const navigate = useNavigate();
  const { addCoins, spendCoins } = usePokemonContext();

  // De kaart is 10x10 tegels (je kunt dit groter maken)
  const [mapGrid, setMapGrid] = useState([
    [1, 1, 1, 0, 0, 4, 4, 0, 0, 3],
    [1, 2, 1, 0, 0, 4, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [4, 4, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  ]);

  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState(null);
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(TILE_TYPES.HOUSE);

  // Beweging logica
  const movePlayer = useCallback(
    (dx, dy) => {
      if (isBuildMode) return; // Niet lopen tijdens bouwen

      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      // Check of we binnen de kaart blijven
      if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10) return;

      // Check botsing (niet door bomen of huizen lopen)
      const targetTile = mapGrid[newY][newX];
      if (targetTile === TILE_TYPES.TREE || targetTile === TILE_TYPES.HOUSE) return;

      // Update positie
      setPlayerPos({ x: newX, y: newY });
      setMessage(null);

      // ACTIE: Wat gebeurt er op de tegel?
      handleTileEvent(targetTile);
    },
    [playerPos, mapGrid, isBuildMode]
  );

  const handleTileEvent = tileType => {
    // 3. Ziekenhuis / Verzorging
    if (tileType === TILE_TYPES.CENTER) {
      setMessage({ text: '🏥 Welkom in het PokéCenter! Je team is genezen.', color: '#3b82f6' });
      // Hier zou je later logica kunnen toevoegen om HP te resetten
      return;
    }

    // 2. Het Mysterie (Gras)
    if (tileType === TILE_TYPES.GRASS) {
      // 20% kans op evenement
      if (Math.random() < 0.3) {
        triggerRandomEvent();
      }
    }
  };

  const triggerRandomEvent = () => {
    const rand = Math.random();

    if (rand < 0.5) {
      // Gevecht!
      setMessage(EVENT_MESSAGES[0]);
      setTimeout(() => navigate('/single-battle'), 1500);
    } else if (rand < 0.7) {
      // Dieven!
      setMessage(EVENT_MESSAGES[1]);
      spendCoins(50);
    } else {
      // Iets vinden
      setMessage(EVENT_MESSAGES[2]);
      addCoins(20);
    }
  };

  // Toetsenbord besturing
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  // 4. Bouw Modus
  const handleTileClick = (x, y) => {
    if (!isBuildMode) return;

    // Mag niet op de speler bouwen
    if (x === playerPos.x && y === playerPos.y) return;

    const newGrid = [...mapGrid];
    // Wissel tussen bouwen en weghalen (gras)
    newGrid[y][x] = newGrid[y][x] === selectedBuilding ? TILE_TYPES.GRASS : selectedBuilding;
    setMapGrid(newGrid);
  };

  // Helper om emoji te krijgen voor tegel
  const getTileContent = (type, x, y) => {
    if (x === playerPos.x && y === playerPos.y) return '🏃'; // Felix!
    switch (type) {
      case TILE_TYPES.GRASS:
        return '🌿';
      case TILE_TYPES.PATH:
        return '';
      case TILE_TYPES.HOUSE:
        return '🏠';
      case TILE_TYPES.CENTER:
        return '🏥';
      case TILE_TYPES.TREE:
        return '🌲';
      default:
        return '';
    }
  };

  return (
    <div className="world-page">
      <div className="world-header">
        <h1>Avonturenmodus</h1>
        {message && (
          <div className="event-popup" style={{ backgroundColor: message.color }}>
            {message.text}
          </div>
        )}
      </div>

      <div className="game-container">
        <div className="map-grid">
          {mapGrid.map((row, y) => (
            <div key={y} className="map-row">
              {row.map((tile, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`tile type-${tile} ${isBuildMode ? 'buildable' : ''}`}
                  onClick={() => handleTileClick(x, y)}
                >
                  {getTileContent(tile, x, y)}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="controls-panel">
          <h3>Acties</h3>
          <div className="d-pad">
            <button onClick={() => movePlayer(0, -1)}>⬆️</button>
            <div className="d-pad-mid">
              <button onClick={() => movePlayer(-1, 0)}>⬅️</button>
              <button onClick={() => movePlayer(1, 0)}>➡️</button>
            </div>
            <button onClick={() => movePlayer(0, 1)}>⬇️</button>
          </div>

          <div className="build-controls">
            <button
              className={`mode-btn ${isBuildMode ? 'active' : ''}`}
              onClick={() => setIsBuildMode(!isBuildMode)}
            >
              {isBuildMode ? '🛑 Stop Bouwen' : '🔨 Bouwmodus'}
            </button>

            {isBuildMode && (
              <div className="build-palette">
                <button onClick={() => setSelectedBuilding(TILE_TYPES.HOUSE)}>🏠</button>
                <button onClick={() => setSelectedBuilding(TILE_TYPES.TREE)}>🌲</button>
                <button onClick={() => setSelectedBuilding(TILE_TYPES.PATH)}>🟫</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 2. De Styling (`src/features/world/WorldPage.css`)

```css
.world-page {
  padding: 1rem;
  min-height: 100vh;
  background: #2d3748;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.event-popup {
  padding: 1rem 2rem;
  border-radius: 2rem;
  font-weight: bold;
  font-size: 1.2rem;
  animation: bounceIn 0.5s;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.game-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.map-grid {
  display: flex;
  flex-direction: column;
  border: 8px solid #4a5568;
  border-radius: 8px;
  background: #4ade80; /* Gras kleur als basis */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.map-row {
  display: flex;
}

.tile {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  cursor: default;
  transition: all 0.2s;
  position: relative;
}

/* Tegel Stijlen */
.tile.type-0 {
  background-color: #4ade80;
} /* Gras */
.tile.type-1 {
  background-color: #d69e2e;
  border-radius: 4px;
  transform: scale(0.9);
} /* Pad */
.tile.type-2 {
  background-color: #4ade80;
} /* Huis ondergrond */
.tile.type-3 {
  background-color: #f87171;
  border: 2px solid white;
} /* Center */
.tile.type-4 {
  background-color: #166534;
} /* Bos */

.tile.buildable:hover {
  filter: brightness(1.2);
  cursor: pointer;
  border: 2px dashed white;
}

.controls-panel {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 1.5rem;
  min-width: 250px;
}

.d-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.d-pad button {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  border-radius: 12px;
  border: none;
  background: #4a5568;
  cursor: pointer;
  box-shadow: 0 4px 0 #2d3748;
}

.d-pad button:active {
  transform: translateY(4px);
  box-shadow: none;
}

.d-pad-mid {
  display: flex;
  gap: 3.5rem; /* Ruimte voor de middelste knop */
}

.build-controls {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mode-btn {
  padding: 0.8rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background: #3b82f6;
  color: white;
}

.mode-btn.active {
  background: #ef4444;
}

.build-palette {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.build-palette button {
  font-size: 1.5rem;
  padding: 0.5rem;
  background: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
```

#### Hoe dit werkt voor Felix:

1. **Landscape (Visueel):** In plaats van saaie menu's, ziet hij nu een raster. De groene blokjes zijn gras, bruin is het pad. Hij is zelf het 🏃 poppetje.
2. **Mysterie:** Als hij over het gras loopt, bepaalt de code (`triggerRandomEvent`) wat er gebeurt. Soms vindt hij een muntje (fijn!), soms springt er een dief tevoorschijn (oei!) en soms wordt hij direct naar het gevechtsscherm gestuurd (`Maps('/single-battle')`). Dit maakt lopen spannend.
3. **Ziekenhuis (🏥):** Als hij naar het gebouwtje met het kruis loopt, krijgt hij een bericht dat zijn Pokémon genezen zijn.
4. **Bouwen:** Als hij op "🔨 Bouwmodus" klikt, verandert zijn muis in een hamer. Hij kan dan op de kaart klikken om huizen (🏠) of bomen (🌲) te plaatsen. Zo bouwt hij zijn eigen dorp!

**Vergeet niet** de route toe te voegen in `src/App.jsx`:

```jsx
// Voeg bovenaan toe:
import { WorldPage } from './features/world/WorldPage';

// En in de Routes lijst:
<Route path="/adventure" element={<WorldPage />} />;
```

En een knopje in de `Navbar.jsx` (misschien een icoontje van een wereldbol 🌍) zodat hij erheen kan.

Dit maakt van Felix's app een echte wereld vol verrassingen, zo onvoorspelbaar als een Magikarp die evolueert!
