import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

type DonationButtonProps = {
  className?: string;
};

export default function DonationButton({ className }: DonationButtonProps) {
  const t = useTranslations('common.cta');
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex items-center space-x-1 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 ${className || ''}`}
      >
        <span className="text-sm font-medium">{t('donate')}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">{t('donate')}</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* WeChat QR Code */}
              <div className="border rounded-md p-3">
                <h4 className="text-sm font-medium mb-2">WeChat</h4>
                <div className="bg-white p-2 rounded-md w-full aspect-square flex items-center justify-center">
                  <div className="text-xs text-center text-gray-500">WeChat QR Code Placeholder</div>
                </div>
              </div>
              
              {/* Ko-fi Button */}
              <Link 
                href="https://ko-fi.com/" 
                target="_blank"
                className="flex items-center justify-center w-full py-2 px-4 bg-[#29abe0] text-white rounded-md hover:bg-[#29abe0]/90"
              >
                <span className="font-medium">Support on Ko-fi</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
