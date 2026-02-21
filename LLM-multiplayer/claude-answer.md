anthropic/claude-sonnet-4.6
LLM Multiplayer Feature for Pokémon Trainer Game
Concept Overview

Each "friend/rival" is an LLM-powered NPC with persistent memory, personality, and a dynamic relationship with Felix that evolves over time.
Architecture

┌─────────────────────────────────────────────────────────┐
│                     Frontend (Game UI)                   │
│  Chat Panel | Relationship Status | Battle Challenges    │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   Backend API (Node.js)                  │
│  /chat  |  /challenge  |  /relationship  |  /trainers   │
└──────┬────────────┬───────────────┬──────────────────────┘
       │            │               │
┌──────▼───┐  ┌─────▼──────┐  ┌────▼──────────────────────┐
│  OpenAI  │  │  Database  │  │   Memory/Context Engine    │
│   API    │  │ (Postgres) │  │   (Summarization Layer)    │
└──────────┘  └────────────┘  └───────────────────────────┘

1. Database Schema

-- The NPC trainers Felix can befriend/rival
CREATE TABLE trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,           -- "Ash", "Gary", "Misty"
  personality JSONB NOT NULL,          -- traits, speech style, backstory
  avatar_url TEXT,
  trainer_class VARCHAR(50),           -- 'Rival', 'Friend', 'Gym Leader'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Felix's relationship with each trainer
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,             -- Felix's user ID
  trainer_id UUID REFERENCES trainers(id),
  relationship_type VARCHAR(20),       -- 'friend', 'rival', 'neutral', 'enemy'
  friendship_score INT DEFAULT 50,     -- 0-100
  rivalry_score INT DEFAULT 0,         -- 0-100
  battles_won INT DEFAULT 0,
  battles_lost INT DEFAULT 0,
  last_interaction TIMESTAMP,
  UNIQUE(player_id, trainer_id)
);

-- Individual chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  trainer_id UUID REFERENCES trainers(id),
  role VARCHAR(10) NOT NULL,           -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Summarized memory (so we don't send 1000s of tokens)
CREATE TABLE memory_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  trainer_id UUID REFERENCES trainers(id),
  summary TEXT NOT NULL,               -- "Felix beat Gary twice, Gary is jealous..."
  key_events JSONB,                    -- structured important moments
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, trainer_id)
);

2. Trainer Personalities (Seed Data)

// trainers.seed.js
const trainers = [
  {
    name: "Gary",
    trainer_class: "Rival",
    personality: {
      traits: ["arrogant", "competitive", "secretly-respectful"],
      speech_style: "boastful, uses 'Smell ya later!', brags about his Pokédex",
      backstory: "Grew up competing with Felix, always wants to be one step ahead",
      pokemon_team: ["Blastoise", "Arcanine", "Alakazam"],
      motivation: "Prove he's the greatest trainer alive",
      weakness: "Gets flustered when Felix genuinely compliments him"
    }
  },
  {
    name: "Misty",
    trainer_class: "Friend",
    personality: {
      traits: ["fiery", "caring", "water-pokemon-obsessed", "tsundere"],
      speech_style: "direct, gets easily annoyed, very passionate about water types",
      backstory: "Met Felix on Route 1, has been traveling buddy since",
      pokemon_team: ["Starmie", "Psyduck", "Gyarados"],
      motivation: "Become the world's greatest Water-type trainer",
      weakness: "Bug pokemon, and admitting she cares about people"
    }
  },
  {
    name: "Brock",
    trainer_class: "Friend", 
    personality: {
      traits: ["wise", "nurturing", "hopeless-romantic", "reliable"],
      speech_style: "gives advice, references cooking and breeding, falls for every girl",
      backstory: "Gave up his gym leader role to travel and learn",
      pokemon_team: ["Onix", "Geodude", "Vulpix"],
      motivation: "Become a Pokemon Breeder and find true love",
      weakness: "Any attractive person within 10 feet"
    }
  }
];

3. The Memory Engine

This is the most important part — keeping context without burning through tokens.

// services/memoryEngine.js

class MemoryEngine {
  
