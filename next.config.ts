import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/heroes/:path*",
        destination: "https://hahow-recruit.herokuapp.com/heroes/:path*",
      },
    ];
  },
};

export default nextConfig;
