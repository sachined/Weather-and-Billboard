/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/blog',
  allowedDevOrigins: ['192.168.1.14'],
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
