import { createLocalizedMetadata } from "@/lib/metadata/nextMetadata";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  return createLocalizedMetadata(
    {
      title: "Egypt Tour | WasetTravel",
      description:
        "Explore itinerary details, inclusions, availability, and booking information for this Egypt tour with WasetTravel.",
      keywords: "Egypt tour, WasetTravel, travel itinerary, Egypt trip",
    },
    locale,
    `/${locale}/trips/${id}`,
  );
}

export default async function TripLayout({ children, params }) {
  const { id } = await params;
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT id FROM trips WHERE id = ? LIMIT 1", [id]);
    if (!rows.length) notFound();
  } catch (error) {
    // Let the client page show its recoverable error state when the database
    // is temporarily unavailable; only confirmed missing IDs become 404s.
    console.error("Trip existence check failed:", error.message);
  }
  return children;
}
