import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Play, Save } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Stepper from "../../components/ui/Stepper";
import { useToast } from "../../components/feedback/ToastProvider";
import { investigationsService } from "../../services/investigationsService";
import StepDetails from "./steps/StepDetails";
import StepIdentifiers from "./steps/StepIdentifiers";
import StepTools from "./steps/StepTools";
import StepReview from "./steps/StepReview";
import { getIdentifierType } from "./config/identifierTypes";
import { findFirstInvalidStep, isIdentifiersValid, validateDetails, validateTools } from "./validation";

const STEPS = ["Investigation details", "Target identifiers", "Tool selection", "Review and launch"];

// A fresh, empty form. This is the single source of truth for the wizard's data.
function createEmptyForm() {
  return {
    details: { name: "", caseId: "", description: "", category: "", notes: "", tags: [], startDate: "" },
    identifiers: [],
    tools: { selectedIds: [], depth: 1, timeoutSeconds: 120, maxResults: 100, allowPivot: false },
  };
}

// Turns the form into the object sent to the service.
// Raw File objects are NOT included; only metadata is sent.
function buildPayload(form) {
  const identifiers = form.identifiers.map((entry) => ({
    type: entry.type,
    value: entry.value.trim(),
    label: entry.label.trim(),
    note: entry.note.trim(),
    customType: entry.customType ? entry.customType.trim() : "",
    isPrimary: entry.isPrimary,
    fileName: entry.file ? entry.file.name : undefined,
    fileSize: entry.file ? entry.file.size : undefined,
  }));
  const primary = form.identifiers.find((entry) => entry.isPrimary) || form.identifiers[0];
  const { selected } = validateTools(form);

  return {
    name: form.details.name.trim(),
    caseId: form.details.caseId.trim(),
    description: form.details.description.trim(),
    category: form.details.category,
    notes: form.details.notes.trim(),
    tags: form.details.tags,
    startDate: form.details.startDate || null,
    primaryTarget: primary ? primary.value.trim() : "",
    targetType: primary ? getIdentifierType(primary.type).targetType : "custom",
    identifiers,
    tools: {
      toolIds: selected.map((tool) => tool.id),
      depth: form.tools.depth,
      timeoutSeconds: form.tools.timeoutSeconds,
      maxResults: form.tools.maxResults,
      allowPivot: form.tools.allowPivot,
    },
  };
}

export default function NewInvestigationPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(createEmptyForm);
  const [showErrors, setShowErrors] = useState(false); // becomes true after a failed "Next"
  const [authorized, setAuthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Helpers that update one part of the form without touching the rest.
  const updateDetails = (patch) => setForm((f) => ({ ...f, details: { ...f.details, ...patch } }));
  const updateIdentifiers = (identifiers) => setForm((f) => ({ ...f, identifiers }));
  const updateTools = (patch) => setForm((f) => ({ ...f, tools: { ...f.tools, ...patch } }));

  const detailsErrors = validateDetails(form.details);

  // Is the current step valid? Used by "Next".
  function currentStepIsValid() {
    if (stepIndex === 0) return Object.keys(detailsErrors).length === 0;
    if (stepIndex === 1) return isIdentifiersValid(form.identifiers);
    if (stepIndex === 2) return Object.keys(validateTools(form).errors).length === 0;
    return true;
  }

  function goTo(index) {
    setShowErrors(false);
    setStepIndex(index);
    window.scrollTo({ top: 0 });
  }

  function handleNext() {
    if (!currentStepIsValid()) {
      setShowErrors(true);
      return;
    }
    goTo(stepIndex + 1);
  }

  // Draft only needs a name and a purpose. Nothing runs.
  async function handleSaveDraft() {
    if (Object.keys(detailsErrors).length > 0) {
      goTo(0);
      setShowErrors(true);
      showToast("Add a name and purpose to save a draft.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await investigationsService.saveDraft(buildPayload(form));
      showToast("Draft saved.", "success");
      navigate("/investigations");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLaunch() {
    const invalidStep = findFirstInvalidStep(form);
    if (invalidStep !== -1) {
      goTo(invalidStep);
      setShowErrors(true);
      showToast("Fix the highlighted fields before launching.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await investigationsService.launch(buildPayload(form));
      showToast("Investigation created and queued. In demonstration mode no tools run.", "success");
      navigate("/investigations");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <div>
      <PageHeader title="New investigation" description="Define the scope, add identifiers, then choose tools." />

      <div className="banner banner-warning" style={{ marginBottom: 16 }}>
        <span>Only investigate targets and data you are authorized to examine.</span>
      </div>

      <Stepper steps={STEPS} current={stepIndex} onStepClick={goTo} />

      {showErrors && !currentStepIsValid() && (
        <div className="banner banner-danger" role="alert" style={{ marginBottom: 16 }}>
          Some fields need attention. Fix the highlighted fields to continue.
        </div>
      )}

      {stepIndex === 0 && <StepDetails value={form.details} onChange={updateDetails} errors={detailsErrors} showErrors={showErrors} />}
      {stepIndex === 1 && <StepIdentifiers identifiers={form.identifiers} onChange={updateIdentifiers} showErrors={showErrors} />}
      {stepIndex === 2 && <StepTools form={form} onChange={updateTools} showErrors={showErrors} />}
      {stepIndex === 3 && (
        <StepReview form={form} authorized={authorized} onAuthorizedChange={setAuthorized} onEditStep={goTo} />
      )}

      <div className="row-between" style={{ marginTop: 24 }}>
        <button className="btn" onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0 || submitting}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="row">
          <button className="btn" onClick={handleSaveDraft} disabled={submitting}>
            <Save size={16} /> Save draft
          </button>
          {isLastStep ? (
            <button className="btn btn-primary" onClick={handleLaunch} disabled={!authorized || submitting}>
              <Play size={16} /> {submitting ? "Starting..." : "Start investigation"}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext} disabled={submitting}>
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
