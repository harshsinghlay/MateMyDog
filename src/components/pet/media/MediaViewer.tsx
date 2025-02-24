import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PetMedia } from '../../../types/pet';

interface MediaViewerProps {
  media: PetMedia;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function MediaViewer({ media, onClose, onNext, onPrevious }: MediaViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X className="h-8 w-8" />
      </button>

      {onPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 text-white hover:text-gray-300"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 text-white hover:text-gray-300"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      <div className="max-w-4xl w-full mx-4">
        {media.type === 'video' ? (
          <video
            src={media.url}
            controls
            className="w-full max-h-[80vh] object-contain"
          />
        ) : (
          <img
            src={media.url}
            alt={media.caption || ''}
            className="w-full max-h-[80vh] object-contain"
          />
        )}

        {media.caption && (
          <p className="mt-4 text-white text-center">{media.caption}</p>
        )}
      </div>
    </div>
  );
}