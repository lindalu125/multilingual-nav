// next.config.mjs

import withNextIntl from 'next-intl/plugin';

// 把 './src/i18n.ts' 这个路径加进去
const withNextIntlConfig = withNextIntl('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 可以在这里加一些其他的 Next.js 配置
};

export default withNextIntlConfig(nextConfig);
