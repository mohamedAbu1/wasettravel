import { contactMetadata } from "@/lib/metadata/contact";
import { createLocalizedMetadata } from "@/lib/metadata/nextMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createLocalizedMetadata(contactMetadata[locale] || contactMetadata.en, locale, `/${locale}/contact`);
}

export default function ContactLayout({ children }) {
  return children;
}
