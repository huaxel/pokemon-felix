import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlayerContext } from './PlayerContext';

// Default player data
const DEFAULT_PLAYER = {
    name: 'Félix',
    avatarId: 'boy_blue', // Placeholder for now
    badges: [],
    achievements: []
};

export function PlayerProvider({ children }) {
    const [playerName, setPlayerName] = useState(() => {
        return localStorage.getItem('player_name') || DEFAULT_PLAYER.name;
    });

    const [avatarId, setAvatarId] = useState(() => {
        return localStorage.getItem('player_avatar') || DEFAULT_PLAYER.avatarId;
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem('player_name', playerName);
    }, [playerName]);

    useEffect(() => {
        localStorage.setItem('player_avatar', avatarId);
    }, [avatarId]);

    const updateProfile = useCallback((name, avatar) => {
        if (name && name.trim().length > 0) {
            setPlayerName(name.trim().substring(0, 12));
        }
        if (avatar) {
            setAvatarId(avatar);
        }
    }, []);

    const value = useMemo(() => ({
        playerName,
        avatarId,
        updateProfile,
        setPlayerName,
        setAvatarId
    }), [playerName, avatarId, updateProfile]);

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
}
