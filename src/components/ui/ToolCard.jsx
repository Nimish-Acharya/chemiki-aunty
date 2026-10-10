import { KeyRound } from "lucide-react";

// Selectable card for one OSINT tool. Unavailable tools are shown but disabled,
// so nobody believes an unimplemented tool is going to run.
export default function ToolCard({ tool, selected, onToggle }) {
  const unavailable = tool.availability === "unavailable";

  return (
    <label className="card" style={{
      display: "flex", gap: 12, cursor: unavailable ? "not-allowed" : "pointer",
      opacity: unavailable ? 0.65 : 1, borderColor: selected ? "var(--primary)" : undefined,
    }}>
      <input type="checkbox" checked={selected && !unavailable} disabled={unavailable} onChange={onToggle}
        style={{ marginTop: 3 }} aria-label={`Select ${tool.name}`} />
      <div className="stack" style={{ gap: 8, flex: 1 }}>
        <div className="row-between">
          <strong>{tool.name}</strong>
          {unavailable
            ? <span className="badge badge-danger">Not integrated</span>
            : <span className="badge badge-purple">Simulated</span>}
        </div>
        <p className="muted">{tool.description}</p>
        <div className="muted small">Works with: {tool.supports.join(", ").replaceAll("_", " ")}</div>
        <div className="row small" style={{ gap: 8 }}>
          <span className="badge badge-neutral">
            {tool.configStatus === "not_required" ? "No configuration needed"
              : tool.configStatus === "configured" ? "Configured" : "Needs configuration"}
          </span>
          {unavailable && <span className="muted">Requires backend integration.</span>}
        </div>
        {tool.credentials.length > 0 && (
          <div className="muted small row" style={{ gap: 6 }}>
            <KeyRound size={14} aria-hidden="true" /> Requires: {tool.credentials.join("; ")}
          </div>
        )}
      </div>
    </label>
  );
}
