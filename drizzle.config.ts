import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/*',
  out: './migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'multilingual-nav.db',
  },
  verbose: true,
  strict: true,
});
