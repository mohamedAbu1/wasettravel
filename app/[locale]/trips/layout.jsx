import { tripsMetadata } from "@/lib/metadata/trips";
import { createLocalizedMetadata } from "@/lib/metadata/nextMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createLocalizedMetadata(tripsMetadata[locale] || tripsMetadata.en, locale, `/${locale}/trips`);
}

export default function TripsLayout({ children }) {
  return children;
}
