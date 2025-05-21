import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Comment from './Comment';

type CommentSectionProps = {
  postId: number;
  comments: Array<{
    id: number;
    content: string;
    createdAt: number;
    author: {
      name: string;
      avatar?: string;
    };
    replies?: CommentSectionProps['comments'];
  }>;
};

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const t = useTranslations('Blog');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally submit the comment to your API
    console.log('Submitting comment:', {
      postId,
      replyTo,
      name,
      email,
      content: commentText
    });
    
    // Reset form
    setCommentText('');
    setReplyTo(null);
    
    // In a real implementation, you would add the new comment to the list
    // after receiving a successful response from the server
  };
  
  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
    // Scroll to comment form
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const cancelReply = () => {
    setReplyTo(null);
  };
  
  return (
    <div className="comment-section mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold mb-6">{t('comments')} ({comments.length})</h3>
      
      {comments.length > 0 ? (
        <div className="space-y-8 mb-12">
          {comments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              onReply={handleReply}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mb-8">{t('noComments')}</p>
      )}
      
      <div id="comment-form" className="bg-card rounded-lg border p-6">
        <h4 className="text-xl font-semibold mb-4">
          {replyTo ? t('replyToComment') : t('leaveComment')}
        </h4>
        
        {replyTo && (
          <div className="bg-muted p-3 rounded-md mb-4 flex justify-between items-center">
            <span className="text-sm">{t('replyingTo')} #{replyTo}</span>
            <button 
              onClick={cancelReply}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('cancel')}
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                {t('name')} *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {t('email')} *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              {t('comment')} *
            </label>
            <textarea
              id="comment"
              rows={5}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {replyTo ? t('submitReply') : t('submitComment')}
          </button>
        </form>
      </div>
    </div>
  );
}
