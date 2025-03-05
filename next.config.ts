import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vtmgwotolt.ufs.sh',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 's1.ticketm.net',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'images.universe.com',
        port: ''
      }
    ]
  }
};

export default nextConfig;