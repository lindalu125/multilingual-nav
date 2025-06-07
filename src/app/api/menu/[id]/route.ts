// 请用这个完整的、正确的 PUT 函数进行替换
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
      .returning(); // <--- 确保这一行 .returning() 存在
    
    if (!updatedMenuItem) {
      return Response.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    return Response.json({ menuItem: updatedMenuItem, success: true });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return Response.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}