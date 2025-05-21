import React from 'react';
import { useTranslations } from 'next-intl';

type AdminHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export default function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-6 px-6 border-b">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
}
