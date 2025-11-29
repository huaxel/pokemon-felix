import { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

export function SearchBar({ allPokemon, onSearch }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); // Empty dependency array - setup once

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 1) {
            const filtered = allPokemon.filter(name =>
                name.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 10); // Limit to 10 suggestions
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    // Debounced version for actual search
    const debouncedSearch = React.useCallback((value) => {
        const timeoutId = setTimeout(() => {
            if (value) {
                onSearch(value);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
    }, [onSearch]);

    const handleSelect = (name) => {
        setQuery(name);
        setIsOpen(false);
        onSearch(name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query) {
            onSearch(query);
            setIsOpen(false);
        }
    };

    return (
        <div className="search-wrapper" ref={wrapperRef}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar Pokémon..."
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                />
                <button type="submit" className="search-btn">🔍</button>
            </form>

            {isOpen && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map(name => (
                        <li key={name} onClick={() => handleSelect(name)}>
                            {name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
