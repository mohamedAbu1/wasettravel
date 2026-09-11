import { aboutMetadata } from "@/lib/metadata/about";
import { createLocalizedMetadata } from "@/lib/metadata/nextMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createLocalizedMetadata(aboutMetadata[locale] || aboutMetadata.en, locale, `/${locale}/about`);
}

export default function AboutLayout({ children }) {
  return children;
}
