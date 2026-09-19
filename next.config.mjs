/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/:locale/privacyPolicy", destination: "/:locale/privacy-policy", permanent: true },
      { source: "/:locale/cancellationPolicy", destination: "/:locale/cancellation-policy", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*\\.(avif|webp|png|jpg|jpeg|svg|ico|woff2|mp4|webm)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https: ws: wss:; media-src 'self' https: blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`,
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wasettravel.com",
        pathname: "/iamges/**",
      },
      {
        protocol: "https",
        hostname: "wasettravel.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "wasettravel.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dxpbyrcbklqrjlytmkum.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lkwlrezhuxercfvtjiiw.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
