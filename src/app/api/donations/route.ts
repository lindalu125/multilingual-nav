import { NextRequest } from 'next/server';
import { db } from '@/db';
import { donationMethods } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const donationData = await db.select().from(donationMethods);
    
    return Response.json({ donationMethods: donationData });
  } catch (error) {
    console.error('Error fetching donation methods:', error);
    return Response.json({ error: 'Failed to fetch donation methods' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Insert donation method
    const [newDonationMethod] = await db.insert(donationMethods).values({
      name: data.name,
      type: data.type,
      qrCode: data.qrCode || null,
      url: data.url || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    }).returning();
    
    return Response.json({ donationMethod: newDonationMethod, success: true });
  } catch (error) {
    console.error('Error creating donation method:', error);
    return Response.json({ error: 'Failed to create donation method' }, { status: 500 });
  }
}
