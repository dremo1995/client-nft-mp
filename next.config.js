/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["ultraverse.infura-ipfs.io"],
  },
};

module.exports = nextConfig;
