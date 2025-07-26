// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the async redirects function here
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "climatestorieslibrary.com", // The non-www domain
          },
        ],
        destination: "https://www.climatestorieslibrary.com/:path*",
        permanent: true, // Use a 301 Permanent Redirect
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "azdnguxhaoslmrxczstx.supabase.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "climatestorieslibrary.sherpa.software",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "climatestorieslibrary.vercel.app",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.climatestorieslibrary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "climatestorieslibrary.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;