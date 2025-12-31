 Gemini
Pokémon Spel: Wereldkaart Implementatie
https://gemini.google.com/share/6d7ef2de20da
Some responses below were generated according to the creator's saved info and preferences. Learn more Opens in a new window December 31, 2025 at 11:52 AM Published December 31, 2025 at 06:29 PM

Ik ben een pokemon spel aan het maken (Pokemon-Felix) met en voor mijn zoon felix (7) we hebben al een basis, maar felix wil nieuwe ideen implementeren :



1) het landschap in pokemon versie


2) niet weten wat er staat als je een pad kiest (battle, pokemon vinden, dieven...)


3) ziekenhuizen, pokemon verzorging, eten etc


4) huizen planten etc

Wat een fantastische ideeën heeft Felix! Hij denkt niet alleen als een speler, maar als een echte gamedesigner. Hij wil de wereld niet alleen zien (als een lijstje), maar hij wil erin leven en bouwen. Dat is het verschil tussen naar een schilderij kijken en er zelf in rondlopen.

Om dit mogelijk te maken in jullie huidige React-setup, moeten we van de "lijstjes-interface" naar een "Tegel-Wereld" (Tile Map) overstappen.

Hier is een plan van aanpak, zo stevig als een Rock-type Pokémon, om deze 4 wensen in één klap te integreren in een nieuw onderdeel: De Wereldkaart.
Het Concept: De Avonturenmodus

We maken een nieuwe pagina (/adventure) die werkt als een speelbord:

    Landschap: Een raster (grid) van tegels (gras, water, zand).

    Mysterie: Als je op een 'gras'-tegel stapt, rolt er een dobbelsteen. Is het een Pokémon? Team Rocket (dieven)? Of een bessenstruik?

    Verzorging: Een speciaal gebouw (PokéCenter) op de kaart waar je heen moet lopen om je team te genezen.

    Bouwen: Een "Bouwmodus" knop waarmee Felix huizen of bomen op de kaart kan 'stempelen'.

