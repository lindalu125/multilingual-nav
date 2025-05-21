import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

type FooterProps = {
  socialLinks?: Array<{
    id: number;
    name: string;
    url: string;
    icon: string;
  }>;
};

export default function Footer({ socialLinks = [] }: FooterProps) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-muted/20">
      <div className="container px-4 md:px-6 py-8">
        {/* Newsletter Section */}
        <div className="mb-8 pb-8 border-b">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">{t('footer.newsletter')}</h3>
            <div className="flex">
              <input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="flex-1 h-10 rounded-l-md border border-input bg-background px-3 py-2 text-sm"
              />
              <button className="inline-flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">MultiNav</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A curated collection of the most useful tools across various categories.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-accent/50 transition-colors"
                  aria-label={link.name}
                >
                  {/* Social icon would be rendered here */}
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.navigation.tools')}</h3>
            <ul className="space-y-2">
              {Object.entries(t.raw('tools.categories')).slice(0, 4).map(([key, value]) => (
                <li key={key}>
                  <Link href={`/tools/${key}`} className="text-sm hover:underline">
                    {value as string}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.navigation.blog')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog/latest" className="text-sm hover:underline">
                  Latest Posts
                </Link>
              </li>
              <li>
                <Link href="/blog/featured" className="text-sm hover:underline">
                  Featured Posts
                </Link>
              </li>
              <li>
                <Link href="/blog/categories" className="text-sm hover:underline">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/blog/tags" className="text-sm hover:underline">
                  Tags
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.navigation.about')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  {t('common.navigation.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          {t('footer.copyright', { year: currentYear })}
        </div>
      </div>
    </footer>
  );
}
