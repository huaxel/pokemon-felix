import React, { useEffect, useState } from 'react';
import { useUI } from '../contexts/DomainContexts';
import './ToastContainer.css';

function ToastItem({ toast, onRemove }) {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    // Use duration from toast or default to 3000ms
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove, isPaused]);

  // Determine ARIA role based on toast type
  // 'alert' for errors (assertive), 'status' for others (polite)
  const role = toast.type === 'error' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={`toast-notification ${toast.type}`}
      onClick={() => onRemove(toast.id)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onRemove(toast.id);
        }
      }}
      tabIndex={0}
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
    >
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
