import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // Vercel's platform itself caps request bodies for serverless
      // functions at ~4.5MB regardless of this setting — stay under it.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
