import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { socialService } from '../lib/supabase/services/socialService';
import type { PostComment } from '../types/social';

export function useComments(postId: string) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await socialService.getComments(postId);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError(err instanceof Error ? err : new Error('Failed to load comments'));
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const addComment = async (content: string) => {
    try {
      const comment = await socialService.addComment(postId, content);
      setComments(prev => [...prev, comment]);
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await socialService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  return {
    comments,
    loading,
    error,
    refresh: loadComments,
    addComment,
    deleteComment
  };
}