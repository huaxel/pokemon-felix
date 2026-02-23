import assert from 'assert';
import { validateChatInput } from '../utils/validation.js';

// Test cases
const tests = [
  {
    name: 'Valid input',
    sender: 'player',
    content: 'Hello trainer!',
    expectedValid: true,
  },
  {
    name: 'Missing content',
    sender: 'player',
    content: null,
    expectedValid: false,
    expectedStatus: 400,
    expectedError: 'Sender and content are required',
  },
  {
    name: 'Empty content',
    sender: 'player',
    content: '',
    expectedValid: false,
    expectedStatus: 400,
    expectedError: 'Sender and content are required',
  },
  {
    name: 'Whitespace content',
    sender: 'player',
    content: '   ',
    expectedValid: false,
    expectedStatus: 400,
    expectedError: 'Content must be a non-empty string',
  },
  {
    name: 'Content too long',
    sender: 'player',
    content: 'a'.repeat(1001),
    expectedValid: false,
    expectedStatus: 400,
    expectedError: 'Content is too long (maximum 1000 characters)',
  },
  {
    name: 'Invalid sender',
    sender: 'invalid',
    content: 'Hello',
    expectedValid: false,
    expectedStatus: 400,
    expectedError: 'Invalid sender. Must be "player" or "trainer"',
  },
  {
    name: 'Content is exactly 1000 characters',
    sender: 'player',
    content: 'a'.repeat(1000),
    expectedValid: true,
  },
];

let failures = 0;
tests.forEach(test => {
  const result = validateChatInput(test.sender, test.content);
  try {
    assert.strictEqual(
      result.valid,
      test.expectedValid,
      `${test.name} failed: expected valid ${test.expectedValid}, got ${result.valid}`
    );
    if (!test.expectedValid) {
      assert.strictEqual(
        result.status,
        test.expectedStatus,
        `${test.name} failed: expected status ${test.expectedStatus}, got ${result.status}`
      );
      assert.strictEqual(
        result.error,
        test.expectedError,
        `${test.name} failed: expected error "${test.expectedError}", got "${result.error}"`
      );
    }
    console.log(`✅ ${test.name} passed`);
  } catch (err) {
    console.error(`❌ ${err.message}`);
    failures++;
  }
});

if (failures > 0) {
  process.exit(1);
} else {
  console.log('\nAll validation tests passed!');
}
