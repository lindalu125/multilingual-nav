import { NextRequest } from 'next/server';
import { db } from '@/db';
import { posts, categories, tags, postCategories, postTags } from '@/db/schema';
// 1. 确保导入了所有需要的函数
import { eq, like, and, desc, inArray, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const tagId = searchParams.get('tagId');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published';
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 2. 创建一个条件数组，并加入第一个必要条件
    const conditions = [eq(posts.locale, locale)];

    // 3. 根据参数，向数组里动态添加条件
    if (status !== 'all') {
      conditions.push(eq(posts.status, status));
    }

    if (search) {
      conditions.push(like(posts.title, `%${search}%`));
    }

    if (categoryId) {
      const postsInCategory = await db
        .select({ postId: postCategories.postId })
        .from(postCategories)
        .where(eq(postCategories.categoryId, parseInt(categoryId)));
      
      const postIds = postsInCategory.map(p => p.postId);
      
      if (postIds.length > 0) {
        conditions.push(inArray(posts.id, postIds));
      } else {
        // 如果这个分类下没有文章，直接返回空结果
        return Response.json({ posts: [], total: 0, page, limit, totalPages: 0 });
      }
    }

    if (tagId) {
      const postsWithTag = await db
        .select({ postId: postTags.postId })
        .from(postTags)
        .where(eq(postTags.tagId, parseInt(tagId)));
      
      const postIds = postsWithTag.map(p => p.postId);
      
      if (postIds.length > 0) {
        conditions.push(inArray(posts.id, postIds));
      } else {
        // 如果这个标签下没有文章，直接返回空结果
        return Response.json({ posts: [], total: 0, page, limit, totalPages: 0 });
      }
    }
    
    // 4. 使用 and() 函数组合所有条件，构建最终查询
    // 查询总数
    const totalResult = await db.select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(and(...conditions));
    const total = totalResult[0].count;
    
    // 查询分页后的数据
    const postsData = await db.select()
        .from(posts)
        .where(and(...conditions))
        .orderBy(desc(posts.publishedAt))
        .limit(limit)
        .offset(offset);

    // (这部分获取关联关系的代码保持不变)
    const postsWithRelations = await Promise.all(
      postsData.map(async (post) => {
        const postCats = await db
          .select({ category: categories })
          .from(postCategories)
          .innerJoin(categories, eq(categories.id, postCategories.categoryId))
          .where(eq(postCategories.postId, post.id));

        const postTgs = await db
          .select({ tag: tags })
          .from(postTags)
          .innerJoin(tags, eq(tags.id, postTags.tagId))
          .where(eq(postTags.postId, post.id));

        return {
          ...post,
          categories: postCats.map(pc => pc.category),
          tags: postTgs.map(pt => pt.tag)
        };
      })
    );

    return Response.json({ 
      posts: postsWithRelations, 
      total: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST 函数保持不变，这里省略...
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create slug from title if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Check if slug already exists
    const existingPost = await db.select()
      .from(posts)
      .where(eq(posts.slug, data.slug))
      .limit(1);
    
    if (existingPost.length > 0) {
      return Response.json({ error: 'Post with this slug already exists' }, { status: 400 });
    }
    
    // Set published date if status is published
    let publishedAt: number | null = null;
    if (data.status === 'published') {
      publishedAt = Math.floor(Date.now() / 1000);
    }
    
    // Insert post
    const [newPost] = await db.insert(posts).values({
      title: data.title,
      slug: data.slug,
      content: data.content || '',
      excerpt: data.excerpt || '',
      featuredImage: data.featuredImage || '',
      pageType: data.pageType || 'markdown',
      status: data.status || 'draft',
      locale: data.locale,
      isSticky: data.isSticky || false,
      publishedAt: publishedAt,
    }).returning();
    
    // Add categories if provided
    if (data.categories && data.categories.length > 0) {
      await db.insert(postCategories).values(
        data.categories.map((categoryId: number) => ({
          postId: newPost.id,
          categoryId,
        }))
      );
    }
    
    // Add tags if provided
    if (data.tags && data.tags.length > 0) {
      await db.insert(postTags).values(
        data.tags.map((tagId: number) => ({
          postId: newPost.id,
          tagId,
        }))
      );
    }
    
    return Response.json({ post: newPost, success: true });
  } catch (error) {
    console.error('Error creating post:', error);
    return Response.json({ error: 'Failed to create post' }, { status: 500 });
  }
}