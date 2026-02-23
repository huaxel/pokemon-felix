import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInventory } from '../useInventory';

vi.mock('../../lib/services/inventoryService', () => ({
  getInventory: vi.fn(),
  saveInventory: vi.fn(),
}));

import * as inventoryService from '../../lib/services/inventoryService';

describe('useInventory', () => {
  beforeEach(() => {
    localStorage.clear();
    inventoryService.getInventory.mockReset();
    inventoryService.saveInventory.mockReset();
  });

  it('initializes inventory from service and syncs changes back', async () => {
    inventoryService.getInventory.mockResolvedValue({ potion: 2 });

    const { result } = renderHook(() => useInventory());

    await act(async () => {});

    expect(inventoryService.getInventory).toHaveBeenCalledTimes(1);
    expect(result.current.inventory).toEqual({ potion: 2 });

    act(() => result.current.addItem('potion', 1));
    expect(result.current.inventory.potion).toBe(3);

    await act(async () => {});
    expect(inventoryService.saveInventory).toHaveBeenCalled();
  });

  it('removes items only when there is enough quantity', async () => {
    inventoryService.getInventory.mockResolvedValue({ potion: 1 });

    const { result } = renderHook(() => useInventory());
    await act(async () => {});

    let ok = false;
    act(() => {
      ok = result.current.removeItem('potion', 2);
    });
    expect(ok).toBe(false);

    act(() => {
      ok = result.current.removeItem('potion', 1);
    });
    expect(ok).toBe(true);
    expect(result.current.inventory.potion).toBe(0);
  });
});
