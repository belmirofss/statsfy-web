/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 900,
  images: {
    domains: ["i.scdn.co"],
  },
};

export default nextConfig;
