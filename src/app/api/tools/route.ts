import { NextRequest } from 'next/server';
import { db } from '@/db';
import { tools, categories, tags, toolCategories, toolTags } from '@/db/schema';
// 1. 确保导入了所有需要的函数
import { eq, like, and, sql, inArray } from 'drizzle-orm';

// 2. 替换整个 GET 函数
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const tagId = searchParams.get('tagId');
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 创建一个条件数组
    const conditions = [eq(tools.locale, locale)];

    // 动态添加条件
    if (search) {
      conditions.push(like(tools.name, `%${search}%`));
    }

    if (categoryId) {
      const toolsInCategory = await db
        .select({ toolId: toolCategories.toolId })
        .from(toolCategories)
        .where(eq(toolCategories.categoryId, parseInt(categoryId)));
      
      const toolIds = toolsInCategory.map(t => t.toolId);
      
      if (toolIds.length > 0) {
        conditions.push(inArray(tools.id, toolIds));
      } else {
        return Response.json({ tools: [], total: 0, page, limit, totalPages: 0 });
      }
    }

    if (tagId) {
      const toolsWithTag = await db
        .select({ toolId: toolTags.toolId })
        .from(toolTags)
        .where(eq(toolTags.tagId, parseInt(tagId)));
      
      const toolIds = toolsWithTag.map(t => t.toolId);
      
      if (toolIds.length > 0) {
        conditions.push(inArray(tools.id, toolIds));
      } else {
        return Response.json({ tools: [], total: 0, page, limit, totalPages: 0 });
      }
    }

    // 使用组合后的条件查询总数
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(tools)
      .where(and(...conditions));
    const total = totalResult[0].count;

    // 使用组合后的条件查询分页数据
    const toolsData = await db.select()
      .from(tools)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    // (这部分获取关联关系的代码保持不变)
    const toolsWithRelations = await Promise.all(
      toolsData.map(async (tool) => {
        const toolCats = await db
          .select({ category: categories })
          .from(toolCategories)
          .innerJoin(categories, eq(categories.id, toolCategories.categoryId))
          .where(eq(toolCategories.toolId, tool.id));

        const toolTgs = await db
          .select({ tag: tags })
          .from(toolTags)
          .innerJoin(tags, eq(tags.id, toolTags.tagId))
          .where(eq(toolTags.toolId, tool.id));

        return {
          ...tool,
          categories: toolCats.map(tc => tc.category),
          tags: toolTgs.map(tt => tt.tag)
        };
      })
    );

    return Response.json({ 
      tools: toolsWithRelations, 
      total: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return Response.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}

// POST 函数保持不变，这里省略...
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.url || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create slug from name if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Insert tool
    const [newTool] = await db.insert(tools).values({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      url: data.url,
      favicon: data.favicon || '',
      isPick: data.isPick || false,
      locale: data.locale,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning();
    
    // Add categories if provided
    if (data.categories && data.categories.length > 0) {
      await db.insert(toolCategories).values(
        data.categories.map((categoryId: number) => ({
          toolId: newTool.id,
          categoryId,
        }))
      );
    }
    
    // Add tags if provided
    if (data.tags && data.tags.length > 0) {
      await db.insert(toolTags).values(
        data.tags.map((tagId: number) => ({
          toolId: newTool.id,
          tagId,
        }))
      );
    }
    
    return Response.json({ tool: newTool, success: true });
  } catch (error) {
    console.error('Error creating tool:', error);
    return Response.json({ error: 'Failed to create tool' }, { status: 500 });
  }
}