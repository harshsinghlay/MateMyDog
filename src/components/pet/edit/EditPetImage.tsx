import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMediaUpload } from '../../../hooks/useMediaUpload';
import { validateImageDimensions } from '../../../utils/mediaHelpers';
import type { Pet } from '../../../types/pet';

interface EditPetImageProps {
  pet: Pet;
  onChange: (field: keyof Pet, value: any) => void;
}

export function EditPetImage({ pet, onChange }: EditPetImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMedia, uploading } = useMediaUpload();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate image dimensions
    try {
      const dimensions = await validateImageDimensions(file);
      if (!dimensions.valid) {
        toast.error(dimensions.message);
        return;
      }
    } catch (error) {
      console.error('Error validating image dimensions:', error);
      toast.error('Failed to validate image dimensions');
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const [media] = await uploadMedia([file]);
      onChange('imageUrl', media.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setPreviewUrl(null); // Reset preview on error
    }
  };

  const displayUrl = previewUrl || pet.imageUrl || 'https://via.placeholder.com/128?text=Pet+Image';

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <div className="h-32 w-32 rounded-full overflow-hidden">
          {uploading ? (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <img
              src={displayUrl}
              alt={pet.name || 'Pet'}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md hover:bg-gray-50 disabled:opacity-50"
        >
          <Camera className="h-5 w-5 text-gray-600" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-500">
          {uploading ? (
            'Uploading image...'
          ) : (
            <div className="space-y-2">
              <div>Upload a new photo of your pet. The image should be:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>JPG, JPEG, PNG, or WebP format</li>
                <li>At least 400x400 pixels</li>
                <li>Less than 5MB in size</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}