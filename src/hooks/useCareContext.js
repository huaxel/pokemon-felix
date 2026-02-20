import { createContextHook } from '../lib/createContextHook';
import { CareContext } from '../contexts/DomainContexts';

export const useCareContext = createContextHook(CareContext, 'useCareContext');
