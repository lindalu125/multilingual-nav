import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema'; // <--- 正确的路径，表示同目录下的 schema 文件夹
import * as dotenv from 'dotenv';

// 加载 .env.local 文件中的环境变量
dotenv.config({ path: '.env.local' });

// 检查 DATABASE_URL 是否已设置
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// 创建 pg 连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 根据 Supabase 的建议，可能需要为 Vercel Serverless 添加 SSL 配置
  // ssl: {
  //   rejectUnauthorized: false, 
  // }
});

// 使用连接池和 schema 创建 Drizzle 实例
export const db = drizzle(pool, { schema });

// 如果您之前有导出 Pool 或 Client 的代码，可以移除或相应修改
