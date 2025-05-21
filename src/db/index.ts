import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Initialize SQLite database
const sqlite = new Database('multilingual-nav.db');

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Function to run migrations
export async function runMigrations() {
  // This will run migrations from the specified directory
  migrate(db, { migrationsFolder: 'migrations' });
  console.log('Migrations completed');
}

// Export schema
export { schema };
