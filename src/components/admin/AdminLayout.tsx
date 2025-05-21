import React from 'react';
import { useTranslations } from 'next-intl';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

type AdminLayoutProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  activePath: string;
};

export default function AdminLayout({ 
  children, 
  title, 
  description, 
  actions, 
  activePath 
}: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activePath={activePath} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          title={title} 
          description={description} 
          actions={actions} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
