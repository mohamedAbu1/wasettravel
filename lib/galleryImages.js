import { toPublicImageUrl } from "@/lib/publicImageUrl";

const supportedLanguages = ["en", "ar", "es", "fr", "de", "it", "zh"];

function parseGalleryValue(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Salvage URLs from legacy values that were copied with Markdown syntax.
    return (value.match(/https?:\/\/[^\s"'\])}]+/gi) || []).map((url) => ({ url }));
  }
}

export function normalizeGalleryImages(value) {
  return parseGalleryValue(value)
    .map((image) => {
      const source = typeof image === "string" ? { url: image } : image || {};
      const url = toPublicImageUrl(source.url || source.src || source.image || source.image_url || source.path);
      if (!url || !/^https?:\/\//i.test(url)) return null;
      const sourceName = source.name && typeof source.name === "object" ? source.name : {};
      const name = Object.fromEntries(supportedLanguages.map((language) => [
        language,
        typeof sourceName[language] === "string" ? sourceName[language].replaceAll("[", "").replaceAll("]", "").trim() : "",
      ]));
      return { url, name };
    })
    .filter(Boolean);
}
