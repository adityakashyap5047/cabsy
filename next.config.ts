/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' https://js.stripe.com;
              connect-src 'self' https://api.stripe.com https://js.stripe.com;
              frame-src https://js.stripe.com https://hooks.stripe.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
            `.replace(/\s{2,}/g, " "),
          },
        ],
      },
    ];
  },
  experimental: {
    scriptNonce: 'random', // Let Next.js safely allow inline scripts with a nonce
  },
};

export default nextConfig;
