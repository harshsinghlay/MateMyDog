import React, { useEffect, useState } from "react";
import { X, Upload, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { usePets } from "../../hooks/usePets";
import { useMediaUpload } from "../../hooks/useMediaUpload";
import { socialService } from "../../lib/supabase/services/socialService";
import type { Pet } from "../../types/pet";

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const { user } = useAuth();
  const { pets } = usePets();
  const { uploadMedia } = useMediaUpload();
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [storyText, setStoryText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPet || !image) return;

    try {
      setIsSubmitting(true);

      // Upload image
      const [media] = await uploadMedia([image]);

      // Extract hashtags from story text
      const hashtags = storyText.match(/#[a-zA-Z0-9]+/g) || [];

      // Create post
      await socialService.createPost({
        petId: selectedPet.id,
        imageUrl: media.url,
        storyText,
        hashtags: hashtags.map((tag) => tag.substring(1)), // Remove # from hashtags
        // location: selectedPet?.owner.location || null
        owner : selectedPet?.owner.id
      });

      toast.success("Post created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif">Create Post</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Pet
              </label>
              <select
                value={selectedPet?.id || ""}
                onChange={(e) =>
                  setSelectedPet(
                    pets.find((p) => p.id === e.target.value) || null
                  )
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select a pet</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="mx-auto h-48 w-48 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload a photo
                    </p>
                  </>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept={allowedTypes.join(",")}
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Story Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Write your story
              </label>
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Share your story... Use #hashtags to categorize your post"
                required
              />
            </div>

            {/* Location Preview */}
            {selectedPet?.owner.location.city && (
              <div className="flex items-start space-x-2 text-sm text-gray-500">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>
                  {selectedPet?.owner.location.city || ""}, {selectedPet?.owner.location.state || ""}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedPet || !image}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
