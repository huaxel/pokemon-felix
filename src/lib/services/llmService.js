/**
 * LLM Service to handle chat interactions and relationship logic.
 */

const LLM_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function fetchChatResponse(systemPrompt, userMessage, history = []) {
  if (!LLM_API_KEY || LLM_API_KEY === 'your_api_key_here') {
    return {
      message: 'PokeGear error: No OpenRouter API Key found. (Add VITE_OPENROUTER_API_KEY to .env)',
      emotion: 'neutral',
      action: null,
      relationship_delta: { friendship: 0, rivalry: 0 },
    };
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10), // Keep last 10 messages for context
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LLM_API_KEY}`,
        'HTTP-Referer': 'https://github.com/huaxel/pokemon-felix', // Optional, for OpenRouter rankings
        'X-Title': 'Pokemon Felix', // Optional
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: messages,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('LLM Fetch Error:', error);
    return {
      message: 'The signal is weak here... try again?',
      emotion: 'neutral',
      action: null,
    };
  }
}
