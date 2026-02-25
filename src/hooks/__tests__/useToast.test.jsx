import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  it('adds and removes toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => result.current.showSuccess('ok'));
    act(() => result.current.showError('no'));
    act(() => result.current.showInfo('info'));
    act(() => result.current.showWarning('warn'));
    act(() => result.current.showQuest('quest'));
    act(() => result.current.showCoins('coins'));

    expect(result.current.toasts).toHaveLength(6);

    const firstId = result.current.toasts[0].id;
    act(() => result.current.removeToast(firstId));

    expect(result.current.toasts.some(t => t.id === firstId)).toBe(false);
  });
});
