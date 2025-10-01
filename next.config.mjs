/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: false, // Keep console logs for debugging notifications
  },
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
