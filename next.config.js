/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.nhentai.net' },
      { protocol: 'https', hostname: 'nhentai.net' },
    ],
  },
}
module.exports = nextConfig
