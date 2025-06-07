import { NextRequest } from 'next/server';
import { db } from '@/db';
import { navMenu } from '@/db/schema';
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
    
    const menuItem = await db.select()
      .from(navMenu)
      .where(eq(navMenu.id, id))
      .limit(1);
    
    if (menuItem.length === 0) {
      return Response.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    return Response.json({ menuItem: menuItem[0] });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return Response.json({ error: 'Failed to fetch menu item' }, { status: 500 });
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
    if (!data.title || !data.link || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check for circular reference
    if (data.parentId && data.parentId === id) {
      return Response.json({ error: 'Menu item cannot be its own parent' }, { status: 400 });
    }
    
    // Update menu item
    const [updatedMenuItem] = await db.update(navMenu)
      .set({
        parentId: data.parentId || null,
        title: data.title,
        link: data.link,
        icon: data.icon || null,
        locale: data.locale,
        order: data.order,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      .where(eq(navMenu.id, id))
      .returning();
    
    if (!updatedMenuItem) {
      return Response.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    return Response.json({ menuItem: updatedMenuItem, success: true });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return Response.json({ error: 'Failed to update menu item' }, { status: 500 });
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
    
    // Check if there are children
    const children = await db.select()
      .from(navMenu)
      .where(eq(navMenu.parentId, id));
    
    if (children.length > 0) {
      return Response.json({ 
        error: 'Cannot delete menu item with children. Please delete or reassign children first.',
        children
      }, { status: 400 });
    }
    
    // Delete the menu item
    const [deletedMenuItem] = await db.delete(navMenu)
      .where(eq(navMenu.id, id))
      .returning();
    
    if (!deletedMenuItem) {
      return Response.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return Response.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}