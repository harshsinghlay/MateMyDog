import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import type { PostComment } from "../../types/social";
import { socialService } from "../../lib/supabase/services/socialService";

interface CommentsModalProps {
  postId: string;
  onClose: () => void;
  onCommentAdded: (content: string) => Promise<void>;
}

export function CommentsModal({
  postId,
  onClose,
  onCommentAdded,
}: CommentsModalProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        const data = await socialService.getComments(postId);
        setComments(data);
      } catch (error) {
        console.error("Error loading comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const comment = await socialService.addComment(
        postId,
        newComment.trim(),
        {
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        }
      );
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      await onCommentAdded(newComment.trim());
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg h-[80vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : comments?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No comments yet</p>
          ) : (
            comments?.map((comment) => (
              <div key={comment?.id} className="flex space-x-3 ">
                <div className="flex-shrink-0 ">
                  {comment?.userAvatar ? (
                    <img
                      src={comment?.userAvatar}
                      alt={comment?.userName}
                      className="h-8 w-8 rounded-f.user_metadataull rounded-full overflow-hidden"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {comment?.userName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <p className="font-medium text-sm">{comment?.userName}</p>
                    <p className="text-sm text-gray-700">{comment?.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
