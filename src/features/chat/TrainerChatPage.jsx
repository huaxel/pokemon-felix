import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TRAINERS } from '../../lib/trainers';
import { randomService } from '../../lib/RandomService';
import './TrainerChatPage.css';

export function TrainerChatPage() {
    const { trainerId } = useParams();
    const navigate = useNavigate();

    const [trainer, setTrainer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const selectedTrainer = TRAINERS.find(t => t.id === trainerId);
        if (!selectedTrainer) {
            navigate('/trainer-selection');
            return;
        }
        setTrainer(selectedTrainer);

        // Initial greeting
        setMessages([
            { id: 1, sender: 'trainer', text: selectedTrainer.greeting, timestamp: new Date() }
        ]);
    }, [trainerId, navigate]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (text, category = null) => {
        if (!trainer || isTyping) return;

        // Add user message
        const newUserMsg = { id: Date.now(), sender: 'user', text, timestamp: new Date() };
        setMessages(prev => [...prev, newUserMsg]);
        setIsTyping(true);

        // Simulate thinking delay
        setTimeout(() => {
            let responseOptions = [];

            if (category && trainer.dialogue[category]) {
                responseOptions = trainer.dialogue[category];
            } else {
                // Flatten all dialogues if no category or random fallback
                responseOptions = Object.values(trainer.dialogue).flat();
            }

            const randomResponse = randomService.pick(responseOptions);

            const newTrainerMsg = { id: Date.now() + 1, sender: 'trainer', text: randomResponse, timestamp: new Date() };
            setMessages(prev => [...prev, newTrainerMsg]);
            setIsTyping(false);
        }, 1000 + Math.random() * 500);
    };

    const handleBattleClick = () => {
        navigate(`/trainer-battle/${trainer.id}`);
    };

    if (!trainer) return <div className="loading-screen">Laden...</div>;

    const SUGGESTED_REPLIES = [
        { text: "Vertel eens over je Pokémon", category: "pokemon" },
        { text: "Heb je wat tips voor mij?", category: "tips" },
        { text: "Zijn er nog nieuwtjes?", category: "gossip" },
        { text: "Klaar voor een gevecht?", category: "battle", action: handleBattleClick }
    ];

    return (
        <div className="trainer-chat-page">
            <div className="chat-header game-panel-dark">
                <button className="back-button btn-kenney neutral" onClick={() => navigate('/trainer-selection')}>
                    ⬅️
                </button>
                <div className="trainer-profile">
                    <img src={trainer.avatar} alt={trainer.name} className="header-avatar" />
                    <div className="header-info">
                        <h2>{trainer.name}</h2>
                        <span className={`status-badge ${trainer.type}`}>
                            {trainer.type === 'friend' ? 'Vriend' : 'Rivaal'}
                        </span>
                    </div>
                </div>
                <button className="battle-button btn-kenney primary" onClick={handleBattleClick}>
                    ⚔️
                </button>
            </div>

            <div className="chat-messages game-panel" data-scrollable="true">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                        {msg.sender === 'trainer' && (
                            <img src={trainer.avatar} alt="Trainer" className="message-avatar" />
                        )}
                        <div className={`message-bubble ${msg.sender}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="message-wrapper trainer">
                        <img src={trainer.avatar} alt="Trainer" className="message-avatar" />
                        <div className="message-bubble typing-indicator">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area game-panel-dark">
                <div className="suggested-replies">
                    {SUGGESTED_REPLIES.map((reply, i) => (
                        <button
                            key={i}
                            className="reply-chip"
                            onClick={() => reply.action ? reply.action() : handleSendMessage(reply.text, reply.category)}
                            disabled={isTyping}
                        >
                            {reply.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

