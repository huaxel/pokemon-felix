import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { useCollection } from '../useCollection';

vi.mock('../../lib/services/collectionService', () => ({
  getCollection: vi.fn(async () => []),
  addToCollection: vi.fn(async () => ({})),
  removeFromCollection: vi.fn(async () => ({}))
}));

function TestComponent() {
  const { ownedIds, setOwnedIds } = useCollection();
  React.useEffect(() => {
    setOwnedIds([1, 2]);
  }, [setOwnedIds]);
  return <div data-testid="owned">{JSON.stringify(ownedIds)}</div>;
}

describe('useCollection hook', () => {
  it('loads initial collection and allows setting owned ids', async () => {
    render(<TestComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('owned').textContent).toContain('1');
    });
  });
});
