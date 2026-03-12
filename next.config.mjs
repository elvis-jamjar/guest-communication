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
        hostname: "picsum.photos",
        protocol: "https",
      },
      {
        hostname: "pyramidsparkresort.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
