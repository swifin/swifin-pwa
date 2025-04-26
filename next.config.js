// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  compress: true,               // ✅ Gzip compression enabled
  poweredByHeader: false,        // ✅ Hides 'X-Powered-By: Next.js' for better security
};

module.exports = nextConfig;
