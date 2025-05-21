import { NextRequest } from 'next/server';
import { db } from '@/db';
import { socialMedia } from '@/db/schema';
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
    
    const socialLink = await db.select()
      .from(socialMedia)
      .where(eq(socialMedia.id, id))
      .limit(1);
    
    if (socialLink.length === 0) {
      return Response.json({ error: 'Social link not found' }, { status: 404 });
    }
    
    return Response.json({ socialLink: socialLink[0] });
  } catch (error) {
    console.error('Error fetching social link:', error);
    return Response.json({ error: 'Failed to fetch social link' }, { status: 500 });
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
    if (!data.name || !data.url || !data.icon) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Update social link
    const [updatedSocialLink] = await db.update(socialMedia)
      .set({
        name: data.name,
        url: data.url,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      .where(eq(socialMedia.id, id))
      .returning();
    
    if (!updatedSocialLink) {
      return Response.json({ error: 'Social link not found' }, { status: 404 });
    }
    
    return Response.json({ socialLink: updatedSocialLink, success: true });
  } catch (error) {
    console.error('Error updating social link:', error);
    return Response.json({ error: 'Failed to update social link' }, { status: 500 });
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
    
    // Delete the social link
    const [deletedSocialLink] = await db.delete(socialMedia)
      .where(eq(socialMedia.id, id))
      .returning();
    
    if (!deletedSocialLink) {
      return Response.json({ error: 'Social link not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting social link:', error);
    return Response.json({ error: 'Failed to delete social link' }, { status: 500 });
  }
}
