import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { getMessages } from 'next-intl/server';
import { locales } from '@/lib/navigation';
import '../globals.css';

export const metadata = {
  title: 'Multilingual Navigation',
  description: 'A curated collection of the most useful tools across various categories',
};

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
