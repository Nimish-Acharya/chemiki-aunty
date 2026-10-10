import { Wrench } from "lucide-react";
import FormField from "../../../components/forms/FormField";
import EmptyState from "../../../components/ui/EmptyState";
import ToolCard from "../../../components/ui/ToolCard";
import { getCompatibleTools } from "../config/toolsCatalog";
import { validateTools } from "../validation";

// Step 3. Shows only the tools that fit the identifiers entered in step 2.
export default function StepTools({ form, onChange, showErrors }) {
  const compatible = getCompatibleTools(form.identifiers);
  const { errors } = validateTools(form);
  const tools = form.tools;

  function toggleTool(toolId) {
    const selectedIds = tools.selectedIds.includes(toolId)
      ? tools.selectedIds.filter((id) => id !== toolId)
      : [...tools.selectedIds, toolId];
    onChange({ selectedIds });
  }

  // Groups cards under their category heading.
  const categories = [...new Set(compatible.map((tool) => tool.category))];

  return (
    <div className="stack">
      <div className="banner banner-warning">
        <span>
          Tools marked <strong>Simulated</strong> demonstrate the workflow only and make no real
          queries. Tools marked <strong>Not integrated</strong> cannot be selected.
        </span>
      </div>

      {showErrors && errors.tools && <div className="banner banner-danger" role="alert">{errors.tools}</div>}

      {compatible.length === 0 ? (
        <EmptyState icon={Wrench} title="No compatible tools"
          message="Go back and add identifiers. Tools appear here when they support the identifier types you entered." />
      ) : (
        categories.map((category) => (
          <section key={category} className="stack" style={{ gap: 10 }}>
            <h3>{category}</h3>
            {compatible.filter((tool) => tool.category === category).map((tool) => (
              <ToolCard key={tool.id} tool={tool} selected={tools.selectedIds.includes(tool.id)} onToggle={() => toggleTool(tool.id)} />
            ))}
          </section>
        ))
      )}

      <div className="card">
        <h2 style={{ marginBottom: 12 }}>Execution limits</h2>
        <div className="form-grid">
          <FormField label="Investigation depth" hint="Higher depth follows more links and takes longer.">
            <select className="input" value={tools.depth} onChange={(event) => onChange({ depth: Number(event.target.value) })}>
              <option value={1}>1 - Direct matches only</option>
              <option value={2}>2 - One extra hop</option>
              <option value={3}>3 - Two extra hops</option>
            </select>
          </FormField>
          <FormField label="Execution timeout (seconds)" error={showErrors ? errors.timeoutSeconds : ""}>
            <input className="input" type="number" min={30} max={900} value={tools.timeoutSeconds}
              onChange={(event) => onChange({ timeoutSeconds: Number(event.target.value) })} />
          </FormField>
          <FormField label="Maximum results per tool" error={showErrors ? errors.maxResults : ""}>
            <input className="input" type="number" min={10} max={500} value={tools.maxResults}
              onChange={(event) => onChange({ maxResults: Number(event.target.value) })} />
          </FormField>
          <label className="row" style={{ alignSelf: "end", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={tools.allowPivot} onChange={(event) => onChange({ allowPivot: event.target.checked })} />
            <span>Allow pivot searches I approve one by one</span>
          </label>
        </div>
      </div>
    </div>
  );
}
