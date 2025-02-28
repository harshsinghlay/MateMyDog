import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, PlusSquare, UserCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { CreatePostModal } from "../social/CreatePostModal";
import { AuthModal } from "../auth/AuthModal";

export function MobileNav() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast("Please sign in to create a post", {
        icon: "🔒",
      });
      setShowAuthModal(true);
      return;
    }
    setShowCreatePost(true);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate("/profile");
  };

  return (
    <>
      <div className="h-fit bg-white border-t border-gray-200 md:hidden z-40 ">
        <div className="flex items-center justify-around h-[9dvh]">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center w-16 h-full text-gray-600 hover:text-gray-900"
          >
            <Home className="h-6 w-6" />
          </button>

          <button
            onClick={handleCreatePost}
            className="flex flex-col items-center justify-center w-16 h-full text-gray-600 hover:text-gray-900"
          >
            <PlusSquare className="h-6 w-6" />
          </button>

          <button
            onClick={handleProfileClick}
            className="flex flex-col items-center justify-center w-16 h-full text-gray-600 hover:text-gray-900"
          >
            <UserCircle className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSuccess={() => {
            setShowCreatePost(false);
            // Optionally refresh the feed or show success message
            toast.success("Post created successfully!");
          }}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
