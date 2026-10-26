/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // The business page was first published as /build/small-business.
    return [
      { source: "/build/small-business", destination: "/build/businesses", permanent: true },
      // We serve businesses of any size, so these guides dropped "small" from their URLs.
      { source: "/learn/ai-for-small-business", destination: "/learn/ai-for-business", permanent: true },
      { source: "/learn/meeting-room-booking-for-small-business", destination: "/learn/meeting-room-booking-for-business", permanent: true },
      // A book chapter that was published briefly and then taken down.
      { source: "/learn/what-the-bible-teaches-about-technology-and-ai", destination: "/learn/should-pastors-use-ai-for-sermons", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Spendwise is a static single-page app built from expense-tracker/ (npm run build:standalone).
      { source: "/apps/spendwise", destination: "/apps/spendwise/index.html" },
    ];
  },
};

export default nextConfig;
