/** @type {import('next').NextConfig} */
const nextConfig = {
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