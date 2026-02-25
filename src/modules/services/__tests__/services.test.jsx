import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ServicesProvider, useServices, createStorage, createHttpClient, createDefaultServices } from '../index.js';

describe('services module', () => {
  const originalEnv = { ...import.meta.env };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.assign(import.meta.env, originalEnv);
  });

  it('throws when useServices is used outside provider', () => {
    expect(() => renderHook(() => useServices())).toThrow(/ServicesProvider/);
  });

  it('provides services via ServicesProvider', () => {
    const services = { storage: createStorage() };
    const wrapper = ({ children }) => <ServicesProvider services={services}>{children}</ServicesProvider>;

    const { result } = renderHook(() => useServices(), { wrapper });
    expect(result.current).toBe(services);
  });

  it('creates a storage adapter and handles invalid JSON', () => {
    const storage = createStorage();
    storage.setItem('x', '{not json}');
    expect(storage.getJson('x')).toBe(null);
    expect(storage.getJson('missing')).toBe(null);
  });

  it('throws when storage implementation is missing', () => {
    expect(() => createStorage({ storage: null })).toThrow(/No storage/);
  });

  it('creates an http client and throws on non-ok responses', async () => {
    const fetchFn = vi.fn();
    fetchFn.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const http = createHttpClient({ fetchFn });
    await expect(http.getJson('/x')).rejects.toThrow('HTTP 500');
  });

  it('creates default services and exposes llmProvider', () => {
    import.meta.env.VITE_LLM_PROVIDER = 'mock';
    const services = createDefaultServices();
    expect(services.llmProvider?.id).toBe('mock');
    expect(services.logger).toBeDefined();
    expect(services.storage).toBeDefined();
    expect(services.http).toBeDefined();
  });
});
