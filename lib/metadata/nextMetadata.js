const siteUrl = "https://wasettravel.com";

export function createLocalizedMetadata(meta, locale, pathname = `/${locale}`) {
  const canonicalPath = pathname || `/${locale}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en${canonicalPath.replace(/^\/[a-z]{2}/, "")}`,
        de: `/de${canonicalPath.replace(/^\/[a-z]{2}/, "")}`,
        es: `/es${canonicalPath.replace(/^\/[a-z]{2}/, "")}`,
        fr: `/fr${canonicalPath.replace(/^\/[a-z]{2}/, "")}`,
        it: `/it${canonicalPath.replace(/^\/[a-z]{2}/, "")}`,
        zh: `/zh${canonicalPath.replace(/^\/[a-z]{2}/, "")}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: `${siteUrl}${canonicalPath}`,
      siteName: "WasetTravel",
      locale: `${locale}_US`,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}
