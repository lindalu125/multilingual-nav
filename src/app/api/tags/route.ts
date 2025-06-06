import { NextRequest } from 'next/server';
import { db } from '@/db';
import { tags } from '@/db/schema';
// 1. 确保导入了所有需要的函数
import { eq, like, and, sql } from 'drizzle-orm';

// 2. 替换整个 GET 函数
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 创建一个条件数组
    const conditions = [eq(tags.locale, locale)];

    // 动态添加条件
    if (search) {
      conditions.push(like(tags.name, `%${search}%`));
    }

    // 使用组合后的条件查询总数
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(tags)
      .where(and(...conditions));
    const total = totalResult[0].count;

    // 使用组合后的条件查询分页数据
    const tagsData = await db.select()
      .from(tags)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    return Response.json({ 
      tags: tagsData, 
      total: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return Response.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create slug from name if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Check if slug already exists
    const existingTag = await db.select()
      .from(tags)
      .where(eq(tags.slug, data.slug))
      .limit(1);
    
    if (existingTag.length > 0) {
      return Response.json({ error: 'Tag with this slug already exists' }, { status: 400 });
    }
    
    // Insert tag
    const [newTag] = await db.insert(tags).values({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      locale: data.locale,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning();
    
    return Response.json({ tag: newTag, success: true });
  } catch (error) {
    console.error('Error creating tag:', error);
    return Response.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}