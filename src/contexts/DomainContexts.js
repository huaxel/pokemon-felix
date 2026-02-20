import { createContext } from 'react';
import { createContextHook } from '../lib/createContextHook';

export const DataContext = createContext(null);
export const EconomyContext = createContext(null);
export const ProgressContext = createContext(null);
export const CollectionContext = createContext(null);
export const CareContext = createContext(null);
export const ExperienceContext = createContext(null);
export const TownContext = createContext(null);
export const UIContext = createContext(null);

export const useData = createContextHook(DataContext, 'useData');
export const useEconomy = createContextHook(EconomyContext, 'useEconomy');
export const useProgress = createContextHook(ProgressContext, 'useProgress');
export const useDomainCollection = createContextHook(CollectionContext, 'useDomainCollection');
export const useCare = createContextHook(CareContext, 'useCare');
export const useExperience = createContextHook(ExperienceContext, 'useExperience');
export const useDomainTown = createContextHook(TownContext, 'useDomainTown');
export const useUI = createContextHook(UIContext, 'useUI');
