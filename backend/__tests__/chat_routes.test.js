import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createChatRouter } from '../routes/chat.js';

// Mock express
vi.mock('express', () => {
  const Router = vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    use: vi.fn(),
  }));
  return {
    default: { Router },
    Router,
  };
});

// Mock httpError
vi.mock('../lib/httpError.js', () => ({
  badRequest: vi.fn((msg) => new Error(`BadRequest: ${msg}`)),
}));

describe('Chat Routes Security Test', () => {
  let db;
  let getTrainerResponse;
  let router;
  let postHandler;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock DB
    db = {
      prepare: vi.fn().mockReturnValue({
        all: vi.fn(),
        run: vi.fn(),
        get: vi.fn(),
      }),
    };

    // Mock getTrainerResponse
    getTrainerResponse = vi.fn().mockResolvedValue({ reply: 'Hello', action: 'none' });

    // Create router
    router = createChatRouter({ db, getTrainerResponse });

    // Get the POST handler. Because we added a rateLimiter middleware,
    // the actual async handler is the 3rd argument.
    const postCall = router.post.mock.calls.find(call => call[0] === '/api/chat/:trainer_id');
    if (postCall) {
      postHandler = postCall[2];
    }
  });

  it('should prevent sender spoofing', async () => {
    const req = {
      params: { trainer_id: '1' },
      body: { sender: 'Ash Ketchum', content: 'I want to be the very best' },
    };
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    // asyncHandler returns void, so we await just in case, but it won't return a promise we can wait on for the inner logic.
    // However, since mock DB and everything is sync or mocked promises, checking next/db calls immediately after might work
    // or we might need to wait a tick.
    await postHandler(req, res, next);

    // Verify: DB insert should use 'player' not 'Ash Ketchum'
    expect(db.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO chat_history'));
    const runMock = db.prepare.mock.results[0].value.run;
    expect(runMock).toHaveBeenCalledWith('1', 'player', 'I want to be the very best');
  });

  it('should reject invalid content (empty string)', async () => {
    const req = {
      params: { trainer_id: '1' },
      body: { sender: 'player', content: '   ' },
    };
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    await postHandler(req, res, next);

    // Verify: next should be called with error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toContain('Content must be a non-empty string');

    // Verify: DB insert should NOT happen
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('should reject too long content', async () => {
    const longContent = 'a'.repeat(1001);
    const req = {
      params: { trainer_id: '1' },
      body: { sender: 'player', content: longContent },
    };
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    await postHandler(req, res, next);

    // Verify: next should be called with error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toContain('Content is too long (maximum 1000 characters)');

    // Verify: DB insert should NOT happen
    expect(db.prepare).not.toHaveBeenCalled();
  });
});
