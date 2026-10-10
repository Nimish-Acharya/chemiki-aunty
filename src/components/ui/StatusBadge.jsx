import { STATUS_META } from "../../config/constants";

// Shows a colored pill for a status such as "completed".
// If the status is unknown we still show its raw text instead of crashing.
export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, tone: "neutral" };
  return <span className={`badge badge-${meta.tone}`}>{meta.label}</span>;
}
