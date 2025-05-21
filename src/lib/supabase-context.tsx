import { createClient as createServerClient } from '@/lib/supabase-server';
import { createClient as createBrowserClient } from '@/lib/supabase-browser';

// 创建一个上下文提供者组件，用于在客户端和服务器端之间共享Supabase客户端
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  supabase: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserClient());

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context.supabase;
}

// 导出服务器端和客户端创建函数
export { createServerClient, createBrowserClient };
