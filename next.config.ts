import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "postimg.cc",
      },
    ],
  },
};

export default nextConfig;
