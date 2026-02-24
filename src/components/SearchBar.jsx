import React, { useState, useEffect, useRef, useDeferredValue, useMemo } from 'react';
import './SearchBar.css';

export function SearchBar({ allPokemon, onSearch }) {
  const [query, setQuery] = useState('');
  // Use deferred value to deprioritize the filtering operation
  const deferredQuery = useDeferredValue(query);

  // Memoize the expensive filtering based on the deferred query
  const suggestions = useMemo(() => {
    if (!deferredQuery || deferredQuery.length <= 1) {
      return [];
    }
    return allPokemon
      .filter(name => name.toLowerCase().includes(deferredQuery.toLowerCase()))
      .slice(0, 10); // Limit to 10 suggestions
  }, [deferredQuery, allPokemon]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array - setup once

  const handleInputChange = e => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    if (value.length > 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = name => {
    setQuery(name);
    setIsOpen(false);
    setActiveIndex(-1);
    onSearch(name);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // If an item is selected via keyboard, select it
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
    } else if (query) {
      onSearch(query);
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = e => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Zoek Pokémon..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="suggestions-list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        />
        <button type="submit" className="btn-kenney primary search-btn" aria-label="Search">
          🔍
        </button>
      </form>

      {isOpen && suggestions.length > 0 && (
        <ul className="suggestions-list" id="suggestions-list" role="listbox">
          {suggestions.map((name, index) => (
            <li
              key={name}
              id={`suggestion-${index}`}
              onClick={() => handleSelect(name)}
              className={index === activeIndex ? 'selected' : ''}
              role="option"
              aria-selected={index === activeIndex}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
