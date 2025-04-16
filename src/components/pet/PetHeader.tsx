import React, { useEffect } from 'react';
import { Edit, Share2 } from 'lucide-react';
import type { Pet } from '../../types/pet';

interface PetHeaderProps {
  pet: Pet;
  isOwner: boolean;
  onEdit: () => void;
  onShare: () => void;
}

export function PetHeader({ pet, isOwner, onEdit, onShare }: PetHeaderProps) {
 

  useEffect(()=>{
     console.log("Pet is",pet);
     
  },[pet])
 

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
        <div className="flex-shrink-0 mb-6 md:mb-0">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="h-48 w-48 rounded-lg object-cover shadow-md"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-serif font-semibold text-gray-900 mb-2">
                {pet.name}
              </h1>
              <p className="text-lg text-gray-600 mb-1">
                {pet.breed}
              </p>
              <div className="flex items-center space-x-2 text-gray-500">
                <span>{pet.age} years old</span>
                <span>•</span>
                <span className="capitalize">{pet.gender}</span>
              </div>
              <p className="mt-2 text-gray-600">
                Owner: <span className="font-medium">{pet.owner.fullName}</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-4">
              {isOwner && (
                <>
                  <button 
                    onClick={onEdit}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  {/* <button 
                    onClick={onDelete}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-md hover:border-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button> */}
                </>
              )}
              <button 
                onClick={onShare}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}