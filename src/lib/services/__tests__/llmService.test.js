import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchChatResponse } from '../llmService';

describe('llmService - fetchChatResponse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('console', { ...console, error: vi.fn() });

    // Set default API key
    vi.stubEnv('VITE_OPENROUTER_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('should return an error object if API key is missing', async () => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', '');

    const result = await fetchChatResponse('system prompt', 'user message');

    expect(result).toEqual({
      message: "PokeGear error: No OpenRouter API Key found. (Add VITE_OPENROUTER_API_KEY to .env)",
      emotion: 'neutral',
      action: null,
      relationship_delta: { friendship: 0, rivalry: 0 }
    });
  });

  it('should return an error object if API key is placeholder', async () => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', 'your_api_key_here');

    const result = await fetchChatResponse('system prompt', 'user message');

    expect(result).toEqual({
      message: "PokeGear error: No OpenRouter API Key found. (Add VITE_OPENROUTER_API_KEY to .env)",
      emotion: 'neutral',
      action: null,
      relationship_delta: { friendship: 0, rivalry: 0 }
    });
  });

  it('should successfully fetch and return parsed response', async () => {
    const mockResponseData = {
      choices: [{
        message: {
          content: JSON.stringify({
            message: "Hello trainer!",
            emotion: "happy",
            action: "wave",
            relationship_delta: { friendship: 1, rivalry: 0 }
          })
        }
      }]
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponseData,
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchChatResponse('You are a Pokemon', 'Hello there');

    expect(mockFetch).toHaveBeenCalledWith('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
        'HTTP-Referer': 'https://github.com/huaxel/pokemon-felix',
        'X-Title': 'Pokemon Felix'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a Pokemon' },
          { role: 'user', content: 'Hello there' }
        ],
        response_format: { type: "json_object" }
      })
    });

    expect(result).toEqual({
      message: "Hello trainer!",
      emotion: "happy",
      action: "wave",
      relationship_delta: { friendship: 1, rivalry: 0 }
    });
  });

  it('should handle API errors (non-200 response)', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchChatResponse('system', 'user');

    expect(console.error).toHaveBeenCalledWith('LLM Fetch Error:', expect.any(Error));
    expect(result).toEqual({
      message: "The signal is weak here... try again?",
      emotion: 'neutral',
      action: null,
    });
  });

  it('should handle malformed JSON in API response', async () => {
    const mockResponseData = {
      choices: [{
        message: {
          content: "This is not JSON"
        }
      }]
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponseData,
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchChatResponse('system', 'user');

    expect(console.error).toHaveBeenCalledWith('LLM Fetch Error:', expect.any(SyntaxError));
    expect(result).toEqual({
      message: "The signal is weak here... try again?",
      emotion: 'neutral',
      action: null,
    });
  });

  it('should handle network errors (fetch throws)', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network Error'));
      vi.stubGlobal('fetch', mockFetch);

      const result = await fetchChatResponse('system', 'user');

      expect(console.error).toHaveBeenCalledWith('LLM Fetch Error:', expect.any(Error));
      expect(result).toEqual({
        message: "The signal is weak here... try again?",
        emotion: 'neutral',
        action: null,
      });
    });
});
