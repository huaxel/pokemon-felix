z-ai/glm-5
LLM Multiplayer Feature for Felix's Pokémon Game

This is a fantastic project! Let me break down a practical implementation that balances fun, simplicity, and extensibility.
🎮 Core Architecture Overview

┌─────────────────────────────────────────────────────────────────┐
│ GAME CLIENT │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│ │ Game World │ │ Chat UI │ │ Relationship Panel │ │
│ └──────────────┘ └──────────────┘ └──────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
│
┌────────────────────────────▼────────────────────────────────────┐
│ BACKEND SERVER │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│ │ Memory Store │ │ LLM Service │ │ Relationship Engine │ │
│ └──────────────┘ └──────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

📦 Key Components

1. Character Profiles (Friends/Rivals)
2. Memory System (What they remember)
3. Relationship Tracker (How they feel about Felix)
4. LLM Chat Interface (Dynamic conversations)
   🗄️ Database Schema

-- Characters (NPCs)
CREATE TABLE characters (
id TEXT PRIMARY KEY,
name TEXT NOT NULL,
type TEXT CHECK(type IN ('friend', 'rival', 'neutral')),
personality TEXT, -- JSON: {traits: ["competitive", "kind"]}
backstory TEXT,
speech_patterns TEXT, -- JSON: {greeting_style: "casual"}
created_at TIMESTAMP DEFAULT NOW()
);

-- Player-Character Relationships
CREATE TABLE relationships (
id TEXT PRIMARY KEY,
player_id TEXT NOT NULL,
character_id TEXT REFERENCES characters(id),
friendship_level INTEGER DEFAULT 50, -- 0-100
rivalry_intensity INTEGER DEFAULT 0, -- 0-100
battles_won INTEGER DEFAULT 0,
battles_lost INTEGER DEFAULT 0,
trades_completed INTEGER DEFAULT 0,
first_met TIMESTAMP DEFAULT NOW(),
last_interaction TIMESTAMP,
UNIQUE(player_id, character_id)
);

-- Memory Store (Episodic)
CREATE TABLE memories (
id TEXT PRIMARY KEY,
player_id TEXT NOT NULL,
character_id TEXT NOT NULL,
memory_type TEXT CHECK(memory_type IN (
'battle', 'trade', 'gift', 'conversation', 'milestone', 'betrayal'
)),
summary TEXT NOT NULL, -- LLM-generated summary
importance INTEGER DEFAULT 5, -- 1-10, used for retrieval ranking
raw_transcript TEXT, -- Original conversation
game_context TEXT, -- JSON: {location: "Pewter City", ...}
created_at TIMESTAMP DEFAULT NOW()
);

-- Conversation History
CREATE TABLE conversations (
id TEXT PRIMARY KEY,
player_id TEXT NOT NULL,
character_id TEXT NOT NULL,
player_message TEXT,
character_response TEXT,
sentiment TEXT, -- LLM-detected: positive/negative/neutral
created_at TIMESTAMP DEFAULT NOW()
);

🧠 Memory System Design

The heart of this feature! Here's how NPCs remember:

// memory-system.js

