// Wraps an input with a label, optional hint and an error message.
// Because the input sits INSIDE the <label>, screen readers connect them automatically.
export default function FormField({ label, required, hint, error, className = "", children }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">
        {label}
        {required && <span className="required-mark" aria-hidden="true">*</span>}
      </span>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error" role="alert">{error}</span>}
    </label>
  );
}
