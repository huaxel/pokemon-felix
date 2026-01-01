import { createContextHook } from '../lib/createContextHook';
import { TownContext } from '../contexts/TownContext';

export const useTownContext = createContextHook(TownContext, 'useTownContext');
