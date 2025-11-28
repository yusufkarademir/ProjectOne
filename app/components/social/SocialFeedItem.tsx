'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, X } from 'lucide-react';
import { toggleReaction, addComment, deleteComment } from '../../lib/social-actions';
import toast from 'react-hot-toast';

interface SocialFeedItemProps {
  photo: any;
  settings: any;
  currentUserId?: string; // For future use if we have real auth
}

export default function SocialFeedItem({ photo, settings }: SocialFeedItemProps) {
  const [liked, setLiked] = useState(false); // Optimistic UI
  const [likeCount, setLikeCount] = useState(photo._count.reactions);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(photo.comments || []);
  const [commentCount, setCommentCount] = useState(photo._count.comments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anonId, setAnonId] = useState<string>('');

  useEffect(() => {
    // Get or create anon ID
    let id = localStorage.getItem('anon_user_id');
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('anon_user_id', id);
    }
    setAnonId(id);

    // Check if user already liked (This requires fetching user specific reaction state, 
    // which we don't have in the initial payload efficiently yet. 
    // For now, let's assume false on load or we need to pass "isLikedByCurrentUser" from server)
    // Since we are doing anon auth on client, we can't easily know server-side if this specific anon user liked it 
    // without passing the cookie/id.
    // Ideally, we should fetch "my reaction" status.
    // For this MVP, we might miss the initial "liked" state if we reload, unless we persist it locally too.
    // Let's try to persist locally for better UX.
    const localLikes = JSON.parse(localStorage.getItem('liked_photos') || '{}');
    if (localLikes[photo.id]) {
      setLiked(true);
    }
  }, [photo.id]);

  const handleLike = async () => {
    if (!settings.features?.reactions) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev: number) => newLiked ? prev + 1 : prev - 1);

    // Update local storage
    const localLikes = JSON.parse(localStorage.getItem('liked_photos') || '{}');
    if (newLiked) {
      localLikes[photo.id] = true;
    } else {
      delete localLikes[photo.id];
    }
    localStorage.setItem('liked_photos', JSON.stringify(localLikes));

    // Server action
    const result = await toggleReaction(photo.id, '❤️', anonId);
    if (!result.success) {
      // Revert on failure
      setLiked(!newLiked);
      setLikeCount((prev: number) => !newLiked ? prev + 1 : prev - 1);
      toast.error('Bir hata oluştu');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !settings.features?.comments || isSubmitting) return;

    setIsSubmitting(true);
    
    // Optimistic comment
    const tempId = 'temp_' + Date.now();
    const newComment = {
      id: tempId,
      content: commentText,
      createdAt: new Date(),
      authorId: anonId
    };
    
    setComments((prev: any[]) => [...prev, newComment]);
    setCommentCount((prev: number) => prev + 1);
    setCommentText('');

    const result = await addComment(photo.id, newComment.content, anonId);
    
    if (result.success) {
      // Replace temp comment with real one
      setComments((prev: any[]) => prev.map(c => c.id === tempId ? result.comment : c));
    } else {
      // Remove temp comment
      setComments((prev: any[]) => prev.filter(c => c.id !== tempId));
      setCommentCount((prev: number) => prev - 1);
      toast.error('Yorum gönderilemedi');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-100">
        <img 
          src={photo.url} 
          alt="Event photo"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Actions Bar */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          {settings.features?.reactions && (
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            >
              <Heart size={24} fill={liked ? "currentColor" : "none"} />
              <span className="font-medium text-sm">{likeCount > 0 ? likeCount : ''}</span>
            </button>
          )}
          
          {settings.features?.comments && (
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <MessageSquare size={24} />
              <span className="font-medium text-sm">{commentCount > 0 ? commentCount : ''}</span>
            </button>
          )}
        </div>

        {/* Caption/Date */}
        <div className="text-xs text-gray-400 mb-2">
          {new Date(photo.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2">
            {/* Comment List */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">Henüz yorum yok. İlk yorumu sen yap!</p>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className="text-sm">
                    <span className="font-medium text-gray-900 mr-2">Misafir</span>
                    <span className="text-gray-700">{comment.content}</span>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Yorum yaz..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="absolute right-1 top-1 p-1.5 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
