// Shown when there is nothing to display. Always tell the user what to do next.
export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      {Icon && <Icon size={28} className="muted" aria-hidden="true" />}
      <h3 style={{ marginTop: 8 }}>{title}</h3>
      {message && <p className="muted" style={{ margin: "4px auto 12px", maxWidth: 420 }}>{message}</p>}
      {action}
    </div>
  );
}
