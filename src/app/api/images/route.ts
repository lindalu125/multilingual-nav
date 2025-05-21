import { NextResponse } from 'next/server';
import { listFilesInR2 } from '@/lib/r2-utils';
import { r2Client, BUCKET_NAME } from '@/lib/r2';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET(request: Request) {
  try {
    // Get the prefix from query params (default to blog/images/)
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || 'blog/images/';
    
    // List files in R2
    const keys = await listFilesInR2(prefix);
    
    // Generate public URLs for each file
    const images = keys.map(key => ({
      url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`,
      key,
      name: key.split('/').pop(),
    }));
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}
