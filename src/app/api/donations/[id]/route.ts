import { NextRequest } from 'next/server';
import { db } from '@/db';
import { donationMethods } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }
    
    const donationMethod = await db.select()
      .from(donationMethods)
      .where(eq(donationMethods.id, id))
      .limit(1);
    
    if (donationMethod.length === 0) {
      return Response.json({ error: 'Donation method not found' }, { status: 404 });
    }
    
    return Response.json({ donationMethod: donationMethod[0] });
  } catch (error) {
    console.error('Error fetching donation method:', error);
    return Response.json({ error: 'Failed to fetch donation method' }, { status: 500 });
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
    if (!data.name || !data.type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Update donation method
    const [updatedDonationMethod] = await db.update(donationMethods)
      .set({
        name: data.name,
        type: data.type,
        qrCode: data.qrCode || null,
        url: data.url || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
      .where(eq(donationMethods.id, id))
      .returning();
    
    if (!updatedDonationMethod) {
      return Response.json({ error: 'Donation method not found' }, { status: 404 });
    }
    
    return Response.json({ donationMethod: updatedDonationMethod, success: true });
  } catch (error) {
    console.error('Error updating donation method:', error);
    return Response.json({ error: 'Failed to update donation method' }, { status: 500 });
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
    
    // Delete the donation method
    const [deletedDonationMethod] = await db.delete(donationMethods)
      .where(eq(donationMethods.id, id))
      .returning();
    
    if (!deletedDonationMethod) {
      return Response.json({ error: 'Donation method not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting donation method:', error);
    return Response.json({ error: 'Failed to delete donation method' }, { status: 500 });
  }
}
