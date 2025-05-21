import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

type BlogAuthorProps = {
  author: {
    id: number;
    name: string;
    bio?: string;
    avatar?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
  };
};

export default function BlogAuthor({ author }: BlogAuthorProps) {
  const t = useTranslations('Blog');
  
  return (
    <div className="blog-author bg-card rounded-lg border p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
      {/* Author Avatar */}
      {author.avatar ? (
        <div className="flex-shrink-0">
          <Image 
            src={author.avatar} 
            alt={author.name}
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-xl text-primary flex-shrink-0">
          {author.name.charAt(0)}
        </div>
      )}
      
      {/* Author Info */}
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-bold mb-2">{author.name}</h3>
        
        {author.bio && (
          <p className="text-muted-foreground mb-4">{author.bio}</p>
        )}
        
        {/* Social Links */}
        {author.socialLinks && author.socialLinks.length > 0 && (
          <div className="flex gap-3 justify-center md:justify-start">
            {author.socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`${author.name} on ${link.platform}`}
              >
                {/* Simple icon placeholders - in a real app, use proper icons */}
                {link.platform === 'twitter' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                )}
                {link.platform === 'facebook' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                )}
                {link.platform === 'linkedin' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                )}
                {link.platform === 'github' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                )}
                {!['twitter', 'facebook', 'linkedin', 'github'].includes(link.platform) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
