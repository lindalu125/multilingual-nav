import { FC, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadToR2, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/r2-utils';
import ImageUploader from '@/components/blog/ImageUploader';
import { useSupabase } from '@/components/auth/SupabaseProvider';
import { useRouter } from 'next/navigation';

interface BlogPostEditorProps {
  locale: string;
  postId?: string; // If provided, we're editing an existing post
}

const BlogPostEditor: FC<BlogPostEditorProps> = ({ locale, postId }) => {
  const t = useTranslations('admin.posts');
  const { user } = useSupabase();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // Fetch post data if editing
  useState(() => {
    if (postId) {
      // TODO: Fetch post data from API
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      // Validate required fields
      if (!title || !content || !featuredImage) {
        throw new Error('Title, content, and featured image are required');
      }
      
      // Create or update post
      const endpoint = postId 
        ? `/api/posts/${postId}` 
        : '/api/posts';
      
      const method = postId ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          featured_image: featuredImage,
          categories,
          tags,
          is_published: isPublished,
          locale,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error saving post');
      }
      
      setMessage(postId ? t('update_success') : t('create_success'));
      
      // Redirect to post list after a delay
      setTimeout(() => {
        router.push(`/${locale}/admin/posts`);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Error saving post');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUploaded = (imageUrl: string) => {
    setFeaturedImage(imageUrl);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {postId ? t('edit') : t('add')}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>Enter the details of your blog post</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea 
                  id="excerpt" 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categories">Categories (comma-separated)</Label>
                <Input 
                  id="categories" 
                  value={categories.join(',')}
                  onChange={(e) => setCategories(e.target.value.split(',').map(c => c.trim()))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input 
                  id="tags" 
                  value={tags.join(',')}
                  onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isPublished">Publish immediately</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <ImageUploader 
          onImageUploaded={handleImageUploaded}
          defaultImage={featuredImage}
          label="Featured Image"
          description="Upload a featured image for your blog post"
        />
        
        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}
        
        {message && (
          <div className="text-green-600 text-sm">{message}</div>
        )}
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => router.push(`/${locale}/admin/posts`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (postId ? 'Update Post' : 'Create Post')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostEditor;
