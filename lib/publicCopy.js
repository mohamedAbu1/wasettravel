export function normalizePublicCopy(value) {
  return String(value || "")
    .replace(/\bHurgada\b/gi, "Hurghada")
    .replace(/\bour of\b/gi, "Tour of");
}
