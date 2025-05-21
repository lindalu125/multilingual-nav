import React from 'react';
import { useTranslations } from 'next-intl';
import BlogList from '@/components/blog/BlogList';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogNewsletter from '@/components/blog/BlogNewsletter';

export default function BlogCategoryPage({ 
  params 
}: { 
  params: { locale: string, slug: string, page?: string } 
}) {
  const t = useTranslations('Blog');
  
  // In a real implementation, you would fetch the category and posts data from your API
  // This is just a placeholder for demonstration purposes
  const category = {
    id: 1,
    name: 'Next.js',
    slug: params.slug,
    description: 'Articles about Next.js framework and its features.',
  };
  
  // Sample posts for this category
  const posts = [
    {
      id: 1,
      title: 'Getting Started with Next.js and Multilingual Support',
      slug: 'getting-started-with-nextjs-and-multilingual-support',
      excerpt: 'Learn how to build a multilingual website with Next.js and next-intl.',
      content: 'Full content here...',
      featuredImage: 'https://via.placeholder.com/1200x600',
      publishedAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      author: {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/80x80',
      },
      categories: [
        { id: 1, name: 'Next.js', slug: 'nextjs' },
        { id: 2, name: 'Multilingual', slug: 'multilingual' },
      ],
      tags: [
        { id: 1, name: 'Next.js', slug: 'nextjs' },
        { id: 2, name: 'React', slug: 'react' },
        { id: 3, name: 'Internationalization', slug: 'i18n' },
      ],
    },
    {
      id: 2,
      title: 'Building a Blog with Next.js',
      slug: 'building-a-blog-with-nextjs',
      excerpt: 'Learn how to build a blog with Next.js and Markdown.',
      content: 'Full content here...',
      featuredImage: 'https://via.placeholder.com/1200x600',
      publishedAt: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
      author: {
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/80x80',
      },
      categories: [
        { id: 1, name: 'Next.js', slug: 'nextjs' },
      ],
      tags: [
        { id: 1, name: 'Next.js', slug: 'nextjs' },
        { id: 2, name: 'React', slug: 'react' },
      ],
    },
    {
      id: 4,
      title: 'Server Components in Next.js',
      slug: 'server-components-in-nextjs',
      excerpt: 'Learn about Server Components in Next.js.',
      content: 'Full content here...',
      featuredImage: 'https://via.placeholder.com/1200x600',
      publishedAt: Math.floor(Date.now() / 1000) - 345600, // 4 days ago
      author: {
        name: 'Alice Williams',
        avatar: 'https://via.placeholder.com/80x80',
      },
      categories: [
        { id: 1, name: 'Next.js', slug: 'nextjs' },
        { id: 3, name: 'React', slug: 'react' },
      ],
      tags: [
        { id: 1, name: 'Next.js', slug: 'nextjs' },
        { id: 2, name: 'React', slug: 'react' },
        { id: 5, name: 'TypeScript', slug: 'typescript' },
      ],
    },
  ];
  
  // Sample categories for sidebar
  const categories = [
    { id: 1, name: 'Next.js', slug: 'nextjs', count: 5 },
    { id: 2, name: 'Multilingual', slug: 'multilingual', count: 3 },
    { id: 3, name: 'React', slug: 'react', count: 8 },
    { id: 4, name: 'Tailwind CSS', slug: 'tailwind-css', count: 4 },
  ];
  
  // Sample tags for sidebar
  const tags = [
    { id: 1, name: 'Next.js', slug: 'nextjs', count: 5 },
    { id: 2, name: 'React', slug: 'react', count: 8 },
    { id: 3, name: 'Internationalization', slug: 'i18n', count: 3 },
    { id: 4, name: 'Tailwind CSS', slug: 'tailwind-css', count: 4 },
    { id: 5, name: 'TypeScript', slug: 'typescript', count: 6 },
  ];
  
  // Sample recent posts for sidebar
  const recentPosts = posts.slice(0, 3).map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    publishedAt: post.publishedAt,
  }));
  
  // Current page from params or default to 1
  const currentPage = params.page ? parseInt(params.page) : 1;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground mb-8">{category.description}</p>
          )}
          
          <BlogList 
            posts={posts} 
            showPagination={true}
            currentPage={currentPage}
            totalPages={2}
            baseUrl={`/${params.locale}/blog/category/${params.slug}`}
          />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4">
          <BlogSidebar 
            categories={categories}
            tags={tags}
            recentPosts={recentPosts}
          />
          
          <div className="mt-8">
            <BlogNewsletter locale={params.locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
