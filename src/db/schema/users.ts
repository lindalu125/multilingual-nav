import { sql } from 'drizzle-orm';
import { serial, text, boolean, timestamp, pgTable, integer } from 'drizzle-orm/pg-core';
import { categories } from './tools'; // Assuming categories is defined in tools.ts using pgTable

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'), // admin, editor, user
  avatar: text('avatar'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// User submitted tools table
export const userTools = pgTable('user_tools', {
  id: serial('id').primaryKey(),
  // Assuming users.id is serial, integer type is compatible for foreign key
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }), 
  name: text('name').notNull(),
  description: text('description'),
  url: text('url').notNull(),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  // Assuming users.id is serial, integer type is compatible for foreign key
  reviewedBy: integer('reviewed_by').references(() => users.id, { onDelete: 'set null' }), 
  reviewNote: text('review_note'),
  locale: text('locale').notNull().default('en'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// User submitted tool categories relation table
export const userToolCategories = pgTable('user_tool_categories', {
  id: serial('id').primaryKey(),
  // Assuming userTools.id and categories.id are serial, integer type is compatible
  userToolId: integer('user_tool_id').notNull().references(() => userTools.id, { onDelete: 'cascade' }), 
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }), 
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
