import React from 'react';
import { useTranslations } from 'next-intl';

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({ onSearch, placeholder, className }: SearchBarProps) {
  const t = useTranslations('common.search');
  const [query, setQuery] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className || ''}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t('placeholder')}
          className="w-full h-12 pl-4 pr-12 rounded-lg border border-input bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-accent/50"
          aria-label={t('button')}
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
            className="lucide lucide-search"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
        </button>
      </div>
    </form>
  );
}
