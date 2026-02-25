import { describe, it, expect, vi } from 'vitest';
import { createLlmProviderRegistry, createDefaultLlmProvider, createOpenRouterProvider, createMockLlmProvider } from '../index.js';

describe('llm module', () => {
  it('creates a registry and resolves providers by id', () => {
    const a = { id: 'a' };
    const b = { id: 'b' };
    const registry = createLlmProviderRegistry([a, b]);

    expect(registry.list().sort()).toEqual(['a', 'b']);
    expect(registry.get('a')).toBe(a);
    expect(() => registry.get('missing')).toThrow('Unknown LLM provider');
  });

  it('selects default provider using env', () => {
    const services = {
      http: { postJson: vi.fn() },
      logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
    };

    const provider = createDefaultLlmProvider({
      services,
      env: { VITE_LLM_PROVIDER: 'mock', VITE_OPENROUTER_API_KEY: 'x' },
    });

    expect(provider.id).toBe('mock');
  });

  it('openrouter provider returns an error payload when api key is missing', async () => {
    const provider = createOpenRouterProvider({
      apiKey: '',
      http: { postJson: vi.fn() },
      logger: { error: vi.fn() },
    });

    const res = await provider.fetchChatResponse('sys', 'hi', []);
    expect(res.message).toMatch(/No OpenRouter API Key/);
  });

  it('openrouter provider parses JSON content on success and returns fallback on error', async () => {
    const http = { postJson: vi.fn() };
    const logger = { error: vi.fn() };

    http.postJson.mockResolvedValueOnce({
      choices: [{ message: { content: '{"message":"ok","emotion":"neutral","action":null}' } }],
    });

    const provider = createOpenRouterProvider({ apiKey: 'k', http, logger });
    const ok = await provider.fetchChatResponse('sys', 'hi', []);
    expect(ok.message).toBe('ok');

    http.postJson.mockRejectedValueOnce(new Error('net'));
    const fallback = await provider.fetchChatResponse('sys', 'hi', []);
    expect(fallback.message).toMatch(/signal is weak/i);
    expect(logger.error).toHaveBeenCalled();
  });

  it('mock provider returns configured response', async () => {
    const provider = createMockLlmProvider({ response: { message: 'hello' } });
    const res = await provider.fetchChatResponse('sys', 'hi', []);
    expect(res).toEqual({ message: 'hello' });
  });
});
