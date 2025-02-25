import { MessageCircle } from "lucide-react";
import type { Pet } from "../../../types/pet";

interface PetCommentsProps {
  pet: Pet;
  onComment: (content: string) => void;
  commentsCount: number;
  onShowComments: () => void;
}

export function PetComments({
  commentsCount,
  onShowComments,
}: PetCommentsProps) {
  //   const { user, isAuthenticated } = useAuth();
  //   const [comment, setComment] = useState("");
  //   const [isSubmitting, setIsSubmitting] = useState(false);

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!isAuthenticated || !user || !comment.trim() || isSubmitting) return;

  //     try {
  //       setIsSubmitting(true);
  //       await onComment(comment.trim());
  //       setComment("");
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        <button
          onClick={onShowComments}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{commentsCount}</span>
        </button>
      </div>

      {/* <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          disabled={!isAuthenticated || isSubmitting}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isAuthenticated || !comment.trim() || isSubmitting}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form> */}
    </div>
  );
}
