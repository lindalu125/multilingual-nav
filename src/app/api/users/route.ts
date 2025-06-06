import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
// 1. 确保导入了所有需要的函数
import { eq, like, and, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// 2. 替换整个 GET 函数
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 创建一个条件数组
    const conditions = [];

    // 动态添加条件
    if (search) {
      conditions.push(like(users.name, `%${search}%`));
    }
    if (role) {
      conditions.push(eq(users.role, role));
    }

    // 如果有条件，则组合它们，否则 whereClause 为 undefined
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 使用组合后的条件查询总数
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause);
    const total = totalResult[0].count;

    // 使用组合后的条件查询分页数据
    const usersData = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatar: users.avatar,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    return Response.json({ 
      users: usersData, 
      total: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST 函数保持不变，这里省略...
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if email already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return Response.json({ error: 'User with this email already exists' }, { status: 400 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Insert user
    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user',
      avatar: data.avatar || '',
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      avatar: users.avatar,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    });
    
    return Response.json({ user: newUser, success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}