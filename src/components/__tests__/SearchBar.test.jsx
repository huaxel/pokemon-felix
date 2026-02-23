import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const mockAllPokemon = ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle', 'Charizard'];
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(<SearchBar allPokemon={mockAllPokemon} onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Zoek Pokémon...');
    expect(input).toBeTruthy();
  });

  it('shows suggestions when typing', () => {
    render(<SearchBar allPokemon={mockAllPokemon} onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Zoek Pokémon...');

    fireEvent.change(input, { target: { value: 'Pi' } });

    // Should show suggestions
    // Note: These assertions expect role="listbox" and role="option" which are not yet implemented
    const list = screen.getByRole('listbox');
    expect(list).toBeTruthy();

    const items = screen.getAllByRole('option');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe('Pikachu');
  });

  it('navigates suggestions with keyboard', () => {
    render(<SearchBar allPokemon={mockAllPokemon} onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Zoek Pokémon...');

    fireEvent.change(input, { target: { value: 'Bul' } }); // Matches Bulbasaur

    // Press ArrowDown to select first item
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const items = screen.getAllByRole('option');
    expect(items[0].getAttribute('aria-selected')).toBe('true'); // Should be Bulbasaur

    // Press ArrowDown again (loops to start if only 1, or next if multiple)
    // 'Bul' matches Bulbasaur. Only 1 match.
    // Let's use 'ur' -> Bulbasaur, Charmander, Squirtle (all have 'ur' or similar? No)
    // 'sa' -> Bulbasaur, Squirtle?
    // Let's use 'a' -> All 4.
  });

  it('navigates multiple suggestions with keyboard', () => {
    render(<SearchBar allPokemon={mockAllPokemon} onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Zoek Pokémon...');

    // 'Char' matches Charmander, Charizard
    fireEvent.change(input, { target: { value: 'Char' } });

    // Press ArrowDown to select Charmander (index 0)
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const items = screen.getAllByRole('option');
    expect(items[0].getAttribute('aria-selected')).toBe('true');

    // Press ArrowDown to select Charizard (index 1)
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(items[1].getAttribute('aria-selected')).toBe('true');

    // Press ArrowUp to go back to Charmander
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(items[0].getAttribute('aria-selected')).toBe('true');
  });

  it('selects suggestion with Enter key', () => {
    render(<SearchBar allPokemon={mockAllPokemon} onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Zoek Pokémon...');

    fireEvent.change(input, { target: { value: 'Pik' } });

    // Select first item
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Press Enter (simulating form submit)
    fireEvent.submit(input.closest('form'));

    expect(mockOnSearch).toHaveBeenCalledWith('Pikachu');
  });

  it('closes suggestions on Escape', () => {
    render(<SearchBar allPokemon={mockAllPokemon} onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Zoek Pokémon...');

    fireEvent.change(input, { target: { value: 'Pik' } });
    expect(screen.queryByRole('listbox')).toBeTruthy();

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});