class MemorySystem {
constructor(db, embeddingService = null) {
this.db = db;
this.embeddings = embeddingService; // Optional: for semantic search
}

/\*\*

- Store a new memory with auto-generated summary
  \*/
  async storeMemory(playerId, characterId, event) {
  const { type, details, gameContext } = event;


    // Generate a concise summary (could use LLM)
    const summary = await this.generateSummary(type, details);

    // Calculate importance based on event type
    const importance = this.calculateImportance(type, details);

    await this.db.query(`
      INSERT INTO memories (id, player_id, character_id, memory_type,
                           summary, importance, game_context)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [uuid(), playerId, characterId, type, summary, importance, gameContext]);

    // Update relationship based on memory
    await this.updateRelationship(playerId, characterId, type, details);

}

/\*\*

- Retrieve relevant memories for context
  \*/
  async getRelevantMemories(playerId, characterId, currentContext, limit = 10) {
  // Get high-importance memories + recent interactions
  const result = await this.db.query(`     SELECT summary, memory_type, created_at, importance
    FROM memories
    WHERE player_id = $1 AND character_id = $2
    ORDER BY
      importance DESC,
      created_at DESC
    LIMIT $3
  `, [playerId, characterId, limit]);


    return result.rows;

}

/\*\*

- Get relationship snapshot for prompt context
  _/
  async getRelationshipContext(playerId, characterId) {
  const rel = await this.db.query(`
  SELECT _ FROM relationships
  WHERE player_id = $1 AND character_id = $2
  `, [playerId, characterId]);


    const memories = await this.getRelevantMemories(playerId, characterId, null, 5);

    return {
      friendship: rel.rows[0]?.friendship_level ?? 50,
      rivalry: rel.rows[0]?.rivality_intensity ?? 0,
      battles: {
        won: rel.rows[0]?.battles_won ?? 0,
        lost: rel.rows[0]?.battles_lost ?? 0
      },
      keyMemories: memories.map(m => m.summary),
      daysSinceFirstMet: this.daysSince(rel.rows[0]?.first_met)
    };

}

calculateImportance(type, details) {
const importanceMap = {
'battle': details.won ? 8 : 7,
'trade': 6,
'gift': details.rarity === 'legendary' ? 9 : 5,
'milestone': 10,
'betrayal': 10,
'conversation': 3
};
return importanceMap[type] ?? 5;
}

async updateRelationship(playerId, characterId, eventType, details) {
const deltas = {
'battle': details.won ? { friendship: 2, rivalry: 3 } : { friendship: -1, rivalry: 1 },
'trade': { friendship: 5, rivalry: -2 },
'gift': { friendship: 10, rivalry: -5 },
'betrayal': { friendship: -20, rivalry: 15 }
};

    const delta = deltas[eventType] ?? { friendship: 0, rivalry: 0 };

    await this.db.query(`
      INSERT INTO relationships (player_id, character_id, friendship_level, rivalry_intensity)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (player_id, character_id) DO UPDATE SET
        friendship_level = LEAST(100, GREATEST(0, relationships.friendship_level + $3)),
        rivalry_intensity = LEAST(100, GREATEST(0, relationships.rivality_intensity + $4)),
        last_interaction = NOW()
    `, [playerId, characterId, delta.friendship, delta.rivalry]);

}
}

🤖 LLM Integration Service

// llm-service.js

class LLMChatService {
constructor(apiKey, model = 'gpt-4o-mini') {
this.apiKey = apiKey;
this.model = model;
this.baseUrl = 'https://api.openai.com/v1/chat/completions';
}

/\*\*

- Build the system prompt with character personality and memories
  \*/
  buildSystemPrompt(character, relationshipContext) {
  const personalityTraits = character.personality.traits.join(', ');


    // Determine relationship tone
    let toneGuidance = '';
    if (relationshipContext.friendship > 75) {
      toneGuidance = 'You consider them a close friend. Show warmth and genuine care.';
    } else if (relationshipContext.friendship > 50) {
      toneGuidance = 'You\'re friendly acquaintances. Be pleasant but not overly familiar.';
    } else if (relationshipContext.rivalry > 50) {
      toneGuidance = 'You\'re competitive rivals. Be challenging and slightly provocative, but respectful.';
    } else {
      toneGuidance = 'You\'re still getting to know them. Be curious and measured.';
    }

    return `You are ${character.name}, a Pokémon trainer in a Pokémon world game.

## Your Personality

Traits: ${personalityTraits}
Backstory: ${character.backstory}
Speech Style: ${character.speech_patterns.greeting_style}

## Your Relationship with the Player

${toneGuidance}

Battle Record: You've won ${relationshipContext.battles.won} battles against them,
and lost ${relationshipContext.battles.lost}.
You've known each other for ${relationshipContext.daysSinceFirstMet} days.

## Key Memories You Have

${relationshipContext.keyMemories.map((m, i) => `${i + 1}. ${m}`).join('\n')}

## Rules

- Stay in character at all times
- Reference past events naturally when relevant
- Your responses should reflect your relationship level
- Keep responses concise (2-4 sentences typical, up to 6 for important moments)
- Use Pokémon world terminology naturally
- If the player mentions a battle or trade, show appropriate emotion
- Never break the fourth wall or mention being an AI`;
  }

  /\*\*
  - Generate a response
    \*/
    async generateResponse(character, relationshipContext, conversationHistory, playerMessage) {
    const systemPrompt = this.buildSystemPrompt(character, relationshipContext);


      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10).map(m => ({
          role: m.role,
          content: m.content
        })),
        { role: 'user', content: playerMessage }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 200,
          temperature: 0.8  // Some creativity for fun responses
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;

  }

  /\*\*
  - Generate a proactive greeting based on time since last meeting
    \*/
    async generateGreeting(character, relationshipContext, timeSinceLastMeeting) {
    const contextNote = timeSinceLastMeeting > 7
    ? `You haven't seen them in ${Math.floor(timeSinceLastMeeting)} days!`
    : timeSinceLastMeeting > 1
    ? `It's been a day or two since you last talked.`
    : `You saw them recently.`;


      const prompt = `Generate a brief greeting (1-2 sentences) as ${character.name}

  seeing the player. ${contextNote}
  Your relationship: friendship level ${relationshipContext.friendship}/100.
  Style: ${character.speech_patterns.greeting_style}`;

      // Quick LLM call for dynamic greeting
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100,
          temperature: 0.9
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;

  }
  }

🎯 Main Chat Endpoint

// api/chat.js

import { MemorySystem } from './memory-system.js';
import { LLMChatService } from './llm-service.js';

const memorySystem = new MemorySystem(db);
const llmService = new LLMChatService(process.env.OPENAI_API_KEY);

app.post('/api/chat', async (req, res) => {
const { playerId, characterId, message, gameContext } = req.body;

try {
// 1. Get character info
const character = await db.getCharacter(characterId);

    // 2. Load relationship & memory context
    const relationshipContext = await memorySystem.getRelationshipContext(
      playerId,
      characterId
    );

    // 3. Get recent conversation history
    const history = await db.getConversationHistory(playerId, characterId, 10);

    // 4. Generate response
    const response = await llmService.generateResponse(
      character,
      relationshipContext,
      history,
      message
    );

    // 5. Store conversation
    await db.storeConversation(playerId, characterId, message, response);

    // 6. Extract any important events to remember
    const memoryEvent = await detectMemoryEvent(message, response, gameContext);
    if (memoryEvent) {
      await memorySystem.storeMemory(playerId, characterId, memoryEvent);
    }

    res.json({
      response,
      relationship: {
        friendship: relationshipContext.friendship,
        rivalry: relationshipContext.rivalry
      }
    });

} catch (error) {
console.error('Chat error:', error);
res.status(500).json({ error: 'Something went wrong!' });
}
});

/\*\*

- Detect if conversation contains a memorable event
  \*/
  async function detectMemoryEvent(playerMessage, response, gameContext) {
  // Simple keyword detection - could use LLM for more nuance
  const battleKeywords = ['battle', 'fight', 'challenge', 'won', 'lost', 'victory', 'defeat'];
  const tradeKeywords = ['trade', 'swap', 'exchange'];
  const giftKeywords = ['gift', 'gave', 'present', 'here, take'];

const lowerMessage = playerMessage.toLowerCase();

if (battleKeywords.some(k => lowerMessage.includes(k))) {
return {
type: 'battle',
details: { won: lowerMessage.includes('won') || lowerMessage.includes('beat') },
gameContext
};
}

if (tradeKeywords.some(k => lowerMessage.includes(k))) {
return {
type: 'trade',
details: {},
gameContext
};
}

return null;
}

👤 Sample Character Definitions

// characters.js

export const CHARACTERS = {
gary_oak: {
id: 'gary_oak',
name: 'Gary Oak',
type: 'rival',
personality: {
traits: ['competitive', 'confident', 'secretly-caring', 'intelligent'],
fears: ['being surpassed', 'disappointing grandfather'],
loves: ['research', 'rare pokémon', 'winning']
},
backstory: `Grandson of Professor Oak, you've always been driven to prove
yourself. You started as arrogant but have grown through your journey. 
Deep down, you respect trainers who earn it.`,
speech_patterns: {
greeting_style: 'smug-but-playful',
catchphrases: ['Smell ya later!', 'I'm ahead of you!'],
battle_taunts: ['Is that all you\'ve got?', 'My research gave me the edge!']
}
},

misty: {
id: 'misty',
name: 'Misty',
type: 'friend',
personality: {
traits: ['passionate', 'hot-headed', 'loyal', 'romantic'],
fears: ['bug pokemon', 'being seen as weak'],
loves: ['water pokemon', 'romance novels', 'swimming']
},
backstory: `Cerulean City Gym Leader and one of the original traveling
companions. You're passionate about Water-type Pokémon and have a short 
temper, but you're incredibly loyal to friends.`,
speech_patterns: {
greeting_style: 'cheerful-and-direct',
catchphrases: ['Water types are the best!', 'Bug Pokémon... eww!'],
battle_taunts: ['You\'re in over your head!', 'My Water-types will wash you away!']
}
},

brendan: {
id: 'brendan',
name: 'Brendan',
type: 'friend',
personality: {
traits: ['encouraging', 'strategic', 'curious', 'patient'],
fears: ['failing his father\'s expectations'],
loves: ['pokemon breeding', 'strategy', 'helping new trainers']
},
backstory: `Son of Norman, the Petalburg Gym Leader. You chose to help
other trainers rather than compete directly. You're patient and love 
teaching battle strategy.`,
speech_patterns: {
greeting_style: 'warm-and-helpful',
catchphrases: ['Let me show you something cool!', 'Strategy beats raw power!'],
battle_taunts: ['I\'ve analyzed your weaknesses!', 'Check this out!']
}
}
};

🎨 Frontend Chat Component (React Example)

// ChatPanel.jsx

import { useState, useEffect, useRef } from 'react';

export function ChatPanel({ playerId, character, onClose }) {
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [relationship, setRelationship] = useState({ friendship: 50, rivalry: 0 });
const messagesEndRef = useRef(null);

useEffect(() => {
// Load initial greeting
loadGreeting();
}, [character.id]);

useEffect(() => {
scrollToBottom();
}, [messages]);

async function loadGreeting() {
setIsLoading(true);
try {
const res = await fetch('/api/greeting', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ playerId, characterId: character.id })
});
const data = await res.json();
setMessages([{ role: 'assistant', content: data.greeting }]);
setRelationship(data.relationship);
} catch (err) {
setMessages([{
role: 'assistant',
content: `${character.name} waves at you!`
}]);
}
setIsLoading(false);
}

