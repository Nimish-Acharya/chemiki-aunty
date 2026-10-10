import { AlertTriangle } from "lucide-react";

// Shown when loading fails. Says what happened and offers a retry button.
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="banner banner-danger" role="alert">
      <AlertTriangle size={18} aria-hidden="true" style={{ color: "var(--danger)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <strong>Something went wrong.</strong>
        <div className="muted">{message || "The data could not be loaded."}</div>
      </div>
      {onRetry && <button className="btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}
