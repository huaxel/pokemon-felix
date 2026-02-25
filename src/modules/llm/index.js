import { createOpenRouterProvider } from './providers/openRouter';
import { createMockLlmProvider } from './providers/mock';

export function createLlmProviderRegistry(providers) {
  const byId = new Map((providers || []).map(p => [p.id, p]));

  return {
    get(id) {
      const provider = byId.get(id);
      if (!provider) {
        throw new Error(`Unknown LLM provider: ${id}`);
      }
      return provider;
    },
    list() {
      return Array.from(byId.keys());
    },
  };
}

export function createDefaultLlmProvider({ services, env = import.meta.env } = {}) {
  const providerId = env?.VITE_LLM_PROVIDER || 'openrouter';

  const registry = createLlmProviderRegistry([
    createOpenRouterProvider({
      apiKey: env?.VITE_OPENROUTER_API_KEY,
      http: services?.http,
      logger: services?.logger,
    }),
    createMockLlmProvider(),
  ]);

  return registry.get(providerId);
}

export { createOpenRouterProvider, createMockLlmProvider };
