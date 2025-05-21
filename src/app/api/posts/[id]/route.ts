import { NextRequest } from 'next/server';
import { db } from '@/db';
import { posts, postCategories, postTags } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        categories: {
          with: {
            category: true
          }
        },
        tags: {
          with: {
            tag: true
          }
        }
      }
    });
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return Response.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if slug already exists (if changed)
    if (data.slug) {
      const existingPost = await db.select()
        .from(posts)
        .where(eq(posts.slug, data.slug))
        .where(eq(posts.id, id).not())
        .limit(1);
      
      if (existingPost.length > 0) {
        return Response.json({ error: 'Post with this slug already exists' }, { status: 400 });
      }
    }
    
    // Set published date if status is changing to published
    let updateData: any = {
      title: data.title,
      slug: data.slug,
      content: data.content || '',
      excerpt: data.excerpt || '',
      featuredImage: data.featuredImage || '',
      pageType: data.pageType || 'markdown',
      status: data.status || 'draft',
      locale: data.locale,
      isSticky: data.isSticky || false,
    };
    
    // If status is changing to published and there's no published date yet
    if (data.status === 'published') {
      const currentPost = await db.select({ status: posts.status, publishedAt: posts.publishedAt })
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1);
      
      if (currentPost.length > 0 && 
          (currentPost[0].status !== 'published' || !currentPost[0].publishedAt)) {
        updateData.publishedAt = Math.floor(Date.now() / 1000);
      }
    }
    
    // Update post
    const [updatedPost] = await db.update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();
    
    if (!updatedPost) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Update categories if provided
    if (data.categories) {
      // Delete existing categories
      await db.delete(postCategories).where(eq(postCategories.postId, id));
      
      // Add new categories
      if (data.categories.length > 0) {
        await db.insert(postCategories).values(
          data.categories.map((categoryId: number) => ({
            postId: id,
            categoryId,
          }))
        );
      }
    }
    
    // Update tags if provided
    if (data.tags) {
      // Delete existing tags
      await db.delete(postTags).where(eq(postTags.postId, id));
      
      // Add new tags
      if (data.tags.length > 0) {
        await db.insert(postTags).values(
          data.tags.map((tagId: number) => ({
            postId: id,
            tagId,
          }))
        );
      }
    }
    
    return Response.json({ post: updatedPost, success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return Response.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    // Delete post categories and tags first (cascade doesn't work with SQLite)
    await db.delete(postCategories).where(eq(postCategories.postId, id));
    await db.delete(postTags).where(eq(postTags.postId, id));
    
    // Delete the post
    const [deletedPost] = await db.delete(posts)
      .where(eq(posts.id, id))
      .returning();
    
    if (!deletedPost) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
