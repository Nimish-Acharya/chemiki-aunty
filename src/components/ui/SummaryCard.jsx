import styles from "./SummaryCard.module.css";

// One number with a label. "icon" is a Lucide component, "hint" is small helper text.
export default function SummaryCard({ icon: Icon, label, value, hint, tone = "primary" }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={`${styles.icon} ${styles[tone]}`} aria-hidden="true">
        <Icon size={18} />
      </div>
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {hint && <div className="muted small">{hint}</div>}
      </div>
    </div>
  );
}
