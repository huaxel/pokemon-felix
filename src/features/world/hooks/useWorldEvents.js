import { useCallback } from 'react';
import { TILE_TYPES } from '../worldConstants';

export function useWorldEvents({
    playerPos,
    questState,
    setQuestState,
    treeCount,
    addCoins,
    healAll,
    treasures,
    setTreasures,
    targetPos,
    showMessage,
    navigateWithMessage,
    setShowInterior,
    getEncounterMultiplier,
    generateRandomTarget
}) {
    return useCallback((tileType) => {
        if (tileType === TILE_TYPES.HOUSE) {
            setShowInterior(true);
            return;
        }

        // NPC check at (5, 5) - Prof. Oak
        if (playerPos.x === 5 && playerPos.y === 5) {
            if (questState === 'none') {
                showMessage("Prof. Eik: 'Felix! Ik heb je hulp nodig. Plant 3 bomen om het dorp mooier te maken!'", '#8b5cf6');
                setQuestState('active');
            } else if (questState === 'active' && treeCount >= 3) {
                showMessage("Prof. Eik: 'Geweldig! Je hebt 3 bomen geplant. Hier is een Gouden Beloning!'", '#fbbf24');
                addCoins(500);
                setQuestState('rewarded');
            } else if (questState === 'active') {
                showMessage(`Prof. Eik: 'Nog even doorzetten! Je hebt nu ${treeCount}/3 bomen geplant.'`, '#8b5cf6');
            } else {
                showMessage("Prof. Eik: 'Wat een prachtig groen dorp is dit geworden!'", '#8b5cf6');
            }
            return;
        }

        // Fisherman NPC at (5, 7)
        if (tileType === TILE_TYPES.FISHERMAN || (playerPos.x === 5 && playerPos.y === 7)) {
            showMessage("De Visser: 'Hee Felix! Wil je een hengel uitwerpen? Soms vang je Pokémon, soms... oude laarzen.'", '#0ea5e9');
            const rand = Math.random();
            if (rand < 0.3) {
                showMessage("Je hebt een Magikarp gevangen!", '#f87171');
            } else if (rand < 0.6) {
                showMessage("Een oude laars... die bewaar ik voor m'n verzameling.", '#64748b');
            } else {
                showMessage("Geen beet dit keer. Blijf proberen!", '#94a3b8');
            }
            return;
        }

        if (tileType === TILE_TYPES.WATER) {
            showMessage("Het water ziet er verfrissend uit. Ik zou graag willen zwemmen, maar ik heb mijn zwembroek niet mee!", '#0ea5e9');
            return;
        }

        // Generic Navigation Tiles
        const navigationTiles = {
            [TILE_TYPES.GACHA]: { msg: "Ik ga kijken in de Poké-Gacha!", path: '/gacha', color: '#4c1d95' },
            [TILE_TYPES.SQUAD]: { msg: "Ik check even mijn Pokémon team!", path: '/squad', color: '#1d4ed8' },
            [TILE_TYPES.MARKET]: { msg: "Ik denk dat ik wat Pokémon ga verkopen!", path: '/market', color: '#991b1b' },
            [TILE_TYPES.EVOLUTION]: { msg: "Ik ga een Pokémon laten evolueren!", path: '/evolution', color: '#166534' },
            [TILE_TYPES.GYM]: { msg: "Ik ga de Gym Leader verslaan! Ik ben er klaar voor!", path: '/gym', color: '#b45309' },
            [TILE_TYPES.SCHOOL]: { msg: "Ik ga naar school om te leren! 📚", path: '/school', color: '#166534' },
            [TILE_TYPES.WARDROBE]: { msg: "Tijd voor een nieuwe outfit! 👕", path: '/wardrobe', color: '#db2777' },
            [TILE_TYPES.BANK]: { msg: "Tijd om mijn geld te sparen! 💰", path: '/bank', color: '#7c3aed' },
            [TILE_TYPES.POTION_LAB]: { msg: "Tijd om pociones te maken! 🧪", path: '/potion-lab', color: '#8b5cf6' },
            [TILE_TYPES.FOUNTAIN]: { msg: "¡La Fuente de los Deseos brilla mágicamente! ✨", path: '/fountain', color: '#06b6d4' },
            [TILE_TYPES.PALACE]: { msg: "El majestuoso palacio se eleva ante ti... 👑", path: '/palace', color: '#7c3aed' },
            [TILE_TYPES.EVOLUTION_HALL]: { msg: "El Salón de Evolución brilla con energía mística... ⚡", path: '/evolution-hall', color: '#d946ef' },
            [TILE_TYPES.MOUNTAIN]: { msg: "⛰️ The mystical mountain looms ahead...", path: '/mountain', color: '#8b7355' },
            [TILE_TYPES.SECRET_CAVE]: { msg: "🕳️ A mysterious cave entrance beckons...", path: '/secret-cave', color: '#8b5cf6' },
            [TILE_TYPES.WATER_ROUTE]: { msg: "🌊 The sparkling water route awaits! Ready to surf?", path: '/water-route', color: '#06b6d4' },
        };

        if (navigationTiles[tileType]) {
            const { msg, path, color } = navigationTiles[tileType];
            navigateWithMessage(msg, path, color);
            return;
        }

        if (tileType === TILE_TYPES.CENTER) {
            showMessage("Ik voel me weer super! Pokémon genezen!", '#3b82f6');
            healAll();
            return;
        }

        // Check for normal treasures ✨
        const treasureIndex = treasures.findIndex(t => t.x === playerPos.x && t.y === playerPos.y);
        if (treasureIndex !== -1) {
            showMessage("Wauw! Je hebt een zeldzame schat gevonden! +100 coins", '#fbbf24');
            addCoins(100);
            setTreasures(prev => prev.filter((_, i) => i !== treasureIndex));
            return;
        }

        // Check for GPS Treasure 🧭
        if (targetPos && playerPos.x === targetPos.x && playerPos.y === targetPos.y) {
            showMessage("GEWELDIG! Je hebt de verborgen schat gevonden met je GPS! +500 coins", '#10b981');
            addCoins(500);
            generateRandomTarget(null);
            return;
        }

        // Grass logic
        if (tileType === TILE_TYPES.GRASS) {
            const encounterChance = 0.3 * (getEncounterMultiplier ? getEncounterMultiplier() : 1);
            if (Math.random() < encounterChance) {
                const rand = Math.random();
                if (rand < 0.6) {
                    navigateWithMessage("Ik kom een wilde Pokémon tegen!", '/single-battle', '#ef4444');
                } else if (rand < 0.8) {
                    navigateWithMessage("Geen genade! Ik versla Team Rocket!", '/single-battle', '#7f1d1d');
                } else {
                    showMessage("Wauw, ik heb iets gevonden! +20 coins", '#22c55e');
                    addCoins(20);
                }
            }
        }
    }, [
        playerPos, questState, setQuestState, treeCount, addCoins, 
        healAll, treasures, setTreasures, targetPos, showMessage, 
        navigateWithMessage, setShowInterior, getEncounterMultiplier,
        generateRandomTarget
    ]);
}
