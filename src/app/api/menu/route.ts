import { NextRequest } from 'next/server';
import { db } from '@/db';
import { navMenu } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const menuItems = await db.select()
      .from(navMenu)
      .where(eq(navMenu.locale, locale))
      .orderBy(navMenu.order);
    
    // Organize into hierarchical structure
    const menuTree = buildMenuTree(menuItems);
    
    return Response.json({ menu: menuItems, menuTree });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return Response.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.link || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get max order to append at the end
    const maxOrderResult = await db
      .select({ maxOrder: db.fn.max(navMenu.order) })
      .from(navMenu)
      .where(eq(navMenu.locale, data.locale));
    
    const maxOrder = maxOrderResult[0].maxOrder || 0;
    
    // Insert menu item
    const [newMenuItem] = await db.insert(navMenu).values({
      parentId: data.parentId || null,
      title: data.title,
      link: data.link,
      icon: data.icon || null,
      locale: data.locale,
      order: data.order !== undefined ? data.order : maxOrder + 1,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning();
    
    return Response.json({ menuItem: newMenuItem, success: true });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return Response.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

// Helper function to build menu tree
function buildMenuTree(items: any[]) {
  const itemMap = new Map();
  const roots: any[] = [];
  
  // First pass: create a map of all items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });
  
  // Second pass: build the tree
  items.forEach(item => {
    if (item.parentId === null) {
      roots.push(itemMap.get(item.id));
    } else {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(itemMap.get(item.id));
      }
    }
  });
  
  return roots;
}
