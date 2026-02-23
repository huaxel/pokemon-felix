import { createContextHook } from '../modules/reactContext';
import { TownContext } from '../contexts/DomainContexts';

export const useTownContext = createContextHook(TownContext, 'useTownContext');
