// app/layout.tsx
import "./style/globals.css";
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* بدل @import */}
        <link rel="preload" href="/theme.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/scrollbar.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/animations.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/swiper.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/social-icons.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/mui-inputs.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/datepicker.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/luxury-input.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/select.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
        <link rel="preload" href="/BookingSummaryCard.css" as="style" onload="this.onload=null;this.rel='stylesheet'"/>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
