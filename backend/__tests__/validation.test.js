import { describe, it, expect } from 'vitest';
import { validateChatInput } from '../utils/validation.js';

describe('validateChatInput', () => {
  const tests = [
    {
      name: 'Valid input',
      sender: 'player',
      content: 'Hello trainer!',
      expectedValid: true
    },
    {
      name: 'Missing content',
      sender: 'player',
      content: null,
      expectedValid: false,
      expectedStatus: 400,
      expectedError: 'Sender and content are required'
    },
    {
      name: 'Empty content',
      sender: 'player',
      content: '',
      expectedValid: false,
      expectedStatus: 400,
      expectedError: 'Sender and content are required'
    },
    {
      name: 'Whitespace content',
      sender: 'player',
      content: '   ',
      expectedValid: false,
      expectedStatus: 400,
      expectedError: 'Content must be a non-empty string'
    },
    {
      name: 'Content too long',
      sender: 'player',
      content: 'a'.repeat(1001),
      expectedValid: false,
      expectedStatus: 400,
      expectedError: 'Content is too long (maximum 1000 characters)'
    },
    {
      name: 'Invalid sender',
      sender: 'invalid',
      content: 'Hello',
      expectedValid: false,
      expectedStatus: 400,
      expectedError: 'Invalid sender. Must be "player" or "trainer"'
    },
    {
      name: 'Content is exactly 1000 characters',
      sender: 'player',
      content: 'a'.repeat(1000),
      expectedValid: true
    }
  ];

  tests.forEach(test => {
    it(test.name, () => {
      const result = validateChatInput(test.sender, test.content);
      expect(result.valid).toBe(test.expectedValid);
      if (!test.expectedValid) {
        expect(result.status).toBe(test.expectedStatus);
        expect(result.error).toBe(test.expectedError);
      }
    });
  });
});
