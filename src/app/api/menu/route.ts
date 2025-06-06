import { NextRequest } from 'next/server';
import { db } from '@/db';
import { navMenu } from '@/db/schema';
// 1. 确保导入了所有需要的函数
import { eq, sql, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const menuItems = await db.select()
      .from(navMenu)
      .where(eq(navMenu.locale, locale))
      .orderBy(asc(navMenu.order));

    return Response.json({ menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return Response.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

// 2. 替换整个 POST 函数
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get max order to append at the end
    const maxOrderResult = await db
      .select({ maxOrder: sql<number>`max(${navMenu.order})` })
      .from(navMenu)
      .where(eq(navMenu.locale, data.locale));
    
    const maxOrder = maxOrderResult[0].maxOrder || 0;
    
    // Insert menu item
    const [newMenuItem] = await db.insert(navMenu).values({
      title: data.title,
      url: data.url,
      parentId: data.parentId || null,
      order: data.order !== undefined ? data.order : maxOrder + 1,
      locale: data.locale,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning();
    
    return Response.json({ menuItem: newMenuItem, success: true });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return Response.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}