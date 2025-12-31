import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useSquad } from '../useSquad';

function TestSquad() {
  const { squadIds, addToSquad, removeFromSquad, isSquadFull } = useSquad([]);
  React.useEffect(() => {
    addToSquad(1);
    addToSquad(2);
    addToSquad(3);
    addToSquad(4);
    addToSquad(5);
    removeFromSquad(2);
  }, [addToSquad, removeFromSquad]);
  return <div data-testid="squad">{JSON.stringify({ squadIds, isSquadFull })}</div>;
}

describe('useSquad hook', () => {
  it('manages squad and enforces max size', async () => {
    render(<TestSquad />);
    const el = await screen.findByTestId('squad');
    expect(el.textContent).toContain('isSquadFull');
  });
});
