import FormField from "../../../components/forms/FormField";
import TagInput from "../../../components/forms/TagInput";
import { INVESTIGATION_CATEGORIES } from "../../../config/constants";

// Step 1. "value" is form.details, "onChange" receives a partial update such as { name: "..." }.
export default function StepDetails({ value, onChange, errors, showErrors }) {
  const err = (field) => (showErrors ? errors[field] : "");

  return (
    <div className="form-grid">
      <FormField label="Investigation name" required error={err("name")} className="full">
        <input className={`input ${err("name") ? "invalid" : ""}`} value={value.name} maxLength={140}
          placeholder="For example: Brand domain exposure review"
          onChange={(event) => onChange({ name: event.target.value })} />
      </FormField>

      <FormField label="Case or reference ID" hint="Optional. Your own tracking number.">
        <input className="input" value={value.caseId} placeholder="CASE-2026-020"
          onChange={(event) => onChange({ caseId: event.target.value })} />
      </FormField>

      <FormField label="Purpose" required error={err("category")}>
        <select className="input" value={value.category} onChange={(event) => onChange({ category: event.target.value })}>
          <option value="">Choose a purpose</option>
          {INVESTIGATION_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Description" className="full">
        <textarea className="input" value={value.description} placeholder="What question should this investigation answer?"
          onChange={(event) => onChange({ description: event.target.value })} />
      </FormField>

      <FormField label="Analyst notes" className="full" hint="Observations or constraints. Do not paste passwords or secret keys.">
        <textarea className="input" value={value.notes} onChange={(event) => onChange({ notes: event.target.value })} />
      </FormField>

      <FormField label="Tags" hint="Press Enter to add a tag.">
        <TagInput value={value.tags} onChange={(tags) => onChange({ tags })} />
      </FormField>

      <FormField label="Start date" hint="Optional.">
        <input className="input" type="date" value={value.startDate} onChange={(event) => onChange({ startDate: event.target.value })} />
      </FormField>
    </div>
  );
}
