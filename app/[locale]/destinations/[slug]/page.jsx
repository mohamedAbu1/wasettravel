import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

const locales = ["en", "de", "es", "fr", "it", "zh"];
const destinations = {
  luxor: {
    title: "Luxor Tours and Travel Guide",
    description:
      "Discover Luxor tours with WasetTravel: Karnak Temple, Luxor Temple, the Valley of the Kings, Hatshepsut Temple, and private Nile experiences.",
    intro:
      "Luxor is the open-air museum of Egypt. Our Luxor tours connect the East Bank temples with the Valley of the Kings and the West Bank’s remarkable heritage sites.",
    highlights: [
      "Karnak Temple and Luxor Temple",
      "Valley of the Kings and Hatshepsut Temple",
      "Private guided tours with comfortable transfers",
      "Nile cruises linking Luxor with Aswan",
    ],
    image: "/Luxor/pexels-oualid-soussi-2150533856-35050672.webp",
  },
  aswan: {
    title: "Aswan Tours and Travel Guide",
    description:
      "Explore Aswan tours with WasetTravel: Philae Temple, the Nubian village, the Nile, Abu Simbel excursions, and relaxing private experiences.",
    intro:
      "Aswan combines a calm Nile setting with Nubian culture and unforgettable monuments. Build an Aswan itinerary around Philae Temple, local life, and the journey south to Abu Simbel.",
    highlights: [
      "Philae Temple and the High Dam",
      "Nubian village and Nile experiences",
      "Abu Simbel day trips from Aswan",
      "Private transfers and tailored itineraries",
    ],
    image: "/Aswan/pexels-furknsaglam-1596977-21348185.webp",
  },
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.keys(destinations).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const destination = destinations[slug];
  if (!destination) return {};
  const canonical = `/${locale}/destinations/${slug}`;
  return {
    title: `${destination.title} | WasetTravel Egypt`,
    description: destination.description,
    keywords: `${slug} tours, ${slug} travel guide, Egypt tours, Nile cruise Egypt, WasetTravel`,
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...locales.map((supportedLocale) => [supportedLocale, `/${supportedLocale}/destinations/${slug}`]),
        ["x-default", `/en/destinations/${slug}`],
      ]),
    },
    openGraph: {
      title: `${destination.title} | WasetTravel Egypt`,
      description: destination.description,
      type: "article",
      url: `https://wasettravel.com${canonical}`,
      images: [
        {
          url: `https://wasettravel.com${destination.image}`,
          width: 1200,
          height: 630,
          alt: `${destination.title} with WasetTravel`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${destination.title} | WasetTravel Egypt`,
      description: destination.description,
      images: [`https://wasettravel.com${destination.image}`],
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
  };
}

export default async function DestinationPage({ params }) {
  const { locale, slug } = await params;
  const destination = destinations[slug];
  if (!destination) notFound();

  const url = `https://wasettravel.com/${locale}/destinations/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.title,
    description: destination.description,
    url,
    image: `https://wasettravel.com${destination.image}`,
    touristType: ["Cultural tourism", "Nile cruises", "Private Egypt tours"],
    containedInPlace: { "@type": "Country", name: "Egypt" },
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-5 pb-20 pt-32 text-white sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/60">
          <Link href={`/${locale}`} className="hover:text-[#c9a34a]">WasetTravel</Link>
          <span className="px-2">/</span>
          <span>{destination.title}</span>
        </nav>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#c9a34a]">Egypt travel guide</p>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">{destination.title}</h1>
        <figure className="relative mt-8 aspect-[16/7] overflow-hidden rounded-3xl border border-white/10">
          <Image
            src={destination.image}
            alt={`${destination.title} with WasetTravel`}
            fill
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </figure>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{destination.intro}</p>
        <section aria-labelledby="highlights" className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-10">
          <h2 id="highlights" className="text-2xl font-bold text-[#e6dcca]">What to experience</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {destination.highlights.map((item) => <li key={item} className="rounded-2xl border border-[#c9a34a]/25 bg-black/20 p-4 text-white/80">{item}</li>)}
          </ul>
        </section>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/${locale}/trips`} className="rounded-xl bg-[#c9a34a] px-6 py-3 font-semibold hover:bg-[#a67c00]">Explore Egypt tours</Link>
          <Link href={`/${locale}/contact`} className="rounded-xl border border-white/20 px-6 py-3 font-semibold hover:border-[#c9a34a]">Plan a private itinerary</Link>
        </div>
      </article>
    </main>
  );
}
