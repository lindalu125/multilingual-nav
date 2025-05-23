import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema',
  out: './migrations',
  driver: 'better-sqlite3',
  dbCredentials: {
    // 对于Vercel部署，使用内存数据库或确保路径在/tmp目录
    filename: process.env.NODE_ENV === 'production' 
      ? ':memory:' // 生产环境使用内存数据库
      : './data.db', // 开发环境使用本地文件
  },
  // 如果您使用的是SQLite，可以添加以下配置
  verbose: true,
  strict: true,
}) satisfies Config;
