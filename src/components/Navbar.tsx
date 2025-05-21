import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import DonationButton from './DonationButton';
import SocialMediaIcons from './SocialMediaIcons';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';

type NavbarProps = {
  socialLinks?: Array<{
    id: number;
    name: string;
    url: string;
    icon: string;
  }>;
};

export default function Navbar({ socialLinks = [] }: NavbarProps) {
  const t = useTranslations('common');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">MultiNav</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4 ml-6">
              <Link 
                href="/" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.home')}
              </Link>
              <Link 
                href="/tools" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.tools')}
              </Link>
              <Link 
                href="/blog" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.blog')}
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t('navigation.about')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1">
              <SearchBar 
                onSearch={(query) => console.log('Search:', query)} 
                className="w-[200px]"
              />
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <SocialMediaIcons socialLinks={socialLinks} />
              <LanguageSwitcher />
              <ThemeSwitcher />
              <DonationButton />
            </div>
            <button 
              className="md:hidden p-2 rounded-md hover:bg-accent/50"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        socialLinks={socialLinks}
      />
    </>
  );
}
