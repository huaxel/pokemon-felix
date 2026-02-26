import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { PokemonModal } from '../PokemonModal';

const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  types: [{ type: { name: 'grass' } }],
  stats: [{ stat: { name: 'hp' }, base_stat: 45 }],
  sprites: {
    front_default: 'front.png',
    other: { 'official-artwork': { front_default: 'artwork.png' } },
  },
  speciesData: {
    names: [{ language: { name: 'en' }, name: 'Bulbasaur' }],
    flavor_text_entries: [
      { language: { name: 'en' }, flavor_text: 'A strange seed was planted on its back at birth.' },
    ],
  },
};

describe('PokemonModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders modal with accessibility attributes', () => {
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={() => {}}
        isOwned={false}
        onToggleOwned={() => {}}
      />
    );

    const modalContent = screen.getByRole('dialog', { hidden: true });
    expect(modalContent).toBeTruthy();
    expect(modalContent.getAttribute('aria-modal')).toBe('true');
  });

  it('close button has accessible label', () => {
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={() => {}}
        isOwned={false}
        onToggleOwned={() => {}}
      />
    );

    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeTruthy();
  });

  it('language buttons have accessible labels', () => {
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={() => {}}
        isOwned={false}
        onToggleOwned={() => {}}
      />
    );

    expect(screen.getByLabelText('Switch to English')).toBeTruthy();
    expect(screen.getByLabelText('Switch to French')).toBeTruthy();
    expect(screen.getByLabelText('Switch to Spanish')).toBeTruthy();
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <PokemonModal
        pokemon={mockPokemon}
        onClose={handleClose}
        isOwned={false}
        onToggleOwned={() => {}}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });
});
