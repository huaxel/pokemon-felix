import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '../promptBuilder';

describe('promptBuilder', () => {
  const mockTrainer = {
    id: 'rival-blue',
    name: 'Blue (Rivaal)',
    personality: 'Arrogant and competitive.',
    pokemon_team: ['Blastoise', 'Arcanine']
  };

  const mockRelationship = {
    friendship_score: 50,
    rivalry_score: 50,
    relationship_type: 'rival',
    history_summary: 'We just met.',
    battles_won: 1,
    battles_lost: 2
  };

  it('correctly includes persona and team in prompt', () => {
    const prompt = buildSystemPrompt({ trainer: mockTrainer, relationship: mockRelationship });
    expect(prompt).toContain('Blue (Rivaal)');
    expect(prompt).toContain('Arrogant and competitive.');
    expect(prompt).toContain('Blastoise, Arcanine');
  });

  it('correctly includes relationship scores', () => {
    const prompt = buildSystemPrompt({ trainer: mockTrainer, relationship: mockRelationship });
    expect(prompt).toContain('Friendship: 50/100');
    expect(prompt).toContain('Rivalry: 50/100');
  });

  it('includes START_BATTLE actionable event instruction', () => {
    const prompt = buildSystemPrompt({ trainer: mockTrainer, relationship: mockRelationship });
    expect(prompt).toContain('START_BATTLE');
  });

  it('enforces JSON response format', () => {
    const prompt = buildSystemPrompt({ trainer: mockTrainer, relationship: mockRelationship });
    expect(prompt).toContain('Respond in EXACT JSON format');
    expect(prompt).toContain('"message":');
    expect(prompt).toContain('"relationship_delta":');
  });
});
