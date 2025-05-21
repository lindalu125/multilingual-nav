import { NextRequest } from 'next/server';
import { db } from '@/db';
import { userTools, userToolCategories } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = db.select().from(userTools).where(eq(userTools.locale, locale));

    if (status !== 'all') {
      query = query.where(eq(userTools.status, status));
    }

    if (search) {
      query = query.where(
        like(userTools.name, `%${search}%`)
      );
    }

    // Count total before applying pagination
    const countQuery = db.select({ count: db.fn.count() }).from(query.as('subquery'));
    const [{ count }] = await countQuery;
    
    // Apply pagination
    const submissionsData = await query.limit(limit).offset(offset);

    // Get user and reviewer details
    const submissionsWithRelations = await Promise.all(
      submissionsData.map(async (submission) => {
        // Get user details
        let user = null;
        if (submission.userId) {
          const userData = await db.query.users.findFirst({
            where: eq(db.schema.users.id, submission.userId),
            columns: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          });
          user = userData;
        }

        // Get reviewer details
        let reviewer = null;
        if (submission.reviewedBy) {
          const reviewerData = await db.query.users.findFirst({
            where: eq(db.schema.users.id, submission.reviewedBy),
            columns: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          });
          reviewer = reviewerData;
        }

        // Get categories
        const categories = await db.query.userToolCategories.findMany({
          where: eq(userToolCategories.userToolId, submission.id),
          with: {
            category: true
          }
        });

        return {
          ...submission,
          user,
          reviewer,
          categories: categories.map(c => c.category)
        };
      })
    );

    return Response.json({ 
      submissions: submissionsWithRelations, 
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit)
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
