// Each validator receives the text a user typed and returns:
//   ""            -> the value is fine
//   "some text"   -> the message to show under the field
// These checks are for usability only. The backend must validate again.

const requireText = (value, label, max = 200) => {
  const text = value.trim();
  if (!text) return `${label} is required.`;
  if (text.length > max) return `${label} must be ${max} characters or fewer.`;
  return "";
};

export const validateUsername = (value) => {
  const text = value.trim();
  if (text.length < 2 || text.length > 64) return "Use 2 to 64 characters.";
  if (/\s/.test(text)) return "Usernames cannot contain spaces.";
  return "";
};

export const validateName = (value) => requireText(value, "This field");

export const validateEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
    ? ""
    : "Enter a valid email address, for example name@example.org.";

export const validatePhone = (value) => {
  const cleaned = value.replace(/[\s-]/g, "");
  return /^\+[1-9]\d{6,14}$/.test(cleaned)
    ? ""
    : "Include the country code, for example +977 98XXXXXXXX.";
};

export const validateUrl = (value) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? ""
      : "The URL must start with http:// or https://.";
  } catch {
    return "Enter a full URL, for example https://example.org/page.";
  }
};

export const validateDomain = (value) =>
  /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(value.trim())
    ? ""
    : "Enter a domain such as example.org (no http:// and no path).";

export const validateIp = (value) => {
  const text = value.trim();
  // IPv4: four numbers from 0 to 255 separated by dots.
  const parts = text.split(".");
  const isV4 =
    parts.length === 4 &&
    parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
  // IPv6 (loose check): hex digits and at least two colons.
  const isV6 = /^[0-9a-f:]+$/i.test(text) && (text.match(/:/g) || []).length >= 2;
  return isV4 || isV6 ? "" : "Enter a valid IPv4 or IPv6 address.";
};

export const validateHash = (value) => {
  const text = value.trim();
  if (!/^[a-f0-9]+$/i.test(text)) return "Hashes use only the characters 0-9 and a-f.";
  return [32, 40, 64, 128].includes(text.length)
    ? ""
    : "Expected an MD5 (32), SHA-1 (40), SHA-256 (64) or SHA-512 (128) character hash.";
};

export const validateWallet = (value) =>
  /^[a-z0-9]{26,64}$/i.test(value.trim())
    ? ""
    : "Wallet addresses are usually 26 to 64 letters and numbers.";

export const validateFileType = (value) =>
  /^[a-z0-9.+/-]{2,60}$/i.test(value.trim())
    ? ""
    : "Use an extension or MIME type, for example pdf or application/pdf.";

export const validateDnsRecord = (value) =>
  requireText(value, "The DNS record", 300);

export const validateCertificateRef = (value) => {
  const text = value.trim();
  return text.length >= 6 ? "" : "Enter a serial number or fingerprint (6+ characters).";
};
