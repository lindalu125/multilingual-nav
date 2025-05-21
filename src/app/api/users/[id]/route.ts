import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const user = await db.select({
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
    .where(eq(users.id, id))
    .limit(1);
    
    if (user.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    return Response.json({ user: user[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 });
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
    if (!data.name || !data.email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if email already exists (if changed)
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, data.email))
      .where(eq(users.id, id).not())
      .limit(1);
    
    if (existingUser.length > 0) {
      return Response.json({ error: 'User with this email already exists' }, { status: 400 });
    }
    
    // Prepare update data
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role || 'user',
      avatar: data.avatar || '',
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    
    // Update password if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    // Update user
    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatar: users.avatar,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      });
    
    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    return Response.json({ user: updatedUser, success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json({ error: 'Failed to update user' }, { status: 500 });
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
    
    // Delete the user
    const [deletedUser] = await db.delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id
      });
    
    if (!deletedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
