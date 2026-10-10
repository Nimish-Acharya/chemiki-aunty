// Shared labels used across many pages. Keeping them in one file means
// a status is spelled the same way everywhere.

// "tone" picks the badge color (see .badge-* classes in base.css).
export const STATUS_META = {
  draft:     { label: "Draft",                          tone: "neutral" },
  queued:    { label: "Queued",                         tone: "info" },
  running:   { label: "Running",                        tone: "info" },
  completed: { label: "Completed",                      tone: "success" },
  partial:   { label: "Completed with partial results", tone: "warning" },
  failed:    { label: "Failed",                         tone: "danger" },
  cancelled: { label: "Cancelled",                      tone: "neutral" },
  archived:  { label: "Archived",                       tone: "neutral" },
};

export const TARGET_TYPE_LABELS = {
  domain: "Domain",
  username: "Username",
  email: "Email address",
  phone: "Phone number",
  person: "Person or alias",
  organization: "Organization",
  ip: "IP address",
  image: "Image",
  file: "File",
  profile: "Public profile",
  wallet: "Wallet address",
  repository: "Code repository",
  custom: "Custom",
};

export const INVESTIGATION_CATEGORIES = [
  "Authorized security audit",
  "Brand or domain exposure review",
  "Due diligence",
  "Incident response support",
  "Research or training",
  "Other",
];

// Chart colors as plain hex values (Recharts needs real colors, not CSS variables).
export const CHART_COLORS = {
  primary: "#22d3ee",
  secondary: "#a78bfa",
  warning: "#fbbf24",
  danger: "#f87171",
  success: "#34d399",
  grid: "#26324f",
  text: "#8f9bb8",
};
