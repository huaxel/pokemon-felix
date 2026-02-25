export function createMockLlmProvider({
  response = {
    message: 'mock',
    emotion: 'neutral',
    action: null,
    relationship_delta: { friendship: 0, rivalry: 0 },
  },
} = {}) {
  return {
    id: 'mock',
    async fetchChatResponse(_systemPrompt, _userMessage, _history) {
      return response;
    },
  };
}
