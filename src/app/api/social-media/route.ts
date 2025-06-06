import { NextRequest } from 'next/server';
import { db } from '@/db';
import { socialMedia } from '@/db/schema';
// 1. 确保导入了所有需要的函数
import { eq, like, sql, asc } from 'drizzle-orm';

// 2. 替换整个 GET 函数
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let socialLinks;

    if (search) {
      // 如果有搜索词，构建带 where 的查询
      socialLinks = await db.select()
        .from(socialMedia)
        .where(like(socialMedia.name, `%${search}%`))
        .orderBy(asc(socialMedia.order));
    } else {
      // 如果没有搜索词，构建不带 where 的查询
      socialLinks = await db.select()
        .from(socialMedia)
        .orderBy(asc(socialMedia.order));
    }

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
      .select({ maxOrder: sql<number>`max(${socialMedia.order})` })
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