import { Search, X } from "lucide-react";

// A text box with a search icon and a clear button. The parent owns the value.
export default function SearchInput({ value, onChange, placeholder = "Search", label = "Search" }) {
  return (
    <div style={{ position: "relative", minWidth: 220, flex: "1 1 220px" }}>
      <Search size={16} aria-hidden="true"
        style={{ position: "absolute", left: 10, top: 10, color: "var(--text-muted)" }} />
      <input
        className="input"
        style={{ paddingLeft: 32, paddingRight: 32 }}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      {value && (
        <button className="icon-btn" style={{ position: "absolute", right: 2, top: 0 }}
          onClick={() => onChange("")} title="Clear search" aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
