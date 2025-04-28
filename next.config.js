// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  compress: true,               // ✅ Gzip compression enabled
  poweredByHeader: false,        // ✅ Hide 'X-Powered-By: Next.js' for better security
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'swifin-pwa.vercel.app',  // old Vercel default domain
          },
        ],
        destination: 'https://app.swifin.com/:path*',
        permanent: true, // 308 redirect (good for SEO)
      },
    ];
  },
};

module.exports = nextConfig;

