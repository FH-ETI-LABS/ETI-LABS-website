import "./Toast.css";

type ToastTone = "success" | "error" | "info";

type ToastProps = {
  message: string;
  tone?: ToastTone;
  onDismiss?: () => void;
};

const Toast = ({ message, tone = "info", onDismiss }: ToastProps) => {
  return (
    <div className={`toast toast-${tone}`} role="status" aria-live="polite">
      <span className="toast-message">{message}</span>
      {onDismiss && (
        <button
          type="button"
          className="toast-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Toast;
