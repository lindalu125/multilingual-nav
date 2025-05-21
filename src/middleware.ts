import { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/navigation';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
