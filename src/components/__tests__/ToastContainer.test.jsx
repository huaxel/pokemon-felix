import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastContainer } from '../ToastContainer';
import * as DomainContexts from '../../contexts/DomainContexts';

// Mock useUI
vi.mock('../../contexts/DomainContexts', () => ({
  useUI: vi.fn(),
}));

describe('ToastContainer', () => {
  const mockRemoveToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when there are no toasts', () => {
    DomainContexts.useUI.mockReturnValue({
      toasts: [],
      removeToast: mockRemoveToast,
    });

    const { container } = render(<ToastContainer />);
    expect(container.querySelector('.toast-container')).toBeNull();
  });

  it('renders toasts correctly with proper roles', () => {
    const toasts = [
      { id: 1, message: 'Success!', type: 'success', duration: 3000 },
      { id: 2, message: 'Error!', type: 'error', duration: 3000 },
    ];

    DomainContexts.useUI.mockReturnValue({
      toasts,
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    expect(screen.getByText('Success!')).toBeTruthy();
    expect(screen.getByText('Error!')).toBeTruthy();

    // toast 2 is error -> alert (assertive)
    const alert = screen.getByRole('alert');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('Error!');

    // toast 1 is success -> status (polite)
    const status = screen.getByRole('status');
    expect(status).toBeTruthy();
    expect(status.textContent).toContain('Success!');
  });

  it('auto-dismisses toasts after duration', () => {
    const toasts = [{ id: 1, message: 'Disappear', type: 'info', duration: 1000 }];

    DomainContexts.useUI.mockReturnValue({
      toasts,
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });

  it('pauses auto-dismiss on hover', () => {
    const toasts = [{ id: 1, message: 'Hover me', type: 'info', duration: 1000 }];

    DomainContexts.useUI.mockReturnValue({
      toasts,
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);
    const toast = screen.getByText('Hover me').closest('div');

    // Hover
    fireEvent.mouseEnter(toast);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should NOT have been called yet because paused
    expect(mockRemoveToast).not.toHaveBeenCalled();

    // Leave
    fireEvent.mouseLeave(toast);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should be called now
    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });

  it('pauses auto-dismiss on focus', () => {
    const toasts = [{ id: 1, message: 'Focus me', type: 'info', duration: 1000 }];

    DomainContexts.useUI.mockReturnValue({
      toasts,
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);
    const toast = screen.getByText('Focus me').closest('div');

    // Focus
    fireEvent.focus(toast);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should NOT have been called yet because paused
    expect(mockRemoveToast).not.toHaveBeenCalled();

    // Blur
    fireEvent.blur(toast);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should be called now
    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });

  it('dismisses on click', () => {
    const toasts = [{ id: 1, message: 'Click me', type: 'info', duration: 3000 }];

    DomainContexts.useUI.mockReturnValue({
      toasts,
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);
    const toast = screen.getByText('Click me').closest('div');

    fireEvent.click(toast);
    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });

  it('dismisses on Enter key', () => {
    const toasts = [{ id: 1, message: 'Press Enter', type: 'info', duration: 3000 }];

    DomainContexts.useUI.mockReturnValue({
      toasts,
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);
    const toast = screen.getByText('Press Enter').closest('div');

    fireEvent.keyDown(toast, { key: 'Enter' });
    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });

  it('dismisses on Space key', () => {
    const toasts = [{ id: 1, message: 'Press Space', type: 'info', duration: 3000 }];

    DomainContexts.useUI.mockReturnValue({
      toasts,
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);
    const toast = screen.getByText('Press Space').closest('div');

    fireEvent.keyDown(toast, { key: ' ' });
    expect(mockRemoveToast).toHaveBeenCalledWith(1);
  });
});
