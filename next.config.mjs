/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // The business page was first published as /build/small-business.
    return [{ source: "/build/small-business", destination: "/build/businesses", permanent: true }];
  },
  async rewrites() {
    return [
      // Spendwise is a static single-page app built from expense-tracker/ (npm run build:standalone).
      { source: "/apps/spendwise", destination: "/apps/spendwise/index.html" },
    ];
  },
};

export default nextConfig;
