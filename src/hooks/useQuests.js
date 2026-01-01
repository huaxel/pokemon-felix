import { useState, useEffect } from 'react';
import * as questsService from '../lib/services/questsService';

const QUESTS_STORAGE_KEY = 'felix_quests_state';

const INITIAL_QUESTS = [
    {
        id: 'first_steps',
        title: 'Primeros Pasos',
        description: 'Atrapa 3 Pokémon salvajes.',
        type: 'catch',
        target: 3,
        reward: { coins: 300, item: 'greatball' },
        icon: '🎯'
    },
    {
        id: 'school_expert',
        title: 'Estudiante Estrella',
        description: 'Completa 2 cuestionarios en la escuela.',
        type: 'school',
        target: 2,
        reward: { coins: 500, item: 'rare-candy' },
        icon: '🎓'
    },
    {
        id: 'gym_challenger',
        title: 'Desafío del Gimnasio',
        description: 'Derrota a 1 Líder de Gimnasio.',
        type: 'battle_gym',
        target: 1,
        reward: { coins: 1000, item: 'ultraball' },
        icon: '💪'
    }
];

export function useQuests() {
    const [quests, setQuests] = useState(null);

    useEffect(() => {
        let mounted = true;
        questsService.getQuests().then(saved => {
            if (!mounted) return;
            if (saved && saved.length) {
                const merged = INITIAL_QUESTS.map(q => {
                    const savedQ = saved.find(sq => sq.id === q.id);
                    return savedQ ? { ...q, progress: savedQ.progress, completed: savedQ.completed } : { ...q, progress: 0, completed: false };
                });
                setQuests(merged);
            } else {
                setQuests(INITIAL_QUESTS.map(q => ({ ...q, progress: 0, completed: false })));
            }
        });
        return () => { mounted = false };
    }, []);

    useEffect(() => {
        if (quests !== null) questsService.saveQuests(quests);
    }, [quests]);

    const updateQuestProgress = (type, amount = 1) => {
        setQuests(prev => prev.map(q => {
            if (q.type === type && !q.completed) {
                const newProgress = Math.min(q.target, q.progress + amount);
                return { ...q, progress: newProgress };
            }
            return q;
        }));
    };

    const completeQuest = (id) => {
        let reward = null;
        setQuests(prev => prev.map(q => {
            if (q.id === id && q.progress >= q.target && !q.completed) {
                reward = q.reward;
                return { ...q, completed: true };
            }
            return q;
        }));
        return reward;
    };

    return {
        quests,
        updateQuestProgress,
        completeQuest
    };
}
