import React from 'react';

export function PetListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}