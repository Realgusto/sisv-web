import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  headers: async () => [
    {
        source: '/api/:path*',
        headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
            { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
    },
  ],
}
 
export default nextConfig