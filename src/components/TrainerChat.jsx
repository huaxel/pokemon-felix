import React, { useState, useEffect, useRef } from 'react';
import { fetchChatResponse } from '../lib/services/llmService';
import { buildSystemPrompt } from '../lib/services/promptBuilder';
import { RelationshipBar } from './RelationshipBar';
import './TrainerChat.css';

export function TrainerChat({ trainer, relationship, onUpdateRelationship, onAction, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const systemPrompt = buildSystemPrompt({ trainer, relationship });
            const response = await fetchChatResponse(systemPrompt, userMessage, messages);

            setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);

            // Update relationship via callback (to be handled by host page/context)
            if (response.relationship_delta && onUpdateRelationship) {
                onUpdateRelationship(response.relationship_delta);
            }

            // Trigger game action (e.g., START_BATTLE)
            if (response.action && onAction) {
                onAction(response.action);
            }
        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-overlay">
            <div className="chat-window shadow-lg">
                <div className="chat-header">
                    <div className="chat-trainer-info">
                        <img src={trainer.avatar_url} alt={trainer.name} className="chat-avatar" />
                        <div className="chat-trainer-meta">
                            <div className="chat-trainer-name">{trainer.name}</div>
                            <RelationshipBar relationship={relationship} />
                        </div>
                    </div>
                    <button className="chat-close-btn" onClick={onClose}>X</button>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 && (
                        <div className="message assistant">
                            {trainer.greeting || `Hallo Felix! Wat wil je bespreken?`}
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
                    {isTyping && <div className="typing-indicator">{trainer.name} is aan het typen...</div>}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <input
                        type="text"
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Praat met ${trainer.name}...`}
                        disabled={isTyping}
                    />
                    <button
                        className="chat-send-btn"
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}
                    >
                        VERZEND
                    </button>
                </div>
            </div>
        </div>
    );
}
