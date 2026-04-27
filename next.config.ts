import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  // This is the key. It tells the bundler: 
  // "Do not look inside these folders, just treat them as external"
  serverComponentsExternalPackages: ['ccxt'],
}

export default nextConfig;
