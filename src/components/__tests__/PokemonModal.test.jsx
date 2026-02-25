import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { PokemonModal } from '../PokemonModal';

describe('PokemonModal', () => {
  const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    sprites: {
      front_default: 'front.png',
      other: { 'official-artwork': { front_default: 'art.png' } },
    },
    stats: [
      { base_stat: 45, stat: { name: 'hp' } },
      { base_stat: 49, stat: { name: 'attack' } },
    ],
    speciesData: {
      names: [{ language: { name: 'en' }, name: 'Bulbasaur' }],
      flavor_text_entries: [
        { language: { name: 'en' }, flavor_text: 'A strange seed was planted on its back at birth.' },
      ],
    },
  };

  const mockOnClose = vi.fn();
  const mockOnToggleOwned = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={mockOnClose}
        isOwned={false}
        onToggleOwned={mockOnToggleOwned}
      />
    );
    expect(screen.getByText('Bulbasaur')).toBeTruthy();
  });

  it('has accessible dialog role', () => {
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={mockOnClose}
        isOwned={false}
        onToggleOwned={mockOnToggleOwned}
      />
    );
    // This is expected to fail initially as role="dialog" is missing
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('has accessible close button', () => {
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={mockOnClose}
        isOwned={false}
        onToggleOwned={mockOnToggleOwned}
      />
    );
    // This is expected to fail initially as aria-label="Close" is missing
    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeTruthy();

    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('has accessible language buttons', () => {
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={mockOnClose}
        isOwned={false}
        onToggleOwned={mockOnToggleOwned}
      />
    );

    // Using getByTitle initially because that's what we have, but checking for aria attributes
    const enButton = screen.getByTitle('English');

    // These are expected to fail initially
    expect(enButton.getAttribute('aria-label')).toBeTruthy();
    expect(enButton.getAttribute('aria-pressed')).toBe('true'); // Default is 'en'
  });

  it('closes on Escape key', () => {
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={mockOnClose}
        isOwned={false}
        onToggleOwned={mockOnToggleOwned}
      />
    );

    // Expected to fail initially
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
