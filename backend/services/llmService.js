import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import db from '../db/database.js';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const tools = [
  {
    name: 'start_battle',
    description:
      'Triggers a Pokemon battle between Felix and this trainer. Use this when Felix explicitly asks to battle or when the conversation naturally leads to a challenge.',
    input_schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: "A short reason for the battle (e.g., 'Friendly challenge', 'Rival match')",
        },
      },
      required: ['reason'],
    },
  },
];

export async function getTrainerResponse(trainerId, playerMessage) {
  // 1. Fetch Trainer Persona
  const trainer = db.prepare('SELECT * FROM trainers WHERE id = ?').get(trainerId);
  if (!trainer) throw new Error('Trainer not found');

  // 2. Fetch Relationship Context
  const relationship = db
    .prepare(
      `
    SELECT * FROM relationships 
    WHERE trainer_id = ?
  `
    )
    .get(trainerId);

  // 3. Fetch Recent Chat History
  const history = db
    .prepare(
      `
    SELECT * FROM chat_history 
    WHERE trainer_id = ? 
    ORDER BY timestamp DESC 
    LIMIT 10
  `
    )
    .all(trainerId)
    .reverse();

  // 4. Build System Prompt
  const personality = trainer.personality;
  const relationshipContext = relationship
    ? `Your relationship with Felix: ${relationship.relationship_type}. Friendship: ${relationship.friendship_score}, Rivalry: ${relationship.rivalry_score}. Summary: ${relationship.history_summary}`
    : "You've just met Felix.";

  const systemPrompt = `
You are ${trainer.name} from the Pokemon world.
Your personality: ${personality}
${relationshipContext}

Guidelines:
- Stay in character at all times.
- Keep responses relatively short (2-3 sentences), suitable for a 7-year-old child.
- You can talk about your Pokemon team: ${trainer.pokemon_team}.
- If the player wants to battle, use the 'start_battle' tool. Respond verbally as well.
`;

  // 5. Build Messages Array
  const messages = history.map(h => ({
    role: h.sender === 'player' ? 'user' : 'assistant',
    content: h.content
  }));

  // Append current user message
  messages.push({ role: "user", content: playerMessage });

  // 6. Call LLM
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 500,
    system: systemPrompt,
    tools: tools,
    messages: messages,
  });

  let trainerReply = '';
  let toolCall = null;

  for (const content of response.content) {
    if (content.type === 'text') {
      trainerReply += content.text;
    } else if (content.type === 'tool_use') {
      toolCall = content;
    }
  }

  // If tool was used, handle it
  if (toolCall && toolCall.name === 'start_battle') {
    trainerReply += '\n\n[Systeem: Gevecht wordt gestart!]';
  }

  // Save history
  db.prepare(
    `
    INSERT INTO chat_history (trainer_id, sender, content)
    VALUES (?, ?, ?)
  `
  ).run(trainerId, 'trainer', trainerReply);

  return {
    reply: trainerReply,
    action: toolCall ? { type: toolCall.name, ...toolCall.input } : null,
  };
}
