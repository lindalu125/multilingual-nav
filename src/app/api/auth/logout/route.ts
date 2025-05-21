import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Clear auth cookie
    cookies().delete('auth_token');
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error during logout:', error);
    return Response.json({ error: 'Logout failed' }, { status: 500 });
  }
}
