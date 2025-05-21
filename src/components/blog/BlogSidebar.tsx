import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type BlogSidebarProps = {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    count?: number;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
    count?: number;
  }>;
  recentPosts: Array<{
    id: number;
    title: string;
    slug: string;
    publishedAt: number;
  }>;
};

export default function BlogSidebar({ categories, tags, recentPosts }: BlogSidebarProps) {
  const t = useTranslations('Blog');
  
  return (
    <aside className="blog-sidebar space-y-8">
      {/* Search */}
      <div className="p-4 bg-card rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t('search')}</h3>
        <form className="relative">
          <input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
        </form>
      </div>
      
      {/* Categories */}
      {categories.length > 0 && (
        <div className="p-4 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('categories')}</h3>
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category.id}>
                <Link 
                  href={`/blog/category/${category.slug}`}
                  className="flex items-center justify-between hover:text-primary transition-colors"
                >
                  <span>{category.name}</span>
                  {category.count !== undefined && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">{category.count}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="p-4 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('recentPosts')}</h3>
          <ul className="space-y-4">
            {recentPosts.map(post => (
              <li key={post.id}>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h4 className="font-medium line-clamp-2">{post.title}</h4>
                  <time className="text-xs text-muted-foreground">
                    {new Date(post.publishedAt * 1000).toLocaleDateString()}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Tags */}
      {tags.length > 0 && (
        <div className="p-4 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">{t('tags')}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link 
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors"
              >
                {tag.name}
                {tag.count !== undefined && ` (${tag.count})`}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
