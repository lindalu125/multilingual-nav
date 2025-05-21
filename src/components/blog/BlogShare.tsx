import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type BlogShareProps = {
  post: {
    title: string;
    slug: string;
    url?: string;
  };
};

export default function BlogShare({ post }: BlogShareProps) {
  const t = useTranslations('Blog');
  
  // Generate full URL for sharing
  const fullUrl = post.url || `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(post.title);
  
  // Social share links
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
  
  return (
    <div className="blog-share mt-8 pt-6 border-t">
      <h4 className="text-lg font-medium mb-4">{t('sharePost')}</h4>
      
      <div className="flex flex-wrap gap-3">
        <a 
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-md hover:bg-[#1DA1F2]/90 transition-colors"
          aria-label={t('shareOnTwitter')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
          <span className="hidden sm:inline">Twitter</span>
        </a>
        
        <a 
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#1877F2]/90 transition-colors"
          aria-label={t('shareOnFacebook')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
          <span className="hidden sm:inline">Facebook</span>
        </a>
        
        <a 
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-md hover:bg-[#0A66C2]/90 transition-colors"
          aria-label={t('shareOnLinkedIn')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
        
        <a 
          href={emailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-500/90 transition-colors"
          aria-label={t('shareByEmail')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span className="hidden sm:inline">Email</span>
        </a>
        
        <button 
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(fullUrl);
              // In a real app, you would show a toast notification here
              alert(t('linkCopied'));
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors"
          aria-label={t('copyLink')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span className="hidden sm:inline">{t('copyLink')}</span>
        </button>
      </div>
    </div>
  );
}
