'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, MessageSquare, Send, SmilePlus } from 'lucide-react';
import { toggleReaction, addComment } from '../../lib/social-actions';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialFeedItemProps {
  photo: any;
  settings: any;
}

const REACTIONS = ['❤️', '🔥', '👏', '😂', '😮', '😢'];

export default function SocialFeedItem({ photo, settings }: SocialFeedItemProps) {
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [likeCount, setLikeCount] = useState(photo._count.reactions);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(photo.comments || []);
  const [commentCount, setCommentCount] = useState(photo._count.comments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anonId, setAnonId] = useState<string>('');
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get or create anon ID
    let id = localStorage.getItem('anon_user_id');
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('anon_user_id', id);
    }
    setAnonId(id);

    // Load local reactions
    const localReactions = JSON.parse(localStorage.getItem('user_reactions') || '{}');
    if (localReactions[photo.id]) {
      setUserReactions(localReactions[photo.id]);
    }

    // Click outside to close picker
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowReactionPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [photo.id]);

  const handleReaction = async (emoji: string) => {
    if (!settings.features?.reactions) return;

    const isActive = userReactions.includes(emoji);
    let newReactions: string[];
    
    if (isActive) {
      newReactions = userReactions.filter(r => r !== emoji);
      setLikeCount((prev: number) => prev - 1);
    } else {
      newReactions = [...userReactions, emoji];
      setLikeCount((prev: number) => prev + 1);
    }

    setUserReactions(newReactions);
    setShowReactionPicker(false);

    // Update local storage
    const localReactions = JSON.parse(localStorage.getItem('user_reactions') || '{}');
    localReactions[photo.id] = newReactions;
    localStorage.setItem('user_reactions', JSON.stringify(localReactions));

    // Server action
    const result = await toggleReaction(photo.id, emoji, anonId);
    if (!result.success) {
      // Revert on failure
      setUserReactions(userReactions);
      setLikeCount((prev: number) => isActive ? prev + 1 : prev - 1);
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
      setComments((prev: any[]) => prev.map(c => c.id === tempId ? result.comment : c));
    } else {
      setComments((prev: any[]) => prev.filter(c => c.id !== tempId));
      setCommentCount((prev: number) => prev - 1);
      toast.error('Yorum gönderilemedi');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-100 group">
        <img 
          src={photo.url} 
          alt="Event photo"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Actions Bar */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-4">
            {settings.features?.reactions && (
              <div className="relative" ref={pickerRef}>
                <button 
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                    userReactions.length > 0 
                      ? 'bg-red-50 text-red-500 ring-1 ring-red-100' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {userReactions.length > 0 ? (
                    <span className="text-lg">{userReactions[userReactions.length - 1]}</span>
                  ) : (
                    <Heart size={20} />
                  )}
                  <span className="font-semibold text-sm">{likeCount > 0 ? likeCount : 'Beğen'}</span>
                </button>

                <AnimatePresence>
                  {showReactionPicker && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full left-0 mb-3 bg-white shadow-xl rounded-full p-2 flex gap-1 border border-gray-100 z-10"
                    >
                      {REACTIONS.map(emoji => (
                        <button 
                          key={emoji} 
                          onClick={() => handleReaction(emoji)} 
                          className={`p-2 hover:bg-gray-50 rounded-full transition-transform hover:scale-125 active:scale-95 text-2xl leading-none ${
                            userReactions.includes(emoji) ? 'bg-blue-50 ring-2 ring-blue-100' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {settings.features?.comments && (
              <button 
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                  showComments 
                    ? 'bg-blue-50 text-blue-500 ring-1 ring-blue-100' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare size={20} />
                <span className="font-semibold text-sm">{commentCount > 0 ? commentCount : 'Yorum'}</span>
              </button>
            )}
          </div>

          <div className="text-xs font-medium text-gray-400">
            {new Date(photo.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-100">
                {/* Comment List */}
                <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {comments.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 font-medium">Henüz yorum yok</p>
                      <p className="text-xs text-gray-400 mt-1">İlk yorumu sen yap!</p>
                    </div>
                  ) : (
                    comments.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3 text-sm group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">
                          {comment.authorId?.substring(5, 7).toUpperCase() || 'M'}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-gray-900 text-xs">Misafir</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(comment.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleComment} className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Yorum yaz..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!commentText.trim() || isSubmitting}
                      className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:bg-gray-300 transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
