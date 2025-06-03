import { sql } from 'drizzle-orm';
import { serial, text, boolean, timestamp, integer, pgTable } from 'drizzle-orm/pg-core';
import { categories, tags } from './tools'; // Assuming these are defined in tools.ts using pgTable

// Posts table
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  pageType: text('page_type').notNull().default('markdown'), // markdown or html
  status: text('status').notNull().default('draft'), // draft, published
  locale: text('locale').notNull().default('en'),
  isSticky: boolean('is_sticky').notNull().default(false),
  viewCount: integer('view_count').notNull().default(0),
  publishedAt: timestamp('published_at', { mode: 'date' }), // Keep nullable if intended
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// Post categories relation table
export const postCategories = pgTable('post_categories', {
  id: serial('id').primaryKey(),
  // Assuming posts.id and categories.id are serial, integer type is compatible
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }), 
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }), 
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Post tags relation table
export const postTags = pgTable('post_tags', {
  id: serial('id').primaryKey(),
  // Assuming posts.id and tags.id are serial, integer type is compatible
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }), 
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }), 
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

