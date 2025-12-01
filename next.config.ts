import type { NextConfig } from "next";

const nextConfig: any = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb', // Increase limit for video uploads and QR logos
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

export default nextConfig as any;
