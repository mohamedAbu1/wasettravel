// app/layout.tsx
import "./style/globals.css";
import Providers from "./providers";

export const metadata = {
  metadataBase: new URL("https://wasettravel.com"),
  applicationName: "WasetTravel",
  title: "WasetTravel | Explore Egypt's Best Tours & Trips",
  description:
    "Discover Egypt with WasetTravel: luxury Nile cruises, desert safaris, Red Sea diving, historical tours, and personalized travel experiences.",
  keywords:
    "WasetTravel, Egypt tours, Nile cruise, desert safari, Red Sea diving, Luxor, Aswan, travel agency",
  openGraph: {
    title: "WasetTravel | Explore Egypt's Best Tours & Trips",
    description:
      "Discover Egypt with WasetTravel through curated tours and personalized travel experiences.",
    type: "website",
    url: "https://wasettravel.com/en",
    siteName: "WasetTravel",
    locale: "en_US",
    images: [{ url: "/iamges/5fae16c5ab3f1921b620186c04e03b0ec685a8d3b8b40d72cf262f9573ceeb8b.webp", width: 1200, height: 630, alt: "WasetTravel Egypt travel experiences" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WasetTravel | Explore Egypt's Best Tours & Trips",
    description:
      "Discover Egypt with WasetTravel through curated tours and personalized travel experiences.",
    images: ["/iamges/5fae16c5ab3f1921b620186c04e03b0ec685a8d3b8b40d72cf262f9573ceeb8b.webp"],
  },
  verification: { google: "google49366a773d42ea4a" },
  icons: { icon: "/HomePageImage/apple-touch-icon.png", apple: "/HomePageImage/apple-touch-icon.png" },
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
