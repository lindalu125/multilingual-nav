import { NextRequest } from 'next/server';
import { db } from '@/db';
import { languages } from '@/db/schema';
import { eq, and, not } from "drizzle-orm"; 

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code;
    
    const language = await db.select()
      .from(languages)
      .where(eq(languages.code, code))
      .limit(1);
    
    if (language.length === 0) {
      return Response.json({ error: 'Language not found' }, { status: 404 });
    }
    
    return Response.json({ language: language[0] });
  } catch (error) {
    console.error('Error fetching language:', error);
    return Response.json({ error: 'Failed to fetch language' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.nativeName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if language exists
    const existingLanguage = await db.select()
      .from(languages)
      .where(eq(languages.code, code))
      .limit(1);
    
    if (existingLanguage.length === 0) {
      return Response.json({ error: 'Language not found' }, { status: 404 });
    }
    
   
    if (data.isDefault) {
    // Set other languages to not be default
      await db.update(languages)
        .set({ isDefault: false })
        .where(
            and(
                eq(languages.isDefault, true),
                not(eq(languages.code, code))
            )
        );
}
    // Update language
    const [updatedLanguage] = await db.update(languages)
      .set({
        name: data.name,
        nativeName: data.nativeName,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isDefault: data.isDefault !== undefined ? data.isDefault : false,
      })
      .where(eq(languages.code, code))
      .returning();
    
    return Response.json({ language: updatedLanguage, success: true });
  } catch (error) {
    console.error('Error updating language:', error);
    return Response.json({ error: 'Failed to update language' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code;
    
    // Check if language exists
    const existingLanguage = await db.select()
      .from(languages)
      .where(eq(languages.code, code))
      .limit(1);
    
    if (existingLanguage.length === 0) {
      return Response.json({ error: 'Language not found' }, { status: 404 });
    }
    
    // Check if it's the default language
    if (existingLanguage[0].isDefault) {
      return Response.json({ error: 'Cannot delete default language' }, { status: 400 });
    }
    
    // Delete language
    const [deletedLanguage] = await db.delete(languages)
      .where(eq(languages.code, code))
      .returning();
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting language:', error);
    return Response.json({ error: 'Failed to delete language' }, { status: 500 });
  }
}
