import { NextRequest } from 'next/server';
import { db } from '@/db';
import { tools, toolCategories, toolTags } from '@/db/schema';
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
    
    const tool = await db.query.tools.findFirst({
      where: eq(tools.id, id),
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
    
    if (!tool) {
      return Response.json({ error: 'Tool not found' }, { status: 404 });
    }
    
    return Response.json({ tool });
  } catch (error) {
    console.error('Error fetching tool:', error);
    return Response.json({ error: 'Failed to fetch tool' }, { status: 500 });
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
    if (!data.name || !data.url || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Update tool
    const [updatedTool] = await db.update(tools)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        url: data.url,
        favicon: data.favicon || '',
        isPick: data.isPick || false,
        locale: data.locale,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      .where(eq(tools.id, id))
      .returning();
    
    if (!updatedTool) {
      return Response.json({ error: 'Tool not found' }, { status: 404 });
    }
    
    // Update categories if provided
    if (data.categories) {
      // Delete existing categories
      await db.delete(toolCategories).where(eq(toolCategories.toolId, id));
      
      // Add new categories
      if (data.categories.length > 0) {
        await db.insert(toolCategories).values(
          data.categories.map((categoryId: number) => ({
            toolId: id,
            categoryId,
          }))
        );
      }
    }
    
    // Update tags if provided
    if (data.tags) {
      // Delete existing tags
      await db.delete(toolTags).where(eq(toolTags.toolId, id));
      
      // Add new tags
      if (data.tags.length > 0) {
        await db.insert(toolTags).values(
          data.tags.map((tagId: number) => ({
            toolId: id,
            tagId,
          }))
        );
      }
    }
    
    return Response.json({ tool: updatedTool, success: true });
  } catch (error) {
    console.error('Error updating tool:', error);
    return Response.json({ error: 'Failed to update tool' }, { status: 500 });
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
    
    // Delete tool categories and tags first (cascade doesn't work with SQLite)
    await db.delete(toolCategories).where(eq(toolCategories.toolId, id));
    await db.delete(toolTags).where(eq(toolTags.toolId, id));
    
    // Delete the tool
    const [deletedTool] = await db.delete(tools)
      .where(eq(tools.id, id))
      .returning();
    
    if (!deletedTool) {
      return Response.json({ error: 'Tool not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting tool:', error);
    return Response.json({ error: 'Failed to delete tool' }, { status: 500 });
  }
}
