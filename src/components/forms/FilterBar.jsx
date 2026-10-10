// Row that holds a search box and filters. Children are the controls.
export function FilterBar({ children }) {
  return <div className="row" style={{ marginBottom: 12 }}>{children}</div>;
}

// A labelled dropdown filter. options: [{ value, label }]
export function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="row" style={{ gap: 6 }}>
      <span className="muted small">{label}</span>
      <select className="input" style={{ width: "auto" }} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
