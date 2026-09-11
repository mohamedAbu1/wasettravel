import { createLocalizedMetadata } from "@/lib/metadata/nextMetadata";

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

export default function TripLayout({ children }) {
  return children;
}
