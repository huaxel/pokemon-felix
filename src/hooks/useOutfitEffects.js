import { useState, useEffect } from 'react';

const OUTFIT_EFFECTS = {
    'default': { name: 'Normal', description: 'Sin efectos especiales.' },
    'cool': { name: 'Carisma', description: 'Descuento del 10% en tiendas.', discount: 0.1 },
    'nature': { name: 'Camuflaje', description: 'Encuentra más objetos (x2 chance).', itemChanceMult: 2 },
    'ninja': { name: 'Sigilo', description: 'Menos encuentros salvajes (50%).', encounterRateMult: 0.5 },
    'shiny': { name: 'Brillo', description: 'Mayor suerte con Shinies (x2).', shinyChanceMult: 2 },
};

export function useOutfitEffects() {
    const [currentOutfit, setCurrentOutfit] = useState('default');

    useEffect(() => {
        const checkOutfit = () => {
            const saved = localStorage.getItem('felix_current_outfit');
            if (saved) setCurrentOutfit(saved);
        };

        checkOutfit();
        
        // Listen for storage events (if changed in another tab/component)
        window.addEventListener('storage', checkOutfit);
        
        // Custom event for same-window updates
        window.addEventListener('outfit_changed', checkOutfit);

        return () => {
             window.removeEventListener('storage', checkOutfit);
             window.removeEventListener('outfit_changed', checkOutfit);
        };
    }, []);

    const activeEffect = OUTFIT_EFFECTS[currentOutfit] || OUTFIT_EFFECTS['default'];

    return {
        currentOutfit,
        activeEffect,
        getDiscount: () => activeEffect.discount || 0,
        getEncounterMultiplier: () => activeEffect.encounterRateMult || 1,
        getItemChanceMultiplier: () => activeEffect.itemChanceMult || 1,
        getShinyChanceMultiplier: () => activeEffect.shinyChanceMult || 1
    };
}
