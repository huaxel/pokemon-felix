import { useState, useEffect, useRef } from 'react';
import { usePokemonContext } from '../hooks/usePokemonContext';
import { Terminal, X } from 'lucide-react';
import './GameConsole.css';

export function GameConsole({ onClose }) {
  const { addCoins, healAll, ownedIds, toggleOwned, pokemonList } = usePokemonContext();
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    '🐍 Python Terminal v3.11.0',
    '>>> Sistema listo. Escribe un comando...',
    '>>> Comandos disponibles: heal_all(), add_coins(n), print(pokedex), catch_pokemon(id)',
    '',
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const logsEndRef = useRef(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addLog = (message, isError = false) => {
    setLogs(prev => [...prev, isError ? `❌ ${message}` : message]);
  };

  const executeCommand = () => {
    if (!input.trim()) return;

    const cmd = input.trim();
    addLog(`>>> ${cmd}`);

    // Add to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Parse and execute command
    try {
      if (cmd === 'heal_all()') {
        healAll();
        addLog('✨ ¡Todos los Pokémon han sido curados!');
      } else if (cmd.match(/^add_coins\(\d+\)$/)) {
        const amount = parseInt(cmd.match(/\d+/)[0]);
        addCoins(amount);
        addLog(`💰 ¡Has hackeado el banco! +${amount} monedas.`);
      } else if (cmd === 'print(pokedex)') {
        addLog(`📚 Tienes ${ownedIds.length} Pokémon capturados.`);
        addLog(`📊 Total Pokémon disponibles: ${pokemonList.length}`);
      } else if (cmd.match(/^catch_pokemon\(\d+\)$/)) {
        const id = parseInt(cmd.match(/\d+/)[0]);
        const pokemon = pokemonList.find(p => p.id === id);
        if (pokemon) {
          if (!ownedIds.includes(id)) {
            toggleOwned(id);
            addLog(`🎉 ¡Has capturado a ${pokemon.name}!`);
          } else {
            addLog(`⚠️ Ya tienes a ${pokemon.name} en tu colección.`);
          }
        } else {
          addLog(`❌ Pokémon con ID ${id} no encontrado.`, true);
        }
      } else if (cmd === 'help()') {
        addLog('📖 Comandos disponibles:');
        addLog('   heal_all() - Cura todos los Pokémon');
        addLog('   add_coins(n) - Añade n monedas');
        addLog('   print(pokedex) - Muestra estadísticas');
        addLog('   catch_pokemon(id) - Captura un Pokémon');
        addLog('   clear() - Limpia la consola');
      } else if (cmd === 'clear()') {
        setLogs(['🐍 Python Terminal v3.11.0', '']);
      } else {
        addLog(`SyntaxError: El comando '${cmd}' no se reconoce.`, true);
        addLog(`💡 Tip: Escribe help() para ver comandos disponibles.`);
      }
    } catch (error) {
      addLog(`RuntimeError: ${error.message}`, true);
    }

    setInput('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="console-overlay" onClick={onClose}>
      <div className="console-window" onClick={e => e.stopPropagation()}>
        <div className="console-header">
          <div className="console-title">
            <Terminal size={20} />
            <span>Python Terminal</span>
          </div>
          <button className="console-close" onClick={onClose} aria-label="Cerrar consola">
            <X size={20} />
          </button>
        </div>

        <div className="console-output">
          {logs.map((log, i) => (
            <div key={i} className="console-line">
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        <div className="console-input-line">
          <span className="console-prompt">&gt;&gt;&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="console-input"
            placeholder="Escribe tu código aquí..."
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="console-hint">
          💡 Tip: Usa ↑/↓ para navegar el historial | ESC para cerrar
        </div>
      </div>
    </div>
  );
}
