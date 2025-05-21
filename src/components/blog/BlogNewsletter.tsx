import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type BlogNewsletterProps = {
  locale: string;
};

export default function BlogNewsletter({ locale }: BlogNewsletterProps) {
  const t = useTranslations('Blog');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would submit the form to your API
    console.log('Newsletter subscription submitted');
    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };
  
  return (
    <div className="blog-newsletter bg-primary/5 rounded-lg p-6 md:p-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">{t('subscribeNewsletter')}</h3>
        <p className="text-muted-foreground mb-6">{t('newsletterDescription')}</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            required
            className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {t('subscribe')}
          </button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4">
          {t('privacyNotice')} <Link href={`/${locale}/privacy-policy`} className="underline hover:text-primary">{t('privacyPolicy')}</Link>
        </p>
      </div>
    </div>
  );
}
