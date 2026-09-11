const locales = ["en", "de", "es", "fr", "it", "zh"];
const routes = ["", "about", "trips", "contact", "b2b", "privacyPolicy", "cancellationPolicy"];

export default function sitemap() {
  const baseUrl = "https://wasettravel.com";
  const lastModified = new Date("2026-09-11T00:00:00.000Z");

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route ? `/${route}` : ""}`,
      lastModified,
      changeFrequency: route === "trips" ? "daily" : "weekly",
      priority: route === "" ? 1 : route === "trips" ? 0.9 : 0.6,
    })),
  );
}
