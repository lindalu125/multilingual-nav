import { NextRequest } from 'next/server';
import { db } from '@/db';
import { tags } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = db.select().from(tags).where(eq(tags.locale, locale));

    if (search) {
      query = query.where(
        like(tags.name, `%${search}%`)
      );
    }

    // Count total before applying pagination
    const countQuery = db.select({ count: db.fn.count() }).from(query.as('subquery'));
    const [{ count }] = await countQuery;
    
    // Apply pagination
    const tagsData = await query.limit(limit).offset(offset);

    return Response.json({ 
      tags: tagsData, 
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit)
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
