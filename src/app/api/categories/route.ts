import { NextRequest } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = db.select().from(categories).where(eq(categories.locale, locale));

    if (search) {
      query = query.where(
        like(categories.name, `%${search}%`)
      );
    }

    // Count total before applying pagination
    const countQuery = db.select({ count: db.fn.count() }).from(query.as('subquery'));
    const [{ count }] = await countQuery;
    
    // Apply pagination
    const categoriesData = await query.limit(limit).offset(offset);

    return Response.json({ 
      categories: categoriesData, 
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
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
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.slug, data.slug))
      .limit(1);
    
    if (existingCategory.length > 0) {
      return Response.json({ error: 'Category with this slug already exists' }, { status: 400 });
    }
    
    // Insert category
    const [newCategory] = await db.insert(categories).values({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      icon: data.icon || '',
      locale: data.locale,
      order: data.order || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning();
    
    return Response.json({ category: newCategory, success: true });
  } catch (error) {
    console.error('Error creating category:', error);
    return Response.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
