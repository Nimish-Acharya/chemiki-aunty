// SAMPLE DATA ONLY. Used by the Overview page in demonstration mode.
// Exposure findings are "references found", not confirmed exposures.

export const mockFindings = [
  { id: "finding_001", investigationId: "investigation_003", investigationName: "Staff email reference check",
    title: "Email address referenced on a public page", category: "Email address exposure",
    status: "unreviewed", confidence: "medium", observedAt: "2026-10-09T16:35:00Z" },
  { id: "finding_002", investigationId: "investigation_001", investigationName: "Brand domain exposure review",
    title: "Domain listed in a public paste index", category: "Other exposure",
    status: "unreviewed", confidence: "low", observedAt: "2026-10-08T14:05:00Z" },
  { id: "finding_003", investigationId: "investigation_002", investigationName: "Public username footprint",
    title: "Handle appears on a public forum profile", category: "Username exposure",
    status: "under_review", confidence: "medium", observedAt: "2026-10-09T09:10:00Z" },
  { id: "finding_004", investigationId: "investigation_001", investigationName: "Brand domain exposure review",
    title: "Redacted credential indicator in public repository", category: "API key or credential indicator",
    status: "unreviewed", confidence: "high", observedAt: "2026-10-07T10:20:00Z" },
  { id: "finding_005", investigationId: "investigation_011", investigationName: "Support phone number mentions",
    title: "Phone number published in a public directory", category: "Phone number exposure",
    status: "unreviewed", confidence: "medium", observedAt: "2026-09-04T07:55:00Z" },
];

export const mockActivity = [
  { id: "activity_001", at: "2026-10-09T18:00:00Z", text: "Partner portal certificate review is running." },
  { id: "activity_002", at: "2026-10-09T16:45:00Z", text: "Staff email reference check collected 2 new findings." },
  { id: "activity_003", at: "2026-10-09T09:20:00Z", text: "Public username footprint finished with partial results." },
  { id: "activity_004", at: "2026-10-08T14:10:00Z", text: "Brand domain exposure review was updated." },
  { id: "activity_005", at: "2026-10-07T12:30:00Z", text: "Public repository leak check failed. One tool timed out." },
  { id: "activity_006", at: "2026-10-05T11:10:00Z", text: "Image metadata review saved as a draft." },
];

export const mockActivityChart = [
  { day: "Oct 4", investigations: 1, findings: 3 },
  { day: "Oct 5", investigations: 2, findings: 5 },
  { day: "Oct 6", investigations: 1, findings: 2 },
  { day: "Oct 7", investigations: 3, findings: 7 },
  { day: "Oct 8", investigations: 2, findings: 9 },
  { day: "Oct 9", investigations: 4, findings: 12 },
  { day: "Oct 10", investigations: 1, findings: 4 },
];

export const mockEntityDistribution = [
  { name: "Websites and domains", value: 74 },
  { name: "Usernames and accounts", value: 31 },
  { name: "Email addresses", value: 18 },
  { name: "IP addresses", value: 22 },
  { name: "Organizations", value: 9 },
  { name: "Other", value: 12 },
];

export const mockToolSummary = [
  { tool: "Public web search",        succeeded: 14, failed: 1, skipped: 0, lastStatus: "completed" },
  { tool: "Domain and DNS lookup",    succeeded: 11, failed: 0, skipped: 1, lastStatus: "completed" },
  { tool: "Username account check",   succeeded: 6,  failed: 2, skipped: 0, lastStatus: "partial" },
  { tool: "Image metadata and OCR",   succeeded: 3,  failed: 0, skipped: 2, lastStatus: "completed" },
  { tool: "Repository search",        succeeded: 2,  failed: 3, skipped: 0, lastStatus: "failed" },
];
