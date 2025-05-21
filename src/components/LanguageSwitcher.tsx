import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/lib/navigation';
import { locales } from '@/lib/navigation';

export default function LanguageSwitcher() {
  const t = useTranslations('common.language');
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-accent/50">
        <span className="text-sm font-medium">
          {t(pathname.split('/')[1] as 'en' | 'zh' | 'es')}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="lucide lucide-chevron-down"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      <div className="absolute right-0 mt-1 w-40 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-accent/50"
            >
              {t(locale)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
