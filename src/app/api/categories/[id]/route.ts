import { NextRequest } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, and, not } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, id)
    });
    
    if (!category) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return Response.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return Response.json({ error: 'Failed to fetch category' }, { status: 500 });
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
    if (!data.name || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if slug already exists (if changed)
    if (data.slug) {
      // 修改后的正确代码
  const existingCategory = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
        and(
            eq(categories.slug, data.slug),
            not(eq(categories.id, id))
        )
    )
    .limit(1);
      
      if (existingCategory.length > 0) {
        return Response.json({ error: 'Category with this slug already exists' }, { status: 400 });
      }
    }
    
    // Update category
    const [updatedCategory] = await db.update(categories)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        icon: data.icon || '',
        locale: data.locale,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      .where(eq(categories.id, id))
      .returning();
    
    if (!updatedCategory) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return Response.json({ category: updatedCategory, success: true });
  } catch (error) {
    console.error('Error updating category:', error);
    return Response.json({ error: 'Failed to update category' }, { status: 500 });
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
    
    // Delete the category
    const [deletedCategory] = await db.delete(categories)
      .where(eq(categories.id, id))
      .returning();
    
    if (!deletedCategory) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return Response.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
