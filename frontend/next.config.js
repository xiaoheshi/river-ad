/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  
  // 图片优化配置
  images: {
    domains: ['localhost', 'riverad.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 环境变量配置
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    NEXT_PUBLIC_APP_NAME: 'River-AD',
  },
  
  // 重写配置，代理API请求
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
  
  // 头部配置
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
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Webpack配置
  webpack: (config, { isServer }) => {
    // 客户端构建优化
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;