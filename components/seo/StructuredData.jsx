const siteUrl = "https://wasettravel.com";

export default function StructuredData({ locale = "en", pathname = "" }) {
  const url = `${siteUrl}/${locale}${pathname}`.replace(/\/$/, "") || siteUrl;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "WasetTravel",
      url: siteUrl,
      logo: `${siteUrl}/HomePageImage/apple-touch-icon.png`,
      sameAs: [
        "https://www.facebook.com/share/1BTkjPD5Sd/",
        "https://www.instagram.com/kader.mohameda",
        "https://www.tiktok.com/@mohamedakader25",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": pathname === "" ? "WebSite" : "WebPage",
      name: "WasetTravel",
      url,
      inLanguage: locale,
      isPartOf: { "@type": "WebSite", name: "WasetTravel", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "WasetTravel", item: `${siteUrl}/${locale}` },
        ...(pathname
          ? [{ "@type": "ListItem", position: 2, name: pathname.slice(1).split("/")[0], item: url }]
          : []),
      ],
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
