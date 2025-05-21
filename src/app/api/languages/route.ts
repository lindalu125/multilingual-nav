import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// 创建API处理函数
export async function GET(request: Request) {
  try {
    // 初始化Supabase客户端
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
    
    // 获取所有支持的语言
    const { data: languages, error } = await supabase
      .from('languages')
      .select('*')
      .order('code');
    
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ languages });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
