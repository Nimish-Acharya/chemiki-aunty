import { useState } from "react";
import { Plus } from "lucide-react";
import IdentifierInput from "../../../components/forms/IdentifierInput";
import { IDENTIFIER_GROUPS, IDENTIFIER_TYPES } from "../config/identifierTypes";
import { validateIdentifiers } from "../validation";
import { createId } from "../../../utils/ids";

// Step 2. Four collapsible sections (native <details>) each listing their own identifiers.
// "identifiers" is the whole list; every change sends a NEW list up through onChange.
export default function StepIdentifiers({ identifiers, onChange, showErrors }) {
  const { entryErrors, duplicateIds, formError } = validateIdentifiers(identifiers);
  // Which type is chosen in each section's "add" dropdown.
  const [pendingType, setPendingType] = useState({});

  function addIdentifier(groupId, typeOptions) {
    const typeId = pendingType[groupId] || typeOptions[0].id;
    const newEntry = {
      id: createId("identifier"), type: typeId, value: "", label: "", note: "",
      customType: "", file: null, fileError: "",
      isPrimary: identifiers.length === 0, // the first identifier becomes the primary target
    };
    onChange([...identifiers, newEntry]);
  }

  function updateIdentifier(id, patch) {
    onChange(identifiers.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function setPrimary(id) {
    onChange(identifiers.map((entry) => ({ ...entry, isPrimary: entry.id === id })));
  }

  function removeIdentifier(id) {
    const remaining = identifiers.filter((entry) => entry.id !== id);
    // If the primary target was removed, promote the first remaining identifier.
    if (remaining.length > 0 && !remaining.some((entry) => entry.isPrimary)) {
      remaining[0] = { ...remaining[0], isPrimary: true };
    }
    onChange(remaining);
  }

  return (
    <div className="stack">
      <div className="banner">
        <span>
          Identifiers in one investigation are not assumed to belong to the same person.
          Add each one as a separate lead.
        </span>
      </div>

      {showErrors && formError && <div className="banner banner-danger" role="alert">{formError}</div>}

      {IDENTIFIER_GROUPS.map((group, index) => {
        const typeOptions = IDENTIFIER_TYPES.filter((type) => type.group === group.id);
        const entries = identifiers.filter((entry) => typeOptions.some((type) => type.id === entry.type));
        return (
          <details key={group.id} className="card" open={index === 0 || entries.length > 0}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>
              {group.title} <span className="muted small">({entries.length})</span>
            </summary>

            <div className="stack" style={{ marginTop: 12 }}>
              {entries.map((entry) => (
                <IdentifierInput
                  key={entry.id}
                  entry={entry}
                  typeOptions={typeOptions}
                  error={entryErrors[entry.id]}
                  isDuplicate={duplicateIds.has(entry.id)}
                  showErrors={showErrors}
                  onChange={(patch) => updateIdentifier(entry.id, patch)}
                  onSetPrimary={() => setPrimary(entry.id)}
                  onRemove={() => removeIdentifier(entry.id)}
                />
              ))}

              <div className="row">
                <select className="input" style={{ width: "auto" }} aria-label={`Identifier type to add to ${group.title}`}
                  value={pendingType[group.id] || typeOptions[0].id}
                  onChange={(event) => setPendingType({ ...pendingType, [group.id]: event.target.value })}>
                  {typeOptions.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                </select>
                <button type="button" className="btn" onClick={() => addIdentifier(group.id, typeOptions)}>
                  <Plus size={16} /> Add identifier
                </button>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
