import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

type CommentProps = {
  comment: {
    id: number;
    content: string;
    createdAt: number;
    author: {
      name: string;
      avatar?: string;
    };
    replies?: CommentProps['comment'][];
  };
  level?: number;
  onReply?: (commentId: number) => void;
};

export default function Comment({ comment, level = 0, onReply }: CommentProps) {
  const t = useTranslations('Blog');
  const formattedDate = new Date(comment.createdAt * 1000).toLocaleDateString();
  const maxLevel = 3; // Maximum nesting level
  
  return (
    <div className={`comment ${level > 0 ? 'ml-6 md:ml-12 pl-4 border-l' : ''}`}>
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        {comment.author.avatar ? (
          <Image 
            src={comment.author.avatar} 
            alt={comment.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm text-primary">
            {comment.author.name.charAt(0)}
          </div>
        )}
        
        {/* Comment content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
            <h4 className="font-medium">{comment.author.name}</h4>
            <time className="text-xs text-muted-foreground">{formattedDate}</time>
          </div>
          
          <div className="prose prose-sm dark:prose-invert">
            <p>{comment.content}</p>
          </div>
          
          {onReply && level < maxLevel && (
            <button 
              onClick={() => onReply(comment.id)}
              className="text-sm text-primary hover:underline mt-2"
            >
              {t('reply')}
            </button>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-6 space-y-6">
          {comment.replies.map(reply => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              level={level + 1}
              onReply={level + 1 < maxLevel ? onReply : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
