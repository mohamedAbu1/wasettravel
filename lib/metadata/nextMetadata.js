const siteUrl = "https://wasettravel.com";
const socialImage = "/iamges/5fae16c5ab3f1921b620186c04e03b0ec685a8d3b8b40d72cf262f9573ceeb8b.webp";
const localeMap = { en: "en_US", de: "de_DE", es: "es_ES", fr: "fr_FR", it: "it_IT", zh: "zh_CN" };

export function createLocalizedMetadata(meta, locale, pathname = `/${locale}`) {
  const canonicalPath = pathname || `/${locale}`;
  const languagePath = canonicalPath.replace(/^\/[a-z]{2}/, "");

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en${languagePath}`,
        de: `/de${languagePath}`,
        es: `/es${languagePath}`,
        fr: `/fr${languagePath}`,
        it: `/it${languagePath}`,
        zh: `/zh${languagePath}`,
        "x-default": `/en${languagePath}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: `${siteUrl}${canonicalPath}`,
      siteName: "WasetTravel",
      locale: localeMap[locale] || localeMap.en,
      images: [{ url: socialImage, width: 1200, height: 630, alt: "WasetTravel Egypt travel experiences" }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [socialImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    authors: [{ name: "WasetTravel" }],
    creator: "WasetTravel",
    publisher: "WasetTravel",
  };
}
