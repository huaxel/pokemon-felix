import React, { createContext, useContext, useMemo } from 'react';
import { createLogger } from '../observability';
import { createDefaultLlmProvider } from '../llm';

const ServicesContext = createContext(null);

export function ServicesProvider({ services, children }) {
  const value = useMemo(() => services, [services]);
  return React.createElement(ServicesContext.Provider, { value }, children);
}

export function useServices() {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error('useServices must be used within ServicesProvider');
  }
  return services;
}

export function createStorage({ storage = globalThis?.localStorage } = {}) {
  if (!storage) {
    throw new Error('No storage implementation available');
  }

  return {
    getItem: key => storage.getItem(key),
    setItem: (key, value) => storage.setItem(key, value),
    removeItem: key => storage.removeItem(key),
    getJson: key => {
      const raw = storage.getItem(key);
      if (raw === null || raw === undefined) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    },
    setJson: (key, value) => storage.setItem(key, JSON.stringify(value)),
  };
}

export function createHttpClient({ fetchFn = globalThis?.fetch } = {}) {
  if (!fetchFn) {
    throw new Error('No fetch implementation available');
  }

  return {
    async request(url, init) {
      const res = await fetchFn(url, init);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    },
    async getJson(url, init) {
      const res = await fetchFn(url, { ...init, method: 'GET' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    },
    async postJson(url, body, init) {
      const res = await fetchFn(url, {
        ...init,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    },
  };
}

export function createDefaultServices() {
  const services = {
    logger: createLogger(),
    storage: createStorage(),
    http: createHttpClient(),
  };
  services.llmProvider = createDefaultLlmProvider({ services });
  return services;
}
