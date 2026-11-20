import { homeMetadata } from "@/lib/metadata/home";
import { createLocalizedMetadata } from "@/lib/metadata/nextMetadata";
import StructuredData from "@/components/seo/StructuredData";
import { notFound } from "next/navigation";

const supportedLocales = ["en", "es", "fr", "de", "it", "zh"];

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createLocalizedMetadata(homeMetadata[locale] || homeMetadata.en, locale, `/${locale}`);
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!supportedLocales.includes(locale)) notFound();
  return <><StructuredData locale={locale} />{children}</>;
}
