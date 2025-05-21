import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import BlogPost from './BlogPost';

type BlogListProps = {
  posts: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    publishedAt: number;
    author?: {
      name: string;
      avatar?: string;
    };
    categories?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
    tags?: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  }>;
  title?: string;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  baseUrl?: string;
};

export default function BlogList({ 
  posts, 
  title, 
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  baseUrl = '/blog'
}: BlogListProps) {
  const t = useTranslations('Blog');
  
  return (
    <div className="blog-list">
      {title && (
        <h1 className="text-3xl font-bold mb-8">{title}</h1>
      )}
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">{t('noPosts')}</p>
        </div>
      ) : (
        <div className="grid gap-8 md:gap-12">
          {posts.map(post => (
            <BlogPost key={post.id} post={post} isPreview={true} />
          ))}
        </div>
      )}
      
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link
                href={`${baseUrl}${currentPage > 2 ? `/page/${currentPage - 1}` : ''}`}
                className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                <span className="sr-only">{t('previousPage')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </Link>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Link
                key={page}
                href={`${baseUrl}${page > 1 ? `/page/${page}` : ''}`}
                className={`inline-flex items-center justify-center h-10 w-10 rounded-md ${
                  currentPage === page 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {page}
              </Link>
            ))}
            
            {currentPage < totalPages && (
              <Link
                href={`${baseUrl}/page/${currentPage + 1}`}
                className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                <span className="sr-only">{t('nextPage')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
