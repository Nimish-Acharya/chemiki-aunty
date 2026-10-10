import { formatDateTime } from "../../utils/format";
import styles from "./Dashboard.module.css";

// Vertical list of recent events, newest first.
export default function ActivityTimeline({ items }) {
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li key={item.id}>
          <div>{item.text}</div>
          <time className="muted small" dateTime={item.at}>{formatDateTime(item.at)}</time>
        </li>
      ))}
    </ol>
  );
}
