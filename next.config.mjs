/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "dxpbyrcbklqrjlytmkum.supabase.co",
      "lkwlrezhuxercfvtjiiw.supabase.co",
      "wasettravel.com",
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
