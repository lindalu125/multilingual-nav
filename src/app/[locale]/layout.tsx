// src/app/[locale]/layout.tsx

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
 
export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // 在服务器组件中，使用 await getMessages()
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}