import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vtmgwotolt.ufs.sh',
        port: ''
      }
    ]
  }
};

export default nextConfig;