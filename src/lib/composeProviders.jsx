import React from 'react';

/**
 * Composes multiple providers into a single component.
 * Providers are nested from left to right (first in array is the outermost).
 * 
 * @param {Array} providers - Array of provider components or [Provider, props] tuples
 * @returns {Component} Composed component
 */
export function composeProviders(providers) {
    return ({ children }) => {
        return providers.reduceRight((acc, ProviderDef) => {
            const [Provider, props] = Array.isArray(ProviderDef) 
                ? ProviderDef 
                : [ProviderDef, {}];
                
            return React.createElement(Provider, props, acc);
        }, children);
    };
}
