const siteUrl = "https://wasettravel.com";

export default function StructuredData({ locale = "en", pathname = "" }) {
  const url = `${siteUrl}/${locale}${pathname}`.replace(/\/$/, "") || siteUrl;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "TravelAgency"],
      name: "WasetTravel",
      url: siteUrl,
      logo: `${siteUrl}/HomePageImage/apple-touch-icon.png`,
      description:
        "Egypt travel agency offering tours, Nile cruises, cultural experiences, and private trips in Luxor, Aswan, and across Egypt.",
      areaServed: [
        { "@type": "City", name: "Luxor" },
        { "@type": "City", name: "Aswan" },
        { "@type": "Country", name: "Egypt" },
      ],
      email: "info@wasettravel.com",
      telephone: "+201091126069",
      sameAs: [
        "https://www.facebook.com/share/1BTkjPD5Sd/",
        "https://www.instagram.com/kader.mohameda",
        "https://www.tiktok.com/@mohamedakader25",
        "https://www.tripadvisor.com/Attraction_Review-g294205-d34511536-Reviews-Waset_Travel-Luxor_Nile_River_Valley.html",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": pathname === "" ? "WebSite" : "WebPage",
      name: "WasetTravel",
      url,
      inLanguage: locale,
      isPartOf: { "@type": "WebSite", name: "WasetTravel", url: siteUrl },
      about: ["Egypt tourism", "Luxor tours", "Aswan tours", "Nile cruises"],
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
