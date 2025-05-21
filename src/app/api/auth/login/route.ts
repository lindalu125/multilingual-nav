import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'multilingual-nav-secret-key';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.email || !data.password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Find user by email
    const user = await db.select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);
    
    if (user.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Check if user is active
    if (!user[0].isActive) {
      return Response.json({ error: 'Account is inactive' }, { status: 403 });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user[0].password);
    
    if (!isPasswordValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Create JWT token
    const token = sign(
      { 
        id: user[0].id, 
        email: user[0].email,
        name: user[0].name,
        role: user[0].role
      }, 
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    return Response.json({ 
      success: true,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
        avatar: user[0].avatar
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}
