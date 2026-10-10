import { useState } from "react";
import { X } from "lucide-react";

// Type a tag and press Enter (or comma) to add it. Click the X on a chip to remove it.
export default function TagInput({ value, onChange, max = 10 }) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const tag = draft.trim().toLowerCase();
    setDraft("");
    if (!tag || value.includes(tag) || value.length >= max) return; // ignore blanks and duplicates
    onChange([...value, tag]);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault(); // stop Enter from submitting a form
      addTag();
    }
    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1)); // Backspace on an empty box removes the last tag
    }
  }

  return (
    <div>
      <input
        className="input"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length >= max ? `Maximum ${max} tags` : "Type a tag and press Enter"}
        disabled={value.length >= max}
      />
      {value.length > 0 && (
        <div className="row" style={{ gap: 6, marginTop: 8 }}>
          {value.map((tag) => (
            <span key={tag} className="chip">
              {tag}
              <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}
                title={`Remove tag ${tag}`} aria-label={`Remove tag ${tag}`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
