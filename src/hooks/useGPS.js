import { useState, useCallback } from 'react';

/**
 * Hook to manage GPS-related calculations and target tracking.
 */
export function useGPS(gridSize = 10) {
    const [targetPos, setTargetPos] = useState(null);

    const generateRandomTarget = useCallback((excludePos = { x: 0, y: 0 }) => {
        let newTarget;
        do {
            newTarget = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
        } while (newTarget.x === excludePos.x && newTarget.y === excludePos.y);
        
        setTargetPos(newTarget);
        return newTarget;
    }, [gridSize]);

    const calculateDistance = useCallback((pos1, pos2) => {
        if (!pos1 || !pos2) return 0;
        // Manhattan distance for tile-based movement
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
    }, []);

    const getDirectionHint = useCallback((current, target) => {
        if (!current || !target) return '';
        
        const hints = [];
        if (target.y < current.y) hints.push('Norte');
        if (target.y > current.y) hints.push('Sur');
        if (target.x > current.x) hints.push('Este');
        if (target.x < current.x) hints.push('Oeste');
        
        return hints.join(' ');
    }, []);

    return {
        targetPos,
        setTargetPos,
        generateRandomTarget,
        calculateDistance,
        getDirectionHint
    };
}