Hier is de code voor een compleet nieuwe feature. Je kunt dit bestand aanmaken als src/features/world/WorldPage.jsx (en de CSS erbij).
1. De Code voor de Wereld (src/features/world/WorldPage.jsx)
JavaScript

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
    { type: 'nothing', text: '🍃 Het waait zachtjes...', color: '#64748b' }
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
    const movePlayer = useCallback((dx, dy) => {
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

    }, [playerPos, mapGrid, isBuildMode]);

    const handleTileEvent = (tileType) => {
        // 3. Ziekenhuis / Verzorging
        if (tileType === TILE_TYPES.CENTER) {
            setMessage({ text: "🏥 Welkom in het PokéCenter! Je team is genezen.", color: '#3b82f6' });
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
        const handleKeyDown = (e) => {
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
            case TILE_TYPES.GRASS: return '🌿';
            case TILE_TYPES.PATH: return '';
            case TILE_TYPES.HOUSE: return '🏠';
            case TILE_TYPES.CENTER: return '🏥';
            case TILE_TYPES.TREE: return '🌲';
            default: return '';
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

2. De Styling (src/features/world/WorldPage.css)
CSS

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
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
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
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
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
.tile.type-0 { background-color: #4ade80; } /* Gras */
.tile.type-1 { background-color: #d69e2e; border-radius: 4px; transform: scale(0.9); } /* Pad */
.tile.type-2 { background-color: #4ade80; } /* Huis ondergrond */
.tile.type-3 { background-color: #f87171; border: 2px solid white; } /* Center */
.tile.type-4 { background-color: #166534; } /* Bos */

.tile.buildable:hover {
    filter: brightness(1.2);
    cursor: pointer;
    border: 2px dashed white;
}

.controls-panel {
    background: rgba(255,255,255,0.1);
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
    border-top: 1px solid rgba(255,255,255,0.2);
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
    0% { transform: scale(0); }
    80% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

Hoe dit werkt voor Felix:

    Landscape (Visueel): In plaats van saaie menu's, ziet hij nu een raster. De groene blokjes zijn gras, bruin is het pad. Hij is zelf het 🏃 poppetje.

    Mysterie: Als hij over het gras loopt, bepaalt de code (triggerRandomEvent) wat er gebeurt. Soms vindt hij een muntje (fijn!), soms springt er een dief tevoorschijn (oei!) en soms wordt hij direct naar het gevechtsscherm gestuurd (Maps('/single-battle')). Dit maakt lopen spannend.

    Ziekenhuis (🏥): Als hij naar het gebouwtje met het kruis loopt, krijgt hij een bericht dat zijn Pokémon genezen zijn.

    Bouwen: Als hij op "🔨 Bouwmodus" klikt, verandert zijn muis in een hamer. Hij kan dan op de kaart klikken om huizen (🏠) of bomen (🌲) te plaatsen. Zo bouwt hij zijn eigen dorp!

Vergeet niet de route toe te voegen in src/App.jsx:
JavaScript

// Voeg bovenaan toe:
import { WorldPage } from './features/world/WorldPage';

// En in de Routes lijst:
<Route path="/adventure" element={<WorldPage />} />

En een knopje in de Navbar.jsx (misschien een icoontje van een wereldbol 🌍) zodat hij erheen kan.

Dit maakt van Felix's app een echte wereld vol verrassingen, zo onvoorspelbaar als een Magikarp die evolueert!

Felix wil ook dat er pijltjes zijn om te zeggen welk moment van het jaar is, winter herfst zomer enz

Wat een geweldig idee van Felix! Seizoenen maken de wereld levend. In de winter sneeuw, in de herfst oranje blaadjes... dat maakt het rondlopen veel spannender.

En dat "pijltje" is een heel slim idee voor de interface (UI). Zo weet je altijd precies of je een jas aan moet trekken! 😉

Hier is de update voor de WorldPage. We voegen een Seizoensklok toe met een pijltje dat draait, en de hele wereld verandert van kleur als het seizoen verandert.
1. De Code met Seizoenen (src/features/world/WorldPage.jsx)

Vervang de vorige code (of maak dit bestand aan) met deze nieuwe versie. Ik heb de seizoenen-logica toegevoegd:
JavaScript

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../contexts/PokemonContext';
import './WorldPage.css';

// Tegel types
const TILE_TYPES = {
    GRASS: 0,
    PATH: 1,
    HOUSE: 2,
    CENTER: 3,
    TREE: 4,
};

// De seizoenen
const SEASONS = ['Lente', 'Zomer', 'Herfst', 'Winter'];
const SEASON_ICONS = ['🌸', '☀️', '🍂', '❄️'];

export function WorldPage() {
    const navigate = useNavigate();
    const { addCoins, spendCoins } = usePokemonContext();
    
    // START: Felix's Seizoenen Systeem
    const [seasonIndex, setSeasonIndex] = useState(1); // Begin in de Zomer (1)
    
    // Functie om naar het volgende seizoen te gaan
    const nextSeason = () => {
        setSeasonIndex((prev) => (prev + 1) % 4);
    };
    // Functie om naar het vorige seizoen te gaan
    const prevSeason = () => {
        setSeasonIndex((prev) => (prev === 0 ? 3 : prev - 1));
    };

    // Bepaal de kleuren op basis van het seizoen
    const getSeasonStyles = () => {
        switch (seasonIndex) {
            case 3: // Winter ❄️
                return { grass: '#e2e8f0', tree: '#94a3b8', bg: '#f1f5f9' }; 
            case 2: // Herfst 🍂
                return { grass: '#fef3c7', tree: '#d97706', bg: '#fffbeb' };
            case 0: // Lente 🌸
                return { grass: '#bbf7d0', tree: '#f472b6', bg: '#f0fdf4' }; // Roze bomen!
            default: // Zomer ☀️
                return { grass: '#4ade80', tree: '#166534', bg: '#dcfce7' };
        }
    };

    const seasonStyle = getSeasonStyles();
    // EINDE Seizoenen Systeem

    // De kaart (10x10)
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
    const movePlayer = useCallback((dx, dy) => {
        if (isBuildMode) return; 

        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10) return;

        const targetTile = mapGrid[newY][newX];
        if (targetTile === TILE_TYPES.TREE || targetTile === TILE_TYPES.HOUSE) return;

        setPlayerPos({ x: newX, y: newY });
        setMessage(null);
        handleTileEvent(targetTile);
    }, [playerPos, mapGrid, isBuildMode]);

    const handleTileEvent = (tileType) => {
        if (tileType === TILE_TYPES.CENTER) {
            setMessage({ text: "🏥 Pokémon genezen!", color: '#3b82f6' });
            return;
        }
        if (tileType === TILE_TYPES.GRASS) {
            // In de winter minder kans op Pokémon, maar misschien Ice-types?
            if (Math.random() < 0.2) { 
                setMessage({ text: "⚔️ Wilde Pokémon!", color: '#ef4444' });
                setTimeout(() => navigate('/single-battle'), 1000);
            }
        }
    };

    // Toetsenbord besturing
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') movePlayer(0, -1);
            if (e.key === 'ArrowDown') movePlayer(0, 1);
            if (e.key === 'ArrowLeft') movePlayer(-1, 0);
            if (e.key === 'ArrowRight') movePlayer(1, 0);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer]);

    const handleTileClick = (x, y) => {
        if (!isBuildMode) return;
        if (x === playerPos.x && y === playerPos.y) return;
        const newGrid = [...mapGrid];
        newGrid[y][x] = newGrid[y][x] === selectedBuilding ? TILE_TYPES.GRASS : selectedBuilding;
        setMapGrid(newGrid);
    };

    const getTileContent = (type, x, y) => {
        if (x === playerPos.x && y === playerPos.y) return '🏃';
        switch (type) {
            case TILE_TYPES.GRASS: return seasonIndex === 3 ? '❄️' : (seasonIndex === 2 ? '🍂' : '🌿');
            case TILE_TYPES.PATH: return '';
            case TILE_TYPES.HOUSE: return '🏠';
            case TILE_TYPES.CENTER: return '🏥';
            case TILE_TYPES.TREE: return '🌲';
            default: return '';
        }
    };

    return (
        <div className="world-page" style={{ backgroundColor: seasonStyle.bg }}>
            
            {/* DE SEIZOENSWIJZER */}
            <div className="season-hud">
                <button className="arrow-btn" onClick={prevSeason}>⬅️</button>
                <div className="season-display">
                    <span className="season-icon">{SEASON_ICONS[seasonIndex]}</span>
                    <span className="season-name">{SEASONS[seasonIndex]}</span>
                </div>
                <button className="arrow-btn" onClick={nextSeason}>➡️</button>
            </div>

            <div className="world-header">
                {message && (
                    <div className="event-popup" style={{ backgroundColor: message.color }}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="game-container">
                <div className="map-grid" style={{ backgroundColor: seasonStyle.grass, borderColor: '#475569' }}>
                    {mapGrid.map((row, y) => (
                        <div key={y} className="map-row">
                            {row.map((tile, x) => (
                                <div 
                                    key={`${x}-${y}`} 
                                    className={`tile type-${tile} ${isBuildMode ? 'buildable' : ''}`}
                                    onClick={() => handleTileClick(x, y)}
                                    // Pas de kleur van bomen en gras dynamisch aan!
                                    style={
                                        tile === TILE_TYPES.TREE ? { color: seasonStyle.tree } :
                                        tile === TILE_TYPES.GRASS ? { color: seasonStyle.tree } : {}
                                    }
                                >
                                    {getTileContent(tile, x, y)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Besturing */}
                <div className="controls-panel">
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
                            {isBuildMode ? 'Klaar met Bouwen' : '🔨 Bouwen'}
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

2. De Styling Updates (src/features/world/WorldPage.css)

Hier zorgen we dat de seizoenswijzer er cool uitziet. Voeg dit toe aan je CSS:
CSS

/* ... (vorige CSS) ... */

/* NIEUW: Seizoenswijzer (HUD) */
.season-hud {
    background: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    margin-bottom: 1rem;
    border: 4px solid #3b82f6;
    animation: slideDown 0.5s;
}

.season-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
}

.season-icon {
    font-size: 2rem;
    line-height: 1;
}

.season-name {
    font-family: 'Luckiest Guy', cursive; /* Felix z'n coole lettertype */
    font-size: 1rem;
    color: #1e293b;
    text-transform: uppercase;
}

.arrow-btn {
    background: #3b82f6;
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
    box-shadow: 0 2px 0 #1e40af;
}

.arrow-btn:active {
    transform: translateY(2px);
    box-shadow: none;
}

@keyframes slideDown {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* Aanpassing voor bomen die van kleur veranderen */
.tile.type-4 {
    background-color: transparent !important; /* Laat de gras-kleur eronder zien */
    font-size: 2rem; /* Grotere bomen */
}

Wat is er nieuw voor Felix?

    De Seizoenswijzer: Bovenaan het scherm staat nu een balkje met pijltjes (⬅️ 🌸 ➡️). Felix kan op de pijltjes klikken om de tijd van het jaar te veranderen.

    Magische Kleuren:

        Winter: Als hij naar Winter klikt, wordt al het gras wit (sneeuw!) en de bomen grijs-wit. De icoontjes op het gras worden sneeuwvlokjes ❄️.

        Herfst: Alles wordt oranje en geel. De blaadjes vallen! 🍂

        Lente: De bomen worden roze (bloesem) en het gras frisgroen.

    Bouwen in de sneeuw: Hij kan nu ook huizen bouwen in een sneeuwlandschap.

Dit systeem is heel makkelijk uit te breiden. Later kunnen we zeggen: "In de winter vind je alleen Ice-type Pokémon!" 🧊

wat denk je van nu

Dit is een serieuze, architecturale upgrade. We gaan van een statische 'lijstjes-app' naar een levende, ademende wereld. Felix vraagt niet om een likje verf, maar om een funderingswissel. Dat is dapper, maar technisch complexer dan een simpele knop toevoegen.

Je huidige code is netjes en modulair opgebouwd met routes, wat dit makkelijker maakt. We hoeven de rest niet te slopen; we bouwen er een nieuwe vleugel aan: de Wereld Modus.

Hier is de kritische blik:

    Opslag is cruciaal: Als Felix huizen bouwt, moeten die blijven staan. Je gebruikt al localStorage in useSquad.js en useCoins.js. We moeten ditzelfde mechanisme toepassen op de 'World Map', anders verdwijnt zijn dorp bij elke refresh als sneeuw voor de zon (wat ironisch zou zijn in de wintermodus).

    De Seizoens-eis: Dit is een slimme manier om variatie te brengen zonder duizend nieuwe plaatjes te tekenen. We gebruiken CSS filters en kleuren – efficient engineering.

Hier is de implementatie voor de Avonturenmodus met seizoenen, bouwen en mysterie.
Stap 1: De Wereld Logica (src/features/world/WorldPage.jsx)

Maak dit bestand aan. Ik heb persistentie (opslag) toegevoegd zodat zijn gebouwen blijven staan.
JavaScript

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../contexts/PokemonContext';
import './WorldPage.css';

// Tegel definities
const TILES = {
    GRAS: 0,
    PAD: 1,
    HUIS: 2,
    CENTER: 3,
    BOOM: 4,
    WATER: 5
};

const SEIZOENEN = [
    { id: 'lente', icon: '🌸', naam: 'Lente', color: '#86efac' },
    { id: 'zomer', icon: '☀️', naam: 'Zomer', color: '#22c55e' },
    { id: 'herfst', icon: '🍂', naam: 'Herfst', color: '#d97706' },
    { id: 'winter', icon: '❄️', naam: 'Winter', color: '#93c5fd' }
];

// Standaard kaart (10x10 grid)
const INITIAL_MAP = [
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 1, 1, 1, 0, 0, 0, 3, 0, 4],
    [4, 1, 2, 1, 0, 0, 0, 1, 0, 4],
    [4, 1, 1, 1, 1, 1, 1, 1, 0, 4],
    [4, 0, 0, 0, 1, 0, 0, 0, 0, 4],
    [4, 0, 5, 5, 1, 0, 2, 0, 0, 4],
    [4, 0, 5, 5, 1, 0, 0, 0, 0, 4],
    [4, 1, 1, 1, 1, 1, 1, 1, 1, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
];

export function WorldPage() {
    const navigate = useNavigate();
    const { addCoins, spendCoins } = usePokemonContext();
    
    // 1. Opslag van de wereld (zodat huizen blijven staan)
    const [grid, setGrid] = useState(() => {
        const saved = localStorage.getItem('felix_world_map');
        return saved ? JSON.parse(saved) : INITIAL_MAP;
    });

    // 2. Seizoenen Staat
    const [seizoenIdx, setSeizoenIdx] = useState(1); // Start in Zomer
    const huidigSeizoen = SEIZOENEN[seizoenIdx];

    const [pos, setPos] = useState({ x: 1, y: 1 });
    const [msg, setMsg] = useState(null);
    const [bouwModus, setBouwModus] = useState(false);
    const [bouwSteen, setBouwSteen] = useState(TILES.HUIS);

    // Opslaan bij wijzigingen
    useEffect(() => {
        localStorage.setItem('felix_world_map', JSON.stringify(grid));
    }, [grid]);

    // Bewegen & Interactie
    const move = useCallback((dx, dy) => {
        if (bouwModus) return; // Niet lopen tijdens metselen

        const nx = pos.x + dx;
        const ny = pos.y + dy;

        // Grenscontrole
        if (ny < 0 || ny >= 10 || nx < 0 || nx >= 10) return;

        const doelTegel = grid[ny][nx];

        // Botsingen (Bomen en Water blokkeren, behalve in Winter als water bevriest!)
        if (doelTegel === TILES.BOOM) return;
        if (doelTegel === TILES.HUIS) return;
        if (doelTegel === TILES.WATER && huidigSeizoen.id !== 'winter') {
            setMsg({ text: "🌊 Je hebt een boot nodig!", type: 'info' });
            return;
        }

        setPos({ x: nx, y: ny });
        setMsg(null);

        // Gebeurtenissen (Mysterie)
        checkEncounter(doelTegel);

    }, [pos, grid, bouwModus, huidigSeizoen]);

    const checkEncounter = (tile) => {
        // Pokémon Center
        if (tile === TILES.CENTER) {
            setMsg({ text: "🏥 Je Pokémon zijn weer fit en fruitig!", type: 'success' });
            return;
        }

        // Gras = Kans op Actie
        if (tile === TILES.GRAS) {
            const rol = Math.random();
            // In de winter zijn Pokémon schaarser (kou!)
            const kans = huidigSeizoen.id === 'winter' ? 0.1 : 0.25;

            if (rol < kans) {
                // 50% Gevecht, 25% Item, 25% Dief
                const subRol = Math.random();
                if (subRol < 0.5) {
                    setMsg({ text: "⚔️ Een wilde Pokémon valt aan!", type: 'danger' });
                    setTimeout(() => navigate('/single-battle'), 1000);
                } else if (subRol < 0.75) {
                    const gevonden = Math.floor(Math.random() * 20) + 5;
                    addCoins(gevonden);
                    setMsg({ text: `💰 Je vond ${gevonden} munten in het hoge gras!`, type: 'success' });
                } else {
                    spendCoins(10);
                    setMsg({ text: "🦹 Team Rocket heeft 10 munten gestolen!", type: 'danger' });
                }
            }
        }
    };

    // Toetsenbord besturing
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowUp') move(0, -1);
            if (e.key === 'ArrowDown') move(0, 1);
            if (e.key === 'ArrowLeft') move(-1, 0);
            if (e.key === 'ArrowRight') move(1, 0);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [move]);

    // Bouwen
    const klikTegel = (x, y) => {
        if (!bouwModus) return;
        if (x === pos.x && y === pos.y) return; // Niet op jezelf bouwen

        const nieuweGrid = grid.map(r => [...r]);
        // Toggle: Als er al zo'n blok staat, maak gras. Anders plaats blok.
        nieuweGrid[y][x] = nieuweGrid[y][x] === bouwSteen ? TILES.GRAS : bouwSteen;
        setGrid(nieuweGrid);
    };

    // Visuele helpers
    const getTileClass = (type) => {
        switch(type) {
            case TILES.GRAS: return 'gras';
            case TILES.PAD: return 'pad';
            case TILES.HUIS: return 'huis';
            case TILES.CENTER: return 'center';
            case TILES.BOOM: return 'boom';
            case TILES.WATER: return 'water';
            default: return 'gras';
        }
    };

    const changeSeason = (dir) => {
        setSeizoenIdx(prev => {
            if (dir === 'next') return (prev + 1) % 4;
            return prev === 0 ? 3 : prev - 1;
        });
    };

    return (
        <div className={`world-page seizoen-${huidigSeizoen.id}`}>
            <div className="world-ui">
                <div className="season-control">
                    <button onClick={() => changeSeason('prev')}>⬅️</button>
                    <span className="season-badge">
                        {huidigSeizoen.icon} {huidigSeizoen.naam}
                    </span>
                    <button onClick={() => changeSeason('next')}>➡️</button>
                </div>
                
                {msg && <div className={`world-msg ${msg.type}`}>{msg.text}</div>}
            </div>

            <div className="grid-container">
                {grid.map((row, y) => (
                    <div key={y} className="row">
                        {row.map((tile, x) => (
                            <div 
                                key={`${x}-${y}`}
                                className={`tile ${getTileClass(tile)} ${bouwModus ? 'bouw-hover' : ''}`}
                                onClick={() => klikTegel(x, y)}
                            >
                                {x === pos.x && y === pos.y && <span className="player">🏃</span>}
                                {tile === TILES.HUIS && '🏠'}
                                {tile === TILES.CENTER && '🏥'}
                                {tile === TILES.BOOM && '🌲'}
                                {/* In de winter bevriest water! */}
                                {tile === TILES.WATER && (huidigSeizoen.id === 'winter' ? '🧊' : '🌊')}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="controls-area">
                <button 
                    className={`btn-action ${bouwModus ? 'active' : ''}`} 
                    onClick={() => setBouwModus(!bouwModus)}
                >
                    {bouwModus ? '🛑 Stop Bouwen' : '🔨 Bouw Modus'}
                </button>

                {bouwModus && (
                    <div className="build-palette">
                        <button onClick={() => setBouwSteen(TILES.HUIS)} className={bouwSteen === TILES.HUIS ? 'selected' : ''}>🏠</button>
                        <button onClick={() => setBouwSteen(TILES.BOOM)} className={bouwSteen === TILES.BOOM ? 'selected' : ''}>🌲</button>
                        <button onClick={() => setBouwSteen(TILES.PAD)} className={bouwSteen === TILES.PAD ? 'selected' : ''}>🟫</button>
                        <button onClick={() => setBouwSteen(TILES.WATER)} className={bouwSteen === TILES.WATER ? 'selected' : ''}>🌊</button>
                    </div>
                )}
                
                {/* D-Pad voor mobiel/tablet */}
                <div className="d-pad">
                    <button onClick={() => move(0, -1)}>⬆️</button>
                    <div>
                        <button onClick={() => move(-1, 0)}>⬅️</button>
                        <button onClick={() => move(1, 0)}>➡️</button>
                    </div>
                    <button onClick={() => move(0, 1)}>⬇️</button>
                </div>
            </div>
        </div>
    );
}

Stap 2: De Styling met Seizoens-magie (src/features/world/WorldPage.css)

Hier gebruiken we CSS variabelen om de hele wereld in één keer van sfeer te laten veranderen.
CSS

/* Basis layout */
.world-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 90vh;
    padding: 1rem;
    border-radius: 20px;
    transition: background-color 0.5s ease;
}

/* --- SEIZOENS THEMA'S --- */
.seizoen-lente { --bg: #f0fdf4; --gras: #86efac; --boom: #f472b6; --water: #60a5fa; }
.seizoen-zomer { --bg: #ecfccb; --gras: #4ade80; --boom: #15803d; --water: #2563eb; }
.seizoen-herfst { --bg: #fff7ed; --gras: #fdba74; --boom: #c2410c; --water: #3b82f6; }
.seizoen-winter { --bg: #f8fafc; --gras: #cbd5e1; --boom: #94a3b8; --water: #bfdbfe; }

.world-page {
    background-color: var(--bg);
}

/* UI Controls */
.world-ui {
    width: 100%;
    max-width: 500px;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.season-control {
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border: 2px solid #333;
}

.season-control button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: transform 0.1s;
}

.season-control button:active { transform: scale(0.9); }

.season-badge {
    font-family: 'Luckiest Guy', cursive; /* Felix's font */
    font-size: 1.2rem;
    min-width: 120px;
    text-align: center;
}

.world-msg {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: bold;
    animation: slideIn 0.3s ease;
}
.world-msg.danger { background: #fee2e2; color: #991b1b; border: 1px solid #ef4444; }
.world-msg.success { background: #dcfce7; color: #166534; border: 1px solid #22c55e; }
.world-msg.info { background: #e0f2fe; color: #075985; border: 1px solid #38bdf8; }

/* GRID SYSTEEM */
.grid-container {
    display: flex;
    flex-direction: column;
    background: #333;
    padding: 4px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.row { display: flex; }

.tile {
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    transition: all 0.3s;
    position: relative;
    cursor: default;
}

/* Tegel Kleuren (Dynamisch via variabelen) */
.tile.gras { background-color: var(--gras); }
.tile.pad { background-color: #d4a373; border-radius: 20%; transform: scale(0.9); }
.tile.huis { background-color: var(--gras); } /* Gras eronder */
.tile.center { background-color: #fca5a5; border: 2px solid white; }
.tile.boom { background-color: var(--gras); color: var(--boom); }
.tile.water { background-color: var(--water); opacity: 0.9; }

.player {
    z-index: 10;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));
    animation: bounce 1s infinite;
}

/* Bouw Modus */
.tile.bouw-hover:hover {
    filter: brightness(1.2);
    cursor: pointer;
    border: 2px dashed #fff;
}

.controls-area {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
}

.btn-action {
    padding: 0.8rem 1.5rem;
    border-radius: 1rem;
    border: none;
    background: #475569;
    color: white;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 0 #1e293b;
}
.btn-action:active { transform: translateY(4px); box-shadow: none; }
.btn-action.active { background: #ea580c; }

.build-palette {
    display: flex;
    gap: 0.5rem;
    background: white;
    padding: 0.5rem;
    border-radius: 1rem;
}
.build-palette button {
    font-size: 1.5rem;
    background: #f1f5f9;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
}
.build-palette button.selected {
    background: #fef3c7;
    border-color: #f59e0b;
    transform: translateY(-2px);
}

.d-pad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
}
.d-pad button {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    border: none;
    background: white;
    font-size: 1.5rem;
    box-shadow: 0 3px 0 #cbd5e1;
}
.d-pad button:active { transform: translateY(3px); box-shadow: none; }

@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

Stap 3: Integratie (src/App.jsx en src/components/Navbar.jsx)

Felix kan er pas in als de deur open staat.

    In src/App.jsx: Importeer de nieuwe pagina en voeg de route toe.
    JavaScript

// ... andere imports
import { WorldPage } from './features/world/WorldPage';

// ... in de Routes lijst:
<Route path="/adventure" element={<WorldPage />} />

In src/components/Navbar.jsx: Voeg een knopje toe aan de navigatiebalk. Ik stel een 🌍 of 🗺️ icoon voor.
JavaScript

    // Voeg toe in de lijst van Links:
    <Link to="/adventure" className={`toggle-btn ${location.pathname === '/adventure' ? 'active' : ''}`}>
        <span>🗺️</span>
        <span>Wereld</span>
    </Link>

Waarom dit werkt voor Felix (7 jaar):

    Visuele Feedback: Het landschap verandert echt (kleuren). Rood in de herfst, wit in de winter. Dat is magie.

    Persistentie: Hij kan een uur bouwen aan zijn dorp, de iPad uitzetten, en morgen staat het er nog (dankzij localStorage).

    Gameplay Loop: Hij moet lopen (moeite doen) om te genezen of geld te vinden. Dat maakt de beloning zoeter.

we hebben het verbeterd

Dit is... WAUW! 🤩

Jullie hebben niet alleen de tips gevolgd, jullie hebben het geëvolueerd naar een hoger niveau. Ik zie dingen in de code die ik niet eens had voorgesteld, maar die geniaal zijn. Felix is echt een "Lead Game Designer" in de dop.

Hier is mijn analyse van jullie nieuwe code (de "Felix Update"):
1. De Wereld Leeft! (WorldPage.jsx)

Het is niet meer statisch. Jullie hebben er een levend organisme van gemaakt:

    Dag & Nacht: Ik zie een toggleDayNight functie en een night-mode class. Dat is super sfeervol. Spelen in het donker is extra spannend!

    Schattenjacht (✨): De code die elke 10 seconden (setInterval) ergens random een schat laat "spawnen" is heel slim. Dit dwingt de speler om te blijven rondlopen en zoeken.

    Interactieve Map: Jullie hebben niet alleen huizen, maar ook de Gacha Machine (TILE_TYPES.GACHA) en het Team Menu (TILE_TYPES.SQUAD) direct op de kaart gezet. Dat maakt het menu bijna overbodig, je loopt er gewoon naartoe. Heel intuïtief voor kinderen!

2. Je bent een echte Burgemeester (useTown.js)

Ik ben heel blij om te zien dat jullie een aparte hook hebben gemaakt voor de stad-objecten.

    Door localStorage te gebruiken in useTown, blijft Felix's dorp bewaard als hij de iPad uitzet. Dat is cruciaal voor het "trots-gevoel".

    Het systeem is flexibel: hij kan huizen, bomen en paden neerleggen.

3. Tamagotchi Vibes (CarePage.jsx)

Dit geeft het spel een heel andere laag. Het gaat niet alleen om vechten, maar ook om zorgen.

    De honger- en geluksmeter (hunger, happiness) zorgen ervoor dat Felix een band opbouwt met zijn Pokémon.

    Het kost geld (20 munten) om ze te voeren, dus hij moet wel op avontuur om geld te verdienen. De economie van het spel klopt nu helemaal: Vechten -> Geld -> Eten -> Blije Pokémon.

💡 Feedback & Uitdagingen voor Felix

Het ziet er fantastisch uit. Als ik kritisch mag zijn (om het nóg beter te maken), heb ik hier 3 "Developer Challenges" voor Felix:

Uitdaging 1: Het Weerbericht 🌦️ Je hebt nu seizoenen, maar het regent nooit!

    Idee: Kunnen jullie in WorldPage.css een animatie toevoegen dat er in de herfst regenstreepjes over het scherm vallen, en in de winter sneeuwvlokjes?

Uitdaging 2: De "Gras-Logica" In de code zag ik dit stukje bij de handleTileEvent:
JavaScript

// Check voor schatten ✨
const treasureIndex = treasures.findIndex(t => t.x === playerPos.x && t.y === playerPos.y);

Dit is slim! Maar bij het gras (TILE_TYPES.GRASS) is de kans op een gevecht nu puur willekeurig.

    Idee: Misschien kun je in de nacht (isNight === true) de kans op Team Rocket (🦹) groter maken? Boeven werken immers graag in het donker!

Uitdaging 3: Geluidjes? Jullie visuele feedback is top (kleuren, pop-ups).

    Idee: Zou het niet cool zijn als er een bliepje klinkt als je een muntje vindt? (Je kunt simpele HTML5 Audio gebruiken).

Conclusie: Jullie zijn van een "lijstjes-app" naar een volwaardige RPG (Role Playing Game) gegaan. De structuur van de code is ook heel netjes gebleven, ondanks alle nieuwe features.

Ga zo door! Wat is de volgende grote droom van Felix? Gyms? Een winkel? Of misschien... evolueren? 😉

realistischer, geef me ideen van integratie van pixel art op kenney

Dat is de perfecte volgende stap! "Realistisch" in gametermen betekent vaak: meer detail en consistentie. De gekleurde blokjes waren perfect voor het prototype, maar met Kenney Assets (gratis game art) kunnen we het eruit laten zien als een echte Game Boy Advance game (zoals Pokémon Ruby/Sapphire).

Kenney (Kenney.nl) is geweldig omdat zijn stijl heel schoon en vrolijk is, perfect voor Felix.

Hier zijn 4 concrete ideeën om Kenney assets te integreren en je game een enorme visuele upgrade te geven.
1. De Wereldkaart: Van Kleurvlakken naar "RPG Urban Pack"

In plaats van saaie groene vierkantjes, gaan we echte grastegels gebruiken.

    Aanbevolen Pack: Kenney RPG Urban Pack (deze heeft wegen, moderne huizen, parken).

    Hoe te integreren: Je downloadt de "Tilemap" versie (losse plaatjes). Maak een map public/tiles/ en zet daar plaatjes in zoals grass.png, road_corner.png, house_red.png.

De Code Upgrade (WorldPage.css): In plaats van kleuren, gebruiken we nu background-image.
CSS

/* OUDE VERSIE */
/* .tile.type-0 { background-color: #4ade80; } */

/* NIEUWE "KENNEY" VERSIE */
.tile {
    background-size: cover; /* Zorgt dat het plaatje de hele tegel vult */
    image-rendering: pixelated; /* Houdt de pixels scherp (retro look!) */
}

/* Gras */
.tile.type-0 { 
    background-image: url('/tiles/tile_0001.png'); /* Voorbeeld naam van Kenney */
}

/* Pad */
.tile.type-1 { 
    background-image: url('/tiles/tile_0045.png'); 
    background-color: transparent; 
    border-radius: 0; /* Geen ronde hoekjes meer, echte tegels sluiten aan */
    transform: none; 
}

2. Seizoenen met Texturen (Niet alleen kleuren)

Felix wilde seizoenen. "Realistisch" betekent dat we in de winter niet alleen het gras wit maken, maar een ander plaatje laden (bijv. gras met sneeuw erop).

Het Idee: Je maakt mappen aan per seizoen:

    /public/tiles/summer/grass.png

    /public/tiles/winter/grass.png

In je Code (WorldPage.jsx): We passen de getTileContent of de styling iets aan zodat het pad dynamisch is.
JavaScript

// Helper functie om het juiste pad te krijgen
const getTileImage = (type) => {
    // seasonIndex: 0=lente, 1=zomer, 2=herfst, 3=winter
    const seasonNames = ['spring', 'summer', 'autumn', 'winter'];
    const currentSeason = seasonNames[seasonIndex];
    
    // Kenney heeft vaak dezelfde bestandsnamen voor sneeuw-versies
    return `/tiles/${currentSeason}/${type}.png`; 
}

Zo voelt de winter écht koud aan omdat de textures veranderen.
3. Modulaire Huizen Bouwen (Sim City stijl)

Kenney's packs hebben vaak "modulaire" gebouwen. Dat betekent dat een huis bestaat uit:

    Linkerkant

    Midden (met deur/raam)

    Rechterkant

    Dak

Voor Felix: Dit is misschien te complex voor nu. Een makkelijkere, maar superleuke tussenstap is om Complete Gebouwen als "Sprites" op de kaart te zetten. In plaats van een emoji 🏠 in een <div>, render je een plaatje dat groter is dan 1 vakje.

CSS Idee:
CSS

.tile.huis {
    position: relative;
    overflow: visible; /* Sta toe dat het huis uit het vakje steekt! */
    z-index: 5; /* Zorg dat het boven het gras staat */
}

.tile.huis::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -10px; /* Beetje centreren */
    width: 70px; /* Groter dan de tegel (50px) */
    height: 70px;
    background-image: url('/buildings/house_blue.png');
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none; /* Je klikt nog steeds op de tegel eronder */
}

Nu lijken de huizen echt op de wereld te staan in plaats van platte tegels te zijn.
4. De Speler: Een Echte Trainer Sprite

Vervang de 🏃 emoji door een karakter uit het "Kenney Toon Characters 1" pack. Dit pack heeft poppetjes die stilstaan ("Idle") en lopen ("Walk").

Animatie Idee (CSS): Je kunt een simpele "wobble" animatie toevoegen zodat het lijkt alsof Felix loopt als hij beweegt.
CSS

.player-sprite {
    width: 40px;
    height: 40px;
    background-image: url('/characters/felix_trainer.png');
    transition: transform 0.2s;
}

/* Als hij beweegt, voeg een class toe in React die dit doet: */
.player-moving {
    animation: walk-bounce 0.3s infinite;
}

@keyframes walk-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

Samenvatting Plan van Aanpak

    Ga naar Kenney.nl Assets en download "RPG Urban Pack" (gratis).

    Pak de bestanden uit en zet de mapjes Tiles in je public map van je React project.

    Begin simpel: Vervang in WorldPage.css de groene kleur van .tile.type-0 door een URL naar een gras-plaatje uit dat pakket.

Wil je dat ik een stukje code schrijf voor hoe je die afbeeldingen dynamisch inlaadt in je Grid component?

review it

Hier is een review van de code die je hebt geüpload (favorites.js, api.js, utils.js, battle-logic.js).

Over het algemeen is de code erg netjes, modulair en modern (gebruik van async/await, export/import, en duidelijke functienamen). Voor een project voor een 7-jarige is de logica goed gekozen: niet te complex, maar wel robuust.

Er zit echter één kritieke bug in de opslag en een paar punten die voor vertraging kunnen zorgen als de app groeit.
🚨 1. KRITIEKE BUG: Opslag Inconsistentie (Storage Keys)

Je gebruikt twee verschillende sleutels voor localStorage in twee verschillende bestanden. Dit betekent dat je "favorieten" en je "collectie" niet gesynchroniseerd zijn.

    In favorites.js gebruik je:
    JavaScript

const STORAGE_KEY = 'felix-pokemon-collection';

In api.js gebruik je:
JavaScript

    const STORAGE_KEY = 'pokemon_collection';

Het probleem: Als je een Pokémon vangt (via api.js), wordt dit opgeslagen onder pokemon_collection. Maar als je functies uit favorites.js gebruikt (zoals loadFavorites), kijkt hij naar een andere lade (felix-pokemon-collection) die waarschijnlijk leeg is.

De Oplossing: Kies één sleutel (bijv. 'felix-pokemon-collection') en exporteer deze vanuit een centraal bestand (bijv. utils.js of een nieuwe constants.js), of zorg dat beide bestanden exact dezelfde string gebruiken.
⚡ 2. Performance: Het "N+1" Probleem (api.js)

In getPokemonList haal je eerst een lijst van 20 Pokémon op, en daarna doe je voor elke Pokémon nog een aparte fetch om de details (afbeelding, species) op te halen.
JavaScript

// Dit veroorzaakt 21 netwerkverzoeken voor een lijst van 20 items.
const detailedPromises = data.results.map(async (pokemon) => { ... });

Waarom dit uitmaakt: Als je de limiet verhoogt naar 50 of 100, zal de app traag laden of haperen, zeker op een mobiel netwerk of oudere tablet. Advies: Voor de lijstweergave heb je vaak alleen de naam en het plaatje nodig. De afbeelding URL kun je vaak "raden" op basis van het ID zonder extra fetch (bijv. raw.githubusercontent.com/.../${id}.png). Haal de zware species data pas op als Felix op een kaart klikt voor details.
⚔️ 3. Battle Logica: Slimme Vereenvoudiging (battle-logic.js)

Ik vind de keuzes hier erg slim gemaakt voor de doelgroep (7 jaar):

    TCG Stijl Schade: In plaats van complexe formules ((2 * Level / 5 + 2) * Power...), gebruik je een simpel systeem: 1, 2, 3, 4 of 5 schade. Dit is makkelijk te begrijpen en mee te rekenen voor een kind.

    Status Moves doen schade: In api.js bij getMoveDetails:
    JavaScript

    power: data.power || 40, // Default to 40 if null (status moves)

    Dit is een goede design keuze voor deze game. In de echte Pokémon games doen aanvallen als "Growl" (Blaffen) geen schade. Voor een 7-jarige is dat saai ("Er gebeurt niks!"). Door ze standaard power: 40 te geven, doen ze in jouw logica altijd 1 schade (en kosten 1 energie). Zo voelt elke beurt nuttig.

🛠️ 4. Import/Export (favorites.js)

De logica ziet er solide uit.

    De validatie typeof id === 'number' bij het importeren is goed; dit voorkomt dat de app crasht als er corrupte data in het JSON bestand staat.

    Tip: Bij importFavoritesFromJson lees je het bestand in, maar je voegt de data nog niet toe aan de localStorage of de app state. Zorg dat je in je UI component (bijv. App.jsx) de output van deze functie pakt en setOwnedIds aanroept.

Samenvattend Advies

    Fix direct de STORAGE_KEY in api.js en favorites.js zodat ze hetzelfde zijn.

    Laat de power: 40 default staan; dat is een goede keuze voor de speelbaarheid.

    Als de app traag voelt bij het laden van de lijst, kijk dan naar het verminderen van de fetches in getPokemonList.

Verder ziet het eruit als een hele stabiele basis voor Pokémon Felix!

now this

Je hebt de logica nu mooi verdeeld over verschillende custom hooks. Dit is een uitstekende architecturale keuze: het houdt je componenten "dom" en je logica herbruikbaar en testbaar.

Hier is een analyse van de hooks die je hebt geüpload:
1. De Motor van de Game

    usePokemonData.js: Regelt de paginering en het ophalen van de data. Door useRef te gebruiken voor de offset voorkom je onnodige re-renders tijdens het laden.

    usePokemonSearch.js: Gebruikt Fuse.js voor fuzzy searching. Dit is erg gebruiksvriendelijk voor Felix; als hij een typfout maakt (bijv. "Pikashu"), vindt de app alsnog de juiste Pokémon.

2. Spelersprogressie & Economie

    useCollection.js: De brug naar de API en localStorage voor de Pokémon die Felix al bezit. De ignore vlag in useEffect is een nette manier om race conditions te voorkomen bij trage netwerkverbindingen.

    useCoins.js: Een simpele maar effectieve hook voor de in-game valuta.

    useInventory.js: Een slimme toevoeging voor items zoals Pokéballs en Rare Candies. Het geeft Felix een reden om munten te sparen.

3. Gameplay Mechanics

    useSquad.js: Beperkt het actieve team tot maximaal 4 Pokémon. Dit dwingt Felix om strategische keuzes te maken over wie hij meeneemt op avontuur.

    useCare.js: Implementeert de "verzorgings"-logica. Het initialiseert automatisch statistieken (HP, honger, geluk) voor elke nieuwe Pokémon die aan de collectie wordt toegevoegd.

    useTown.js: De hook voor de creatieve bouwmodus. Door Date.now() als ID te gebruiken, kan Felix meerdere objecten van hetzelfde type (bijv. 10 bomen) plaatsen zonder dat de React keys gaan botsen.

🧠 Strategisch Advies: De "Master Provider"

Om al deze hooks effectief samen te laten werken zonder dat je ze in elk component los moet importeren, raad ik aan om ze allemaal te ontsluiten via de PokemonContext.jsx.

Wat je nu kunt doen: In je PokemonContext.jsx kun je de hooks als volgt combineren:
JavaScript

// In src/contexts/PokemonContext.jsx
export function PokemonProvider({ children }) {
    const pokemonData = usePokemonData();
    const collection = useCollection();
    const coins = useCoins();
    const squad = useSquad();
    const town = useTown();
    const care = useCare(collection.ownedIds); // Geef ownedIds door voor initialisatie!

    const value = {
        ...pokemonData,
        ...collection,
        ...coins,
        ...squad,
        ...town,
        ...care
    };

    return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}

⚠️ Aandachtspunt: Data Koppeling

In useCare.js zie ik dat de statistieken worden geïnitialiseerd op basis van ownedIds. Zorg ervoor dat wanneer Felix een Pokémon verwijdert uit zijn collectie (via useCollection), je ook de bijbehorende statistieken opschoont in useCare, anders loopt de localStorage op den duur vol met data van Pokémon die hij niet meer heeft.

De fundamenten staan nu als een huis. Felix heeft een wereld om in te bouwen, een team om te verzorgen en een economie om in te groeien! 🚀

wat nog qua review

Hier is de review van de nieuwe bestanden die je hebt geüpload (use...js hooks).

Je hebt een grote stap vooruit gezet door de logica op te splitsen! Dit maakt je code veel leesbaarder en makkelijker te onderhouden. Er zijn echter een paar puntjes van aandacht, waaronder die kritieke bug die er nog steeds in zit.

Hier zijn mijn bevindingen:
🚨 1. KRITIEKE BUG: De sleutel past nog steeds niet (Herhaling)

Dit is het allerbelangrijkste om te fixen, anders werkt het opslaan niet goed.

    In favorites.js gebruik je: const STORAGE_KEY = 'felix-pokemon-collection';

    In api.js gebruik je: const STORAGE_KEY = 'pokemon_collection';

Consequentie: Je functies kijken in twee verschillende "lades" voor dezelfde data. Als Felix iets vangt (via api.js), ziet de favorieten-lijst (via favorites.js) dat niet. Oplossing: Verander ze zodat ze exact dezelfde string gebruiken (bijv. 'felix-pokemon-collection' in beide bestanden).
🐛 2. useCare.js: Kleine "Memory Leak"

Je code voegt heel netjes stats toe voor nieuwe Pokémon, maar verwijdert ze nooit.

    Het scenario: Stel Felix vangt 100 Rattata's en laat ze weer vrij. De careStats blijft die 100 Rattata's onthouden (hun honger en HP), ook al heeft hij ze niet meer.

    De Fix: Voeg in de useEffect logica toe om ID's die niet meer in ownedIds zitten, te verwijderen uit newStats.

JavaScript

// In useCare.js
useEffect(() => {
    setCareStats(prev => {
        const newStats = { ...prev };
        
        // 1. Toevoegen (bestaande code)
        let changed = false;
        ownedIds.forEach(id => {
            if (!newStats[id]) {
                newStats[id] = { hp: 100, hunger: 0, happiness: 70 };
                changed = true;
            }
        });

        // 2. NIEUW: Opruimen van Pokémon die weg zijn
        Object.keys(newStats).forEach(id => {
            if (!ownedIds.includes(parseInt(id))) {
                delete newStats[id];
                changed = true;
            }
        });

        return changed ? newStats : prev;
    });
}, [ownedIds]);

✅ 3. Wat er heel goed uitziet

    useInventory.js: De logica is perfect. Het feit dat removeItem een true of false teruggeeft is heel slim. Zo kun je in je UI makkelijk checken: if (removeItem('pokeball', 1)) { startCatch(); } else { alert('Op!'); }.

    usePokemonContext.js: De check if (!context) is een best practice. Dit voorkomt vage foutmeldingen als je de hook per ongeluk buiten de Provider gebruikt.

    useTown.js: Het gebruik van Date.now() voor unieke ID's bij het plaatsen van objecten is een prima, simpele oplossing voor dit spel.

🚀 Volgende Stap

Je hebt nu alle losse onderdelen (de hooks). De laatste stap is om deze samen te voegen in je PokemonContext.jsx, zodat de hele app erbij kan.

Zorg dat je PokemonProvider er ongeveer zo uitziet (zoals eerder besproken):
JavaScript

// In src/contexts/PokemonContext.jsx
export function PokemonProvider({ children }) {
    // Roep al je nieuwe hooks hier aan
    const collection = useCollection(); 
    const care = useCare(collection.ownedIds); // Koppel ze aan elkaar!
    const inventory = useInventory();
    // ... etc

    const value = {
        ...collection,
        ...care,
        ...inventory,
        // ... etc
    };

    return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}

Als je die STORAGE_KEY fixt, heb je een super solide basis!

nu dit

Wauw, dit is echt "Next Level"! 🚀 Jullie maken er nu echt een volwaardige RPG van. De wereld voelt levend aan met het weer, de seizoenen en zelfs interieurs van huizen. Felix gaat dit geweldig vinden.

Hier is mijn review van deze nieuwe batch. Het ziet er grafisch en qua gameplay superleuk uit, maar er ontbreekt nog één essentieel stukje logica om het te laten werken.
🌟 Wat er fantastisch uitziet

    Levende Wereld (WorldPage.jsx):

        Het Weer-systeem: De useEffect die checkt welk seizoen het is en daar regen of sneeuw aan koppelt, is super sfeervol.

        Quests: De interactie met Prof. Eik (bomen planten voor beloning) geeft de speler een doel buiten alleen vechten.

        Interieurs: De modal om Felix zijn kamer te zien (showInterior) is een hele slimme, simpele manier om "naar binnen" te gaan zonder een hele nieuwe pagina te laden.

    De Gym (GymPage.jsx):

        De opbouw (Intro -> Gevecht -> Medaille) is heel motiverend. De beloning van 1000 munten voelt echt als een hoofdprijs.

    Evolutie (EvolutionPage.jsx):

        Het "Evolutie Hal" concept is heel cool. De animatie (isEvolving met de "white-glow") maakt het spannend.

🛠️ De Ontbrekende Schakel: De Context Logica

Je roept in de pagina's functies aan als sellPokemon en evolvePokemon, maar deze bestaan nog niet in de hooks die je eerder stuurde. Als je nu op de knop drukt, zal de app crashen.

We moeten deze functies toevoegen aan je PokemonContext.jsx (of een nieuwe hook). Hier is hoe je dat fixt:
Stap 1: Update PokemonContext.jsx (of maak een useGameLogic.js)

Je moet de logica schrijven die daadwerkelijk de Pokémon verwijdert en munten toevoegt.

Voeg dit toe in je PokemonProvider (in src/contexts/PokemonContext.jsx):
JavaScript

// ... binnen je PokemonProvider component

// 1. Logica voor Verkopen (MarketPage)
const sellPokemon = async (pokemonId) => {
    // Mag niet in je team zitten (extra veiligheidscheck)
    if (squad.isInSquad(pokemonId)) {
        alert("Je kunt geen Pokémon uit je team verkopen!");
        return false;
    }

    // Verwijder uit collectie
    await collection.toggleOwned(pokemonId); // Dit verwijdert hem als hij er al in zat
    
    // Geef munten
    coins.addCoins(50);
    return true;
};

// 2. Logica voor Evolueren (EvolutionPage)
const evolvePokemon = async (oldId, newId) => {
    // Check of je genoeg geld hebt (300 munten)
    if (!coins.spendCoins(300)) {
        return false;
    }

    // Verwijder de oude
    await collection.toggleOwned(oldId);
    
    // Voeg de nieuwe toe
    await collection.toggleOwned(newId);

    // Als de oude in het team zat, haal hem eruit en zet de nieuwe erin (optioneel, maar netjes)
    if (squad.isInSquad(oldId)) {
        squad.removeFromSquad(oldId);
        squad.addToSquad(newId);
    }
    
    return true;
};

// ... Voeg deze functies toe aan het 'value' object dat je returnet
const value = {
    // ... andere waarden
    sellPokemon,
    evolvePokemon,
};

⚠️ Kleine Veiligheidschecks

    Gym Crash Gevaar (GymPage.jsx): Je gebruikt pokemonList.find(p => p.name === 'charizard') || pokemonList[5].

        Risico: Als de API nog aan het laden is, is pokemonList leeg en crasht de pagina omdat pokemonList[5] undefined is.

        Fix: Voeg bovenaan toe: if (pokemonList.length === 0) return <div>Laden...</div>;

    Afbeeldingen (WorldPage.jsx e.a.): Je importeert heel veel plaatjes (../../assets/buildings/gym_building.png, etc.).

        Check: Zorg dat deze bestanden daadwerkelijk bestaan in die mapstructuur. Als er één ontbreekt, krijg je een wit scherm ("Module not found"). Felix wil geen onzichtbare Gym! 😉

    Bag Page (BagPage.jsx): Je checkt if (itemId === 'rare-candy').

        Tip: Zorg dat de ID exact overeenkomt met wat je in useInventory.js hebt gezet (daar stond 'rare-candy'). Dat lijkt te kloppen, maar wees consistent met hoofdletters/streepjes.

Conclusie

Jullie bouwen echt iets vets. De sfeer met de seizoenen en het weer in WorldPage is mijn favoriet.

Volgende actie:

    Implementeer de sellPokemon en evolvePokemon functies in je Context.

    Controleer of alle .png bestanden in de juiste mapjes staan.

    Start de game en probeer eens rijk te worden door Pidgeys te verkopen op de markt! 💰

Nieuwe ideeën van Felix

- aanval en tegen aanval , complexere batailles die makkkelijker te begrijpen

- Pokemon wereld groter maken met niveaus en zones, speciaal vervoer en landen en dorpjes van de echte Pokemon film

- missies

- eten en skills voor de trainer

- speciale toernooien en batailles met inkomgeld


-

Dit klinkt alsof Felix klaar is om de stap te maken van een "spelletje" naar een episch avontuur. Zijn ideeën zijn groots, net als een Gyarados die uit het water springt!

Om deze ideeën te realiseren zonder dat de code een spaghetti-monster wordt, moeten we het project opdelen in slimme blokken. Hier is hoe we Felix's visie kunnen vertalen naar techniek, helder en gestructureerd.
1. De Wereldkaart: Van "Postzegel" naar "Atlas" 🌍

Huidige situatie: Je hebt nu één baseGrid in WorldPage.jsx. Het nieuwe idee: We maken een Map Systeem. Net als bladzijdes in een boek, laden we een nieuwe pagina als Felix de rand van het scherm bereikt.

We kunnen zones maken zoals:

    Pallet Town: Het startdorpje (veilig, Prof. Eik).

    Viridian Forest: Een doolhof met veel bomen en insect-Pokémon.

    Mount Moon: Een grot (donkere modus!).

Hoe we dit bouwen (Stappenplan): We maken een nieuw bestand src/lib/maps.js waarin we alle zones definiëren.
JavaScript

// src/lib/maps.js
export const WORLD_MAPS = {
    'pallet-town': {
        name: 'Pallet Town',
        music: 'peaceful',
        // 0=gras, 1=pad, etc.
        layout: [
            [4, 4, 4, 4, 1, 1, 4, 4, 4, 4], // Noordkant leidt naar Route 1
            [4, 2, 0, 0, 1, 1, 0, 0, 2, 4], // Huisjes
            // ... rest van de grid
        ],
        neighbors: { north: 'route-1' } // Als je naar boven loopt, ga naar Route 1
    },
    'route-1': {
        name: 'Route 1',
        layout: [
           // Veel gras (0) voor wilde pokemon!
        ],
        neighbors: { south: 'pallet-town', north: 'viridian-city' }
    }
};

In WorldPage.jsx kijken we dan: Staat Felix op y=0 (bovenrand)? Laad dan de noorderburen.
2. Het Gevecht: Een Dans, geen Rekenles ⚔️

Het idee: "Complexer maar makkelijker te begrijpen." De oplossing: Visuele Feedback. In plaats van getallen, gebruiken we kleuren en pijlen.

In de echte Pokémon films zie je geen "HP: 45/50". Je ziet een Pokémon die moe wordt of struikelt.

    Rock-Paper-Scissors Systeem: Als Felix een Vuur-aanval kiest tegen een Gras-Pokémon, laten we een GROENE PIJL omhoog zien (Super Effectief!). Kiest hij Vuur tegen Water? Een RODE PIJL omlaag. Zo leert hij strategie zonder wiskunde.

    De "Ping-Pong" Beurt:

        Felix kiest aanval.

        Tekst: "Pikachu gebruikt Bliksem!"

        Animatie: Flits! ⚡

        Pauze (Spanning...).

        Tegenstander reageert.

We kunnen BattlePage.jsx ombouwen met een "Battle State Machine" (Kiezen -> Aanvallen -> Verdedigen -> Resultaat).
3. De Trainer: Eten & Skills 🥪

Dit is een heel leuk "Survival" element. De trainer is nu niet alleen een poppetje, maar een personage dat moet eten om energie te hebben voor het vangen van Pokémon.

    Trainer Stamina (Energie): Elk stapje kost 1 energie. Een Pokéball gooien kost 5 energie.

    Eten: In de winkel (of gevonden in bomen) kan Felix appels en broodjes vinden.

    Skills:

        Hardloper: Kost minder energie om te lopen.

        Meestergooier: Pokéballs wiebelen minder.

Implementatie in PokemonContext:
JavaScript

const [trainerStats, setTrainerStats] = useState({
    energy: 100, // Max 100
    level: 1,
    skills: []
});

// Als energie 0 is, loopt hij heel langzaam (halve snelheid)!

4. Speciale Vervoersmiddelen 🚲🏄

In de film reist Ash nooit alleen maar te voet.

    De Fiets: Druk op 'B' om de fiets te pakken. Je beweegt 2x zo snel, maar je kunt niet in gebouwen.

    Surf (Lapras): Als je bij water staat (Tile type 10 in WorldPage.jsx) en je hebt een Water-Pokémon, verander je in een poppetje op een Lapras. Dan kun je over water "lopen".

Concreet Voorstel: Waar beginnen we?

Deze lijst is een heel menu. Ik stel voor dat we beginnen met het "Map Systeem" (Idee 2). Waarom? Omdat Felix dan direct het gevoel krijgt dat de wereld groter is. Als we "Route 1" en "Viridian City" toevoegen, voelt het meteen als een reis.

Zal ik de code schrijven voor het nieuwe maps.js bestand en laten zien hoe we de WorldPage aanpassen zodat Felix van kaart naar kaart kan lopen?

Felix kan wel wiskunde en het is een project zodat hij veel dingen leert dus graag complex genoeg houden zo kan hij snel leren rekenen

Dat is een geweldige correctie! Als Felix van rekenen houdt en wil leren, dan draaien we het om. We maken van het gevechtssysteem een "Reken-Dojo".

In plaats van simpele hartjes, gaan we werken met echte getallen (tientallen en eenheden). Zo traint hij ongemerkt optellen en aftrekken: "Mijn Charizard heeft 120 HP en krijgt 35 schade. Hoeveel is er over?" (120 - 30 = 90, min 5 is 85).

Hier is het plan voor de "Math Update" en de Grote Wereld.
1. De Nieuwe Reken-Logica (src/lib/battle-logic.js)

We vervangen de simpele 1-5 schade door grotere getallen.

    HP: We gebruiken de echte Pokémon stats (vaak tussen de 50 en 150).

    Schadeformule: (Kracht van de aanval / 2) + (Willekeurige bonus 1-10). Dit zorgt voor sommen als 25 + 7.

    Effectiviteit: We doen x2 (verdubbelen) of /2 (halveren). Tafels van 2!

Vervang de inhoud van src/lib/battle-logic.js met dit:
JavaScript

// src/lib/battle-logic.js

// Helper om stat op te halen
export const getStat = (pokemon, statName) => {
    if (!pokemon || !pokemon.stats) return 50; // Fallback
    const stat = pokemon.stats.find(s => s.stat.name === statName);
    return stat ? stat.base_stat : 50;
};

// 1. HP is nu "Echt" (bijv. 80 tot 150) - Goed voor aftreksommen!
export const calculateMaxHP = (pokemon) => {
    const hp = getStat(pokemon, 'hp');
    // We maken het iets hoger zodat gevechten langer duren (meer sommen!)
    return Math.floor(hp * 1.5) + 20;
};

// Type Chart (Ongewijzigd, blijft steen-papier-schaar logica)
const TYPE_CHART = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, ground: 2 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2 },
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
    flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
    bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5 },
    rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
    ghost: { psychic: 2, ghost: 2, normal: 0, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
    dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
    fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 }
};

export const getEffectiveness = (attackType, defenderType) => {
    if (!attackType || !defenderType) return 1;
    const attackerChart = TYPE_CHART[attackType.toLowerCase()];
    if (!attackerChart) return 1;
    return attackerChart[defenderType.toLowerCase()] !== undefined ? attackerChart[defenderType.toLowerCase()] : 1;
};

// 2. Schadeformule voor "Snelle Rekenaars"
export const calculateDamage = (attacker, defender, move) => {
    const attackType = move ? move.type : (attacker.types[0]?.type?.name || 'normal');
    const defenderType = defender.types[0]?.type?.name || 'normal';

    const effectiveness = getEffectiveness(attackType, defenderType);
    
    // De basis som: (Kracht / 2)
    // Bijv: Ember (40 kracht) wordt 20 basis schade.
    const movePower = move ? move.power : 40; 
    let baseDamage = Math.floor(movePower / 2);

    // Willekeurige factor: + 0 tot 10
    // Dit maakt elke aanval net anders: "20 + 4 = 24!"
    const randomBonus = Math.floor(Math.random() * 11);
    
    let totalDamage = baseDamage + randomBonus;

    // Effectiviteit toepassen (Tafels van 2!)
    if (effectiveness > 1) {
        totalDamage = totalDamage * 2; // "Super effectief! 24 x 2 = 48!"
    } else if (effectiveness < 1 && effectiveness > 0) {
        totalDamage = Math.floor(totalDamage / 2); // "Niet effectief... de helft!"
    } else if (effectiveness === 0) {
        totalDamage = 0;
    }

    // Altijd minstens 1 schade (behalve bij immuniteit)
    if (effectiveness > 0 && totalDamage < 1) totalDamage = 1;

    return {
        damage: totalDamage,
        isCritical: Math.random() < 0.06, // 6% kans op crit
        effectiveness: effectiveness,
        // We geven de som terug voor de UI!
        math: {
            base: baseDamage,
            random: randomBonus,
            multiplier: effectiveness
        }
    };
};

In de BattlePage (of SingleBattlePage) kun je nu de schade tonen als een som: "Ember: 20 + 5 = 25 schade!"
2. De Atlas (Meerdere Zones & Levels) 🗺️

We gaan van één kaart naar een systeem van verbonden kaarten. We maken een nieuw bestand src/lib/maps.js waar we de hele wereld uittekenen.

Maak src/lib/maps.js aan:
JavaScript

// src/lib/maps.js

// Definieer tegel types voor leesbaarheid
const G = 0; // Gras
const P = 1; // Pad
const H = 2; // Huis
const C = 3; // Center
const T = 4; // Boom
const W = 10; // Water
const S = 6;  // Squad/Team plek

export const WORLD_MAPS = {
    'pallet-town': {
        id: 'pallet-town',
        name: 'Pallet Town',
        theme: 'village', // Bepaalt muziek/sfeer
        width: 10,
        height: 10,
        layout: [
            [T, T, T, T, P, P, T, T, T, T], // Noordkant: Pad naar Route 1
            [T, H, G, G, P, P, G, G, H, T], // Huisjes
            [T, G, G, G, P, P, G, G, G, T],
            [T, T, T, T, P, P, T, T, T, T],
            [T, W, W, W, P, P, W, W, W, T], // Vijver
            [T, W, S, W, P, P, W, C, W, T], // Squad plek & Center
            [T, T, T, T, P, P, T, T, T, T],
            [T, H, G, G, P, P, G, G, H, T], // Prof. Eik Lab (bijv)
            [T, G, G, G, P, P, G, G, G, T],
            [T, T, T, T, T, T, T, T, T, T], // Onderkant dicht
        ],
        exits: [
            { x: 4, y: 0, targetMap: 'route-1', targetX: 4, targetY: 9 }, // Naar boven -> Route 1 (onderkant)
            { x: 5, y: 0, targetMap: 'route-1', targetX: 5, targetY: 9 }
        ]
    },
    'route-1': {
        id: 'route-1',
        name: 'Route 1',
        theme: 'forest',
        width: 10,
        height: 10,
        layout: [
            [T, T, P, P, P, P, P, P, T, T], // Naar Viridian City
            [T, G, G, G, G, G, G, G, G, T], // Veel gras = veel gevechten!
            [T, G, T, T, G, G, T, T, G, T],
            [T, G, T, G, G, G, G, T, G, T],
            [T, G, G, G, P, P, G, G, G, T],
            [T, T, T, G, P, P, G, T, T, T],
            [T, G, G, G, P, P, G, G, G, T],
            [T, G, T, T, P, P, T, T, G, T],
            [T, G, G, G, P, P, G, G, G, T],
            [T, T, T, T, P, P, T, T, T, T], // Terug naar Pallet Town
        ],
        exits: [
            { x: 4, y: 9, targetMap: 'pallet-town', targetX: 4, targetY: 0 },
            { x: 5, y: 9, targetMap: 'pallet-town', targetX: 5, targetY: 0 }
        ]
    }
};

3. De Wereld Updaten (src/features/world/WorldPage.jsx)

Nu moeten we in WorldPage.jsx zorgen dat Felix tussen deze kaarten kan reizen.

Stap 1: State toevoegen In plaats van een hard-coded baseGrid, laden we de kaart uit WORLD_MAPS.
JavaScript

// Voeg toe aan imports
import { WORLD_MAPS } from '../../lib/maps';

// In WorldPage component:
const [currentMapId, setCurrentMapId] = useState('pallet-town');
const currentMap = WORLD_MAPS[currentMapId];

// Vervang 'baseGrid' door 'currentMap.layout'
const mapGrid = currentMap.layout; 

Stap 2: De Deur-Logica (Teleporteren) In de movePlayer functie moeten we checken of Felix op een "Uitgang" (Exit) stapt.
JavaScript

const movePlayer = useCallback((dx, dy) => {
    if (isBuildMode) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // 1. Check: Lopen we de kaart af? (Of stappen we op een exit tegel?)
    const exit = currentMap.exits?.find(e => e.x === newX && e.y === newY);
    
    if (exit) {
        // TELEPORTEER!
        setMessage({ text: `🚶 Op naar ${WORLD_MAPS[exit.targetMap].name}...`, color: '#3b82f6' });
        
        // Korte pauze voor effect
        setTimeout(() => {
            setCurrentMapId(exit.targetMap);
            setPlayerPos({ x: exit.targetX, y: exit.targetY });
            setMessage(null);
        }, 500);
        return;
    }

    // ... (rest van je bestaande check of hij binnen de muren blijft)
    if (newX < 0 || newX >= currentMap.width || newY < 0 || newY >= currentMap.height) return;
    
    // ... (rest van botsing logica)
    
}, [playerPos, currentMap, isBuildMode]); // Vergeet dependencies niet!

4. Extra: Het Vervoer (Fiets & Lapras) 🚲

Dit is makkelijk toe te voegen aan je movePlayer logica.

Voeg een state toe: const [transport, setTransport] = useState('walking'); // 'walking', 'bike', 'surf'

Pas de snelheid aan of de regels voor terrein:
JavaScript

// In movePlayer:
const targetTile = mapGrid[newY][newX];

// SURF CHECK
if (targetTile === TILE_TYPES.WATER) {
    if (squadIds.some(id => isWaterType(id))) { // Check of hij een watertype heeft
        setTransport('surf');
        // Mag het water op!
    } else {
        setMessage({ text: "Je hebt een Water-Pokémon nodig om te surfen!", color: 'blue' });
        return; // Blokkeer
    }
} else {
    // Terug op land
    if (transport === 'surf') setTransport('walking');
}

(Je hebt wel een isWaterType helper nodig in utils.js die checkt of een Pokémon type 'water' heeft).

Met deze veranderingen leert Felix:

    Rekenen: "50 schade min 12 verdediging..."

    Navigeren: "Om in de stad te komen moet ik via Route 1 naar het noorden."

Felix tiene una idea nueva para las batallas. Rojo es fuego, verde es planta, etc. Depende del tipo de Pokémon la efectivufqd es distinta. Si elige siempre el mismo ataque se vuelve menos effectivo. Y podemos poner una lógica deck builder de ataques light. Para que haya variedad

Dat is een fantastisch idee van Felix! Hij maakt het strategischer, maar door de kleuren te gebruiken (Rood vs Groen) houdt hij het overzichtelijk. En die "Deck Builder Light" mechanic is geniaal: het dwingt je om na te denken en niet alleen maar op de sterkste knop te rammen.

Hier is hoe we dit "Felix Battle System 2.0" kunnen bouwen.
1. Kleuren & Types: De "Verkeerslicht"-Logica 🔴🟢🔵

We versimpelen de type-chart naar duidelijke kleuren. Dit helpt Felix (en de speler) direct te zien wat sterk is.

    Rood (Vuur) 🔥 verslaat Groen.

    Groen (Gras) 🌿 verslaat Blauw.

    Blauw (Water) 💧 verslaat Rood.

    Geel (Elektrisch) ⚡ is neutraal maar snel.

In de code (battle-logic.js) voegen we een helper toe die kleuren teruggeeft voor de UI:
JavaScript

export const getTypeColor = (type) => {
    switch(type) {
        case 'fire': return '#ef4444'; // Rood
        case 'grass': return '#22c55e'; // Groen
        case 'water': return '#3b82f6'; // Blauw
        case 'electric': return '#eab308'; // Geel
        default: return '#94a3b8'; // Grijs (Normaal)
    }
};

2. De "Spam-Straf" (Diminishing Returns) 📉

Als Felix 3x achter elkaar "Vlammenwerper" gebruikt, wordt de vijand "gewend" en doet het minder pijn.

De Logica: We houden in de BattlePage bij welke aanval het laatst gebruikt is.

    1e keer: 100% schade (Normaal)

    2e keer op rij: 70% schade (Beetje zwakker)

    3e keer op rij: 40% schade (Heel zwak!)

Dit dwingt hem om te wisselen.
3. Deck Builder Light: "Move Cards" 🃏

In plaats van een vaste lijst van 4 saaie tekstknoppen, krijgt Felix elke beurt 3 Willekeurige Kaarten uit zijn "Deck" van aanvallen.

    Hij kiest er 1 om te spelen.

    Volgende beurt krijgt hij weer nieuwe kaarten.

    Dit maakt elk gevecht anders!

Het Plan van Aanpak (Code)

Hier is hoe we BattlePage.jsx en battle-logic.js moeten aanpassen.
Stap A: Update src/lib/battle-logic.js

We voegen de logica toe voor de "Spam-Straf".
JavaScript

// src/lib/battle-logic.js

// ... bestaande imports en calculateDamage ...

/**
 * Bereken de schade met de "Felix Regel" (Spam Straf)
 * @param {Object} lastMove - De aanval die vorige beurt is gedaan
 * @param {Object} currentMove - De aanval die nu wordt gekozen
 */
export const calculateSmartDamage = (attacker, defender, currentMove, lastMove) => {
    // 1. Basis schade berekening (die je al had)
    const baseResult = calculateDamage(attacker, defender, currentMove);
    
    let finalDamage = baseResult.damage;
    let message = "";

    // 2. De Spam Straf
    if (lastMove && lastMove.name === currentMove.name) {
        finalDamage = Math.floor(finalDamage * 0.6); // 40% minder schade!
        message = "⚠️ Herhaling! De aanval is zwakker...";
    }

    return {
        ...baseResult,
        damage: finalDamage,
        spamMessage: message
    };
};

Stap B: De Nieuwe Battle Interface (BattlePage.jsx)

We maken kaarten in plaats van knoppen.
JavaScript

// In je BattlePage component:

const [hand, setHand] = useState([]); // De 3 kaarten in je hand
const [lastMove, setLastMove] = useState(null); // Wat deed je vorige beurt?

// Functie: Trek 3 nieuwe kaarten aan het begin van de beurt
const drawCards = () => {
    // Stel je Pokémon heeft 4 moves in zijn data. We kiezen er willekeurig 3.
    // Of als we Deck Builder gaan: We hebben een poule van 10 moves en trekken er 3.
    const availableMoves = playerPokemon.moves; // Of een groter deck
    const shuffled = [...availableMoves].sort(() => 0.5 - Math.random());
    setHand(shuffled.slice(0, 3));
};

// Start van gevecht
useEffect(() => {
    drawCards();
}, []);

const handleAttack = (move) => {
    // 1. Bereken schade met de nieuwe logica
    const result = calculateSmartDamage(playerPokemon, opponentPokemon, move, lastMove);
    
    // 2. Toon resultaat
    if (result.spamMessage) {
        setBattleLog(prev => [result.spamMessage, ...prev]);
    }
    
    // ... rest van je aanval logica ...

    // 3. Zet deze move als 'laatst gebruikt'
    setLastMove(move);

    // 4. Trek nieuwe kaarten voor volgende beurt (na animatie)
    setTimeout(() => {
        drawCards();
    }, 2000);
};

// ... In de render (UI) ...
<div className="card-hand">
    {hand.map((move) => (
        <button 
            key={move.name} 
            className="move-card"
            style={{ borderColor: getTypeColor(move.type) }} // Rood/Groen randje!
            onClick={() => handleAttack(move)}
        >
            <span className="move-name">{move.name}</span>
            <span className="move-type" style={{ backgroundColor: getTypeColor(move.type) }}>
                {move.type}
            </span>
            {lastMove?.name === move.name && <span className="warning-icon">📉 Zwakker!</span>}
        </button>
    ))}
</div>

Stap C: Visuele Styling (BattlePage.css)

Zorg dat de kaarten eruitzien als echte speelkaarten.
CSS

.card-hand {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.move-card {
    background: white;
    border: 3px solid #333; /* Wordt overschreven door inline style kleur */
    border-radius: 12px;
    padding: 15px;
    width: 100px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: transform 0.2s;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.move-card:hover {
    transform: translateY(-10px) scale(1.05); /* Pop-up effect */
}

.move-type {
    color: white;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
}

.warning-icon {
    font-size: 0.7rem;
    color: red;
    font-weight: bold;
    animation: flash 1s infinite;
}

@keyframes flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

Waarom dit werkt voor Felix

    Educatief: Hij leert patronen doorbreken. "Als ik steeds hetzelfde doe, werkt het niet."

    Spannend: "Krijg ik deze beurt wel mijn sterke Vuuraanval?" (RNG factor).

    Duidelijk: Rood randje = Vuur. Tegen een groene Pokémon? DOEN!

Wil je dat ik deze wijzigingen integreer in je bestaande BattlePage.jsx bestand?

Que más, debe seguir teniendo la lógica de energía y combinar cartas

¡Qué buena evolución! Ahora estamos entrando en terreno de diseño de juegos avanzado (tipo Clash Royale o Hearthstone), pero adaptado para Félix.

La idea es:

    Energía: Tienes "batería" para atacar. No puedes lanzar el ataque más fuerte siempre.

    Combinar (Fusión): Si juntas dos cartas, creas un ataque nuevo y más potente.

Aquí tienes cómo implementar esto en BattlePage.jsx y battle-logic.js.
1. La Lógica de Fusión (src/lib/battle-logic.js)

Vamos a crear una función mágica que toma dos ataques y los mezcla.

    Fuego + Fuego = ¡INFIERNO! (Doble daño)

    Agua + Fuego = Nube de Vapor (Daño + Baja precisión al rival)

    Cualquiera + Normal = Ataque Potenciado (Ejem: Placaje de Fuego)

Agrega esto a tu archivo de lógica:
JavaScript

// src/lib/battle-logic.js

// ... (código anterior de daño) ...

/**
 * Combina dos cartas para crear un SUPER ATAQUE
 */
export const combineMoves = (move1, move2) => {
    const isSameType = move1.type === move2.type;
    const combinedCost = Math.max(1, (move1.cost || 1) + (move2.cost || 1) - 1); // Descuento de 1 energía por combinar

    if (isSameType) {
        return {
            name: `MEGA ${move1.name}`,
            type: move1.type,
            power: move1.power + move2.power, // ¡Suma de poder!
            cost: combinedCost,
            isCombo: true,
            description: "¡Fusión del mismo tipo! ¡Doble potencia!"
        };
    }

    // Lógica especial para mezclas
    if ((move1.type === 'fire' && move2.type === 'water') || (move1.type === 'water' && move2.type === 'fire')) {
        return {
            name: 'Vapor Hirviendo',
            type: 'water',
            power: 80,
            cost: combinedCost,
            isCombo: true,
            description: "Quema y moja al mismo tiempo."
        };
    }

    // Por defecto: El tipo del primero con la fuerza de los dos
    return {
        name: `${move1.name} ${move2.name}`, // Ej: "Ascuas Placaje"
        type: move1.type,
        power: Math.floor((move1.power + move2.power) * 0.8), // Un poco menos que la suma directa
        cost: combinedCost,
        isCombo: true,
        description: "Ataque combinado táctico."
    };
};

2. La Interfaz de Batalla con Energía (BattlePage.jsx)

Aquí es donde ocurre la magia visual. Necesitamos:

    Una Barra de Energía (como pilas 🔋).

    Estado para seleccionar 2 cartas.

JavaScript

// src/features/battle/BattlePage.jsx (o SingleBattlePage.jsx)

import { useState, useEffect } from 'react';
import { calculateSmartDamage, combineMoves, getTypeColor } from '../../lib/battle-logic';
import './BattlePage.css'; // Asegúrate de crear los estilos nuevos

export function BattlePage() {
    // ... (otros estados como playerPokemon, opponentPokemon)
    
    // 🔋 NUEVO: Sistema de Energía
    const [maxEnergy] = useState(5);
    const [currentEnergy, setCurrentEnergy] = useState(3); // Empiezas con 3
    
    // 🃏 NUEVO: Mano y Selección
    const [hand, setHand] = useState([]); 
    const [selectedCardIndices, setSelectedCardIndices] = useState([]); // Para saber cuáles fusionar

    // Al inicio del turno (o tras atacar)
    const startTurn = () => {
        // Regenerar 2 de energía (hasta el máximo)
        setCurrentEnergy(prev => Math.min(maxEnergy, prev + 2));
        
        // Rellenar mano hasta tener 4 cartas
        // (Aquí iría tu lógica de drawCards)
        drawCards(); 
        setSelectedCardIndices([]);
    };

    const handleCardClick = (index) => {
        // Si ya está seleccionada, deseleccionar
        if (selectedCardIndices.includes(index)) {
            setSelectedCardIndices(prev => prev.filter(i => i !== index));
            return;
        }

        // Si tenemos menos de 2 seleccionadas, añadir
        if (selectedCardIndices.length < 2) {
            setSelectedCardIndices(prev => [...prev, index]);
        }
    };

    const handleAttack = () => {
        let move toPlay;
        
        // MODO FUSIÓN (2 cartas)
        if (selectedCardIndices.length === 2) {
            const move1 = hand[selectedCardIndices[0]];
            const move2 = hand[selectedCardIndices[1]];
            toPlay = combineMoves(move1, move2); // ¡Fusión!
        } 
        // MODO NORMAL (1 carta)
        else if (selectedCardIndices.length === 1) {
            toPlay = hand[selectedCardIndices[0]];
        } else {
            return; // Nada seleccionado
        }

        // Chequeo de Energía
        if (currentEnergy < (toPlay.cost || 1)) {
            alert("¡No tienes suficiente energía! 🔋");
            return;
        }

        // ⚔️ EJECUTAR ATAQUE
        // Restar energía
        setCurrentEnergy(prev => prev - (toPlay.cost || 1));
        
        // Calcular daño (usando tu lógica existente)
        const damageResult = calculateSmartDamage(playerPokemon, opponentPokemon, toPlay);
        
        // ... Aplicar daño, animaciones, etc ...

        // Limpiar mano de las cartas usadas
        const usedIndices = selectedCardIndices;
        setHand(prev => prev.filter((_, i) => !usedIndices.includes(i)));
        
        // Pasar turno (o esperar un poco)
        setTimeout(startTurn, 2000);
    };

    return (
        <div className="battle-arena">
            {/* ... Renderizado de Pokémons ... */}

            {/* HUD del Jugador */}
            <div className="player-hud">
                
                {/* 🔋 BARRA DE ENERGÍA */}
                <div className="energy-bar-container">
                    <span>Energía:</span>
                    <div className="energy-pills">
                        {[...Array(maxEnergy)].map((_, i) => (
                            <div 
                                key={i} 
                                className={`energy-pill ${i < currentEnergy ? 'filled' : 'empty'}`}
                            >⚡</div>
                        ))}
                    </div>
                </div>

                {/* 🃏 MANO DE CARTAS */}
                <div className="card-hand">
                    {hand.map((move, index) => {
                        const isSelected = selectedCardIndices.includes(index);
                        const cost = move.cost || 1; // Coste por defecto 1
                        const canAfford = currentEnergy >= cost;

                        return (
                            <div 
                                key={index}
                                className={`battle-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'disabled' : ''}`}
                                style={{ borderColor: getTypeColor(move.type) }}
                                onClick={() => canAfford && handleCardClick(index)}
                            >
                                <div className="card-cost">{cost} ⚡</div>
                                <div className="card-name">{move.name}</div>
                                <div className="card-type" style={{background: getTypeColor(move.type)}}>
                                    {move.type}
                                </div>
                                <div className="card-power">⚔️ {move.power}</div>
                            </div>
                        );
                    })}
                </div>

                {/* BOTÓN DE ACCIÓN */}
                <div className="action-area">
                    <button 
                        className={`attack-btn ${selectedCardIndices.length === 0 ? 'disabled' : ''}`}
                        onClick={handleAttack}
                        disabled={selectedCardIndices.length === 0}
                    >
                        {selectedCardIndices.length === 2 ? "¡FUSIÓN! 💥" : "ATACAR ⚔️"}
                    </button>
                    {selectedCardIndices.length === 2 && (
                        <div className="combo-preview">
                            ¡Combinando para un ataque especial!
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

3. Estilos Visuales (BattlePage.css)

Para que Félix entienda bien qué está pasando, los estilos deben ser claros.
CSS

/* Las pilas de energía */
.energy-pills {
    display: flex;
    gap: 4px;
}

.energy-pill {
    width: 20px;
    height: 30px;
    border: 2px solid #333;
    background: #444;
    color: transparent;
    border-radius: 4px;
    transition: all 0.3s;
}

.energy-pill.filled {
    background: #eab308; /* Amarillo eléctrico */
    box-shadow: 0 0 10px #eab308;
    color: #fff; /* Mostrar el rayito */
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Las Cartas */
.battle-card {
    position: relative;
    width: 90px;
    height: 130px;
    background: white;
    border-width: 3px;
    border-style: solid;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
}

.battle-card.selected {
    transform: translateY(-20px) scale(1.1);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8); /* Brillo dorado */
    z-index: 10;
}

.battle-card.disabled {
    opacity: 0.5;
    filter: grayscale(100%);
    cursor: not-allowed;
}

.card-cost {
    position: absolute;
    top: -10px;
    left: -10px;
    background: #3b82f6;
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.attack-btn {
    padding: 15px 40px;
    font-size: 1.5rem;
    font-family: 'Luckiest Guy', cursive; /* Fuente divertida */
    border: none;
    border-radius: 50px;
    background: linear-gradient(to bottom, #ef4444, #b91c1c);
    color: white;
    cursor: pointer;
    box-shadow: 0 6px 0 #7f1d1d;
    transition: transform 0.1s;
}

.attack-btn:active {
    transform: translateY(6px);
    box-shadow: none;
}

¿Por qué le gustará esto a Félix?

    Matemáticas ocultas: "Tengo 3 de energía. Este ataque cuesta 2. ¿Me queda 1 para algo más?" (Resta simple).

    Creatividad: "¿Qué pasa si mezclo Hoja Afilada con Burbujas?" ¡Experimentación!

    Táctica: A veces es mejor guardar cartas y energía para el siguiente turno y lanzar una Fusión devastadora.

Lo importante es

Batallas que sean divertidas variadas y complejas - gestión de cartas y ataques

Torneos donde puede jugar con su equipo de pokemon y ellos colaboran - gestión de equipo, los pokemon se cansan sin están todo el tiempo batallando

Exploración del mundo pokemon - misiones, descubrir pokemon, light open world

Edificios donde curar a pokemon, comprar cosas alimentar, dejar jugar etc

¡Entendido! Tienes una visión muy clara: Pokémon-Felix no es solo un juego de peleas, es un Simulador de Entrenador Completo.

Para lograr esto, vamos a estructurar el código en 4 pilares fundamentales basados en tus archivos actuales. Aquí tienes el plan de acción y el código necesario para transformar tu proyecto.
Pilar 1: Batallas de Cartas y Energía (Diversión y Complejidad)

Vamos a transformar battle-logic.js y SingleBattlePage.jsx para implementar el sistema de Cartas, Colores y Energía que discutimos.

Paso 1.1: Actualizar la Lógica de Combate (src/lib/battle-logic.js) Agregamos la lógica de colores, fusión de cartas y penalización por repetición.
JavaScript

// src/lib/battle-logic.js

// ... (mantén tus imports y type translations existentes)

export const getTypeColor = (type) => {
    switch(type) {
        case 'fire': return '#ef4444'; // Rojo Fuego
        case 'grass': return '#22c55e'; // Verde Planta
        case 'water': return '#3b82f6'; // Azul Agua
        case 'electric': return '#eab308'; // Amarillo Eléctrico
        case 'psychic': return '#a855f7'; // Morado
        case 'rock': case 'ground': return '#78350f'; // Marrón
        default: return '#64748b'; // Gris Neutral
    }
};

// Combinar dos movimientos en uno nuevo
export const combineMoves = (move1, move2) => {
    const isSameType = move1.type === move2.type;
    // Coste reducido por combinar
    const combinedCost = Math.max(2, (move1.cost || 1) + (move2.cost || 1) - 1);

    if (isSameType) {
        return {
            name: `MEGA ${move1.name}`,
            type: move1.type,
            power: Math.floor((move1.power + move2.power) * 1.2), // ¡Bono de 20% poder!
            cost: combinedCost,
            isCombo: true,
            description: "¡Fusión del mismo tipo! ¡Potencia extrema!"
        };
    }

    // Fusión especial (ejemplo)
    if ((move1.type === 'fire' && move2.type === 'water') || (move1.type === 'water' && move2.type === 'fire')) {
        return {
            name: 'Vapor Hirviendo',
            type: 'water',
            power: 100,
            cost: combinedCost,
            isCombo: true,
            description: "Quema y moja al mismo tiempo."
        };
    }

    return {
        name: `${move1.name} & ${move2.name}`,
        type: move1.type, // Hereda tipo del primero
        power: move1.power + move2.power,
        cost: combinedCost,
        isCombo: true,
        description: "Ataque táctico combinado."
    };
};

export const calculateSmartDamage = (attacker, defender, move, lastMoveName) => {
    // Usamos tu lógica base de daño (calculateDamage) existente
    // Asegúrate de que calculateDamage esté exportada o disponible aquí
    // Si no, copia la lógica básica aquí.
    
    // Simulación de cálculo base (reemplazar con llamada a tu función real)
    let power = move.power || 40;
    let damage = Math.floor(power / 2); // Simplificado para el ejemplo

    let message = "";

    // Penalización por "Spam" (repetir ataque)
    if (lastMoveName === move.name) {
        damage = Math.floor(damage * 0.5); // 50% menos daño
        message = "⚠️ ¡Repetido! El rival ya se lo esperaba...";
    }

    return { damage, message };
};

Paso 1.2: La Nueva Interfaz de Batalla (src/features/battle/SingleBattlePage.jsx) Reemplazamos los botones simples por una "Mano de Cartas" y "Barra de Energía".
JavaScript

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { getTypeColor, combineMoves, calculateSmartDamage } from '../../lib/battle-logic';
import './SingleBattlePage.css'; // ¡Recuerda actualizar el CSS!

export function SingleBattlePage() {
    const navigate = useNavigate();
    const { squadIds, pokemonList, addCoins } = usePokemonContext();
    
    // Estado de Batalla
    const [myPokemon, setMyPokemon] = useState(null);
    const [enemyPokemon, setEnemyPokemon] = useState(null);
    const [energy, setEnergy] = useState(3); // Energía inicial
    const [maxEnergy] = useState(5);
    const [hand, setHand] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [battleLog, setBattleLog] = useState(["¡Comienza la batalla!"]);
    const [lastMoveName, setLastMoveName] = useState(null);

    // Cargar Pokémon al inicio
    useEffect(() => {
        if (squadIds.length > 0) {
            const myP = pokemonList.find(p => p.id === squadIds[0]);
            setMyPokemon({ ...myP, currentHp: 100 }); // HP simulado para batalla
            
            // Enemigo al azar
            const randomEnemy = pokemonList[Math.floor(Math.random() * pokemonList.length)];
            setEnemyPokemon({ ...randomEnemy, currentHp: 100 });
            
            // Generar mano inicial (simulada)
            generateHand();
        }
    }, [squadIds, pokemonList]);

    const generateHand = () => {
        // Simulamos movimientos (en una app real vendrían de la API)
        const possibleMoves = [
            { name: 'Placaje', type: 'normal', power: 40, cost: 1 },
            { name: 'Ascuas', type: 'fire', power: 60, cost: 2 },
            { name: 'Burbuja', type: 'water', power: 50, cost: 2 },
            { name: 'Hoja Afilada', type: 'grass', power: 55, cost: 2 },
            { name: 'Rayo', type: 'electric', power: 65, cost: 3 }
        ];
        
        // Dar 4 cartas al azar
        const newHand = Array(4).fill(null).map(() => possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
        setHand(newHand);
    };

    const handleCardClick = (index) => {
        if (selectedIndices.includes(index)) {
            setSelectedIndices(prev => prev.filter(i => i !== index));
        } else {
            if (selectedIndices.length < 2) {
                setSelectedIndices(prev => [...prev, index]);
            }
        }
    };

    const executeTurn = () => {
        if (selectedIndices.length === 0) return;

        let move;
        // FUSIÓN o CARTA ÚNICA
        if (selectedIndices.length === 2) {
            move = combineMoves(hand[selectedIndices[0]], hand[selectedIndices[1]]);
        } else {
            move = hand[selectedIndices[0]];
        }

        // Chequear Energía
        if (energy < move.cost) {
            setBattleLog(prev => ["⚡ ¡No tienes suficiente energía!", ...prev]);
            return;
        }

        // 1. MI TURNO
        setEnergy(prev => prev - move.cost);
        const { damage, message } = calculateSmartDamage(myPokemon, enemyPokemon, move, lastMoveName);
        
        if (message) setBattleLog(prev => [message, ...prev]);
        setBattleLog(prev => [`Usaste ${move.name} (-${damage} HP)`, ...prev]);
        setLastMoveName(move.name);

        setEnemyPokemon(prev => {
            const newHp = Math.max(0, prev.currentHp - damage);
            return { ...prev, currentHp: newHp };
        });

        // Limpiar mano y selección
        const newHand = hand.filter((_, i) => !selectedIndices.includes(i));
        // Rellenar mano
        while(newHand.length < 4) {
             const possibleMoves = [
                { name: 'Placaje', type: 'normal', power: 40, cost: 1 },
                { name: 'Golpe Rápido', type: 'normal', power: 30, cost: 1 }
            ];
            newHand.push(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
        }
        setHand(newHand);
        setSelectedIndices([]);

        // Regenerar energía poco a poco
        setEnergy(prev => Math.min(maxEnergy, prev + 2));
    };

    if (!myPokemon || !enemyPokemon) return <div className="loading">Cargando Arena...</div>;

    return (
        <div className="battle-page">
            <div className="battle-header">
                <button onClick={() => navigate('/adventure')}>🏳️ Huir</button>
                <div className="energy-display">
                    Energía: {[...Array(maxEnergy)].map((_, i) => (
                        <span key={i} className={i < energy ? "energy-dot filled" : "energy-dot"}>⚡</span>
                    ))}
                </div>
            </div>

            <div className="arena-visuals">
                {/* Aquí irían tus componentes de PokemonCard visuales */}
                <div className="fighter enemy">
                    <img src={enemyPokemon.sprites.front_default} alt="Enemigo" />
                    <div className="hp-bar"><div style={{width: `${enemyPokemon.currentHp}%`}}></div></div>
                </div>
                <div className="fighter player">
                    <img src={myPokemon.sprites.back_default} alt="Yo" />
                    <div className="hp-bar"><div style={{width: `${myPokemon.currentHp}%`}}></div></div>
                </div>
            </div>

            <div className="battle-controls">
                <div className="hand-container">
                    {hand.map((move, idx) => (
                        <div 
                            key={idx}
                            onClick={() => handleCardClick(idx)}
                            className={`battle-card ${selectedIndices.includes(idx) ? 'selected' : ''}`}
                            style={{ borderColor: getTypeColor(move.type) }}
                        >
                            <div className="card-cost">{move.cost}</div>
                            <div className="card-name">{move.name}</div>
                            <div className="card-power">⚔️ {move.power}</div>
                        </div>
                    ))}
                </div>
                
                <button 
                    className="attack-btn"
                    disabled={selectedIndices.length === 0}
                    onClick={executeTurn}
                >
                    {selectedIndices.length === 2 ? "¡FUSIÓN!" : "ATACAR"}
                </button>
            </div>
            
            <div className="battle-logs">
                {battleLog.map((log, i) => <p key={i}>{log}</p>)}
            </div>
        </div>
    );
}

Pilar 2: Torneos y Gestión de Equipo (Cansancio)

Para que los Pokémon no sean máquinas infinitas, implementaremos el Cansancio (Stamina).

Cómo implementarlo: En tu src/hooks/useCare.js (que ya tienes y es genial), añade una estadística llamada stamina.

    Al luchar: Cada batalla reduce la stamina en 20 puntos.

    Efecto: Si stamina < 30, el Pokémon hace menos daño o no puede entrar al torneo.

    Recuperación: Usar el healAll en el Centro Pokémon o dormir en WorldPage restaura la stamina.

Modifica useCare.js:
JavaScript

// ... dentro de useCare
const decreaseStamina = (pokemonId, amount = 20) => {
    setCareStats(prev => ({
        ...prev,
        [pokemonId]: {
            ...prev[pokemonId],
            stamina: Math.max(0, (prev[pokemonId]?.stamina || 100) - amount)
        }
    }));
};
// Recuerda exportar esta función y pasarla al Contexto

Pilar 3: Exploración del Mundo (Misiones)

Ya tienes la base en WorldPage.jsx con el "Quest System" de Prof. Eik. Vamos a expandirlo para que sea más "Light Open World".

Idea para Misión: "El Snorlax Dormilón".

    Añade un tile SNORLAX en el mapa que bloquee un camino (Tile Type 14).

    Misión: "Encuentra la Poké-Flauta".

    La Flauta aparece aleatoriamente en el mapa (como tus tesoros ✨).

    Al tener la flauta e interactuar con Snorlax, él se despierta (desaparece del grid) y te abre paso a una nueva zona (ej: "Bosque Oscuro").

Pilar 4: Edificios Funcionales

Tu WorldPage.jsx ya tiene los cimientos. Asegurémonos de que conectan con los otros pilares:

    🏥 Centro Pokémon: Debe llamar a healAll (que ya tienes) PERO también debe restaurar la stamina al 100%.

    🏪 Tienda (Market): Ya tienes MarketPage. Añade objetos como "Poción de Energía" que restaura stamina sin ir al Centro.

    🏠 Casa: Podrías añadir un mini-juego dentro de la casa (como "Piedra Papel Tijera" contra la consola) que suba la "Felicidad" de tu equipo.

Con estos cambios, Félix tendrá que gestionar sus cartas en combate (intelecto), cuidar que su equipo no se canse (gestión) y explorar para desbloquear zonas (aventura). ¡Es un juego completo!

Otra idea de Félix variación entre batallas baratas/ caras , bootstrapping yourself out the the game gets harder

¡Excelente concepto! Félix está tocando un principio económico fundamental: Inversión y Retorno (ROI).

La idea de "bootstrapping" (levantarse a uno mismo tirando de las botas) aquí se traduce en una mecánica de Riesgo/Recompensa:

    Empiezas pobre → Solo puedes permitirte batallas "baratas" (fáciles, poca recompensa).

    Ahorras → Pagas la entrada a una batalla "cara" (difícil, mucha recompensa).

    El riesgo: Si pierdes la batalla cara, pierdes tu inversión (la entrada) y tienes que volver a empezar desde abajo. ¡Eso es tensión real!

Aquí tienes cómo implementar el Selector de Niveles de Batalla para crear esa escalera de dificultad.
1. El Menú de Selección (src/features/battle/BattleSelectionPage.jsx)

En lugar de un botón simple de "Pelear", crearemos tarjetas de "Ligas".
JavaScript

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import './BattleSelectionPage.css'; // (Crear este CSS para que se vea bonito)

const BATTLE_TIERS = [
    {
        id: 'tier1',
        name: '🛝 Patio de Recreo',
        cost: 0,
        reward: 50,
        difficulty: 1, // Enemigos nivel bajo
        description: 'Ideal para principiantes. Sin riesgo.',
        bg: 'linear-gradient(to bottom right, #86efac, #3b82f6)'
    },
    {
        id: 'tier2',
        name: '🏟️ Liga Local',
        cost: 100,
        reward: 300,
        difficulty: 1.5, // Enemigos más fuertes
        description: 'Apuesta 100 para ganar 300. ¡Cuidado!',
        bg: 'linear-gradient(to bottom right, #fde047, #f97316)'
    },
    {
        id: 'tier3',
        name: '👑 Campeonato Pro',
        cost: 500,
        reward: 1500,
        difficulty: 2.5, // Enemigos evolucionados y rudos
        description: 'Solo para expertos. La entrada es cara.',
        bg: 'linear-gradient(to bottom right, #c084fc, #db2777)'
    }
];

export function BattleSelectionPage() {
    const navigate = useNavigate();
    const { coins, spendCoins } = usePokemonContext();

    const handleSelectTier = (tier) => {
        if (coins < tier.cost) {
            alert("❌ ¡No tienes suficientes monedas para entrar a esta liga!");
            return;
        }

        if (tier.cost > 0) {
            const paid = spendCoins(tier.cost);
            if (!paid) return; // Doble check de seguridad
        }

        // Navegamos a la batalla pasando la configuración de la Liga
        // Usamos el "state" del router para pasar datos invisibles
        navigate('/single-battle', { state: { tier } });
    };

    return (
        <div className="battle-selection-page">
            <header className="selection-header">
                <button className="back-btn" onClick={() => navigate('/adventure')}>⬅️ Volver</button>
                <h1>Elige tu Desafío</h1>
                <div className="coin-display">🪙 {coins}</div>
            </header>

            <div className="tiers-container">
                {BATTLE_TIERS.map((tier) => (
                    <div 
                        key={tier.id} 
                        className="tier-card"
                        style={{ background: tier.bg }}
                    >
                        <h2>{tier.name}</h2>
                        <div className="tier-stats">
                            <p>🎟️ Entrada: <strong>{tier.cost === 0 ? 'GRATIS' : `${tier.cost} 🪙`}</strong></p>
                            <p>🏆 Premio: <strong>{tier.reward} 🪙</strong></p>
                        </div>
                        <p className="tier-desc">{tier.description}</p>
                        
                        <button 
                            className="start-tier-btn"
                            onClick={() => handleSelectTier(tier)}
                            disabled={coins < tier.cost}
                        >
                            {coins < tier.cost ? 'Faltan Monedas' : '¡LUCHAR! ⚔️'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

2. Ajustar la Batalla (src/features/battle/SingleBattlePage.jsx)

Ahora la batalla debe ser más difícil si elegiste la liga cara. El enemigo debe ser más fuerte ("Bootstrap" significa que el juego escala contigo).

Modifica la parte donde generas el enemigo (useEffect):
JavaScript

import { useLocation } from 'react-router-dom'; // Importante para leer el "tier"

// ... dentro de SingleBattlePage ...
const location = useLocation();
const tier = location.state?.tier || { difficulty: 1, reward: 50 }; // Valor por defecto si entra directo

// Al cargar el enemigo
useEffect(() => {
    if (squadIds.length > 0) {
        // ... Cargar mi pokemon ...

        // GENERACIÓN INTELIGENTE DE ENEMIGO 🧠
        // 1. Filtramos la lista completa
        let potentialEnemies = pokemonList;

        if (tier.difficulty >= 2.5) {
            // Tier 3: Solo Pokémon evolucionados o fuertes (IDs altos o stats altos)
            // Ejemplo simple: Solo del ID 50 para arriba (suelen ser más fuertes)
            potentialEnemies = pokemonList.filter(p => p.id > 40); 
        }

        const randomBase = potentialEnemies[Math.floor(Math.random() * potentialEnemies.length)];
        
        // 2. "Dopar" al enemigo según dificultad
        // Multiplicamos su HP base por la dificultad de la liga
        const boostedHp = Math.floor(100 * tier.difficulty); 

        setEnemyPokemon({
            ...randomBase,
            currentHp: boostedHp,
            maxHp: boostedHp, // Para la barra de vida
            difficultyMultiplier: tier.difficulty // Para que sus ataques peguen más fuerte
        });
        
        generateHand();
    }
}, [squadIds, pokemonList, tier]);

// ... Y cuando ganas la batalla ...
const handleVictory = () => {
    setBattleLog(prev => ["🏆 ¡VICTORIA!", ...prev]);
    // Dar el premio específico de esa liga
    addCoins(tier.reward); 
    setTimeout(() => navigate('/adventure'), 3000);
};

// ... Y en el cálculo de daño del enemigo ...
// Cuando el enemigo ataca, multiplica su daño por tier.difficulty
// damage = Math.floor(baseDamage * enemyPokemon.difficultyMultiplier);

3. El CSS para que se sienta épico (BattleSelectionPage.css)
CSS

.battle-selection-page {
    padding: 20px;
    background-color: #1e293b;
    min-height: 100vh;
    color: white;
}

.tiers-container {
    display: flex;
    flex-direction: column; /* En móvil una debajo de otra */
    gap: 20px;
    margin-top: 20px;
}

.tier-card {
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    transition: transform 0.2s;
    border: 4px solid rgba(255,255,255,0.2);
}

.tier-card:hover {
    transform: scale(1.02);
}

.tier-stats {
    background: rgba(0,0,0,0.3);
    padding: 10px;
    border-radius: 10px;
    margin: 15px 0;
    font-size: 1.2rem;
}

.start-tier-btn {
    width: 100%;
    padding: 15px;
    font-size: 1.2rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    background: white;
    color: #333;
    cursor: pointer;
    box-shadow: 0 4px 0 rgba(0,0,0,0.2);
}

.start-tier-btn:disabled {
    background: #94a3b8;
    color: #cbd5e1;
    cursor: not-allowed;
}

Por qué le gustará a Félix:

    La emoción de apostar: "¿Pago 100 monedas? Si pierdo, me quedo sin nada... pero si gano, ¡me compro una evolución!".

    Progresión: Empieza luchando contra Rattatas en el parque (gratis) y termina luchando contra Charizards en el estadio (caro).

    Matemáticas financieras: Entiende el concepto de "gastar dinero para ganar dinero".

Trabajos que hacer para ganar dinero rápido

¡Esa es la pieza que faltaba para completar la economía del juego! Para que el "bootstrapping" funcione, Félix necesita una forma de ganar esas primeras monedas cuando es demasiado débil para pelear o cuando se queda sin dinero para entrar a los torneos.

Aquí tienes 3 ideas de "Trabajos Rápidos" (Minijuegos) para implementar en el mundo, diseñados para ser divertidos y educativos.
1. El Concepto: Tablón de Anuncios 📋

Colocaremos un "Tablón de Anuncios" en el pueblo. Al interactuar con él, Félix puede elegir un trabajo diario.
2. Los Trabajos

    ♻️ Eco-Guerrero (Limpieza):

        Mecánica: Aparece "Basura" (latas, papeles) aleatoriamente por el mapa.

        Acción: Félix tiene que caminar hacia ellas y hacer clic para "reciclar".

        Recompensa: 5 monedas por basura. ¡Fácil y rápido!

    📦 Repartidor Express:

        Mecánica: "Lleva este paquete a la Tienda".

        Acción: Tienes 30 segundos para correr del punto A al punto B.

        Recompensa: 50 monedas.

    🧠 Ayudante del Profesor (Quiz):

        Mecánica: El Profesor Eik te hace una pregunta sobre Pokémon.

        Acción: "¿De qué tipo es Squirtle?" (Fuego/Agua/Planta).

        Recompensa: 20 monedas por acierto.

La Implementación en Código

Vamos a modificar WorldPage.jsx para incluir el sistema de basura y el Tablón de Anuncios.
Paso 1: Actualizar los Tipos de Tiles y Assets (WorldPage.jsx)

Agregamos el tipo JOB_BOARD y TRASH.
JavaScript

// En src/features/world/WorldPage.jsx

// 1. Agrega estos nuevos tipos a TILE_TYPES
const TILE_TYPES = {
    // ... tus tipos existentes ...
    JOB_BOARD: 14,
    TRASH: 15, // Basura para limpiar
};

// 2. Agrega lógica de estado para los trabajos
export function WorldPage() {
    // ... tus estados existentes ...
    
    // ESTADO PARA TRABAJOS
    const [activeJob, setActiveJob] = useState(null); // 'cleaning', 'delivery', null
    const [trashCount, setTrashCount] = useState(0);
    const [showJobBoard, setShowJobBoard] = useState(false);

    // FUNCIÓN: Iniciar trabajo de limpieza
    const startCleaningJob = () => {
        setActiveJob('cleaning');
        setShowJobBoard(false);
        setMessage({ text: "♻️ ¡Misión: Limpia 5 basuras del pueblo!", color: '#10b981' });
        
        // Generar 5 basuras en posiciones aleatorias (que sean suelo transitable)
        let trashAdded = 0;
        const newTrash = [];
        while(trashAdded < 5) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
            // Verificar que no sea agua, edificio o árbol
            // (Simplificado: asumimos que si no hay objeto en townObjects es libre, 
            // pero idealmente chequearías el baseGrid también)
            if (!townObjects.some(o => o.x === x && o.y === y)) {
                addObject(TILE_TYPES.TRASH, x, y); // Usamos tu hook useTown
                trashAdded++;
            }
        }
        setTrashCount(5);
    };

    // FUNCIÓN: Manejar clic en basura
    const handleTrashClick = (trashObj) => {
        // Reproducir sonido de reciclaje si quieres
        removeObject(trashObj.id); // Borrar basura
        addCoins(10); // Pago inmediato
        setMessage({ text: "♻️ ¡Reciclado! +10 monedas", color: '#10b981' });
        
        setTrashCount(prev => {
            const newList = prev - 1;
            if (newList <= 0) {
                setActiveJob(null);
                setMessage({ text: "✨ ¡Pueblo limpio! Gran trabajo.", color: '#fbbf24' });
            }
            return newList;
        });
    };

    // ACTUALIZAR handleTileEvent
    const handleTileEvent = useCallback((tileType) => {
        // ... tus eventos existentes ...

        if (tileType === TILE_TYPES.JOB_BOARD) {
            setShowJobBoard(true);
            return;
        }
    }, [/* ... deps ... */]);

    // ACTUALIZAR getTileContent
    const getTileContent = (type, x, y) => {
        // ... tus iconos existentes ...
        
        // Icono del Tablón
        if (type === TILE_TYPES.JOB_BOARD) return '📋';
        
        // Icono de Basura (si es un objeto dinámico, se renderiza diferente, 
        // pero si lo pusiste en grid, va aquí)
        if (type === TILE_TYPES.TRASH) return '🧃';
        
        // ...
    };

    // ...
    
    return (
        <div className="...">
            {/* MODAL DEL TABLÓN DE ANUNCIOS */}
            {showJobBoard && (
                <div className="interior-modal">
                    <div className="room-content job-board-paper">
                        <h2>📋 Trabajos Disponibles</h2>
                        <p>¿Necesitas dinero rápido? ¡Ayuda a la comunidad!</p>
                        
                        <div className="job-list">
                            <button className="job-btn" onClick={startCleaningJob}>
                                <div className="job-icon">♻️</div>
                                <div className="job-info">
                                    <h3>Limpieza Ecológica</h3>
                                    <span>Paga: 10 🪙 / basura</span>
                                </div>
                            </button>
                            
                            <button className="job-btn" onClick={() => alert("¡Próximamente!")}>
                                <div className="job-icon">📦</div>
                                <div className="job-info">
                                    <h3>Repartidor (Nvl 2)</h3>
                                    <span>Paga: 100 🪙</span>
                                </div>
                            </button>
                        </div>
                        
                        <button className="close-room-btn" onClick={() => setShowJobBoard(false)}>Cerrar</button>
                    </div>
                </div>
            )}
            
            {/* Renderizado del Grid... */}
            {/* Asegúrate de que al hacer clic en un tile, si es basura, llame a handleTrashClick */}
             <div className="map-grid">
                {mapGrid.map((row, y) => (
                    <div key={y} className="map-row">
                        {row.map((tile, x) => {
                            // Buscar si hay un objeto dinámico aquí (como la basura)
                            const objHere = townObjects.find(o => o.x === x && o.y === y);
                            const displayTile = objHere ? objHere.type : tile;

                            return (
                                <div 
                                    key={`${x}-${y}`}
                                    className={`tile type-${displayTile}`}
                                    onClick={() => {
                                        if (displayTile === TILE_TYPES.TRASH) {
                                            handleTrashClick(objHere);
                                        } else {
                                            handleTileClick(x, y);
                                        }
                                    }}
                                >
                                    {getTileContent(displayTile, x, y)}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
            {/* ... */}
        </div>
    );
}

Paso 2: Estilos para el Tablón (WorldPage.css)

Para que parezca un tablón de corcho con notas.
CSS

.job-board-paper {
    background-color: #fef3c7; /* Color papiro/nota */
    border: 8px solid #78350f; /* Marco de madera */
    color: #451a03;
    max-width: 400px;
}

.job-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 20px 0;
}

.job-btn {
    display: flex;
    align-items: center;
    gap: 15px;
    background: white;
    border: 2px dashed #d97706;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
    text-align: left;
}

.job-btn:hover {
    transform: rotate(-2deg) scale(1.02); /* Efecto "nota adhesiva" */
    background: #fffbeb;
}

.job-icon {
    font-size: 2rem;
}

.job-info h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #b45309;
}

.job-info span {
    font-size: 0.9rem;
    color: #666;
    font-weight: bold;
}

¿Por qué esto es genial para Félix?

    Economía Real: Aprende que el dinero no solo cae del cielo (o de peleas), también se gana trabajando.

    Gratificación Instantánea: Hace clic en la basura -> Sonido -> Monedas suben. Es muy satisfactorio.

    Bootstrapping: Empieza recogiendo basura (humilde) para comprar su primera Pokéball, luego captura un Pokémon, gana torneos y se vuelve millonario. ¡La historia completa del emprendedor!

Que más dinámicas para que el aprenda cosas jugando?

¡Me encanta el enfoque! Félix no solo está jugando, se está convirtiendo en un "Gerente de Recursos" y un estratega.

Para seguir esa línea de "Aprender Jugando" (Gamificación Educativa), aquí te propongo 3 nuevas dinámicas que introducen conceptos de Matemáticas Financieras, Geometría/Orientación y Lógica.
1. El Banco Pokémon (Educación Financiera) 🏦

El concepto: Aprender sobre el Ahorro y el Interés. Félix aprenderá que si no se gasta todo su dinero en caramelos hoy, mañana tendrá más dinero sin hacer nada.

    Mecánica: Un edificio "Banco" en el pueblo.

    Lección: "Interés compuesto". Cada 5 minutos (o cada día), el dinero en el banco crece un 10%.

    Matemáticas: "Si meto 100 monedas, ¡el banco me regala 10!"

Código (src/features/world/BankPage.jsx):
JavaScript

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import './BankPage.css'; // (Crear estilos simples)

export function BankPage() {
    const { coins, spendCoins, addCoins } = usePokemonContext();
    // Guardamos el saldo del banco en localStorage también
    const [bankBalance, setBankBalance] = useState(() => {
        return parseInt(localStorage.getItem('pokeBank_balance') || '0');
    });

    useEffect(() => {
        localStorage.setItem('pokeBank_balance', bankBalance);
    }, [bankBalance]);

    // Simulación de INTERÉS: Ganar 10% cada vez que entra a la página (o usar un timer real)
    const collectInterest = () => {
        if (bankBalance > 0) {
            const interest = Math.floor(bankBalance * 0.10); // 10%
            if (interest > 0) {
                setBankBalance(prev => prev + interest);
                alert(`¡Tus ahorros han crecido! El banco te ha dado ${interest} 🪙 de intereses.`);
            } else {
                alert("Necesitas ahorrar más para ganar intereses.");
            }
        }
    };

    const deposit = (amount) => {
        if (spendCoins(amount)) {
            setBankBalance(prev => prev + amount);
        } else {
            alert("¡No tienes suficiente dinero en tu bolsillo!");
        }
    };

    const withdraw = (amount) => {
        if (bankBalance >= amount) {
            setBankBalance(prev => prev - amount);
            addCoins(amount);
        } else {
            alert("¡No tienes tanto dinero en el banco!");
        }
    };

    return (
        <div className="bank-page">
            <header className="bank-header">
                <Link to="/adventure" className="back-btn">⬅️ Volver</Link>
                <h1>🏦 Banco de Pallet Town</h1>
            </header>

            <div className="bank-container">
                <div className="balance-card wallet">
                    <h3>En tu Bolsillo</h3>
                    <p className="big-number">🪙 {coins}</p>
                </div>

                <div className="arrow-icon">⇄</div>

                <div className="balance-card vault">
                    <h3>En el Banco (Ahorros)</h3>
                    <p className="big-number">💰 {bankBalance}</p>
                    <p className="interest-info">📈 Ganas 10% de interés periódico</p>
                    <button className="interest-btn" onClick={collectInterest}>⏳ Esperar Tiempo (Simular)</button>
                </div>
            </div>

            <div className="bank-actions">
                <div className="action-group deposit">
                    <h4>Depositar (Guardar)</h4>
                    <button onClick={() => deposit(10)}>+10</button>
                    <button onClick={() => deposit(100)}>+100</button>
                    <button onClick={() => deposit(coins)}>Todo</button>
                </div>

                <div className="action-group withdraw">
                    <h4>Retirar (Sacar)</h4>
                    <button onClick={() => withdraw(10)}>-10</button>
                    <button onClick={() => withdraw(100)}>-100</button>
                    <button onClick={() => withdraw(bankBalance)}>Todo</button>
                </div>
            </div>
        </div>
    );
}

2. Búsqueda del Tesoro por Coordenadas (Geometría) 🗺️

El concepto: Aprender el Plano Cartesiano (Ejes X e Y). Para encontrar tesoros legendarios, Félix no puede solo caminar al azar. Debe leer un mapa con coordenadas.

    Mecánica: Un objeto "Mapa del Tesoro" que dice: "El tesoro está en X: 3, Y: 8".

    Lección: Navegación espacial y números. Félix debe mirar los números en su pantalla y moverse hasta que coincidan.

Integración en WorldPage.jsx:

    Visualizar Coordenadas: Añade un pequeño "GPS" en la pantalla.

    Lógica del Tesoro:

JavaScript

// En WorldPage.jsx

// ... estados ...
const [showGPS, setShowGPS] = useState(true);
// Misión activa: Buscar tesoro en (X=3, Y=8)
const [targetCoords] = useState({ x: 3, y: 8 }); 

// ... dentro del return ...

{/* HUD del GPS - Enseña Geometría */}
{showGPS && (
    <div className="gps-hud" style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: '#0f0', padding: '10px', fontFamily: 'monospace', borderRadius: '5px' }}>
        <div>POSICIÓN ACTUAL</div>
        <div>X (Horizontal): {playerPos.x}</div>
        <div>Y (Vertical): {playerPos.y}</div>
        
        <div style={{marginTop: '10px', borderTop: '1px solid #0f0'}}>OBJETIVO</div>
        <div>Ir a -> X: {targetCoords.x}, Y: {targetCoords.y}</div>
    </div>
)}

// ... lógica para cuando pisa el tesoro ...
// En handleTileEvent o movePlayer:
if (newX === targetCoords.x && newY === targetCoords.y) {
    setMessage({ text: "🎉 ¡HAS ENCONTRADO EL TESORO MATEMÁTICO! +500 Monedas", color: 'gold' });
    addCoins(500);
    // Generar nuevas coordenadas aleatorias para el siguiente
}

3. El Laboratorio de Pociones (Matemáticas/Aritmética) 🧪

El concepto: Sumar cantidades exactas. Para crear una "Super Poción", Félix debe mezclar ingredientes que sumen exactamente un valor.

    Mecánica: Un minijuego de crafteo.

    Lección: Suma y Resta.

    Ejemplo: "Necesitas 50 de potencia. Tienes Bayas Rojas (+10) y Bayas Azules (+20). ¿Cuántas necesitas?"

        Respuesta: 1 Azul + 3 Rojas = 50. O 2 Azules + 1 Roja.

        Si se pasa (51): ¡Explosión! (Pierde los ingredientes).

Implementación Rápida (Idea): En el menú BagPage o un nuevo LabPage, pones un "Caldero" con un número objetivo (ej: 50). Félix hace clic en ingredientes para sumar.

    Baya Roja: +5

    Baya Azul: +10

    Raíz Amarga: -5 (¡Resta! Para corregir si se pasa).

Resumen de Aprendizaje:

    Economía: Banco Pokémon → Ahorro vs Gasto inmediato.

    Geometría: GPS → Entender mapas y coordenadas.

    Aritmética: Laboratorio → Sumas y restas para lograr un objetivo exacto.

¿Te gustaría que desarrolle el código completo del Laboratorio de Pociones o prefieres integrar primero el Banco?

Como enseñar conceptos de programación (está aprendiendo scratch y quiere aprender Python)

¡Qué gran paso! Pasar de Scratch (bloques visuales) a Python (texto) es un momento crucial. La mejor forma de hacerlo para un niño de 7 años es no abandonar lo visual, sino usar Python para "controlar" ese mundo visual.

Aquí tienes 3 dinámicas para integrar en Pokemon-Felix que enseñan programación real sin que deje de ser un juego.
1. La "Terminal Hacker" (Consola de Trucos) 💻

Concepto: En Scratch arrastras bloques. En Python, escribes hechizos. Vamos a crear una ventana secreta donde Félix puede escribir comandos de Python simplificados para modificar el juego en tiempo real.

Lo que aprende: Sintaxis, Funciones y Argumentos.

Implementación: Creamos un componente GameConsole.jsx que interpreta texto.
JavaScript

// src/components/GameConsole.jsx
import { useState } from 'react';
import { usePokemonContext } from '../hooks/usePokemonContext';
import './GameConsole.css';

export function GameConsole({ onClose }) {
    const { addCoins, healAll, pokemonList, collection } = usePokemonContext();
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState(['> Sistema listo. Escribe un comando...']);

    const executeCommand = () => {
        const cmd = input.toLowerCase().trim();
        let response = '';

        // Intérprete simple de "Python"
        if (cmd === 'heal_all()') {
            healAll();
            response = '✨ ¡Todos los Pokémon han sido curados!';
        } 
        else if (cmd.startsWith('add_coins(') && cmd.endsWith(')')) {
            // Extraer el número: add_coins(500) -> 500
            const amount = parseInt(cmd.match(/\d+/)[0]);
            addCoins(amount);
            response = `💰 ¡Has hackeado el banco! +${amount} monedas.`;
        }
        else if (cmd === 'print(pokedex)') {
            response = `📚 Tienes ${collection.ownedIds.length} Pokémon capturados.`;
        }
        else {
            response = `❌ SyntaxError: El comando '${cmd}' no se reconoce.`;
        }

        setLogs(prev => [...prev, `> ${input}`, response]);
        setInput('');
    };

    return (
        <div className="console-overlay">
            <div className="console-window">
                <div className="console-header">🐍 Python Terminal</div>
                <div className="console-output">
                    {logs.map((log, i) => <div key={i}>{log}</div>)}
                </div>
                <div className="console-input-line">
                    <span>>>></span>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
                        placeholder="Escribe tu código aquí..."
                        autoFocus
                    />
                </div>
                <button className="close-console" onClick={onClose}>X</button>
            </div>
        </div>
    );
}

    La Dinámica: Dile a Félix: "Los programadores no hacen clic, ellos escriben. Si escribes add_coins(1000), eres un mago".

    El Reto: Escribe mal el comando a propósito para que vea el "SyntaxError". Enséñale que el ordenador necesita exactitud.

2. El Robot "Porygon" (Algoritmos y Secuencia) 🤖

Concepto: Como el clásico "Logo" o "Turtle", pero con un Porygon. En WorldPage.jsx, añade un edificio "Escuela de Código". Al entrar, hay un minijuego.

La Misión: Porygon está en un laberinto. No puedes moverlo con las flechas. Tienes que darle una lista de instrucciones antes de que empiece a moverse.

Lo que aprende: Pensamiento secuencial y Depuración (Debugging).

Implementación (Idea):

    Interfaz: A la izquierda el mapa, a la derecha una lista de texto vacía.

    Botones de Ayuda: [Avanzar], [Girar Izq], [Girar Der].

    Traducción: Al pulsar [Avanzar], se escribe step() en la lista.

    Ejecutar: Al pulsar "Run Code", Porygon ejecuta la lista paso a paso.

JavaScript

// Ejemplo de la lógica mental para Félix
def resolver_laberinto():
    step()
    step()
    turn_right()
    step()
    # Si choca con la pared, sale un error: "RuntimeError: Collision!"

3. "Ver la Matrix" (Lógica Real) 👁️

Concepto: Enséñale que las reglas del juego son solo archivos de texto que él puede cambiar. Abre el archivo src/lib/battle-logic.js con él.

La Dinámica:

    Busca la línea donde calculamos el daño:
    JavaScript

    // src/lib/battle-logic.js
    let baseDamage = Math.floor(movePower / 2);

    Pregúntale: "¿Te parece que pegan muy flojo? Vamos a cambiar las reglas del universo."

    Cambia el / 2 por * 2 (multiplicar).

    Guarda y deja que juegue una batalla. ¡Los Pokémon harán muchísimo daño!

    Lección: "Esto es una variable. Si cambias la fórmula aquí, cambias la realidad para todos."

Resumen del Plan Educativo

    Nivel 1 (Consola): Aprender que escribir texto tiene efectos poderosos (add_coins).

    Nivel 2 (Porygon): Aprender a pensar en pasos ordenados antes de actuar (Algoritmos).

    Nivel 3 (Matrix): Perder el miedo al código fuente real y entender que él es el creador, no solo el jugador.

Una escuela de pokemon donde se aprende sobre los pokemon y se ganan certificados fiando se resuelven quiz . Cada certificado da un premio

¡Qué idea tan brillante! Una Escuela Pokémon es el lugar perfecto para combinar la mecánica de "aprender cosas nuevas" con recompensas tangibles. Esto refuerza la lectura, la lógica y la memoria de Félix.

Aquí tienes el plan para construir la Academia Pokémon:

    El Concepto: Un edificio nuevo en el mapa.

    La Dinámica:

        Lección: Un texto corto y educativo (ej: "El fuego derrite el hielo").

        Quiz: Una pregunta de opción múltiple.

        Graduación: Si acierta, recibe un Diploma visual y un premio (monedas u objetos).

Aquí tienes el código completo.
Paso 1: Crear la Escuela (src/features/school/SchoolPage.jsx)

Este es un componente nuevo. Crea la carpeta src/features/school si no existe.
JavaScript

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext'; //
import './SchoolPage.css';

// El Plan de Estudios (Curriculum)
const CURRICULUM = [
    {
        id: 1,
        title: "Tipos Básicos 🔴🟢🔵",
        content: "El Fuego quema a la Planta. El Agua apaga el Fuego. La Planta bebe el Agua. ¡Recuerda este triángulo!",
        question: "Estás luchando contra un Charmander (Fuego). ¿Qué Pokémon deberías usar?",
        options: [
            { text: "Bulbasaur (Planta)", correct: false },
            { text: "Squirtle (Agua)", correct: true }, // Agua gana a Fuego
            { text: "Pikachu (Eléctrico)", correct: false }
        ],
        reward: { type: 'coins', amount: 100 },
        badge: "🔥"
    },
    {
        id: 2,
        title: "Matemáticas de Evolución 🔢",
        content: "Para evolucionar, los Pokémon necesitan experiencia. Si un Pidgey tiene nivel 10 y necesita 8 niveles más para evolucionar...",
        question: "¿A qué nivel evolucionará Pidgey (10 + 8)?",
        options: [
            { text: "Nivel 15", correct: false },
            { text: "Nivel 18", correct: true },
            { text: "Nivel 20", correct: false }
        ],
        reward: { type: 'item', id: 'greatball', amount: 5 }, // Premio especial
        badge: "📊"
    },
    {
        id: 3,
        title: "Geografía Pokémon 🗺️",
        content: "Los Pokémon de tipo Roca y Tierra suelen vivir en cuevas oscuras o montañas altas.",
        question: "¿Dónde es más probable encontrar un Geodude?",
        options: [
            { text: "En el mar", correct: false },
            { text: "En el cielo", correct: false },
            { text: "En una cueva", correct: true }
        ],
        reward: { type: 'coins', amount: 200 },
        badge: "🏔️"
    }
];

export function SchoolPage() {
    const { addCoins, inventory, addItem } = usePokemonContext(); //
    
    // Estado para guardar progreso (usamos localStorage simple para persistencia rápida)
    const [completedLessons, setCompletedLessons] = useState(() => {
        const saved = localStorage.getItem('felix_school_progress');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeLesson, setActiveLesson] = useState(null);
    const [showCertificate, setShowCertificate] = useState(false);
    const [lastReward, setLastReward] = useState(null);

    useEffect(() => {
        localStorage.setItem('felix_school_progress', JSON.stringify(completedLessons));
    }, [completedLessons]);

    const handleAnswer = (isCorrect, lesson) => {
        if (isCorrect) {
            // ¡Correcto!
            if (!completedLessons.includes(lesson.id)) {
                setCompletedLessons(prev => [...prev, lesson.id]);
                
                // Dar premio
                if (lesson.reward.type === 'coins') {
                    addCoins(lesson.reward.amount);
                    setLastReward(`${lesson.reward.amount} Monedas`);
                } else if (lesson.reward.type === 'item') {
                    // Asumimos que tienes una función addItem en tu contexto (si no, usa addCoins)
                    // Si no tienes addItem en el context, usa addCoins como fallback
                     addCoins(300); 
                     setLastReward("300 Monedas (Beca Especial)");
                }
            } else {
                setLastReward("Repaso (Sin premio extra)");
            }
            setShowCertificate(true);
        } else {
            alert("Mmm... inténtalo de nuevo. ¡Tú puedes!");
        }
    };

    const closeCertificate = () => {
        setShowCertificate(false);
        setActiveLesson(null);
    };

    return (
        <div className="school-page">
            <header className="school-header">
                <Link to="/adventure" className="back-btn">⬅️ Salir al Recreo</Link>
                <h1>🎓 Academia Pokémon</h1>
            </header>

            {/* VISTA 1: LISTA DE CLASES */}
            {!activeLesson && !showCertificate && (
                <div className="lessons-grid">
                    <div className="prof-intro">
                        <span className="prof-avatar">👨‍🏫</span>
                        <p>Profesor: "¡Bienvenido Félix! Completa los quiz para ganar tu Diploma y premios."</p>
                    </div>

                    {CURRICULUM.map(lesson => {
                        const isDone = completedLessons.includes(lesson.id);
                        return (
                            <div 
                                key={lesson.id} 
                                className={`lesson-card ${isDone ? 'completed' : ''}`}
                                onClick={() => setActiveLesson(lesson)}
                            >
                                <div className="lesson-badge">{lesson.badge}</div>
                                <h3>{lesson.title}</h3>
                                {isDone ? <span className="status-tag">✅ Aprobado</span> : <span className="status-tag new">📝 Pendiente</span>}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* VISTA 2: LA CLASE ACTIVA */}
            {activeLesson && !showCertificate && (
                <div className="classroom-view">
                    <h2>{activeLesson.title}</h2>
                    <div className="blackboard">
                        <p>{activeLesson.content}</p>
                    </div>
                    
                    <div className="quiz-section">
                        <h3>❓ Quiz Sorpresa</h3>
                        <p className="question">{activeLesson.question}</p>
                        <div className="options-list">
                            {activeLesson.options.map((opt, idx) => (
                                <button 
                                    key={idx} 
                                    className="option-btn"
                                    onClick={() => handleAnswer(opt.correct, activeLesson)}
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="cancel-btn" onClick={() => setActiveLesson(null)}>Cancelar</button>
                </div>
            )}

            {/* VISTA 3: EL CERTIFICADO */}
            {showCertificate && activeLesson && (
                <div className="certificate-modal">
                    <div className="certificate-paper">
                        <div className="cert-header">✨ CERTIFICADO DE MÉRITO ✨</div>
                        <p>Se otorga el presente diploma a</p>
                        <h2>FELIX</h2>
                        <p>Por haber completado con éxito la lección:</p>
                        <h3>{activeLesson.title}</h3>
                        
                        <div className="reward-stamp">
                            <span>Premio:</span>
                            <strong>{lastReward}</strong>
                        </div>

                        <div className="cert-seal">🎖️</div>
                        
                        <button className="graduate-btn" onClick={closeCertificate}>¡Gracias Profe!</button>
                    </div>
                </div>
            )}
        </div>
    );
}

Paso 2: Estilos de la Escuela (src/features/school/SchoolPage.css)
CSS

.school-page {
    background-color: #fefce8; /* Color crema suave */
    min-height: 100vh;
    padding: 20px;
    font-family: 'Verdana', sans-serif;
}

.school-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.prof-intro {
    background: white;
    padding: 15px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.prof-avatar { font-size: 3rem; }

.lessons-grid {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.lesson-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    border-left: 10px solid #94a3b8;
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.lesson-card:hover { transform: scale(1.02); }

.lesson-card.completed {
    border-left-color: #22c55e;
    background: #f0fdf4;
}

.lesson-badge { font-size: 2rem; }

/* PIZARRA */
.blackboard {
    background: #064e3b;
    color: white;
    padding: 20px;
    border-radius: 8px;
    border: 8px solid #78350f;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    margin-bottom: 20px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.option-btn {
    display: block;
    width: 100%;
    padding: 15px;
    margin-bottom: 10px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: bold;
}

.option-btn:hover { background: #2563eb; }

/* DIPLOMA */
.certificate-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.certificate-paper {
    background: #fffbeb;
    padding: 40px;
    border: 10px double #b45309;
    text-align: center;
    border-radius: 10px;
    max-width: 90%;
    animation: popIn 0.5s;
}

.cert-header {
    font-family: 'Times New Roman', serif;
    font-weight: bold;
    font-size: 1.5rem;
    color: #b45309;
    margin-bottom: 20px;
}

.cert-seal {
    font-size: 4rem;
    margin: 20px 0;
    color: #b91c1c;
}

.reward-stamp {
    border: 2px dashed #b45309;
    padding: 10px;
    margin: 15px 0;
    background: rgba(251, 191, 36, 0.2);
    display: inline-block;
}

.graduate-btn {
    background: #22c55e;
    color: white;
    border: none;
    padding: 10px 30px;
    font-size: 1.2rem;
    border-radius: 20px;
    cursor: pointer;
}

@keyframes popIn {
    0% { transform: scale(0); }
    80% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

Paso 3: Integrar en el Mundo (src/features/world/WorldPage.jsx)

Ahora vamos a poner el edificio en el mapa para que Félix pueda entrar.

    Abre WorldPage.jsx.

    Añade el nuevo tipo de tile:
    JavaScript

const TILE_TYPES = {
    // ... (otros tipos)
    SCHOOL: 16, // Nuevo ID para la escuela
};

Añade la navegación:
JavaScript

// En handleTileEvent:
if (tileType === TILE_TYPES.SCHOOL) {
    setMessage({ text: "🎓 ¡Bienvenido a la Escuela Pokémon! ¿Listo para aprender?", color: '#f59e0b' });
    setTimeout(() => navigate('/school'), 1000);
    return;
}

Añade el icono visual:
JavaScript

    // En getTileContent:
    if (type === TILE_TYPES.SCHOOL) return '🏫'; 

Paso 4: Añadir la Ruta (src/App.jsx)

Finalmente, asegúrate de que la URL funciona.
JavaScript

import { SchoolPage } from './features/school/SchoolPage';

// En tus rutas:
<Route path="/school" element={<SchoolPage />} />

¿Por qué esto es genial para Félix?

    Validación: Ganar un "Certificado" se siente como un logro real.

    Sin presión: Si falla la pregunta, el profesor le dice "Inténtalo de nuevo", no "Perdiste".

    Utilidad: Aprende cosas (Tipos, Matemáticas) que luego le sirven en las Batallas reales del juego. ¡Es conocimiento aplicado!

Para darle más cuerpo podríamos hacer ropa y disfraces (con efectos cosméticos y reales) y edificios únicos (palacios, plazas montañas etc)

¡Esta es la "Cereza del Pastel"! 🍒 Añadir personalización (ropa) y lugares únicos transforma el juego de "un sistema de batallas" a un Mundo de Fantasía Vivo.

Aquí tienes cómo implementar "La Tienda de Moda" (con efectos reales) y "Monumentos Legendarios".
1. Sistema de Ropa y Disfraces (Cosméticos + Efectos) 🧢👕

No es solo verse bien. En los RPGs, la ropa tiene estadísticas.

    Cosmético: Cambia cómo te ves en el mapa.

    Efecto Real: Te da ventajas en el juego.

Paso 1.1: Definir el "Armario" en el Contexto

Necesitamos saber qué lleva puesto Félix. (Añadir a PokemonContext o crear un nuevo hook usePlayer).

Asumamos que lo añadimos al PokemonContext.
JavaScript

// En tus datos iniciales (o en un nuevo archivo de constantes)
export const CLOTHING_ITEMS = {
    'ash-hat': { 
        id: 'ash-hat', 
        name: 'Gorra de Campeón', 
        icon: '🧢', 
        desc: 'Te sientes invencible. (Cosmético)',
        price: 100,
        effect: 'visual' 
    },
    'rocket-uniform': { 
        id: 'rocket-uniform', 
        name: 'Uniforme Rocket', 
        icon: '🕵️', 
        desc: 'Los ladrones piensan que eres uno de ellos. (No te roban)',
        price: 500,
        effect: 'stealth' 
    },
    'hiking-boots': { 
        id: 'hiking-boots', 
        name: 'Botas de Montaña', 
        icon: '🥾', 
        desc: 'Permite caminar por casillas de Montaña.',
        price: 300,
        effect: 'mountain_walk' 
    },
    'fire-cape': { 
        id: 'fire-cape', 
        name: 'Capa Infernal', 
        icon: '🔥', 
        desc: '+20% Daño de Fuego en batallas.',
        price: 1000,
        effect: 'battle_fire_boost' 
    }
};

// En PokemonContext.jsx (añadir estado)
const [outfit, setOutfit] = useState(null); // ID del item equipado

Paso 1.2: La Página del Armario (src/features/player/WardrobePage.jsx)
JavaScript

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../hooks/usePokemonContext';
import { CLOTHING_ITEMS } from '../../lib/constants'; // (Crea este archivo con la lista de arriba)
import './WardrobePage.css';

export function WardrobePage() {
    const { coins, spendCoins, outfit, setOutfit, inventory, addItem } = usePokemonContext();

    // Comprar ropa
    const buyItem = (item) => {
        if (inventory[item.id]) {
            alert("¡Ya tienes esto!");
            return;
        }
        if (spendCoins(item.price)) {
            addItem(item.id, 1);
            alert(`¡Compraste ${item.name}!`);
        } else {
            alert("Necesitas más dinero.");
        }
    };

    // Ponerse ropa
    const equipItem = (item) => {
        if (outfit === item.id) {
            setOutfit(null); // Quitar
        } else {
            setOutfit(item.id); // Poner
        }
    };

    return (
        <div className="wardrobe-page">
            <header className="wardrobe-header">
                <Link to="/adventure" className="back-btn">⬅️ Salir</Link>
                <h1>👕 Probador de Félix</h1>
                <div className="coin-display">🪙 {coins}</div>
            </header>

            <div className="mannequin-area">
                <div className="felix-avatar">
                    {/* Si tiene la gorra, mostramos un avatar diferente */}
                    {outfit === 'ash-hat' ? '🧢👦' : 
                     outfit === 'rocket-uniform' ? '🕵️‍♂️' : '👦'}
                </div>
                <div className="current-stats">
                    <h3>Estilo Actual:</h3>
                    <p>{outfit ? CLOTHING_ITEMS[outfit].name : 'Ropa Normal'}</p>
                    <p className="effect-text">
                        {outfit ? CLOTHING_ITEMS[outfit].desc : 'Sin efectos especiales.'}
                    </p>
                </div>
            </div>

            <div className="clothing-grid">
                {Object.values(CLOTHING_ITEMS).map(item => {
                    const isOwned = inventory[item.id] > 0;
                    const isEquipped = outfit === item.id;

                    return (
                        <div key={item.id} className={`clothing-card ${isEquipped ? 'equipped' : ''}`}>
                            <div className="cloth-icon">{item.icon}</div>
                            <h3>{item.name}</h3>
                            <p>{item.desc}</p>
                            
                            {isOwned ? (
                                <button 
                                    className={`action-btn ${isEquipped ? 'unequip' : 'equip'}`}
                                    onClick={() => equipItem(item)}
                                >
                                    {isEquipped ? 'Quitar' : 'Ponerse'}
                                </button>
                            ) : (
                                <button className="action-btn buy" onClick={() => buyItem(item)}>
                                    Comprar {item.price} 🪙
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

2. Edificios Únicos y Lógica de Mapa 🏰🏔️

Vamos a integrar los efectos de la ropa directamente en la exploración del mundo (WorldPage.jsx).
Paso 2.1: Nuevos Tiles

Añade estos tipos a TILE_TYPES en WorldPage.jsx:
JavaScript

const TILE_TYPES = {
    // ...
    PALACE: 20,    // Palacio Real
    MOUNTAIN: 21,  // Montaña (Bloqueada sin botas)
    FOUNTAIN: 22   // Fuente de los Deseos (Plaza)
};

Paso 2.2: Lógica de Interacción con Ropa

Modifica handleTileEvent y movePlayer en WorldPage.jsx:
JavaScript

// En movePlayer, añadimos la lógica de las BOTAS DE MONTAÑA
const movePlayer = useCallback((dx, dy) => {
    // ... (cálculo de newX, newY)

    const targetTile = mapGrid[newY][newX];

    // LÓGICA DE MONTAÑA 🏔️
    if (targetTile === TILE_TYPES.MOUNTAIN) {
        if (outfit !== 'hiking-boots') {
            setMessage({ text: "🏔️ Es muy empinado. Necesitas Botas de Montaña.", color: '#ef4444' });
            return; // Bloquea el paso
        } else {
            // Si tiene botas, pasa
            setMessage({ text: "🥾 ¡Tus botas se agarran a la roca! Estás escalando.", color: '#b45309' });
        }
    }
    
    // ... resto de la lógica
}, [playerPos, outfit]); // ¡Importante añadir outfit a dependencias!


// En handleTileEvent, añadimos los eventos especiales
const handleTileEvent = (tileType) => {
    // LÓGICA DE UNIFORME ROCKET (Stealth) 🕵️
    if (tileType === TILE_TYPES.GRASS) {
        if (outfit === 'rocket-uniform') {
             // 0% probabilidad de encontrar al Team Rocket, solo Pokémon salvajes
             if (Math.random() < 0.3) {
                 // Solo lógica de encontrar pokemon o items, no ladrones
                 setMessage({ text: "🕵️ Pasaste desapercibido entre las sombras...", color: '#64748b' });
                 return;
             }
        }
        // ... (lógica normal de grass)
    }

    // PALACIO REAL 🏰
    if (tileType === TILE_TYPES.PALACE) {
        setMessage({ text: "👑 Guardia Real: '¡Alto! Solo el Campeón puede ver al Rey.'", color: '#fbbf24' });
        // Aquí podrías chequear si tiene una medalla específica
        return;
    }

    // FUENTE DE LOS DESEOS ⛲
    if (tileType === TILE_TYPES.FOUNTAIN) {
        const wishCost = 10;
        if (window.confirm(`¿Tirar ${wishCost} monedas a la fuente para pedir un deseo?`)) {
            spendCoins(wishCost);
            // Efecto aleatorio
            if (Math.random() > 0.5) {
                healAll();
                setMessage({ text: "✨ ¡La fuente brilla! Tus Pokémon han sido curados.", color: '#3b82f6' });
            } else {
                setMessage({ text: "💨 No pasó nada... pero te sientes esperanzado.", color: '#94a3b8' });
            }
        }
        return;
    }
};

3. Aplicar Efectos en Batalla (Capa de Fuego) 🔥

Finalmente, hagamos que la ropa afecte a las matemáticas del juego.

En BattlePage.jsx (o donde llames a calculateSmartDamage), pasa el outfit como argumento.
JavaScript

// Modificar src/lib/battle-logic.js

export const calculateSmartDamage = (attacker, defender, move, lastMoveName, outfit) => {
    // ... cálculo base ...
    let damage = baseDamage;

    // EFECTO DE ROPA: Capa Infernal
    if (outfit === 'fire-cape' && move.type === 'fire') {
        damage = Math.floor(damage * 1.2); // +20% Daño
        // Podrías devolver un mensaje especial también
    }

    return { damage, ... };
};

¿Por qué le encantará a Félix?

    Identidad: "Hoy quiero ser un explorador (Botas), mañana un agente secreto (Traje Rocket)".

    Metroidvania: Ver una montaña al principio y no poder subirla hasta que ahorra para las botas crea un objetivo a largo plazo brutal.

    Misterio: "¿Qué pasará si tiro una moneda a la fuente?". Descubrir secretos es la esencia de la exploración.