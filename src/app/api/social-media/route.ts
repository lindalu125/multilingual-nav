import { NextRequest } from 'next/server';
import { db } from '@/db';
import { socialMedia } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let query = db.select().from(socialMedia);

    if (search) {
      query = query.where(
        like(socialMedia.name, `%${search}%`)
      );
    }
    
    // Order by the order field
    query = query.orderBy(socialMedia.order);
    
    const socialLinks = await query;

    return Response.json({ socialLinks });
  } catch (error) {
    console.error('Error fetching social links:', error);
    return Response.json({ error: 'Failed to fetch social links' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.url || !data.icon) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get max order to append at the end
    const maxOrderResult = await db
      .select({ maxOrder: db.fn.max(socialMedia.order) })
      .from(socialMedia);
    
    const maxOrder = maxOrderResult[0].maxOrder || 0;
    
    // Insert social link
    const [newSocialLink] = await db.insert(socialMedia).values({
      name: data.name,
      url: data.url,
      icon: data.icon,
      order: data.order !== undefined ? data.order : maxOrder + 1,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning();
    
    return Response.json({ socialLink: newSocialLink, success: true });
  } catch (error) {
    console.error('Error creating social link:', error);
    return Response.json({ error: 'Failed to create social link' }, { status: 500 });
  }
}
