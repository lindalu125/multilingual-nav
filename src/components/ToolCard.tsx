import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import FaviconFetcher from './FaviconFetcher';

type ToolCardProps = {
  id: number;
  name: string;
  description: string;
  url: string;
  favicon: string;
  isPick: boolean;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
};

export default function ToolCard({ id, name, description, url, favicon, isPick, tags }: ToolCardProps) {
  const t = useTranslations('tools.card');
  
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
      {isPick && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {t('pick')}
          </span>
        </div>
      )}
      <Link href={url} target="_blank" className="block p-4">
        <div className="flex items-center space-x-3">
          {favicon ? (
            <FaviconFetcher url={url} size={32} fallbackText={name.charAt(0)} />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">{name.charAt(0)}</span>
            </div>
          )}
          <h3 className="font-semibold">{name}</h3>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag.id} 
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </Link>
    </div>
  );
}
