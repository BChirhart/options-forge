/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configured for Firebase Functions deployment
  images: {
    unoptimized: true,
  },
  // Disable static export - using Firebase Functions for SSR
  output: undefined,
};

export default nextConfig;