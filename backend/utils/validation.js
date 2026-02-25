export function validateChatInput(sender, content) {
  if (!sender || !content) {
    return { valid: false, status: 400, error: 'Sender and content are required' };
  }

  if (typeof content !== 'string' || content.trim().length === 0) {
    return { valid: false, status: 400, error: 'Content must be a non-empty string' };
  }

  if (content.length > 1000) {
    return { valid: false, status: 400, error: 'Content is too long (maximum 1000 characters)' };
  }

  if (!['player', 'trainer'].includes(sender)) {
    return { valid: false, status: 400, error: 'Invalid sender. Must be "player" or "trainer"' };
  }

  return { valid: true };
}
