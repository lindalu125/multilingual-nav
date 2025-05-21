import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import Image from 'next/image';

type BlogCardProps = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  publishedAt: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  locale: string;
};

export default function BlogCard({ 
  id, 
  title, 
  excerpt, 
  slug, 
  featuredImage, 
  publishedAt, 
  categories,
  locale
}: BlogCardProps) {
  const t = useTranslations('blog');
  
  // Format date based on locale
  const formattedDate = new Date(publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
      {featuredImage ? (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <Image 
            src={featuredImage} 
            alt={title}
            width={600}
            height={340}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted"></div>
      )}
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.slice(0, 2).map((category) => (
            <Link 
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        <h3 className="font-semibold line-clamp-2 mb-2">
          <Link href={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {t('publishedOn', { date: formattedDate })}
          </span>
          <Link 
            href={`/blog/${slug}`} 
            className="text-xs font-medium text-primary hover:underline"
          >
            {t('readMore')}
          </Link>
        </div>
      </div>
    </div>
  );
}
