// app/layout.tsx
import "./style/globals.css";
import Providers from "./providers";

export const metadata = {
  metadataBase: new URL("https://wasettravel.com"),
  applicationName: "WasetTravel",
  title: "WasetTravel | Explore Egypt's Best Tours & Trips",
  description:
    "Discover Egypt with WasetTravel: luxury Nile cruises, desert safaris, Red Sea diving, historical tours, and personalized travel experiences.",
  openGraph: {
    title: "WasetTravel | Explore Egypt's Best Tours & Trips",
    description:
      "Discover Egypt with WasetTravel through curated tours and personalized travel experiences.",
    type: "website",
    url: "https://wasettravel.com/en",
    siteName: "WasetTravel",
    locale: "en_US",
    images: [{ url: "/iamges/pexels-alexazabache-3185480.webp", width: 1200, height: 630, alt: "WasetTravel Egypt travel experiences" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WasetTravel | Explore Egypt's Best Tours & Trips",
    description:
      "Discover Egypt with WasetTravel through curated tours and personalized travel experiences.",
    images: ["/iamges/pexels-alexazabache-3185480.webp"],
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
    <html lang="en" data-site-theme="stone" suppressHydrationWarning>
      <body>
        <a href="#main-content-root" className="skip-link">Skip to content</a>
        <Providers><div id="main-content-root" tabIndex={-1}>{children}</div></Providers>
      </body>
    </html>
  );
}
