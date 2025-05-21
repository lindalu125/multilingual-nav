import React from 'react';
import { useTranslations } from 'next-intl';
import BlogPost from '@/components/blog/BlogPost';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogAuthor from '@/components/blog/BlogAuthor';
import BlogShare from '@/components/blog/BlogShare';
import BlogRelatedPosts from '@/components/blog/BlogRelatedPosts';
import CommentSection from '@/components/blog/CommentSection';
import BlogNewsletter from '@/components/blog/BlogNewsletter';

export default function BlogPostPage({ params }: { params: { locale: string, slug: string } }) {
  const t = useTranslations('Blog');
  
  // In a real implementation, you would fetch the post data from your API
  // This is just a placeholder for demonstration purposes
  const post = {
    id: 1,
    title: 'Getting Started with Next.js and Multilingual Support',
    slug: params.slug,
    excerpt: 'Learn how to build a multilingual website with Next.js and next-intl.',
    content: `<p>This is a sample blog post content. In a real implementation, this would be the full content of the blog post, formatted as HTML.</p>
              <p>You can include various HTML elements like paragraphs, headings, lists, code blocks, etc.</p>
              <h2>Section Heading</h2>
              <p>This is a section of the blog post. You can have multiple sections in a blog post.</p>
              <ul>
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
              </ul>
              <p>You can also include code blocks:</p>
              <pre><code>const greeting = 'Hello, World!';</code></pre>`,
    featuredImage: 'https://via.placeholder.com/1200x600',
    publishedAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
    author: {
      id: 1,
      name: 'John Doe',
      bio: 'Web developer and technical writer.',
      avatar: 'https://via.placeholder.com/80x80',
      socialLinks: [
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'github', url: 'https://github.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' },
      ],
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
  };
  
  // Sample related posts
  const relatedPosts = [
    {
      id: 2,
      title: 'Building a Blog with Next.js',
      slug: 'building-a-blog-with-nextjs',
      excerpt: 'Learn how to build a blog with Next.js and Markdown.',
      featuredImage: 'https://via.placeholder.com/400x300',
      publishedAt: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
    },
    {
      id: 3,
      title: 'Styling Your Next.js App with Tailwind CSS',
      slug: 'styling-your-nextjs-app-with-tailwind-css',
      excerpt: 'Learn how to use Tailwind CSS with Next.js.',
      featuredImage: 'https://via.placeholder.com/400x300',
      publishedAt: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
    },
    {
      id: 4,
      title: 'Server Components in Next.js',
      slug: 'server-components-in-nextjs',
      excerpt: 'Learn about Server Components in Next.js.',
      featuredImage: 'https://via.placeholder.com/400x300',
      publishedAt: Math.floor(Date.now() / 1000) - 345600, // 4 days ago
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
  const recentPosts = [
    {
      id: 2,
      title: 'Building a Blog with Next.js',
      slug: 'building-a-blog-with-nextjs',
      publishedAt: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
    },
    {
      id: 3,
      title: 'Styling Your Next.js App with Tailwind CSS',
      slug: 'styling-your-nextjs-app-with-tailwind-css',
      publishedAt: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
    },
    {
      id: 4,
      title: 'Server Components in Next.js',
      slug: 'server-components-in-nextjs',
      publishedAt: Math.floor(Date.now() / 1000) - 345600, // 4 days ago
    },
  ];
  
  // Sample comments
  const comments = [
    {
      id: 1,
      content: 'Great article! I learned a lot about Next.js and multilingual support.',
      createdAt: Math.floor(Date.now() / 1000) - 43200, // 12 hours ago
      author: {
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40x40',
      },
      replies: [
        {
          id: 2,
          content: 'Thanks for your comment! I\'m glad you found it helpful.',
          createdAt: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
          author: {
            name: 'John Doe',
            avatar: 'https://via.placeholder.com/40x40',
          },
        },
      ],
    },
    {
      id: 3,
      content: 'I\'ve been looking for a good tutorial on multilingual support in Next.js. This is exactly what I needed!',
      createdAt: Math.floor(Date.now() / 1000) - 64800, // 18 hours ago
      author: {
        name: 'Bob Johnson',
      },
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <BlogPost post={post} />
          
          <div className="mt-8">
            <BlogAuthor author={post.author} />
          </div>
          
          <BlogShare post={post} />
          
          <BlogRelatedPosts currentPostId={post.id} relatedPosts={relatedPosts} />
          
          <CommentSection postId={post.id} comments={comments} />
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
