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
  if (/^(https?:|data:|blob:)/i.test(cleaned)) return cleaned;
  return `${publicSiteUrl}/${cleaned.replace(/^\/+/, "")}`;
}

export function normalizeNextImageSource(value) {
  if (!value || typeof value !== "string") return value || "";
  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      if (url.hostname === new URL(publicSiteUrl).hostname) return decodeURIComponent(url.pathname);
      return value;
    }
    return value.startsWith("/") ? decodeURIComponent(value) : value;
  } catch {
    return value;
  }
}
