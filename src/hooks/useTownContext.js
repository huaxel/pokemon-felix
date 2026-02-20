import { createContextHook } from '../lib/createContextHook';
import { TownContext } from '../contexts/DomainContexts';

export const useTownContext = createContextHook(TownContext, 'useTownContext');
