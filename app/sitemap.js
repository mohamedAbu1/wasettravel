import { connectDB } from "@/lib/db";

const locales = ["en", "de", "es", "fr", "it", "zh"];
const routes = ["", "about", "trips", "contact", "b2b", "destinations/luxor", "destinations/aswan"];

async function getTripIds() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT id FROM trips");
    return rows.map((row) => String(row.id));
  } catch (error) {
    console.error("Sitemap trip lookup skipped:", error.message);
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = "https://wasettravel.com";
  const lastModified = new Date("2026-09-11T00:00:00.000Z");
  const tripIds = await getTripIds();

  const staticEntries = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route ? `/${route}` : ""}`,
      lastModified,
      changeFrequency: route === "trips" ? "daily" : "weekly",
      priority: route === "" ? 1 : route === "trips" ? 0.9 : 0.6,
    })),
  );

  const tripEntries = locales.flatMap((locale) =>
    tripIds.map((id) => ({
      url: `${baseUrl}/${locale}/trips/${encodeURIComponent(id)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  );

  return [...staticEntries, ...tripEntries];
}
