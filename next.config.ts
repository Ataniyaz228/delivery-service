import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.dodopizza.ru" },
      { protocol: "https", hostname: "bkastana.kz" },
      { protocol: "https", hostname: "sushimaster.kz" },
      { protocol: "https", hostname: "astanatasty.kz" },
      { protocol: "https", hostname: "starbucks.kz" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
