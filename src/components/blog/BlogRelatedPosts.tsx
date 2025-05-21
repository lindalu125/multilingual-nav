import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

type BlogRelatedPostsProps = {
  currentPostId: number;
  relatedPosts: Array<{
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: string;
    publishedAt: number;
  }>;
};

export default function BlogRelatedPosts({ currentPostId, relatedPosts }: BlogRelatedPostsProps) {
  const t = useTranslations('Blog');
  
  // Filter out current post if it's in the related posts array
  const filteredPosts = relatedPosts.filter(post => post.id !== currentPostId);
  
  if (filteredPosts.length === 0) {
    return null;
  }
  
  return (
    <div className="blog-related-posts mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold mb-6">{t('relatedPosts')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <Link 
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
          >
            {post.featuredImage && (
              <div className="relative w-full h-40 overflow-hidden">
                <Image 
                  src={post.featuredImage} 
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-4">
              <h4 className="font-medium text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              
              <time className="text-xs text-muted-foreground">
                {new Date(post.publishedAt * 1000).toLocaleDateString()}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
