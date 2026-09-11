import { homeMetadata } from "@/lib/metadata/home";
import { createLocalizedMetadata } from "@/lib/metadata/nextMetadata";
import StructuredData from "@/components/seo/StructuredData";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createLocalizedMetadata(homeMetadata[locale] || homeMetadata.en, locale, `/${locale}`);
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  return <><StructuredData locale={locale} />{children}</>;
}
