/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is the key. It tells the bundler: 
  // "Do not look inside these folders, just treat them as external"
  serverComponentsExternalPackages: ['ccxt'],
  
  webpack: (config) => {
    config.externals.push({
      // This specifically tells Webpack to ignore the protobufjs path issue
      'protobufjs/minimal': 'commonjs protobufjs/minimal',
    });
    return config;
  },
};

export default nextConfig;






