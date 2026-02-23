google/gemini-3-pro-preview

This is a fantastic project idea. Adding "LLM Multiplayer" turns a static game into a living world. For Felix, the magic will come from the NPCs feeling like they have history with him (remembering he won the Gym Badge) and agency (deciding to challenge him to a battle).

Here is a roadmap to implementing this, keeping it manageable but high-quality.
The Architecture: How it works

You need three logical layers to make this work:

    The Persona Layer: Who the NPC is.
    The Context Layer: What the NPC knows (Game State + Memory).
    The Action Layer: How the NPC affects the game (starting battles, trading).

1. The Persona Layer (System Prompts)

Instead of hard-coding dialogue, you will create "Character Sheets" for every friend and rival.

Data Structure Example:

{
"id": "rival_gary",
"name": "Gary",
"role": "Rival",
"personality": "Arrogant, competitive, secretly respects the player but won't admit it.",
"quirks": "Always calls the player 'Gramps' or 'Smell ya later'.",
"team": ["Squirtle", "Pidgey"]
}

When you send a request to the LLM (like OpenAI's GPT-4o-mini or Anthropic's Haiku—both are fast and cheap), you inject this into the System Prompt. 2. The Context Layer (Memory & Game State)

This is the hardest part. You cannot feed the entire chat history forever because it gets too expensive and confuses the model. You need a Hybrid Memory System.
A. Short-Term Memory (The Chat Log)

Keep the last 10–15 messages of the current conversation in your database. Pass these to the LLM so the conversation flows naturally.
B. Long-Term Memory (Summarization)

When a conversation ends, ask the LLM to summarize it into a "Memory Node" and save it to the NPC's database record.

    Prompt to LLM for summary: "Summarize the following interaction between Felix and Gary. Highlight key events (Felix won the battle) and emotional shifts (Gary is annoyed)."

Next time they meet, you inject that summary into the prompt:

    System Note: Last time you met, Felix defeated your Squirtle. You are still salty about it.

C. Game State Awareness

The NPC needs to know what is happening now. Before you send the chat to the LLM, append a hidden "Context Object."

    System Note: Felix currently has 3 Gym Badges. His active Pokemon is Charizard (Health: Low).

3. The Action Layer (Function Calling)

This is what makes it a "game" and not just a chatbot. You want the NPC to be able to do things.

Use Function Calling (Tool Use). Define functions the LLM can trigger.

Defined Tools:

    startBattle()
    tradePokemon(offered, requested)
    giveItem(itemName)
    leaveConversation()

If Felix types: "I bet my Charizard can crush you right now!" The LLM (Gary) might reply: "You're on! Let's see what you got!" and simultaneously call the startBattle() function, which your frontend detects to trigger the battle scene.
Implementation Steps

Here is a technical approach using Node.js/Next.js and OpenAI.
Step 1: define the Prompt Generator

You need a function that assembles the prompt dynamically.

function generateSystemPrompt(npc, playerState, memories) {
return `
You are ${npc.name}.
Personality: ${npc.personality}

    CURRENT SITUATION:
    - Player Name: Felix
    - Player Badges: ${playerState.badges}
    - Your Current Team: ${npc.team.join(", ")}

    PAST MEMORIES:
    ${memories.join("\n")}

    INSTRUCTIONS:
    - Keep responses short (under 2 sentences).
    - Be immersive. Do not act like an AI.
    - If the player challenges you, call the 'startBattle' function.

`;
}

Step 2: The API Route (Backend)

When Felix sends a message, your backend handler looks like this:

// POST /api/chat
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req) {
const { message, npcId, playerState, history } = await req.json();

// 1. Fetch NPC definitions and Long-Term Memories from DB
const npc = getNPC(npcId);
const memories = getMemories(npcId);

// 2. define Tools
const tools = [
{
type: "function",
function: {
name: "start_battle",
description: "Triggers a pokemon battle with the player",
parameters: { type: "object", properties: {} },
},
},
];

// 3. Call LLM
const completion = await openai.chat.completions.create({
model: "gpt-4o-mini", // Fast and cheap
messages: [
{ role: "system", content: generateSystemPrompt(npc, playerState, memories) },
...history, // Previous few chat messages
{ role: "user", content: message }
],
tools: tools,
tool_choice: "auto",
});

const responseMessage = completion.choices[0].message;

// 4. Check if LLM wants to start a battle (Tool Call)
if (responseMessage.tool_calls) {
return Response.json({
text: "You're on!",
action: "START_BATTLE"
});
}

// 5. Normal text response
return Response.json({ text: responseMessage.content, action: null });
}

Step 3: Persistence (Database)

You can use something simple like Supabase or Firebase. You need tables for:

    Players (Felix's save state).
    NPCs (Static data).
    Relationships (Stores the affinity score—e.g., Friendship: 80/100).
    Memories (Stores the summarized interactions).

Making it fun for Felix

To really make this shine:

    Dynamic Difficulty: If Felix loses a battle to a Rival, update the database so the Rival becomes "Arrogant." If Felix wins, the Rival becomes "Determined." Feed this state into the next prompt.
    Secret Keywords: Tell Felix that if he mentions "Team Rocket," the NPCs might react with fear or bravery based on their personality.
    Local LLM option: If you are worried about API costs or privacy, you can run Ollama locally on the computer running the game server. It’s free, but requires a decent GPU. (For a web app, OpenAI/Anthropic is much easier).

Safety Note

Since this is for a child, use OpenAI's moderation endpoint or add a logic layer that filters the output to ensure the "Rivals" don't get too mean! gpt-4o-mini is generally very safe, but you can add instructions like: "Even if you represent a villain, keep language PG and appropriate for a pokemon game."
