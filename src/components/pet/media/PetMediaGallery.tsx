import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Video } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AddMedia } from './AddMedia';
import { MediaViewer } from './MediaViewer';
import type { Pet, PetMedia } from '../../../types/pet';

interface PetMediaGalleryProps {
  pet: Pet;
  onUpdate: (updatedPet: Pet) => void;
  isOwner: boolean;
}

export function PetMediaGallery({ pet, onUpdate, isOwner }: PetMediaGalleryProps) {
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<PetMedia | null>(null);

  const handleAddMedia = (newMedia: PetMedia[]) => {
    const updatedPet = {
      ...pet,
      media: [...pet.media, ...newMedia]
    };
    onUpdate(updatedPet);
    setIsAddingMedia(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Photos & Videos</h2>
        {isOwner && (
          <button
            onClick={() => setIsAddingMedia(true)}
            className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Media</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pet.media.map((media) => (
          <button
            key={media.id}
            onClick={() => setSelectedMedia(media)}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            {media.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30">
                <Video className="h-8 w-8 text-white" />
              </div>
            )}
            <img
              src={media.type === 'video' ? media.thumbnail || media.url : media.url}
              alt={media.caption || 'Pet media'}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}

        {isOwner && (
          <button
            onClick={() => setIsAddingMedia(true)}
            className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
          >
            <Plus className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Add Media</span>
          </button>
        )}
      </div>

      {isAddingMedia && (
        <AddMedia onSave={handleAddMedia} onClose={() => setIsAddingMedia(false)} />
      )}

      {selectedMedia && (
        <MediaViewer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onNext={() => {
            const currentIndex = pet.media.findIndex(m => m.id === selectedMedia.id);
            const nextMedia = pet.media[currentIndex + 1];
            if (nextMedia) setSelectedMedia(nextMedia);
          }}
          onPrevious={() => {
            const currentIndex = pet.media.findIndex(m => m.id === selectedMedia.id);
            const previousMedia = pet.media[currentIndex - 1];
            if (previousMedia) setSelectedMedia(previousMedia);
          }}
        />
      )}
    </div>
  );
}