async function sendMessage(e) {
e.preventDefault();
if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          characterId: character.id,
          message: userMessage,
          gameContext: {
            location: 'Pallet Town', // from game state
            badges: 3
          }
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setRelationship(data.relationship);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '... (connection error)'
      }]);
    }
    setIsLoading(false);

}

function scrollToBottom() {
messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}

return (
<div className="chat-panel">
{/_ Header _/}
<div className="chat-header">
<div className="character-info">
<img src={character.avatar} alt={character.name} />
<div>
<h3>{character.name}</h3>
<span className="character-type">{character.type}</span>
</div>
</div>

        {/* Relationship indicator */}
        <div className="relationship-bar">
          <div className="friendship" style={{ width: `${relationship.friendship}%` }}>
            💚 {relationship.friendship}
          </div>
          {relationship.rivalry > 0 && (
            <div className="rivalry" style={{ width: `${relationship.rivalry}%` }}>
              ⚔️ {relationship.rivalry}
            </div>
          )}
        </div>

        <button onClick={onClose} className="close-btn">×</button>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <img src={character.avatar} className="avatar-small" />
            )}
            <p>{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant loading">
            <span className="typing-indicator">...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Talk to ${character.name}...`}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>

);
}

🚀 Quick Start Implementation

For a simple version to start with Felix:
Option A: Browser-Only (Simplest)

// Store everything in localStorage
const simpleChat = {
async chat(characterId, message) {
const history = JSON.parse(localStorage.getItem(`chat_${characterId}`) || '[]');
const relationship = JSON.parse(localStorage.getItem(`rel_${characterId}`) || '{"friendship":50}');

    // Call LLM API directly from browser
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `You are ${characterId}. ${getCharacterPrompt(characterId)}` },
          ...history.slice(-10),
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Save history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: reply });
    localStorage.setItem(`chat_${characterId}`, JSON.stringify(history.slice(-20)));

    return reply;

}
};

Option B: Full Backend (Recommended)

Use the code above with a simple Express server + SQLite.
💡 Pro Tips for Felix's Experience

1. Event-Triggered Conversations

// When Felix beats a gym, rivals react!
async function onGymBadgeEarned(playerId, badgeName) {
const rivals = await getRivals(playerId);
for (const rival of rivals) {
await sendProactiveMessage(rival, {
trigger: 'badge_earned',
context: { badge: badgeName }
});
}
}

2. Relationship Milestones

const MILESTONES = {
friendship_75: 'You unlocked a special item from your friend!',
rivalry_90: 'Your rival challenged you to a battle!',
first_trade: 'Achievement: Made your first trade!'
};

3. Character-Specific Behaviors

// Rivals send challenges
if (character.type === 'rival' && daysSinceLastBattle > 7) {
await suggestBattle(character);
}

// Friends give hints
if (character.type === 'friend' && player.stuckOnGym) {
await giveHint(character, currentGym);
}

📊 Memory Storage Options

| Approach | Complexity | Best For | |----------|------------|----------| | localStorage | ⭐ | Prototyping, single device | | SQLite | ⭐⭐ | Single server, small scale | | PostgreSQL | ⭐⭐⭐ | Production, multiple players | | Vector DB (Pinecone/Chroma) | ⭐⭐⭐⭐ | Semantic memory, "remember that time..." |
🎯 Implementation Roadmap

Week 1: Core Chat
├── Basic LLM integration
├── Simple character prompts
└── Chat UI component

Week 2: Memory System
├── Database setup (SQLite)
├── Relationship tracking
└── Memory storage

Week 3: Rich Interactions
├── Game event triggers
├── Proactive messages
└── Relationship effects on dialogue

Week 4: Polish
├── Multiple characters
├── Special events
└── Testing with Felix!

Would you like me to dive deeper into any of these areas? I can also help with:

    Setting up the actual project structure
    Creating more character personalities
    Adding voice/speech features
    Building the game event integration hooks
