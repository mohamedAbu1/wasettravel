// app/layout.tsx
import "./style/globals.css";
import Providers from "./providers";

export const metadata = {
  metadataBase: new URL("https://wasettravel.com"),
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
  },
  twitter: {
    card: "summary_large_image",
    title: "WasetTravel | Explore Egypt's Best Tours & Trips",
    description:
      "Discover Egypt with WasetTravel through curated tours and personalized travel experiences.",
  },
  robots: {
    index: true,
    follow: true,
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
