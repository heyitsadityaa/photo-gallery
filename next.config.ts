const deployment = process.env.CONVEX_DEPLOYMENT;
const hostname = deployment ? `${deployment}.convex.cloud` : '';

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname,
        pathname: '/api/**',
      },
    ],
  },
  /* config options here */
};
