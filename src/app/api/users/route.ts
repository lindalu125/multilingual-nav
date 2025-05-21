import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      avatar: users.avatar,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    }).from(users);

    if (search) {
      query = query.where(
        like(users.name, `%${search}%`)
      );
    }

    if (role) {
      query = query.where(eq(users.role, role));
    }

    // Count total before applying pagination
    const countQuery = db.select({ count: db.fn.count() }).from(query.as('subquery'));
    const [{ count }] = await countQuery;
    
    // Apply pagination
    const usersData = await query.limit(limit).offset(offset);

    return Response.json({ 
      users: usersData, 
      total: Number(count),
      page,
      limit,
      totalPages: Math.ceil(Number(count) / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

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
