import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import DonationButton from './DonationButton';
import SocialMediaIcons from './SocialMediaIcons';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  socialLinks: Array<{
    id: number;
    name: string;
    url: string;
    icon: string;
  }>;
};

export default function MobileMenu({ isOpen, onClose, socialLinks }: MobileMenuProps) {
  const t = useTranslations('common');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
              <span className="font-bold text-xl">MultiNav</span>
            </Link>
            <button 
              onClick={onClose}
              className="p-2 rounded-md hover:bg-accent/50"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-auto py-4 px-6">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-lg font-medium py-2 hover:text-primary"
                onClick={onClose}
              >
                {t('navigation.home')}
              </Link>
              <Link 
                href="/tools" 
                className="text-lg font-medium py-2 hover:text-primary"
                onClick={onClose}
              >
                {t('navigation.tools')}
              </Link>
              <Link 
                href="/blog" 
                className="text-lg font-medium py-2 hover:text-primary"
                onClick={onClose}
              >
                {t('navigation.blog')}
              </Link>
              <Link 
                href="/about" 
                className="text-lg font-medium py-2 hover:text-primary"
                onClick={onClose}
              >
                {t('navigation.about')}
              </Link>
            </nav>
            
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('language.en')}</span>
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('theme.light')}</span>
                  <ThemeSwitcher />
                </div>
              </div>
              
              <div className="mt-6">
                <DonationButton className="w-full justify-center" />
              </div>
              
              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Social Media</div>
                <SocialMediaIcons socialLinks={socialLinks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
