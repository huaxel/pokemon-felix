import React, { useState, useEffect, useRef } from 'react';
import { sendLLMMessage, getLLMChatHistory } from '../../lib/api';
import './TrainerChat.css';

export default function TrainerChat({ trainer, onStartBattle }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        async function loadHistory() {
            if (trainer?.id) {
                const history = await getLLMChatHistory(trainer.id);
                setMessages(history);
            }
        }
        loadHistory();
    }, [trainer?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { sender: 'player', content: userMsg }]);
        setIsLoading(true);

        try {
            const { response, action } = await sendLLMMessage(trainer.id, userMsg);
            setMessages(prev => [...prev, { sender: 'trainer', content: response }]);

            if (action && action.type === 'start_battle') {
                setTimeout(() => {
                    onStartBattle(trainer);
                }, 2000);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { sender: 'system', content: 'Fout bij verbinden met trainer...' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!trainer) return null;

    return (
        <div className="trainer-chat-container kenney-panel">
            <div className="chat-header">
                <img src={trainer.avatar_url} alt={trainer.name} className="trainer-avatar-small" />
                <h3>Chat met {trainer.name}</h3>
            </div>

            <div className="chat-messages" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`message-bubble ${msg.sender}`}>
                        <span className="sender-name">{msg.sender === 'player' ? 'Felix' : trainer.name}:</span>
                        <p>{msg.content}</p>
                    </div>
                ))}
                {isLoading && <div className="message-bubble trainer typing">...</div>}
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Typ een bericht..."
                    disabled={isLoading}
                    className="game-input"
                />
                <button type="submit" className="game-button game-button-primary" disabled={isLoading}>
                    Stuur
                </button>
            </form>
        </div>
    );
}
