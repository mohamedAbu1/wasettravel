import { siteConfig } from "@/lib/siteConfig";

const { siteUrl } = siteConfig;

export default function StructuredData({ locale = "en", pathname = "" }) {
  const url = `${siteUrl}/${locale}${pathname}`.replace(/\/$/, "") || siteUrl;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "TravelAgency"],
      name: "WasetTravel",
      "@id": `${siteUrl}/#agency`,
      url: `${siteUrl}/en`,
      logo: `${siteUrl}/HomePageImage/apple-touch-icon.png`,
      description:
        "Egypt travel agency offering tours, Nile cruises, cultural experiences, and private trips in Luxor, Aswan, and across Egypt.",
      areaServed: [
        { "@type": "City", name: "Luxor" },
        { "@type": "City", name: "Aswan" },
        { "@type": "Country", name: "Egypt" },
      ],
      email: siteConfig.email,
      telephone: siteConfig.phone,
      sameAs: Object.values(siteConfig.social),
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
    ...(pathname ? [{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "WasetTravel", item: `${siteUrl}/${locale}` },
        ...(pathname
          ? [{ "@type": "ListItem", position: 2, name: pathname.slice(1).split("/")[0], item: url }]
          : []),
      ],
    }] : []),
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
