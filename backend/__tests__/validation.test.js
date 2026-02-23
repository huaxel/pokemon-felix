import { describe, it, expect } from 'vitest';
import { validateChatInput } from '../utils/validation.js';

describe('validateChatInput', () => {
  it('should accept valid input', () => {
    const result = validateChatInput('player', 'Hello trainer!');
    expect(result.valid).toBe(true);
  });

  it('should reject missing content', () => {
    const result = validateChatInput('player', null);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
    expect(result.error).toBe('Sender and content are required');
  });

  it('should reject empty content', () => {
    const result = validateChatInput('player', '');
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
    expect(result.error).toBe('Sender and content are required');
  });

  it('should reject whitespace content', () => {
    const result = validateChatInput('player', '   ');
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
    expect(result.error).toBe('Content must be a non-empty string');
  });

  it('should reject content that is too long', () => {
    const result = validateChatInput('player', 'a'.repeat(1001));
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
    expect(result.error).toBe('Content is too long (maximum 1000 characters)');
  });

  it('should reject invalid sender', () => {
    const result = validateChatInput('invalid', 'Hello');
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
    expect(result.error).toBe('Invalid sender. Must be "player" or "trainer"');
  });

  it('should accept content that is exactly 1000 characters', () => {
    const result = validateChatInput('player', 'a'.repeat(1000));
    expect(result.valid).toBe(true);
  });
});
