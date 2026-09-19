const publicSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://wasettravel.com").replace(/\/$/, "");

export function toPublicImageUrl(value) {
  if (!value || typeof value !== "string") return value || "";
  let cleaned = value.trim();

  // Protect against URLs copied from Markdown, e.g. `[https://...](...)`.
  const markdownUrl = cleaned.match(/https?:\/\/[^\s\])}]+/i);
  if (markdownUrl) cleaned = markdownUrl[0].replace(/[.,]+$/, "");
  cleaned = cleaned.replace(/^\[+/, "").replace(/\]+$/, "");

  if (/^https?:\/\/basttettravel\.com\//i.test(cleaned)) {
    return cleaned.replace(/^https?:\/\/basttettravel\.com/i, publicSiteUrl);
  }
  if (/^https?:\/\//i.test(cleaned)) {
    try {
      const url = new URL(cleaned);
      if (url.hostname === new URL(publicSiteUrl).hostname) {
        return `${publicSiteUrl}${normalizeLegacyImagePath(url.pathname)}${url.search}`;
      }
    } catch {
      return cleaned;
    }
    return cleaned;
  }
  if (/^(data:|blob:)/i.test(cleaned)) return cleaned;
  return `${publicSiteUrl}${normalizeLegacyImagePath(`/${cleaned.replace(/^\/+/, "")}`)}`;
}

export function normalizeNextImageSource(value) {
  if (!value || typeof value !== "string") return value || "";
  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      if (url.hostname === new URL(publicSiteUrl).hostname) return normalizeLegacyImagePath(decodeURIComponent(url.pathname));
      return value;
    }
    return value.startsWith("/") ? normalizeLegacyImagePath(decodeURIComponent(value)) : value;
  } catch {
    return value;
  }
}

function normalizeLegacyImagePath(pathname) {
  return pathname
    .replace(/^\/(?:Nile Cruise|Medical trips)\//i, "/iamges/")
    .replace(/^\/(?:Nile%20Cruise|Medical%20trips)\//i, "/iamges/");
}
