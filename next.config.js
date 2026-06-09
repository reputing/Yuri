/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.nhentai.net' },
      { protocol: 'https', hostname: 'nhentai.net' },
    ],
  },
}
module.exports = nextConfig
