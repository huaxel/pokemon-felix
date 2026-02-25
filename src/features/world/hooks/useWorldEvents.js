import { useCallback } from 'react';
import { randomService } from '../../../lib/RandomService';
import { TILE_TYPES } from '../worldConstants';

const getNPCResponse = (
  tileType,
  { playerPos, questState, treeCount, addCoins, setQuestState, showMessage }
) => {
  if (playerPos.x === 5 && playerPos.y === 5) {
    if (questState === 'none') {
      showMessage("Prof. Eik: 'Felix! Ik heb hulp nodig. Plant 3 bomen!'", '#8b5cf6');
      setQuestState('active');
    } else if (questState === 'active' && treeCount >= 3) {
      showMessage("Prof. Eik: 'Geweldig! Je hebt 3 bomen geplant!'", '#fbbf24');
      addCoins(500);
      setQuestState('rewarded');
    } else if (questState === 'active')
      showMessage(`Prof. Eik: 'Nog even doorzetten! ${treeCount}/3 bomen.'`, '#8b5cf6');
    else showMessage("Prof. Eik: 'Wat een prachtig groen dorp!'", '#8b5cf6');
    return true;
  }
  if (tileType === TILE_TYPES.FISHERMAN || (playerPos.x === 5 && playerPos.y === 7)) {
    showMessage("De Visser: 'Hee Felix! Wil je een hengel uitwerpen?'", '#0ea5e9');
    const r = randomService.float(); // Seeded RNG
    if (r < 0.3) showMessage('Je hebt een Magikarp gevangen!', '#f87171');
    else if (r < 0.6) showMessage('Een oude laars...', '#64748b');
    else showMessage('Geen beet dit keer.', '#94a3b8');
    return true;
  }
  return false;
};

const getNavTile = tileType =>
  ({
    [TILE_TYPES.GACHA]: { msg: 'Poké-Gacha!', path: '/gacha', color: '#4c1d95' },
    [TILE_TYPES.SQUAD]: { msg: 'Team!', path: '/squad', color: '#1d4ed8' },
    [TILE_TYPES.MARKET]: { msg: 'Venta!', path: '/market', color: '#991b1b' },
    [TILE_TYPES.EVOLUTION]: { msg: 'Evolución!', path: '/evolution', color: '#166534' },
    [TILE_TYPES.GYM]: { msg: 'Gym!', path: '/gym', color: '#b45309' },
    [TILE_TYPES.SCHOOL]: { msg: 'School!', path: '/school', color: '#166534' },
    [TILE_TYPES.WARDROBE]: { msg: 'Wardrobe!', path: '/wardrobe', color: '#db2777' },
    [TILE_TYPES.BANK]: { msg: 'Bank!', path: '/bank', color: '#7c3aed' },
    [TILE_TYPES.CITY_HALL]: { msg: 'Ayuntamiento', path: '/city-hall', color: '#475569' },
    [TILE_TYPES.POTION_LAB]: { msg: 'Pociones!', path: '/potion-lab', color: '#8b5cf6' },
    [TILE_TYPES.FOUNTAIN]: { msg: 'Fuente!', path: '/fountain', color: '#06b6d4' },
    [TILE_TYPES.PALACE]: { msg: 'Palacio!', path: '/palace', color: '#7c3aed' },
    [TILE_TYPES.EVOLUTION_HALL]: { msg: 'Salón!', path: '/evolution-hall', color: '#d946ef' },
    [TILE_TYPES.MOUNTAIN]: { msg: 'Mountain!', path: '/mountain', color: '#8b7355' },
    [TILE_TYPES.SECRET_CAVE]: { msg: 'Cave!', path: '/secret-cave', color: '#8b5cf6' },
    [TILE_TYPES.WATER_ROUTE]: { msg: 'Water!', path: '/water-route', color: '#06b6d4' },
    [TILE_TYPES.DESERT]: { msg: 'Desierto!', path: '/desert', color: '#f59e0b' },
    [TILE_TYPES.CAVE_DUNGEON]: { msg: 'Mazmorra!', path: '/cave-dungeon', color: '#1e293b' },
    [TILE_TYPES.ART_STUDIO]: { msg: 'Art Studio!', path: '/art-studio', color: '#e879f9' },
    [TILE_TYPES.WARDROBE]: { msg: 'Tienda de Moda!', path: '/wardrobe', color: '#ec4899' },
    [TILE_TYPES.URBAN_SHOP]: { msg: 'Muebles & Dec', path: '/decor-shop', color: '#f59e0b' },
  })[tileType];

