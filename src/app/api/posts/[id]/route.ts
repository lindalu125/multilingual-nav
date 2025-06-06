// 这是正确的 DELETE 函数
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    // Delete post categories and tags first (cascade doesn't work with SQLite)
    await db.delete(postCategories).where(eq(postCategories.postId, id));
    await db.delete(postTags).where(eq(postTags.postId, id));
    
    // Delete the post
    const [deletedPost] = await db.delete(posts)
      .where(eq(posts.id, id))
      .returning();
    
    if (!deletedPost) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    // 确保这一行是完整的
    return Response.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}