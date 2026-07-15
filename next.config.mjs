import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
};

const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheId: 'cadastro-localizacoes-v2',
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.hostname.endsWith('.supabase.co'),
      handler: 'NetworkOnly',
      method: 'GET',
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'google-fonts-v2' },
    },
    {
      urlPattern: ({ sameOrigin, url }) => sameOrigin && !url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: { cacheName: 'local-pages-v2', networkTimeoutSeconds: 10 },
    },
  ],
})(nextConfig);

export default config;
