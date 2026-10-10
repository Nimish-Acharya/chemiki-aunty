// Validation for each wizard step. Every function returns plain objects so the
// step components just read the messages. Server-side validation is still required.
import { getIdentifierType } from "./config/identifierTypes";
import { getCompatibleTools } from "./config/toolsCatalog";

export function validateDetails(details) {
  const errors = {};
  if (!details.name.trim()) errors.name = "Give the investigation a name.";
  else if (details.name.trim().length > 120) errors.name = "Use 120 characters or fewer.";
  if (!details.category) errors.category = "Choose a purpose.";
  return errors;
}

// Two identifiers are duplicates when type and value match (ignoring case and spaces).
const duplicateKey = (entry) => `${entry.type}::${(entry.value || "").trim().toLowerCase()}`;

// Returns { entryErrors: { [id]: message }, duplicateIds: Set, formError: string }
export function validateIdentifiers(identifiers) {
  const entryErrors = {};
  const duplicateIds = new Set();
  const seen = new Map();

  identifiers.forEach((entry) => {
    const type = getIdentifierType(entry.type);
    const value = (entry.value || "").trim();

    if (entry.fileError) {
      entryErrors[entry.id] = entry.fileError;
    } else if (!value) {
      entryErrors[entry.id] = type.inputKind === "file" ? "Choose a file." : "Enter a value.";
    } else if (type.validate) {
      const message = type.validate(value);
      if (message) entryErrors[entry.id] = message;
    }
    if (entry.type === "custom" && !(entry.customType || "").trim() && !entryErrors[entry.id]) {
      entryErrors[entry.id] = "Name the custom identifier type.";
    }

    if (value) {
      const key = duplicateKey(entry);
      if (seen.has(key)) {
        duplicateIds.add(entry.id);
        duplicateIds.add(seen.get(key));
      } else {
        seen.set(key, entry.id);
      }
    }
  });

  let formError = "";
  if (identifiers.length === 0) formError = "Add at least one identifier.";
  else if (!identifiers.some((entry) => entry.isPrimary)) formError = "Choose a primary target.";
  else if (duplicateIds.size > 0) formError = "Remove duplicate identifiers before continuing.";

  return { entryErrors, duplicateIds, formError };
}

export function isIdentifiersValid(identifiers) {
  const { entryErrors, formError } = validateIdentifiers(identifiers);
  return Object.keys(entryErrors).length === 0 && !formError;
}

export function validateTools(form) {
  const compatible = getCompatibleTools(form.identifiers);
  const selected = compatible.filter(
    (tool) => form.tools.selectedIds.includes(tool.id) && tool.availability !== "unavailable"
  );
  const errors = {};
  if (selected.length === 0) errors.tools = "Select at least one available tool.";
  const { timeoutSeconds, maxResults } = form.tools;
  if (timeoutSeconds < 30 || timeoutSeconds > 900) errors.timeoutSeconds = "Use 30 to 900 seconds.";
  if (maxResults < 10 || maxResults > 500) errors.maxResults = "Use 10 to 500 results.";
  return { errors, selected };
}

// Returns the first step (0 to 2) that has a problem, or -1 when everything is valid.
export function findFirstInvalidStep(form) {
  if (Object.keys(validateDetails(form.details)).length > 0) return 0;
  if (!isIdentifiersValid(form.identifiers)) return 1;
  if (Object.keys(validateTools(form).errors).length > 0) return 2;
  return -1;
}
