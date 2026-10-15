/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Spendwise is a static single-page app built from expense-tracker/ (npm run build:standalone).
      { source: "/apps/spendwise", destination: "/apps/spendwise/index.html" },
    ];
  },
};

export default nextConfig;
