import { sql } from 'drizzle-orm';
import { serial, text, boolean, timestamp, integer, pgTable } from 'drizzle-orm/pg-core';

// Categories table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  locale: text('locale').notNull().default('en'),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Tags table
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  locale: text('locale').notNull().default('en'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Tools table
export const tools = pgTable('tools', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  url: text('url').notNull(),
  favicon: text('favicon'),
  isPick: boolean('is_pick').notNull().default(false),
  locale: text('locale').notNull().default('en'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Tool categories relation table
export const toolCategories = pgTable('tool_categories', {
  id: serial('id').primaryKey(),
  // Assuming tools.id and categories.id are serial, integer type is compatible
  toolId: integer('tool_id').notNull().references(() => tools.id, { onDelete: 'cascade' }), 
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }), 
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Tool tags relation table
export const toolTags = pgTable('tool_tags', {
  id: serial('id').primaryKey(),
  // Assuming tools.id and tags.id are serial, integer type is compatible
  toolId: integer('tool_id').notNull().references(() => tools.id, { onDelete: 'cascade' }), 
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }), 
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
