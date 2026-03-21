/** @type {import('next').NextConfig} */
const nextConfig = {
basePath: '/blog',
  async redirects() {
    return [
      {
        source: '/roadmap',
        destination: '/job-gap',
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;