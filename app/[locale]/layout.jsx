import { homeMetadata } from "@/lib/metadata/home";
import { createLocalizedMetadata } from "@/lib/metadata/nextMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createLocalizedMetadata(homeMetadata[locale] || homeMetadata.en, locale, `/${locale}`);
}

export default function LocaleLayout({ children }) {
  return children;
}
