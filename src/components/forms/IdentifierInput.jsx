import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { FILE_RULES, getIdentifierType } from "../../features/investigations/config/identifierTypes";
import { formatBytes } from "../../utils/formatBytesProxy";
import styles from "./IdentifierInput.module.css";

// One row of the identifier form: type, value, label, note, primary radio, remove.
//
// entry        the identifier object ({ id, type, value, label, note, isPrimary, file ... })
// typeOptions  identifier types allowed in this section
// error        validation message for this row ("" when fine)
// isDuplicate  true when another row has the same type and value
// showErrors   true after the user tried to continue (show every error, not just touched ones)
export default function IdentifierInput({
  entry, typeOptions, error, isDuplicate, showErrors, onChange, onSetPrimary, onRemove,
}) {
  const [touched, setTouched] = useState(false);       // has the user left the value box yet?
  const [readProgress, setReadProgress] = useState(0); // 0 to 100 while a file is being read
  const [previewUrl, setPreviewUrl] = useState(null);  // temporary URL used to preview an image

  const type = getIdentifierType(entry.type);
  const isFile = type.inputKind === "file";
  const visibleError = isDuplicate
    ? "This is a duplicate of another identifier in the form."
    : touched || showErrors ? error : "";

  // Create a preview URL for image files, and release it when no longer needed.
  useEffect(() => {
    if (entry.file && entry.file.type.startsWith("image/")) {
      const url = URL.createObjectURL(entry.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // cleanup prevents memory leaks
    }
    setPreviewUrl(null);
  }, [entry.file]);

  function handleFileChange(event) {
    const file = event.target.files[0];
    setReadProgress(0);
    if (!file) return;

    const rules = FILE_RULES[type.fileRule];
    // These checks only improve the user experience. The backend must enforce them too.
    if (!rules.mimeTypes.includes(file.type)) {
      onChange({ file: null, value: "", fileError: `This file type is not supported. ${rules.help}` });
      return;
    }
    if (file.size > rules.maxBytes) {
      onChange({ file: null, value: "", fileError: `The file is ${formatBytes(file.size)}. ${rules.help}` });
      return;
    }

    // Reading the file locally gives real progress. Nothing is uploaded until a backend exists.
    const reader = new FileReader();
    reader.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        setReadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    };
    reader.onload = () => setReadProgress(100);
    reader.onerror = () => onChange({ file: null, value: "", fileError: "The file could not be read." });
    reader.readAsArrayBuffer(file);

    onChange({ file, value: file.name, fileError: "" });
  }

  return (
    <div className={`${styles.row} ${visibleError ? styles.invalid : ""}`}>
      <div className="form-grid">
        <label className="field">
          <span className="field-label">Type</span>
          <select
            className="input"
            value={entry.type}
            // Changing the type clears the old value because formats differ.
            onChange={(event) => onChange({ type: event.target.value, value: "", file: null, fileError: "" })}
          >
            {typeOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </label>

        {isFile ? (
          <label className="field">
            <span className="field-label">File</span>
            <input className="input" type="file" accept={FILE_RULES[type.fileRule].accept} onChange={handleFileChange} />
            <span className="field-hint">{FILE_RULES[type.fileRule].help}</span>
          </label>
        ) : (
          <label className="field">
            <span className="field-label">Value</span>
            <input
              className={`input ${visibleError ? "invalid" : ""}`}
              value={entry.value}
              placeholder={type.placeholder}
              onChange={(event) => onChange({ value: event.target.value })}
              onBlur={() => setTouched(true)}
              aria-invalid={Boolean(visibleError)}
            />
          </label>
        )}

        {entry.type === "custom" && (
          <label className="field full">
            <span className="field-label">Custom type name</span>
            <input className="input" value={entry.customType || ""} placeholder="For example: loyalty card number"
              onChange={(event) => onChange({ customType: event.target.value })} />
          </label>
        )}

        <label className="field">
          <span className="field-label">Label (optional)</span>
          <input className="input" value={entry.label} placeholder="Short name for this identifier"
            onChange={(event) => onChange({ label: event.target.value })} />
        </label>
        <label className="field">
          <span className="field-label">Source or context (optional)</span>
          <input className="input" value={entry.note} placeholder="Where did you get this identifier?"
            onChange={(event) => onChange({ note: event.target.value })} />
        </label>
      </div>

      {isFile && entry.file && (
        <div className={styles.fileInfo}>
          {previewUrl && <img src={previewUrl} alt={`Preview of ${entry.file.name}`} className={styles.preview} />}
          <div style={{ flex: 1, minWidth: 160 }}>
            <div>{entry.file.name} <span className="muted small">({formatBytes(entry.file.size)})</span></div>
            <progress value={readProgress} max="100" style={{ width: "100%" }} aria-label="File read progress" />
            <div className="muted small">
              {readProgress < 100 ? `Reading file locally: ${readProgress}%` : "Ready. The file is uploaded only when you launch with a backend."}
            </div>
          </div>
        </div>
      )}

      {visibleError && <div className="field-error" role="alert">{visibleError}</div>}

      <div className="row-between">
        <label className="row" style={{ gap: 6, cursor: "pointer" }}>
          <input type="radio" name="primary-identifier" checked={entry.isPrimary} onChange={onSetPrimary} />
          <span>Primary target</span>
        </label>
        <button type="button" className="btn btn-ghost" onClick={onRemove} title="Remove this identifier">
          <Trash2 size={16} /> Remove
        </button>
      </div>
    </div>
  );
}
