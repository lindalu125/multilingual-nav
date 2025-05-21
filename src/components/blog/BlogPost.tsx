import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

type BlogPostProps = {
  post: {
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
  };
  isPreview?: boolean;
};

export default function BlogPost({ post, isPreview = false }: BlogPostProps) {
  const t = useTranslations('Blog');
  
  // Format date
  const formattedDate = new Date(post.publishedAt * 1000).toLocaleDateString();
  
  return (
    <article className={`blog-post ${isPreview ? 'blog-preview' : 'blog-full'}`}>
      {post.featuredImage && (
        <div className="relative w-full h-48 md:h-64 lg:h-80 mb-4 overflow-hidden rounded-lg">
          <Image 
            src={post.featuredImage} 
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="mb-4">
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.categories.map(category => (
              <Link 
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
        
        <h2 className={`font-bold ${isPreview ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
          {isPreview ? (
            <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
              {post.title}
            </Link>
          ) : post.title}
        </h2>
        
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          {post.author && (
            <>
              {post.author.avatar ? (
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/20 mr-2 flex items-center justify-center text-xs text-primary">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <span className="mr-2">{post.author.name}</span>
              <span className="mx-2">•</span>
            </>
          )}
          <time dateTime={new Date(post.publishedAt * 1000).toISOString()}>
            {formattedDate}
          </time>
        </div>
      </div>
      
      {isPreview ? (
        <>
          <div className="prose prose-sm dark:prose-invert line-clamp-3 mb-4">
            {post.excerpt}
          </div>
          <Link 
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t('readMore')} →
          </Link>
        </>
      ) : (
        <>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t">
              <span className="text-sm font-medium">{t('tags')}:</span>
              {post.tags.map(tag => (
                <Link 
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full hover:bg-muted/80"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
}