// Helper for Grass Encounters
const handleGrassEncounter = ({
  squadIds,
  getEncounterMultiplier,
  navigateWithMessage,
  showMessage,
  addItem,
  addCoins,
}) => {
  if (!squadIds || squadIds.length === 0) {
    showMessage('Je hebt nog geen Pokémon! Zoek eerst een Pokéball.', '#ef4444');
    return;
  }

  const chance = 0.3 * (getEncounterMultiplier ? getEncounterMultiplier() : 1);
  if (!randomService.bool(chance)) return;

  const r = randomService.float();
  if (r < 0.05) {
    navigateWithMessage('¡✨ LEYENDA ✨!', '/single-battle', '#f59e0b', 2000, {
      isWild: true,
      isLegendary: true,
    });
  } else if (r < 0.6) {
    navigateWithMessage('¡Pokémon!', '/single-battle', '#ef4444', 1500, { isWild: true });
  } else if (r < 0.8) {
    navigateWithMessage('¡Team Rocket!', '/single-battle', '#7f1d1d');
  } else {
    const r2 = randomService.float();
    if (r2 < 0.15) {
      showMessage('¡Encontraste una Baya Oran! 🫐', '#3b82f6');
      addItem('berry', 1);
    } else if (r2 < 0.2) {
      showMessage('¡Encontraste una Baya Zidra! 🍋', '#facc15');
      addItem('sitrus-berry', 1);
    } else if (r2 < 0.3) {
      showMessage('¡Encontraste una Baya Frambu! 🍓', '#ef4444');
      addItem('razz-berry', 1);
    } else {
      showMessage('¡Encontraste algo! +20', '#22c55e');
      addCoins(20);
    }
  }
};

const handleTreasurePickup = (playerPos, treasures, setTreasures, showMessage, addCoins) => {
  const tIdx = treasures.findIndex(t => t.x === playerPos.x && t.y === playerPos.y);
  if (tIdx !== -1) {
    showMessage('Schat! +100', '#fbbf24');
    addCoins(100);
    setTreasures(p => p.filter((_, i) => i !== tIdx));
    return true;
  }
  return false;
};

const handlePokeballPickup = (playerPos, pokeballs, setPokeballs, showMessage, addCoins) => {
  const pIdx = pokeballs?.findIndex(p => p.x === playerPos.x && p.y === playerPos.y);
  if (pIdx !== -1 && pIdx !== undefined) {
    showMessage('Pokéball! +250', '#ef4444');
    addCoins(250);
    setPokeballs(p => p.filter((_, i) => i !== pIdx));
    return true;
  }
  return false;
};

const handleGPSTarget = (playerPos, targetPos, showMessage, addCoins, generateRandomTarget) => {
  if (targetPos && playerPos.x === targetPos.x && playerPos.y === targetPos.y) {
    showMessage('GPS schat! +500', '#10b981');
    addCoins(500);
    generateRandomTarget(null);
    return true;
  }
  return false;
};

export function useWorldEvents({
  playerPos,
  questState,
  setQuestState,
  treeCount,
  addCoins,
  addItem,
  treasures,
  setTreasures,
  pokeballs,
  setPokeballs,
  targetPos,
  showMessage,
  navigateWithMessage,
  setShowInterior,
  getEncounterMultiplier,
  generateRandomTarget,
  squadIds,
}) {
  return useCallback(
    tileType => {
      if (
        getNPCResponse(tileType, {
          playerPos,
          questState,
          treeCount,
          addCoins,
          addItem,
          setQuestState,
          showMessage,
        })
      )
        return;

      const nav = getNavTile(tileType);
      if (nav) return navigateWithMessage(nav.msg, nav.path, nav.color);

      if (tileType === TILE_TYPES.HOUSE) return setShowInterior(true);
      if (tileType === TILE_TYPES.CENTER) {
        return navigateWithMessage('Centro Pokémon', '/center', '#ef4444');
      }

      if (tileType === TILE_TYPES.GRASS) {
        handleGrassEncounter({
          squadIds,
          getEncounterMultiplier,
          navigateWithMessage,
          showMessage,
          addItem,
          addCoins,
        });
        return;
      }

      if (handleTreasurePickup(playerPos, treasures, setTreasures, showMessage, addCoins)) return;
      if (handlePokeballPickup(playerPos, pokeballs, setPokeballs, showMessage, addCoins)) return;
      if (handleGPSTarget(playerPos, targetPos, showMessage, addCoins, generateRandomTarget))
        return;
    },
    [
      playerPos,
      questState,
      treeCount,
      treasures,
      pokeballs,
      targetPos,
      addCoins,
      addItem,
      setQuestState,
      showMessage,
      navigateWithMessage,
      setShowInterior,
      getEncounterMultiplier,
      generateRandomTarget,
      setTreasures,
      setPokeballs,
      squadIds,
    ]
  );
}
