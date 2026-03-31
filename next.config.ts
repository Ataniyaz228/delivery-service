import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // Увеличиваем таймаут для загрузки изображений
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Отключаем строгую проверку изображений в разработке
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
