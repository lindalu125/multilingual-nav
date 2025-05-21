import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Site settings table
export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  locale: text('locale').notNull().default('en'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Languages table
export const languages = sqliteTable('languages', {
  id: integer('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  nativeName: text('native_name').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Navigation menu table
export const navMenu = sqliteTable('nav_menu', {
  id: integer('id').primaryKey(),
  parentId: integer('parent_id').references(() => navMenu.id),
  title: text('title').notNull(),
  link: text('link').notNull(),
  icon: text('icon'),
  locale: text('locale').notNull().default('en'),
  order: integer('order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Social media links table
export const socialMedia = sqliteTable('social_media', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  icon: text('icon').notNull(),
  order: integer('order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Donation methods table
export const donationMethods = sqliteTable('donation_methods', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // wechat, kofi, etc.
  qrCode: text('qr_code'),
  url: text('url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
