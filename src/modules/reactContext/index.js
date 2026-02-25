import { useContext } from 'react';

export function createContextHook(Context, name) {
  return function useContextHook() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`${name} must be used within its Provider`);
    }
    return context;
  };
}
