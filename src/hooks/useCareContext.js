import { createContextHook } from '../lib/createContextHook';
import { CareContext } from '../contexts/CareContext';

export const useCareContext = createContextHook(CareContext, 'useCareContext');
