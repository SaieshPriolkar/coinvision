/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Enable /app directory support
  },
};

module.exports = nextConfig;
module.exports = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

