import { Pencil } from "lucide-react";
import { getIdentifierType } from "../config/identifierTypes";
import { validateTools } from "../validation";

// Small block with a title and an Edit button that jumps back to a step.
function Section({ title, onEdit, children }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>{title}</h2>
        <button type="button" className="btn btn-ghost" onClick={onEdit}><Pencil size={14} /> Edit</button>
      </div>
      {children}
    </section>
  );
}

// Step 4. Read-only summary plus the authorization confirmation.
export default function StepReview({ form, authorized, onAuthorizedChange, onEditStep }) {
  const { details, identifiers, tools } = form;
  const { selected } = validateTools(form);
  const primary = identifiers.find((entry) => entry.isPrimary);

  return (
    <div className="stack">
      <Section title="Investigation details" onEdit={() => onEditStep(0)}>
        <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "max-content 1fr", gap: "6px 16px" }}>
          <dt className="muted">Name</dt><dd style={{ margin: 0 }}>{details.name}</dd>
          <dt className="muted">Case ID</dt><dd style={{ margin: 0 }}>{details.caseId || "None"}</dd>
          <dt className="muted">Purpose</dt><dd style={{ margin: 0 }}>{details.category}</dd>
          <dt className="muted">Tags</dt><dd style={{ margin: 0 }}>{details.tags.join(", ") || "None"}</dd>
          <dt className="muted">Start date</dt><dd style={{ margin: 0 }}>{details.startDate || "Not set"}</dd>
        </dl>
      </Section>

      <Section title="Target identifiers" onEdit={() => onEditStep(1)}>
        <p className="muted" style={{ marginBottom: 8 }}>
          Primary target: <strong className="mono">{primary ? primary.value : "none"}</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {identifiers.map((entry) => (
            <li key={entry.id}>
              <span className="muted">{getIdentifierType(entry.type).label}:</span>{" "}
              <span className="mono">{entry.value}</span>
              {entry.label && <span className="muted"> ({entry.label})</span>}
              {entry.isPrimary && <span className="badge badge-info" style={{ marginLeft: 8 }}>Primary</span>}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tools and limits" onEdit={() => onEditStep(2)}>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {selected.map((tool) => <li key={tool.id}>{tool.name} <span className="muted">(simulated)</span></li>)}
        </ul>
        <p className="muted" style={{ marginTop: 8 }}>
          Depth {tools.depth}, timeout {tools.timeoutSeconds}s, up to {tools.maxResults} results per tool,
          pivot searches {tools.allowPivot ? "allowed with approval" : "off"}.
        </p>
      </Section>

      <label className="banner banner-warning" style={{ cursor: "pointer" }}>
        <input type="checkbox" checked={authorized} onChange={(event) => onAuthorizedChange(event.target.checked)} style={{ marginTop: 3 }} />
        <span>
          I confirm I am authorized to investigate these targets and will only use publicly
          accessible information.
        </span>
      </label>
    </div>
  );
}
