import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is the modern replacement for the webpack fix
  // It forces Turbopack to ignore CCXT during bundling
  serverExternalPackages: ["ccxt"],
  
  // This satisfies the Vercel requirement to explicitly choose a path
  turbopack: {}, 
};

export default nextConfig;
