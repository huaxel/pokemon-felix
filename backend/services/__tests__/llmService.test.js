import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockAnthropicCreate, mockDbPrepare } = vi.hoisted(() => {
  return {
    mockAnthropicCreate: vi.fn(),
    mockDbPrepare: vi.fn(),
  }
});

// Mock modules
vi.mock('../../db/database.js', () => ({
  default: {
    prepare: mockDbPrepare
  }
}));

vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    constructor() {
      this.messages = {
        create: mockAnthropicCreate
      };
    }
  }
}));

// Import the function to test
import { getTrainerResponse } from '../llmService.js';

describe('llmService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: 'text', text: 'Hello!' }]
    });
  });

  it('should construct messages array correctly from history', async () => {
    // Setup mock data
    const trainerId = 'trainer1';
    const playerMessage = 'Hello trainer!';

    // Mock trainer
    mockDbPrepare.mockImplementation((query) => {
      if (query.includes('FROM trainers')) {
        return {
          get: () => ({
            id: 'trainer1',
            name: 'Ash',
            personality: 'Energetic',
            pokemon_team: 'Pikachu'
          })
        };
      }
      if (query.includes('FROM relationships')) {
        return {
          get: () => null // No relationship
        };
      }
      if (query.includes('FROM chat_history')) {
        return {
          all: () => [
            { sender: 'trainer', content: 'Hello!' },
            { sender: 'player', content: 'Hi there' }
          ] // Returns in reverse chronological order usually, let's assume implementation reverses it back
        };
      }
      return {
        run: vi.fn()
      };
    });

    // Call the function
    await getTrainerResponse(trainerId, playerMessage);

    // Verify anthropic.messages.create was called
    expect(mockAnthropicCreate).toHaveBeenCalled();

    const callArgs = mockAnthropicCreate.mock.calls[0][0];

    // Check system prompt does NOT contain history
    expect(callArgs.system).not.toContain('Chat history:');
    expect(callArgs.system).not.toContain('player: Hi there');

    // Check messages array contains history
    expect(callArgs.messages).toHaveLength(3); // 2 history + 1 new message
    expect(callArgs.messages[0]).toEqual({ role: 'user', content: 'Hi there' });
    expect(callArgs.messages[1]).toEqual({ role: 'assistant', content: 'Hello!' });
    expect(callArgs.messages[2]).toEqual({ role: 'user', content: 'Hello trainer!' });
  });
});
