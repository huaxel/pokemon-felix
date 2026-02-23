import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTrainer,
  getRelationship,
  updateRelationship,
  getMessages,
  saveMessage,
} from '../../lib/api';
import { fetchChatResponse } from '../../lib/services/llmService';
import { buildSystemPrompt } from '../../lib/services/promptBuilder';
import { RelationshipBar } from '../../components/RelationshipBar';
import './TrainerChatPage.css';

export function TrainerChatPage() {
  const { trainerId } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [relationship, setRelationship] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const playerId = 'felix'; // Hardcoded for now

  useEffect(() => {
    const loadData = async () => {
      const [t, rel, msgs] = await Promise.all([
        getTrainer(trainerId),
        getRelationship(playerId, trainerId),
        getMessages(playerId, trainerId),
      ]);

      if (!t) {
        navigate('/trainer-selection');
        return;
      }

      setTrainer(t);
      setRelationship(rel);
      setMessages(msgs);
    };

    loadData();
  }, [trainerId, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async text => {
    if (!text.trim() || !trainer || isTyping) return;

    const userMessage = text.trim();
    setInput('');

    // Save user message
    const newUserMsg = await saveMessage(playerId, trainerId, 'user', userMessage);
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const systemPrompt = buildSystemPrompt({ trainer, relationship });
      const completion = await fetchChatResponse(
        systemPrompt,
        userMessage,
        messages.map(m => ({ role: m.role, content: m.content }))
      );

      // Save assistant message
      const assistantMsg = await saveMessage(playerId, trainerId, 'assistant', completion.message);
      setMessages(prev => [...prev, assistantMsg]);

      // Update relationship
      if (completion.relationship_delta) {
        const updatedRel = await updateRelationship(
          playerId,
          trainerId,
          completion.relationship_delta
        );
        setRelationship(updatedRel);
      }

      // Handle Battle Action
      if (completion.action === 'START_BATTLE') {
        setTimeout(() => {
          navigate(`/trainer-battle/${trainer.id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('LLM Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!trainer) return <div className="loading-screen">Laden...</div>;

  const SUGGESTED_REPLIES = [
    {
      text: 'Laten we vechten!',
      action: () => handleSendMessage('Ik daag je uit voor een gevecht!'),
    },
    { text: 'Hoe gaat het?', action: () => handleSendMessage('Hoe gaat het vandaag?') },
    {
      text: 'Vertel over je team',
      action: () => handleSendMessage('Vertel eens over je Pokémon team.'),
    },
  ];

  return (
    <div className="trainer-chat-page">
      <div className="chat-header game-panel-dark">
        <button
          className="back-button btn-kenney neutral"
          onClick={() => navigate('/trainer-selection')}
        >
          ⬅️
        </button>
        <div className="trainer-profile">
          <img src={trainer.avatar_url} alt={trainer.name} className="header-avatar" />
          <div className="header-info">
            <h2>{trainer.name}</h2>
            {relationship && <RelationshipBar relationship={relationship} />}
          </div>
        </div>
        <button
          className="battle-button btn-kenney primary"
          onClick={() => navigate(`/trainer-battle/${trainer.id}`)}
        >
          ⚔️
        </button>
      </div>

      <div className="chat-messages game-panel">
        {messages.length === 0 && (
          <div className="message-wrapper trainer">
            <img src={trainer.avatar_url} alt="Trainer" className="message-avatar" />
            <div className="message-bubble trainer">{trainer.greeting || 'Hallo Felix!'}</div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-wrapper ${msg.role === 'assistant' ? 'trainer' : 'user'}`}
          >
            {msg.role === 'assistant' && (
              <img src={trainer.avatar_url} alt="Trainer" className="message-avatar" />
            )}
            <div className={`message-bubble ${msg.role === 'assistant' ? 'trainer' : 'user'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper trainer">
            <img src={trainer.avatar_url} alt="Trainer" className="message-avatar" />
            <div className="message-bubble typing-indicator">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area game-panel-dark">
        <div className="suggested-replies" style={{ marginBottom: '1rem' }}>
          {SUGGESTED_REPLIES.map((reply, i) => (
            <button key={i} className="reply-chip" onClick={reply.action} disabled={isTyping}>
              {reply.text}
            </button>
          ))}
        </div>
        <div className="actual-input-wrapper" style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="chat-input-field"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage(input)}
            placeholder="Typ een bericht..."
            disabled={isTyping}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '3px solid #8b5a3c',
              background: 'white',
              fontFamily: 'inherit',
            }}
          />
          <button
            className="btn-kenney primary"
            onClick={() => handleSendMessage(input)}
            disabled={isTyping || !input.trim()}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
