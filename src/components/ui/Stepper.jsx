import { Check } from "lucide-react";
import styles from "./Stepper.module.css";

// Progress indicator for the wizard. Finished steps can be clicked to go back.
export default function Stepper({ steps, current, onStepClick }) {
  return (
    <ol className={styles.stepper} aria-label="Progress">
      {steps.map((label, index) => {
        const isDone = index < current;
        const isCurrent = index === current;
        return (
          <li key={label} className={styles.item} aria-current={isCurrent ? "step" : undefined}>
            <button
              type="button"
              className={`${styles.button} ${isCurrent ? styles.current : ""} ${isDone ? styles.done : ""}`}
              disabled={!isDone}
              onClick={() => onStepClick(index)}
            >
              <span className={styles.circle}>{isDone ? <Check size={14} /> : index + 1}</span>
              <span className={styles.label}>{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
