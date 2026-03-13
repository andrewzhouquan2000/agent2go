import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable React Server Components
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
