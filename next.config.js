/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 't.nhentai.net' },
      { protocol: 'https', hostname: 'i.nhentai.net' },
      { protocol: 'https', hostname: 't3.nhentai.net' },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
}
module.exports = nextConfig
