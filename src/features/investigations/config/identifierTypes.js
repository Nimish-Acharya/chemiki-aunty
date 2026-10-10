// Describes every kind of identifier a user can add.
// To support a new identifier type, add one object here: the form,
// validation and review list all read from this list.
import {
  validateCertificateRef, validateDnsRecord, validateDomain, validateEmail, validateFileType,
  validateHash, validateIp, validateName, validatePhone, validateUrl, validateUsername, validateWallet,
} from "../../../utils/validators";

const MB = 1024 * 1024;

// Limits shown in the UI. The backend must enforce them again.
export const FILE_RULES = {
  image: {
    accept: ".png,.jpg,.jpeg,.webp,.gif",
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
    maxBytes: 5 * MB,
    help: "PNG, JPG, WebP or GIF, up to 5 MB.",
  },
  document: {
    accept: ".pdf,.docx,.txt,.csv,.json",
    mimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain", "text/csv", "application/json",
    ],
    maxBytes: 10 * MB,
    help: "PDF, DOCX, TXT, CSV or JSON, up to 10 MB.",
  },
};

// group ids match the four collapsible sections in the form
export const IDENTIFIER_GROUPS = [
  { id: "personal", title: "Personal and account identifiers" },
  { id: "files", title: "Image and file identifiers" },
  { id: "infrastructure", title: "Internet and infrastructure identifiers" },
  { id: "other", title: "Other identifiers" },
];

// targetType links an identifier to the label used in investigation tables.
export const IDENTIFIER_TYPES = [
  { id: "username", label: "Username or handle", group: "personal", targetType: "username", placeholder: "exampleuser123", validate: validateUsername },
  { id: "full_name", label: "Full name or alias", group: "personal", targetType: "person", placeholder: "Sample Person", validate: validateName },
  { id: "email", label: "Email address", group: "personal", targetType: "email", placeholder: "name@example.org", validate: validateEmail },
  { id: "phone", label: "Phone number (with country code)", group: "personal", targetType: "phone", placeholder: "+1 555 010 0199", validate: validatePhone },
  { id: "profile_url", label: "Public profile URL", group: "personal", targetType: "profile", placeholder: "https://example.org/users/name", validate: validateUrl },
  { id: "organization", label: "Organization or company name", group: "personal", targetType: "organization", placeholder: "Example Org Ltd", validate: validateName },

  { id: "image_upload", label: "Image upload", group: "files", targetType: "image", inputKind: "file", fileRule: "image" },
  { id: "image_url", label: "Image URL", group: "files", targetType: "image", placeholder: "https://example.org/photo.jpg", validate: validateUrl },
  { id: "file_upload", label: "Document or file upload", group: "files", targetType: "file", inputKind: "file", fileRule: "document" },
  { id: "file_hash", label: "File hash", group: "files", targetType: "file", placeholder: "SHA-256 or MD5 hash", validate: validateHash },
  { id: "file_type", label: "File type", group: "files", targetType: "file", placeholder: "pdf", validate: validateFileType },

  { id: "domain", label: "Domain name", group: "infrastructure", targetType: "domain", placeholder: "example.org", validate: validateDomain },
  { id: "website_url", label: "Website URL", group: "infrastructure", targetType: "domain", placeholder: "https://www.example.org", validate: validateUrl },
  { id: "ip", label: "IP address", group: "infrastructure", targetType: "ip", placeholder: "203.0.113.10", validate: validateIp },
  { id: "subdomain", label: "Subdomain", group: "infrastructure", targetType: "domain", placeholder: "portal.example.org", validate: validateDomain },
  { id: "dns_record", label: "DNS record", group: "infrastructure", targetType: "domain", placeholder: "example.org A 203.0.113.10", validate: validateDnsRecord },
  { id: "certificate_ref", label: "Certificate reference", group: "infrastructure", targetType: "domain", placeholder: "Serial number or fingerprint", validate: validateCertificateRef },

  { id: "wallet", label: "Cryptocurrency wallet address", group: "other", targetType: "wallet", placeholder: "Public wallet address", validate: validateWallet },
  { id: "repo_url", label: "Public code repository URL", group: "other", targetType: "repository", placeholder: "https://example.com/org/repo", validate: validateUrl },
  { id: "social_url", label: "Social profile URL", group: "other", targetType: "profile", placeholder: "https://example.org/profile", validate: validateUrl },
  { id: "custom", label: "Custom identifier", group: "other", targetType: "custom", placeholder: "Custom value", validate: validateName },
];

export const getIdentifierType = (typeId) => IDENTIFIER_TYPES.find((type) => type.id === typeId);
