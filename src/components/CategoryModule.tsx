import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import ToolCard from '@/components/ToolCard';

type CategoryModuleProps = {
  category: {
    id: number;
    name: string;
    slug: string;
    description?: string;
  };
  tools: Array<{
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
  }>;
};

export default function CategoryModule({ category, tools }: CategoryModuleProps) {
  const t = useTranslations('home');
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{category.name}</h2>
          {category.description && (
            <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
        <Link 
          href={`/tools/${category.slug}`} 
          className="text-sm font-medium text-primary hover:underline"
        >
          {t('categories.viewAll')}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            name={tool.name}
            description={tool.description}
            url={tool.url}
            favicon={tool.favicon}
            isPick={tool.isPick}
            tags={tool.tags}
          />
        ))}
      </div>
    </div>
  );
}
