/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // 如果您使用了国际化功能，可能需要添加以下配置
  i18n: {
    locales: ['en', 'zh', 'es', 'fr', 'pt', 'ar', 'ru'],
    defaultLocale: 'en',
  },
  // 如果您使用了图片优化，可能需要添加以下配置
  images: {
    domains: ['your-cloudflare-r2-domain.com'],
  },
};

export default nextConfig;
