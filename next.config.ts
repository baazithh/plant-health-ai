import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['172.20.10.3'],
  },
};

export default nextConfig;
