import { Link } from "react-router-dom";
import { formatDate } from "../../utils/format";
import EmptyState from "../../components/ui/EmptyState";
import styles from "./Dashboard.module.css";

const REVIEW_LABELS = { unreviewed: "Unreviewed", under_review: "Under review" };
const CONFIDENCE_TONE = { high: "badge-info", medium: "badge-warning", low: "badge-neutral" };

// List of findings. A finding is a reference found in a public source.
// It is NOT proof that anything is compromised until a person reviews it.
export default function FindingsList({ findings, emptyMessage }) {
  if (findings.length === 0) {
    return <EmptyState title="Nothing to review" message={emptyMessage} />;
  }
  return (
    <ul className={styles.findings}>
      {findings.map((finding) => (
        <li key={finding.id}>
          <div className="row-between">
            <strong>{finding.title}</strong>
            <span className={`badge ${CONFIDENCE_TONE[finding.confidence]}`}>{finding.confidence} confidence</span>
          </div>
          <div className="muted small">
            {finding.category} in{" "}
            <Link to={`/investigations/${finding.investigationId}`}>{finding.investigationName}</Link>
          </div>
          <div className="muted small">
            {REVIEW_LABELS[finding.status] || finding.status} - observed {formatDate(finding.observedAt)}
          </div>
        </li>
      ))}
    </ul>
  );
}
