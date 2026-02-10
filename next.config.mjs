/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: [
      "dxpbyrcbklqrjlytmkum.supabase.co", // دومين Supabase Storage
    ],
  },
};

export default nextConfig;
