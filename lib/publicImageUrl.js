const publicSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://wasettravel.com").replace(/\/$/, "");

export function toPublicImageUrl(value) {
  if (!value || typeof value !== "string") return value || "";
  if (/^https?:\/\/basttettravel\.com\//i.test(value)) {
    return value.replace(/^https?:\/\/basttettravel\.com/i, publicSiteUrl);
  }
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${publicSiteUrl}/${value.replace(/^\/+/, "")}`;
}
