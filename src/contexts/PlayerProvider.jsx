import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlayerContext } from './PlayerContext';
import { useServices } from '../modules/services';

// Default player data
const DEFAULT_PLAYER = {
  name: 'Félix',
  avatarId: 'boy_blue', // Placeholder for now
  badges: [],
  achievements: [],
};

export function PlayerProvider({ children }) {
  const { storage } = useServices();

  const [playerName, setPlayerName] = useState(() => {
    return storage.getItem('player_name') || DEFAULT_PLAYER.name;
  });

  const [avatarId, setAvatarId] = useState(() => {
    return storage.getItem('player_avatar') || DEFAULT_PLAYER.avatarId;
  });

  const [hasProfile, setHasProfile] = useState(() => {
    return storage.getItem('player_has_profile') === 'true';
  });

  // Persistence
  useEffect(() => {
    storage.setItem('player_name', playerName);
  }, [playerName, storage]);

  useEffect(() => {
    storage.setItem('player_avatar', avatarId);
  }, [avatarId, storage]);

  useEffect(() => {
    storage.setItem('player_has_profile', hasProfile);
  }, [hasProfile, storage]);

  const updateProfile = useCallback((name, avatar) => {
    if (name && name.trim().length > 0) {
      setPlayerName(name.trim().substring(0, 12));
    }
    if (avatar) {
      setAvatarId(avatar);
    }
    setHasProfile(true);
  }, []);

  const value = useMemo(
    () => ({
      playerName,
      avatarId,
      hasProfile,
      updateProfile,
      setPlayerName,
      setAvatarId,
    }),
    [playerName, avatarId, hasProfile, updateProfile]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
