import { createContext, useContext } from 'react';

export const DataContext = createContext(null);
export const EconomyContext = createContext(null);
export const ProgressContext = createContext(null);
export const CollectionContext = createContext(null);
export const CareContext = createContext(null);
export const ExperienceContext = createContext(null);
export const TownContext = createContext(null);
export const UIContext = createContext(null);

export const useData = () => useContext(DataContext);
export const useEconomy = () => useContext(EconomyContext);
export const useProgress = () => useContext(ProgressContext);
export const useDomainCollection = () => useContext(CollectionContext);

export const useDomainCare = () => useContext(CareContext);
export const useDomainExperience = () => useContext(ExperienceContext);
export const useDomainTown = () => useContext(TownContext);
export const useDomainUI = () => useContext(UIContext);
