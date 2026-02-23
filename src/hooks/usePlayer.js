import { createContextHook } from '../modules/reactContext';
import { PlayerContext } from '../contexts/PlayerContext';

export const usePlayer = createContextHook(PlayerContext, 'usePlayer');
