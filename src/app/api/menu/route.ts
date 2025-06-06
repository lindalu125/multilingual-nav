// 请用这个完整的、正确的 POST 函数进行替换
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
    }).returning(); // <--- 确保这一行 .returning() 存在
    
    return Response.json({ menuItem: newMenuItem, success: true });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return Response.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}