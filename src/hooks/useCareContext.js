import { createContextHook } from '../modules/reactContext';
import { CareContext } from '../contexts/DomainContexts';

export const useCareContext = createContextHook(CareContext, 'useCareContext');
