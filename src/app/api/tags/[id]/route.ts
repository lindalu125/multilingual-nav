import { NextRequest } from 'next/server';
import { db } from '@/db';
import { tags } from '@/db/schema';
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
    
    const tag = await db.query.tags.findFirst({
      where: eq(tags.id, id)
    });
    
    if (!tag) {
      return Response.json({ error: 'Tag not found' }, { status: 404 });
    }
    
    return Response.json({ tag });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return Response.json({ error: 'Failed to fetch tag' }, { status: 500 });
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
      const existingTag = await db.select()
        .from(tags)
        .where(eq(tags.slug, data.slug))
        .where(eq(tags.id, id).not())
        .limit(1);
      
      if (existingTag.length > 0) {
        return Response.json({ error: 'Tag with this slug already exists' }, { status: 400 });
      }
    }
    
    // Update tag
    const [updatedTag] = await db.update(tags)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        locale: data.locale,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      .where(eq(tags.id, id))
      .returning();
    
    if (!updatedTag) {
      return Response.json({ error: 'Tag not found' }, { status: 404 });
    }
    
    return Response.json({ tag: updatedTag, success: true });
  } catch (error) {
    console.error('Error updating tag:', error);
    return Response.json({ error: 'Failed to update tag' }, { status: 500 });
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
    
    // Delete the tag
    const [deletedTag] = await db.delete(tags)
      .where(eq(tags.id, id))
      .returning();
    
    if (!deletedTag) {
      return Response.json({ error: 'Tag not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return Response.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
