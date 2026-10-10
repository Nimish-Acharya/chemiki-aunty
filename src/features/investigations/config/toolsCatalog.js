// The tool list used by the wizard (and later the OSINT Tools page).
// availability:
//   "simulated"   the UI works but NO real queries are made (demonstration only)
//   "unavailable" not integrated yet, so it cannot be selected
// configStatus: "not_required" | "configured" | "missing"
// Credentials are NEVER stored here. They live on the backend.

export const TOOLS_CATALOG = [
  { id: "username_discovery", name: "Username and account discovery", category: "Username and account discovery",
    description: "Checks whether a handle exists on public sites. A match does not prove the same person owns both accounts.",
    supports: ["username", "profile_url", "social_url"], availability: "simulated", configStatus: "not_required", credentials: [] },
  { id: "public_web_search", name: "Public web search", category: "Public web search",
    description: "Finds public pages that mention an identifier.",
    supports: ["username", "full_name", "email", "domain", "organization", "phone"], availability: "simulated", configStatus: "not_required", credentials: [] },
  { id: "email_public_checks", name: "Email public-source checks", category: "Email-related public-source checks",
    description: "Looks up an address in a lawful breach-notification service.",
    supports: ["email"], availability: "unavailable", configStatus: "missing", credentials: ["Breach-notification service API key (set on the backend)"] },
  { id: "domain_dns", name: "Domain and DNS lookup", category: "Domain and IP reconnaissance",
    description: "Reads public DNS records and registration data.",
    supports: ["domain", "subdomain", "dns_record", "website_url"], availability: "simulated", configStatus: "not_required", credentials: [] },
  { id: "ip_lookup", name: "IP address lookup", category: "Domain and IP reconnaissance",
    description: "Reads public ownership and reverse DNS data for an address.",
    supports: ["ip"], availability: "simulated", configStatus: "not_required", credentials: [] },
  { id: "cert_transparency", name: "Certificate transparency search", category: "Domain and IP reconnaissance",
    description: "Searches public certificate logs for related hostnames.",
    supports: ["domain", "subdomain", "certificate_ref"], availability: "simulated", configStatus: "not_required", credentials: [] },
  { id: "image_similarity", name: "Image similarity search", category: "Image similarity integrations",
    description: "Finds visually similar public images. Similarity is not identification.",
    supports: ["image_upload", "image_url"], availability: "unavailable", configStatus: "missing", credentials: ["Image search provider API key (set on the backend)"] },
  { id: "image_metadata_ocr", name: "Image metadata and OCR", category: "Image metadata and OCR",
    description: "Reads embedded metadata and visible text from an image.",
    supports: ["image_upload", "image_url"], availability: "simulated", configStatus: "not_required", credentials: [] },
  { id: "file_metadata_hash", name: "File metadata and hashing", category: "File metadata and hashing",
    description: "Reads file properties and calculates hashes.",
    supports: ["file_upload", "file_hash", "file_type"], availability: "simulated", configStatus: "not_required", credentials: [] },
  { id: "repo_search", name: "Public repository search", category: "Public web search",
    description: "Searches public repositories for references. Credential indicators are stored redacted.",
    supports: ["repo_url", "username", "organization"], availability: "simulated", configStatus: "not_required", credentials: [] },
  { id: "wallet_explorer", name: "Blockchain explorer lookup", category: "Public web search",
    description: "Reads public transaction history for a wallet address.",
    supports: ["wallet"], availability: "unavailable", configStatus: "missing", credentials: ["Explorer API key (set on the backend)"] },
];

// Returns the tools that can use at least one of the entered identifier types.
export function getCompatibleTools(identifiers) {
  const enteredTypes = new Set(identifiers.map((identifier) => identifier.type));
  return TOOLS_CATALOG.filter((tool) => tool.supports.some((type) => enteredTypes.has(type)));
}
