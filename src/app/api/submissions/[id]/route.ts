import { NextRequest } from 'next/server';
import { db } from '@/db';
import { userTools, userToolCategories, tools } from '@/db/schema';
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
    
    const submission = await db.query.userTools.findFirst({
      where: eq(userTools.id, id),
      with: {
        categories: {
          with: {
            category: true
          }
        }
      }
    });
    
    if (!submission) {
      return Response.json({ error: 'Submission not found' }, { status: 404 });
    }
    
    // Get user and reviewer details
    let user = null;
    if (submission.userId) {
      user = await db.query.users.findFirst({
        where: eq(db.schema.users.id, submission.userId),
        columns: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      });
    }
    
    let reviewer = null;
    if (submission.reviewedBy) {
      reviewer = await db.query.users.findFirst({
        where: eq(db.schema.users.id, submission.reviewedBy),
        columns: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      });
    }
    
    return Response.json({ 
      submission: {
        ...submission,
        user,
        reviewer
      } 
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return Response.json({ error: 'Failed to fetch submission' }, { status: 500 });
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
    
    // Update submission
    const [updatedSubmission] = await db.update(userTools)
      .set({
        name: data.name,
        description: data.description,
        url: data.url,
        status: data.status,
        reviewedBy: data.reviewedBy,
        reviewNote: data.reviewNote,
      })
      .where(eq(userTools.id, id))
      .returning();
    
    if (!updatedSubmission) {
      return Response.json({ error: 'Submission not found' }, { status: 404 });
    }
    
    // If approved, create a new tool
    if (data.status === 'approved' && data.createTool) {
      const [newTool] = await db.insert(tools).values({
        name: updatedSubmission.name,
        slug: updatedSubmission.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: updatedSubmission.description || '',
        url: updatedSubmission.url,
        favicon: '',
        isPick: false,
        locale: updatedSubmission.locale,
        isActive: true,
      }).returning();
      
      // Copy categories
      const submissionCategories = await db.select()
        .from(userToolCategories)
        .where(eq(userToolCategories.userToolId, id));
      
      if (submissionCategories.length > 0) {
        await db.insert(db.schema.toolCategories).values(
          submissionCategories.map(sc => ({
            toolId: newTool.id,
            categoryId: sc.categoryId,
          }))
        );
      }
      
      return Response.json({ 
        submission: updatedSubmission, 
        tool: newTool,
        success: true 
      });
    }
    
    return Response.json({ submission: updatedSubmission, success: true });
  } catch (error) {
    console.error('Error updating submission:', error);
    return Response.json({ error: 'Failed to update submission' }, { status: 500 });
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
    
    // Delete submission categories first
    await db.delete(userToolCategories).where(eq(userToolCategories.userToolId, id));
    
    // Delete the submission
    const [deletedSubmission] = await db.delete(userTools)
      .where(eq(userTools.id, id))
      .returning();
    
    if (!deletedSubmission) {
      return Response.json({ error: 'Submission not found' }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return Response.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
