import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'multilingual-nav-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return Response.json({ authenticated: false });
    }
    
    // Verify token
    try {
      const decoded = verify(token, JWT_SECRET);
      return Response.json({ 
        authenticated: true,
        user: decoded
      });
    } catch (err) {
      // Token is invalid or expired
      cookies().delete('auth_token');
      return Response.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return Response.json({ error: 'Authentication check failed' }, { status: 500 });
  }
}
