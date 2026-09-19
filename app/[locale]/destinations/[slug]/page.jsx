import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import AuthModalPortal from "@/components/layout/AuthModalPortal";

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

const localizedDestinations = {
  de: {
    luxor: { title: "Luxor Reisen und Reiseführer", description: "Entdecken Sie Luxor-Reisen mit WasetTravel: Karnak-Tempel, Luxor-Tempel, Tal der Könige, Hatschepsut-Tempel und private Nil-Erlebnisse.", intro: "Luxor ist ein Freilichtmuseum Ägyptens. Unsere Reisen verbinden die Tempel des Ostufer mit dem Tal der Könige und den beeindruckenden Kulturerbestätten des Westufers.", highlights: ["Karnak- und Luxor-Tempel", "Tal der Könige und Hatschepsut-Tempel", "Private Führungen mit komfortablen Transfers", "Nilkreuzfahrten zwischen Luxor und Assuan"] },
    aswan: { title: "Assuan Reisen und Reiseführer", description: "Erkunden Sie Assuan mit WasetTravel: Philae-Tempel, Nubisches Dorf, Nil, Abu-Simbel-Ausflüge und private Reiseerlebnisse.", intro: "Assuan verbindet die ruhige Landschaft des Nils mit nubischer Kultur und unvergesslichen Monumenten. Planen Sie Ihre Reise rund um den Philae-Tempel, das lokale Leben und Abu Simbel.", highlights: ["Philae-Tempel und Assuan-Hochdamm", "Nubisches Dorf und Nil-Erlebnisse", "Tagesausflüge nach Abu Simbel", "Private Transfers und individuelle Reiseplanung"] },
  },
  es: {
    luxor: { title: "Viajes a Luxor y guía de viaje", description: "Descubre viajes a Luxor con WasetTravel: templo de Karnak, templo de Luxor, Valle de los Reyes, templo de Hatshepsut y experiencias privadas en el Nilo.", intro: "Luxor es un museo al aire libre. Nuestros viajes conectan los templos de la orilla este con el Valle de los Reyes y el extraordinario patrimonio de la orilla oeste.", highlights: ["Templos de Karnak y Luxor", "Valle de los Reyes y templo de Hatshepsut", "Visitas privadas con traslados cómodos", "Cruceros por el Nilo entre Luxor y Asuán"] },
    aswan: { title: "Viajes a Asuán y guía de viaje", description: "Explora Asuán con WasetTravel: templo de Philae, pueblo nubio, el Nilo, excursiones a Abu Simbel y experiencias privadas.", intro: "Asuán combina la tranquilidad del Nilo con la cultura nubia y monumentos inolvidables. Diseña tu itinerario alrededor de Philae, la vida local y Abu Simbel.", highlights: ["Templo de Philae y la Alta Presa", "Pueblo nubio y experiencias en el Nilo", "Excursiones de un día a Abu Simbel", "Traslados privados e itinerarios a medida"] },
  },
  fr: {
    luxor: { title: "Voyages à Louxor et guide de voyage", description: "Découvrez Louxor avec WasetTravel : temples de Karnak et de Louxor, vallée des Rois, temple d'Hatchepsout et expériences privées sur le Nil.", intro: "Louxor est un musée à ciel ouvert. Nos voyages relient les temples de la rive Est à la vallée des Rois et au patrimoine remarquable de la rive Ouest.", highlights: ["Temples de Karnak et de Louxor", "Vallée des Rois et temple d'Hatchepsout", "Visites privées et transferts confortables", "Croisières sur le Nil entre Louxor et Assouan"] },
    aswan: { title: "Voyages à Assouan et guide de voyage", description: "Explorez Assouan avec WasetTravel : temple de Philae, village nubien, Nil, excursions à Abou Simbel et expériences privées.", intro: "Assouan associe la douceur du Nil à la culture nubienne et à des monuments inoubliables. Organisez votre itinéraire autour de Philae, de la vie locale et d'Abou Simbel.", highlights: ["Temple de Philae et haut barrage", "Village nubien et expériences sur le Nil", "Excursions à Abou Simbel", "Transferts privés et itinéraires personnalisés"] },
  },
  it: {
    luxor: { title: "Viaggi a Luxor e guida di viaggio", description: "Scopri Luxor con WasetTravel: templi di Karnak e Luxor, Valle dei Re, tempio di Hatshepsut ed esperienze private sul Nilo.", intro: "Luxor è un museo a cielo aperto. I nostri viaggi collegano i templi della riva orientale alla Valle dei Re e al patrimonio della riva occidentale.", highlights: ["Templi di Karnak e Luxor", "Valle dei Re e tempio di Hatshepsut", "Visite private e trasferimenti confortevoli", "Crociere sul Nilo tra Luxor e Assuan"] },
    aswan: { title: "Viaggi ad Assuan e guida di viaggio", description: "Esplora Assuan con WasetTravel: tempio di Philae, villaggio nubiano, Nilo, escursioni ad Abu Simbel ed esperienze private.", intro: "Assuan unisce la calma del Nilo alla cultura nubiana e a monumenti indimenticabili. Crea il tuo itinerario tra Philae, la vita locale e Abu Simbel.", highlights: ["Tempio di Philae e alta diga", "Villaggio nubiano ed esperienze sul Nilo", "Escursioni di un giorno ad Abu Simbel", "Trasferimenti privati e itinerari su misura"] },
  },
  zh: {
    luxor: { title: "卢克索旅行与旅游指南", description: "与WasetTravel探索卢克索：卡纳克神庙、卢克索神庙、帝王谷、哈特谢普苏特神庙以及私人尼罗河体验。", intro: "卢克索是一座露天博物馆。我们的行程连接东岸神庙、帝王谷和西岸壮丽的历史遗产。", highlights: ["卡纳克神庙与卢克索神庙", "帝王谷与哈特谢普苏特神庙", "私人导览与舒适接送", "连接卢克索与阿斯旺的尼罗河游轮"] },
    aswan: { title: "阿斯旺旅行与旅游指南", description: "与WasetTravel探索阿斯旺：菲莱神庙、努比亚村、尼罗河、阿布辛贝一日游以及私人旅行体验。", intro: "阿斯旺将宁静的尼罗河风光、努比亚文化与令人难忘的古迹融为一体。围绕菲莱神庙、当地生活和阿布辛贝规划您的旅程。", highlights: ["菲莱神庙与阿斯旺大坝", "努比亚村与尼罗河体验", "阿布辛贝一日游", "私人接送与定制行程"] },
  },
};

