/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress the outdated Next.js warning if running a pinned version
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Ensure server-only packages aren't bundled for the client
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
