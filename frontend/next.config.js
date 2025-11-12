const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // Turbopack configuration
  experimental: {
    webpackBuildWorker: true,
  },
  // External packages for server components
  serverExternalPackages: ['puppeteer-core'],
  // Turbopack configuration to resolve warning
  turbopack: {
    // Empty config to resolve warning
  },
  // Modern image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; " +
                   "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; " +
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                   "img-src 'self' data: https:; " +
                   "font-src 'self' https://fonts.gstatic.com; " +
                   "connect-src 'self' http://localhost:4000 https://www.google-analytics.com; " +
                   "frame-src https://www.googletagmanager.com;",
          },
        ],
      },
    ];
  },
});