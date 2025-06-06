import { NextRequest } from 'next/server';
import { db } from '@/db';
import { userTools, userToolCategories, users } from '@/db/schema';
// 1. 确保导入了所有需要的函数
import { eq, like, and, sql, desc } from 'drizzle-orm';

// 2. 替换整个 GET 函数
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 创建一个条件数组
    const conditions = [eq(userTools.locale, locale)];

    // 动态添加条件
    if (status !== 'all') {
      conditions.push(eq(userTools.status, status));
    }

    if (search) {
      conditions.push(like(userTools.name, `%${search}%`));
    }

    // 使用组合后的条件查询总数
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(userTools)
      .where(and(...conditions));
    const total = totalResult[0].count;
    
    // 使用组合后的条件查询分页数据
    const submissionsData = await db.select()
      .from(userTools)
      .where(and(...conditions))
      .orderBy(desc(userTools.createdAt))
      .limit(limit)
      .offset(offset);

    // (这部分获取关联关系的代码保持不变)
    const submissionsWithRelations = await Promise.all(
      submissionsData.map(async (submission) => {
        let user = null;
        if (submission.userId) {
          user = await db.query.users.findFirst({
            where: eq(users.id, submission.userId),
            columns: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          });
        }

        let reviewer = null;
        if (submission.reviewedBy) {
          reviewer = await db.query.users.findFirst({
            where: eq(users.id, submission.reviewedBy),
            columns: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          });
        }

        const categoriesData = await db.query.userToolCategories.findMany({
          where: eq(userToolCategories.userToolId, submission.id),
          with: {
            category: true
          }
        });

        return {
          ...submission,
          user,
          reviewer,
          categories: categoriesData.map(c => c.category)
        };
      })
    );

    return Response.json({ 
      submissions: submissionsWithRelations, 
      total: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return Response.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.url || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Insert submission
    const [newSubmission] = await db.insert(userTools).values({
      userId: data.userId || null,
      name: data.name,
      description: data.description || '',
      url: data.url,
      status: 'pending',
      locale: data.locale,
    }).returning();
    
    // Add categories if provided
    if (data.categories && data.categories.length > 0) {
      await db.insert(userToolCategories).values(
        data.categories.map((categoryId: number) => ({
          userToolId: newSubmission.id,
          categoryId,
        }))
      );
    }
    
    return Response.json({ submission: newSubmission, success: true });
  } catch (error) {
    console.error('Error creating submission:', error);
    return Response.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}