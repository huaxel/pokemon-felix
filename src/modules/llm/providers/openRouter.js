export function createOpenRouterProvider({
  apiKey,
  http,
  logger,
  apiUrl = 'https://openrouter.ai/api/v1/chat/completions',
  model = 'openai/gpt-4o-mini',
  referer = 'https://github.com/huaxel/pokemon-felix',
  title = 'Pokemon Felix',
} = {}) {
  return {
    id: 'openrouter',
    async fetchChatResponse(systemPrompt, userMessage, history = []) {
      if (!apiKey || apiKey === 'your_api_key_here') {
        return {
          message: 'PokeGear error: No OpenRouter API Key found. (Add VITE_OPENROUTER_API_KEY to .env)',
          emotion: 'neutral',
          action: null,
          relationship_delta: { friendship: 0, rivalry: 0 },
        };
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10),
        { role: 'user', content: userMessage },
      ];

      try {
        const data = await http.postJson(
          apiUrl,
          {
            model,
            messages,
            response_format: { type: 'json_object' },
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'HTTP-Referer': referer,
              'X-Title': title,
            },
          }
        );

        const content = data?.choices?.[0]?.message?.content;
        return typeof content === 'string' ? JSON.parse(content) : content;
      } catch (error) {
        logger?.error?.('LLM Fetch Error', error);
        return {
          message: 'The signal is weak here... try again?',
          emotion: 'neutral',
          action: null,
        };
      }
    },
  };
}