function getDestination(locale, slug) {
  return { ...destinations[slug], ...(localizedDestinations[locale]?.[slug] || {}) };
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.keys(destinations).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const destination = getDestination(locale, slug);
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
  const destination = getDestination(locale, slug);
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
    <main className="site-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <div className="px-5 pb-20 pt-32 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--muted)]">
          <Link href={`/${locale}`} className="hover:text-[var(--color)]">WasetTravel</Link>
          <span className="px-2">/</span>
          <span>{destination.title}</span>
        </nav>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color)]">Egypt travel guide</p>
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
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">{destination.intro}</p>
        <section aria-labelledby="highlights" className="mt-12 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_1rem_3rem_rgba(78,54,31,.08)] sm:p-10">
          <h2 id="highlights" className="text-2xl font-bold text-[var(--foreground)]">What to experience</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {destination.highlights.map((item) => <li key={item} className="rounded-2xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 text-[var(--muted)]">{item}</li>)}
          </ul>
        </section>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/${locale}/trips`} className="rounded-xl bg-[var(--color)] px-6 py-3 font-semibold text-white shadow-md hover:bg-[var(--color-hover)]">Explore Egypt tours</Link>
          <Link href={`/${locale}/contact`} className="rounded-xl border border-[var(--line)] px-6 py-3 font-semibold text-[var(--foreground)] hover:border-[var(--color)]">Plan a private itinerary</Link>
        </div>
      </article>
      </div>
      <Footer />
      <AuthModalPortal />
    </main>
  );
}
