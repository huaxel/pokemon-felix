import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Use vi.hoisted to ensure mocks are available for vi.mock factory
const { mockDb, mockAnthropicInstance } = vi.hoisted(() => {
  const mockDb = {
    prepare: vi.fn(),
  };

  const mockAnthropicInstance = {
    messages: {
      create: vi.fn(),
    },
  };

  return { mockDb, mockAnthropicInstance };
});

// Mock modules
vi.mock('../../db/database.js', () => ({
  default: mockDb,
}));

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class Anthropic {
      constructor() {
        return mockAnthropicInstance;
      }
    },
  };
});

// Import the service AFTER mocking
import { getTrainerResponse } from '../llmService.js';

describe('llmService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    mockDb.prepare.mockImplementation(() => ({
      get: vi.fn(),
      all: vi.fn(),
      run: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should exist', () => {
    expect(getTrainerResponse).toBeDefined();
  });

  it('should throw "Trainer not found" if trainer does not exist', async () => {
    const mockGet = vi.fn().mockReturnValue(undefined);
    mockDb.prepare.mockReturnValue({ get: mockGet });

    await expect(getTrainerResponse('invalid-id', 'Hello')).rejects.toThrow('Trainer not found');
  });

  it('should return a successful text response and save chat history', async () => {
    // Setup - Database Mocks
    const mockTrainer = {
      id: 'trainer-1',
      name: 'Ash',
      personality: 'Energetic',
      pokemon_team: 'Pikachu',
    };
    const mockRelationship = {
      relationship_type: 'Rival',
      friendship_score: 10,
      rivalry_score: 5,
      history_summary: 'Battled once',
    };
    const mockHistory = [
      { sender: 'player', content: 'Hi' },
      { sender: 'trainer', content: 'Hello!' },
    ];

    const mockGet = vi.fn()
      .mockReturnValueOnce(mockTrainer)
      .mockReturnValueOnce(mockRelationship);

    const mockAll = vi.fn().mockReturnValue(mockHistory);
    const mockRun = vi.fn();

    mockDb.prepare.mockImplementation((query) => {
      if (query.includes('FROM trainers')) return { get: mockGet };
      if (query.includes('FROM relationships')) return { get: mockGet };
      if (query.includes('FROM chat_history') && query.includes('SELECT')) return { all: mockAll };
      if (query.includes('INSERT INTO chat_history')) return { run: mockRun };
      return { get: vi.fn(), all: vi.fn(), run: vi.fn() };
    });

    // Setup - Anthropic Mock
    const mockAnthropicResponse = {
      content: [
        { type: 'text', text: 'Pikachu, use Thunderbolt!' }
      ]
    };
    mockAnthropicInstance.messages.create.mockResolvedValue(mockAnthropicResponse);

    // Execute
    const result = await getTrainerResponse('trainer-1', 'Let us battle!');

    // Verify
    expect(result.reply).toBe('Pikachu, use Thunderbolt!');
    expect(result.action).toBeNull();
    expect(mockRun).toHaveBeenCalledWith('trainer-1', 'trainer', 'Pikachu, use Thunderbolt!');
  });

  it('should handle "start_battle" tool usage', async () => {
    // Setup - Database Mocks
    const mockTrainer = {
      id: 'trainer-2',
      name: 'Brock',
      personality: 'Stoic',
      pokemon_team: 'Onix',
    };
    const mockRelationship = undefined; // No relationship
    const mockHistory = [];

    const mockGet = vi.fn()
      .mockReturnValueOnce(mockTrainer) // 1. Fetch Trainer
      .mockReturnValueOnce(mockRelationship); // 2. Fetch Relationship

    const mockAll = vi.fn().mockReturnValue(mockHistory); // 3. Fetch History
    const mockRun = vi.fn(); // Save history

    mockDb.prepare.mockImplementation((query) => {
      if (query.includes('FROM trainers')) return { get: mockGet };
      if (query.includes('FROM relationships')) return { get: mockGet };
      if (query.includes('FROM chat_history') && query.includes('SELECT')) return { all: mockAll };
      if (query.includes('INSERT INTO chat_history')) return { run: mockRun };
      return { get: vi.fn(), all: vi.fn(), run: vi.fn() };
    });

    // Setup - Anthropic Mock
    const mockAnthropicResponse = {
      content: [
        { type: 'text', text: 'I accept your challenge!' },
        {
          type: 'tool_use',
          name: 'start_battle',
          input: { reason: 'Respect' }
        }
      ]
    };
    mockAnthropicInstance.messages.create.mockResolvedValue(mockAnthropicResponse);

    // Execute
    const result = await getTrainerResponse('trainer-2', 'Let us fight!');

    // Verify
    expect(result.reply).toContain('[Systeem: Gevecht wordt gestart!]');
    expect(result.action).toEqual({ type: 'start_battle', reason: 'Respect' });
  });

  it('should construct correct system prompt with context', async () => {
    // Setup
    const mockTrainer = {
      id: 'trainer-3',
      name: 'Misty',
      personality: 'Tsundere',
      pokemon_team: 'Starmie',
    };
    const mockRelationship = {
      relationship_type: 'Friend',
      friendship_score: 50,
      rivalry_score: 0,
      history_summary: 'Good friends',
    };
    const mockHistory = [
      { sender: 'player', content: 'Hey Misty' },
    ];

    const mockGet = vi.fn()
      .mockReturnValueOnce(mockTrainer)
      .mockReturnValueOnce(mockRelationship);

    const mockAll = vi.fn().mockReturnValue(mockHistory);

    mockDb.prepare.mockImplementation((query) => {
      if (query.includes('FROM trainers')) return { get: mockGet };
      if (query.includes('FROM relationships')) return { get: mockGet };
      if (query.includes('FROM chat_history')) return { all: mockAll };
      return { get: vi.fn(), all: vi.fn(), run: vi.fn() };
    });

    mockAnthropicInstance.messages.create.mockResolvedValue({
      content: [{ type: 'text', text: 'Response' }]
    });

    // Execute
    await getTrainerResponse('trainer-3', 'Test');

    // Verify System Prompt
    const callArgs = mockAnthropicInstance.messages.create.mock.calls[0][0];
    const systemPrompt = callArgs.system;

    expect(systemPrompt).toContain('You are Misty');
    expect(systemPrompt).toContain('Your personality: Tsundere');
    expect(systemPrompt).toContain('Your relationship with Felix: Friend');
    expect(systemPrompt).toContain('Friendship: 50');
    expect(systemPrompt).toContain('Starmie');
    expect(systemPrompt).toContain('player: Hey Misty');
  });
});
