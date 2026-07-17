/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "dxpbyrcbklqrjlytmkum.supabase.co", // دومين Supabase
      "lkwlrezhuxercfvtjiiw.supabase.co", // دومين Supabase إضافي
      "wasettravel.com", // موقعك
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wasettravel.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
