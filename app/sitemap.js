const locales = ["en", "de", "es", "fr", "it", "zh"];
const routes = ["", "about", "trips", "contact", "b2b", "privacyPolicy", "cancellationPolicy"];

export default function sitemap() {
  const baseUrl = "https://wasettravel.com";

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route ? `/${route}` : ""}`,
      lastModified: new Date(),
      changeFrequency: route === "trips" ? "daily" : "weekly",
      priority: route === "" ? 1 : route === "trips" ? 0.9 : 0.6,
    })),
  );
}
