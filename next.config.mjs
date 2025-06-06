import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 你可以在这里加一些其他的 Next.js 配置
};

export default withNextIntlConfig(nextConfig);
