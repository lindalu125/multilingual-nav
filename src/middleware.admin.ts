import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'multilingual-nav-secret-key';

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = cookies().get('auth_token')?.value;
  
  // Check if the path is under /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Verify token
      const decoded = verify(token, JWT_SECRET) as any;
      
      // Check if user has admin role
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Continue with the request
      return NextResponse.next();
    } catch (err) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Continue with the request for non-admin paths
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
