import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

describe('SearchBar Performance', () => {
  // Generate 50,000 items
  const largeDataset = Array.from({ length: 50000 }, (_, i) => `Pokemon ${i}`);

  it('measures input latency with large dataset', async () => {
    const onSearch = vi.fn();
    render(<SearchBar allPokemon={largeDataset} onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Zoek Pokémon...');

    const start = performance.now();

    // Simulate typing "Poke" rapidly
    await act(async () => {
      fireEvent.change(input, { target: { value: 'P' } });
      fireEvent.change(input, { target: { value: 'Po' } });
      fireEvent.change(input, { target: { value: 'Pok' } });
      fireEvent.change(input, { target: { value: 'Poke' } });
    });

    const end = performance.now();

    console.log(`[Performance] Time for 4 keystrokes with 50k items: ${(end - start).toFixed(2)}ms`);

    expect(input.value).toBe('Poke');

    // Check that suggestions are eventually rendered
    const list = await screen.findByRole('listbox');
    expect(list).toBeTruthy();
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
    expect(options[0].textContent).toContain('Pokemon');
  });
});
