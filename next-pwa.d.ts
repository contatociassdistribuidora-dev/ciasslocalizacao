declare module 'next-pwa' {
  const withPWA: (config: unknown) => (nextConfig: unknown) => unknown;
  export default withPWA;
}

declare module 'next-pwa/cache' {
  export const defaultCache: unknown;
}
