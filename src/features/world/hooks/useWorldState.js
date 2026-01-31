import { useState, useEffect } from 'react';
import { TIME_CONFIG, TREASURE_CONFIG, POKEBALL_CONFIG } from '../worldConstants';

export function useWorldState() {
    // Seizoenen Systeem
    const [seasonIndex, setSeasonIndex] = useState(1); // Begin in de Zomer
    const [isNight, setIsNight] = useState(false);
    const [autoTime, setAutoTime] = useState(true);
    const [weather, setWeather] = useState('sunny');
    const [treasures, setTreasures] = useState([{ x: 3, y: 7 }]);
    const [pokeballs, setPokeballs] = useState([{ x: 2, y: 4 }]); // Initial pokeball for testing
    const [questState, setQuestState] = useState('none');
    const [showInterior, setShowInterior] = useState(false);
    const [showPokeballModal, setShowPokeballModal] = useState(false);
    const [showQuestLog, setShowQuestLog] = useState(false);

    const nextSeason = () => setSeasonIndex((prev) => (prev + 1) % 4);
    const prevSeason = () => setSeasonIndex((prev) => (prev === 0 ? 3 : prev - 1));

    // DAG/NACHT
    useEffect(() => {
        if (autoTime) {
            const updateTime = () => {
                const hour = new Date().getHours();
                setIsNight(hour < TIME_CONFIG.NIGHT_END_HOUR || hour >= TIME_CONFIG.NIGHT_START_HOUR);
            };
            updateTime();
            const interval = setInterval(updateTime, TIME_CONFIG.TIME_CHECK_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [autoTime]);

    // WEER
    useEffect(() => {
        if (seasonIndex === 3) setWeather('snowy');
        else if (seasonIndex === 0 || seasonIndex === 2) {
            setWeather(Math.random() < 0.4 ? 'rainy' : 'sunny');
        } else setWeather('sunny');
    }, [seasonIndex]);

    // SCHATTEN SPAWN
    useEffect(() => {
        const interval = setInterval(() => {
            if (treasures.length < TREASURE_CONFIG.MAX_TREASURES && Math.random() < TREASURE_CONFIG.SPAWN_CHANCE) {
                const newX = Math.floor(Math.random() * 10);
                const newY = Math.floor(Math.random() * 10);
                setTreasures(prev => [...prev, { x: newX, y: newY }]);
            }
        }, TREASURE_CONFIG.SPAWN_INTERVAL);
        return () => clearInterval(interval);
    }, [treasures]);

    // POKEBALL SPAWN
    useEffect(() => {
        const interval = setInterval(() => {
            if (pokeballs.length < POKEBALL_CONFIG.MAX_POKEBALLS && Math.random() < POKEBALL_CONFIG.SPAWN_CHANCE) {
                const newX = Math.floor(Math.random() * 10);
                const newY = Math.floor(Math.random() * 10);
                setPokeballs(prev => [...prev, { x: newX, y: newY }]);
            }
        }, POKEBALL_CONFIG.SPAWN_INTERVAL);
        return () => clearInterval(interval);
    }, [pokeballs]);

    return {
        seasonIndex,
        setSeasonIndex,
        isNight,
        setIsNight,
        autoTime,
        setAutoTime,
        weather,
        setWeather,
        treasures,
        setTreasures,
        pokeballs,
        setPokeballs,
        questState,
        setQuestState,
        showInterior,
        setShowInterior,
        showPokeballModal,
        setShowPokeballModal,
        showQuestLog,
        setShowQuestLog,
        nextSeason,
        prevSeason
    };
}
