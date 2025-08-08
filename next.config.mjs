/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
        protocol: "https",
      },
      {
        hostname: "storage.googleapis.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
