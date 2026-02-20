import { createContextHook } from '../lib/createContextHook';
import { PlayerContext } from '../contexts/PlayerContext';

export const usePlayer = createContextHook(PlayerContext, 'usePlayer');

