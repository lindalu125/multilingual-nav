import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import Image from 'next/image';

type FaviconFetcherProps = {
  url: string;
  size?: number;
  className?: string;
  fallbackText?: string;
};

export default function FaviconFetcher({ url, size = 32, className, fallbackText }: FaviconFetcherProps) {
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  
  React.useEffect(() => {
    if (!url) {
      setIsLoading(false);
      setError(true);
      return;
    }
    
    const fetchFavicon = async () => {
      try {
        // Try to get favicon from Google's favicon service
        const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;
        setFaviconUrl(googleFaviconUrl);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching favicon:', err);
        setError(true);
        setIsLoading(false);
      }
    };
    
    fetchFavicon();
  }, [url, size]);
  
  if (isLoading) {
    return (
      <div 
        className={`h-${size / 4} w-${size / 4} rounded-full bg-muted flex items-center justify-center ${className || ''}`}
        style={{ width: size, height: size }}
      >
        <span className="animate-pulse bg-muted-foreground/20 w-full h-full rounded-full"></span>
      </div>
    );
  }
  
  if (error || !faviconUrl) {
    return (
      <div 
        className={`h-${size / 4} w-${size / 4} rounded-full bg-muted flex items-center justify-center ${className || ''}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs font-medium">{fallbackText || url.charAt(0).toUpperCase()}</span>
      </div>
    );
  }
  
  return (
    <div 
      className={`relative h-${size / 4} w-${size / 4} ${className || ''}`}
      style={{ width: size, height: size }}
    >
      <Image 
        src={faviconUrl} 
        alt={`Favicon for ${url}`} 
        fill 
        className="rounded-full object-contain" 
        onError={() => setError(true)}
      />
    </div>
  );
}
