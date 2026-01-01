import { describe, it, expect } from 'vitest';
import { createContextHook } from '../createContextHook';
import { createContext } from 'react';
import { renderHook } from '@testing-library/react';

describe('createContextHook', () => {
    it('should create a hook that returns context value', () => {
        const TestContext = createContext({ value: 'test' });
        const useTestContext = createContextHook(TestContext, 'useTestContext');
        
        const wrapper = ({ children }) => (
            <TestContext.Provider value={{ value: 'test' }}>
                {children}
            </TestContext.Provider>
        );
        
        const { result } = renderHook(() => useTestContext(), { wrapper });
        
        expect(result.current).toEqual({ value: 'test' });
    });
    
    it('should throw error when used outside provider', () => {
        const TestContext = createContext(null);
        const useTestContext = createContextHook(TestContext, 'useTestContext');
        
        expect(() => {
            renderHook(() => useTestContext());
        }).toThrow('useTestContext must be used within its Provider');
    });
    
    it('should use custom error message name', () => {
        const TestContext = createContext(null);
        const useCustomContext = createContextHook(TestContext, 'useCustomContext');
        
        expect(() => {
            renderHook(() => useCustomContext());
        }).toThrow('useCustomContext must be used within its Provider');
    });
});