  // Build the context window for a conversation
  async buildContext(playerId, trainerId) {
    const [relationship, summary, recentMessages, trainerData] = await Promise.all([
      db.relationships.findOne({ player_id: playerId, trainer_id: trainerId }),
      db.memory_summaries.findOne({ player_id: playerId, trainer_id: trainerId }),
      // Only last 10 messages for recent context
      db.messages.findMany({ 
        player_id: playerId, 
        trainer_id: trainerId,
        orderBy: { created_at: 'desc' },
        take: 10
      }),
      db.trainers.findOne({ id: trainerId })
    ]);

    return { relationship, summary, recentMessages: recentMessages.reverse(), trainerData };
  }

  // Summarize old messages periodically (run every 20 messages)
  async updateMemorySummary(playerId, trainerId) {
    const { summary, recentMessages, relationship, trainerData } = 
      await this.buildContext(playerId, trainerId);

    const allOldMessages = await db.messages.findMany({
      player_id: playerId,
      trainer_id: trainerId,
      orderBy: { created_at: 'asc' },
      // Everything except last 10
      skip: 0,
      take: -10  
    });

    const summaryPrompt = `
      You are summarizing the relationship history between Felix (pokemon trainer) 
      and ${trainerData.name} for memory storage.
      
      EXISTING SUMMARY: ${summary?.summary || 'No history yet'}
      
      NEW MESSAGES TO INTEGRATE:
      ${allOldMessages.map(m => `${m.role}: ${m.content}`).join('\n')}
      
      Create a concise updated summary covering:
      - Key events and battles
      - How the relationship has evolved  
      - Important things ${trainerData.name} would remember about Felix
      - Emotional highlights (arguments, victories, moments of bonding)
      
      Also extract key_events as JSON array like:
      [{"date": "...", "event": "...", "impact": "friendship+10"}]
      
      Format: SUMMARY: <text> | KEY_EVENTS: <json>
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // cheaper model for summarization
      messages: [{ role: "user", content: summaryPrompt }]
    });

    // Parse and save
    const [summaryText, keyEventsJson] = response.choices[0].message.content.split('| KEY_EVENTS:');
    
    await db.memory_summaries.upsert({
      player_id: playerId,
      trainer_id: trainerId,
      summary: summaryText.replace('SUMMARY:', '').trim(),
      key_events: JSON.parse(keyEventsJson.trim()),
      updated_at: new Date()
    });
  }
}

4. Chat API Endpoint

// routes/chat.js
import { buildSystemPrompt } from '../services/promptBuilder.js';
import { MemoryEngine } from '../services/memoryEngine.js';
import { RelationshipEngine } from '../services/relationshipEngine.js';

const memoryEngine = new MemoryEngine();
const relationshipEngine = new RelationshipEngine();

app.post('/api/chat', async (req, res) => {
  const { trainerId, message } = req.body;
  const playerId = req.user.id; // Felix's ID from auth

  // 1. Load context
  const context = await memoryEngine.buildContext(playerId, trainerId);
  
  // 2. Build system prompt
  const systemPrompt = buildSystemPrompt(context);
  
  // 3. Save Felix's message
  await db.messages.create({
    player_id: playerId,
    trainer_id: trainerId,
    role: 'user',
    content: message
  });

  // 4. Call LLM
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      // Recent conversation history
      ...context.recentMessages.map(m => ({
        role: m.role,
        content: m.content
      })),
      { role: "user", content: message }
    ],
    // Get structured response
    response_format: { type: "json_object" }
  });

  const result = JSON.parse(response.choices[0].message.content);
  
  // 5. Save trainer's response
  await db.messages.create({
    player_id: playerId,
    trainer_id: trainerId,
    role: 'assistant',
    content: result.message
  });

  // 6. Update relationship scores based on interaction
  await relationshipEngine.processInteraction(playerId, trainerId, {
    playerMessage: message,
    trainerResponse: result,
    relationshipDelta: result.relationship_delta
  });

  // 7. Trigger memory summarization if needed
  const messageCount = await db.messages.count({ player_id: playerId, trainer_id: trainerId });
  if (messageCount % 20 === 0) {
    memoryEngine.updateMemorySummary(playerId, trainerId); // async, don't await
  }

  res.json({
    message: result.message,
    emotion: result.emotion,        // for avatar animations
    relationship_change: result.relationship_delta,
    challenge_issued: result.challenge_issued  // if trainer wants to battle
  });
});

5. The System Prompt Builder

// services/promptBuilder.js

export function buildSystemPrompt({ trainerData, relationship, summary }) {
  const { personality } = trainerData;
  const rel = relationship;

  return `
You are ${trainerData.name}, a Pokémon trainer in a game played by Felix.

## YOUR IDENTITY
- Trainer Class: ${trainerData.trainer_class}
- Personality traits: ${personality.traits.join(', ')}
- How you speak: ${personality.speech_style}  
- Your backstory: ${personality.backstory}
- Your Pokémon team: ${personality.pokemon_team.join(', ')}
- Your motivation: ${personality.motivation}
- Your weakness: ${personality.weakness}

## YOUR RELATIONSHIP WITH FELIX
- Relationship type: ${rel?.relationship_type || 'neutral'}
- Friendship score: ${rel?.friendship_score || 50}/100
- Rivalry score: ${rel?.rivalry_score || 0}/100
- Battles: You won ${rel?.battles_lost || 0}, Felix won ${rel?.battles_won || 0}

## WHAT YOU REMEMBER ABOUT FELIX
${summary?.summary || 'You just met Felix. Be appropriately cautious but curious.'}

## HOW TO BEHAVE
- Stay in character ALWAYS. Never break the 4th wall.
- Reference shared history naturally when relevant
- Your attitude toward Felix should reflect the relationship scores
  * Friendship 0-30: Cold, suspicious
  * Friendship 31-60: Neutral, getting to know each other  
  * Friendship 61-85: Warm, genuinely friendly
  * Friendship 86-100: Best friends, very open
- As a rival (${trainerData.trainer_class === 'Rival'}):
  * You're competitive but this drives Felix to improve
  * Celebrate his wins grudgingly, trash talk your own wins
- Occasionally challenge Felix to battles if rivalry is high
- React emotionally to news about his Pokémon and badges

## RESPONSE FORMAT (always valid JSON)
{
  "message": "Your in-character response here",
  "emotion": "happy|angry|surprised|sad|smug|excited|nervous",
  "relationship_delta": {
    "friendship": -5 to +5,
    "rivalry": -5 to +5,
    "reason": "brief explanation"
  },
  "challenge_issued": true | false,
  "challenge_details": null | { "format": "1v1", "stakes": "loser buys ramen" }
}
`;
}

6. Relationship Engine

// services/relationshipEngine.js

export class RelationshipEngine {
  
  async processInteraction(playerId, trainerId, { relationshipDelta }) {
    const rel = await db.relationships.findOne({ player_id: playerId, trainer_id: trainerId });
    
    const newFriendship = Math.max(0, Math.min(100, 
      rel.friendship_score + (relationshipDelta.friendship || 0)
    ));
    
    const newRivalry = Math.max(0, Math.min(100,
      rel.rivalry_score + (relationshipDelta.rivalry || 0)
    ));

    // Relationship type evolves automatically
    const newType = this.calculateRelationshipType(newFriendship, newRivalry);

    await db.relationships.update({
      player_id: playerId,
      trainer_id: trainerId,
      friendship_score: newFriendship,
      rivalry_score: newRivalry,
      relationship_type: newType,
      last_interaction: new Date()
    });

    // Trigger special events at thresholds
    await this.checkMilestones(playerId, trainerId, newFriendship, newRivalry);
  }

  calculateRelationshipType(friendship, rivalry) {
    if (friendship > 75 && rivalry > 75) return 'friendly-rival';  // best kind!
    if (friendship > 75) return 'best-friend';
    if (rivalry > 75) return 'arch-rival';
    if (friendship < 25 && rivalry > 50) return 'enemy';
    if (friendship > 50) return 'friend';
    if (rivalry > 50) return 'rival';
    return 'neutral';
  }

  async checkMilestones(playerId, trainerId, friendship, rivalry) {
    // These create special in-game moments
    const milestones = [
      { condition: friendship >= 100, event: 'BEST_FRIEND_UNLOCKED', reward: 'special_item' },
      { condition: rivalry >= 100, event: 'ARCH_RIVAL_UNLOCKED', reward: 'rival_badge' },
      { condition: friendship === 50 && rivalry === 50, event: 'PERFECT_BALANCE', reward: 'balance_badge' }
    ];

    for (const milestone of milestones) {
      if (milestone.condition) {
        await this.triggerMilestoneEvent(playerId, trainerId, milestone);
      }
    }
  }
}

7. Frontend Chat Component

// components/TrainerChat.jsx
import { useState, useEffect, useRef } from 'react';

export function TrainerChat({ trainer, relationship }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [trainerEmotion, setTrainerEmotion] = useState('neutral');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainerId: trainer.id, message: input })
      });
      
      const data = await res.json();
      
      setTrainerEmotion(data.emotion);
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      
      // Show relationship change notification
      if (data.relationship_change.friendship !== 0) {
        showRelationshipToast(data.relationship_change);
      }
      
      // Handle battle challenge
      if (data.challenge_issued) {
        showBattleChallenge(data.challenge_details);
      }

    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="trainer-chat">
      {/* Trainer Avatar with emotion */}
      <div className="trainer-header">
        <TrainerAvatar 
          trainer={trainer} 
          emotion={trainerEmotion}  // swap sprite based on emotion
        />
        <RelationshipBar 
          friendship={relationship.friendship_score}
          rivalry={relationship.rivalry_score}
          type={relationship.relationship_type}
        />
      </div>

      {/* Message History */}
      <div className="messages-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <span className="trainer-name">{trainer.name}:</span>
            )}
            <p>{msg.content}</p>
          </div>
        ))}
        {isTyping && <TypingIndicator trainerName={trainer.name} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder={`Talk to ${trainer.name}...`}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

// Relationship visualization
function RelationshipBar({ friendship, rivalry, type }) {
  const typeColors = {
    'best-friend': '#4CAF50',
    'arch-rival': '#F44336', 
    'friendly-rival': '#FF9800',
    'enemy': '#9C27B0',
    'friend': '#8BC34A',
    'rival': '#FF5722',
    'neutral': '#9E9E9E'
  };

  return (
    <div className="relationship-bar">
      <span style={{ color: typeColors[type] }}>{type.toUpperCase()}</span>
      <div>💚 {friendship}/100</div>
      <div>⚔️ {rivalry}/100</div>
    </div>
  );
}

8. Cost Management

// This keeps API costs low for a kid's game

const MODEL_STRATEGY = {
  // Cheap & fast for regular chat
  chat: "gpt-4o-mini",          // ~$0.00015 per message
  
  // Better for important story moments  
  story_events: "gpt-4o",       // ~$0.005 per message
  
  // Cheapest for background summarization
  summarization: "gpt-4o-mini"
};

// Rate limiting per player
const RATE_LIMITS = {
  messages_per_hour: 30,
  messages_per_day: 100
};

Tech Stack Recommendation

| Layer | Choice | Why | |-------|--------|-----| | Frontend | React + Tailwind | Fast to build, Felix can learn it | | Backend | Node.js + Express | Easy JS for game logic | | Database | PostgreSQL + Prisma | Reliable, great for relationships | | LLM | OpenAI GPT-4o-mini | Cheap, good enough | | Auth | Clerk or Supabase Auth | Simple to set up | | Hosting | Vercel + Railway | Free tiers available |
Phased Build Plan

Phase 1 — Basic Chat (Week 1-2)
  ✅ One trainer (Gary as rival)
  ✅ Simple chat with personality
  ✅ Messages saved to DB

Phase 2 — Memory (Week 3-4)  
  ✅ Summarization engine
  ✅ Relationship scores
  ✅ Scores affect Gary's attitude

Phase 3 — Multiple Trainers (Week 5-6)
  ✅ Add Misty, Brock
  ✅ Trainers talk about each other
  ✅ Relationship milestones + rewards

Phase 4 — Polish (Week 7-8)
  ✅ Emotion-based avatars
  ✅ Battle challenges from chat
  ✅ Relationship badges

Felix is going to love having Gary trash-talk him and then grudgingly respect him after enough battles! The key magic is in the memory summarization keeping costs low while making it feel like these trainers genuinely know and remember him. 🎮