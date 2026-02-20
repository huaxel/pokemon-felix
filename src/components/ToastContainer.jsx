import { useUI } from '../contexts/DomainContexts';
import './ToastContainer.css';

export function ToastContainer() {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-notification ${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="toast-message">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
