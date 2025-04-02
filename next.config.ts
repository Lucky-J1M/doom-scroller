import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // config options here
    experimental: {        
        allowedDevOrigins: ["*"]
      }
};
export default nextConfig;
