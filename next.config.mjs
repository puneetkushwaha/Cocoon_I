/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/shop",
        destination: "/#shop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
