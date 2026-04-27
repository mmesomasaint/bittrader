import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In Next.js 15, this is stable and renamed to serverExternalPackages
  serverExternalPackages: ["ccxt"],
  
  // Hard-override the webpack resolver for protobufjs
  webpack: (config) => {
    config.externals.push({
      "protobufjs/minimal": "commonjs protobufjs/minimal",
    });
    return config;
  },
};

export default nextConfig;
