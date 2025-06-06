import { NextRequest } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
// 1. 在这里加入 "and"
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const settings = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.locale, locale));

    // Convert to key-value object
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string | null>);

    return Response.json({ settings: settingsObject });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// 2. 替换整个 POST 函数
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.key || !data.locale) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if setting already exists - [修改点一]
    const existingSetting = await db.select()
      .from(siteSettings)
      .where(
        and(
          eq(siteSettings.key, data.key),
          eq(siteSettings.locale, data.locale)
        )
      )
      .limit(1);
    
    if (existingSetting.length > 0) {
      // Update existing setting - [修改点二]
      const [updatedSetting] = await db.update(siteSettings)
        .set({
          value: data.value,
        })
        .where(
          and(
            eq(siteSettings.key, data.key),
            eq(siteSettings.locale, data.locale)
          )
        )
        .returning();
      
      return Response.json({ setting: updatedSetting, success: true });
    } else {
      // Insert new setting
      const [newSetting] = await db.insert(siteSettings).values({
        key: data.key,
        value: data.value,
        locale: data.locale,
      }).returning();
      
      return Response.json({ setting: newSetting, success: true });
    }
  } catch (error) {
    console.error('Error saving setting:', error);
    return Response.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}