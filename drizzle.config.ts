import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

export default {
  schema: './src/db/schema', // Path to your schema files
  out: './migrations',      // Directory for migration files
  dialect: 'postgresql',    // Specify the dialect as PostgreSQL
  dbCredentials: {
    // Use the DATABASE_URL from environment variables
    url: process.env.DATABASE_URL!, // Ensure DATABASE_URL is set in .env.local
  },
  // Optional: Add verbose logging if needed
  verbose: true,
  strict: true,
} satisfies Config;

