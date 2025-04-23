import React from 'react';

export function MatchingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
          {/* Image Skeleton */}
          <div className="relative aspect-square bg-gray-200 animate-pulse">
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-md">
              <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
              <div className="h-4 w-8 bg-gray-300 rounded"></div>
            </div>
            {/* Verified Badge */}
            <div className="absolute top-4 left-4 bg-gray-300 text-white px-2 py-1 rounded-full flex items-center">
              <div className="h-3 w-3 bg-gray-400 rounded-full mr-1"></div>
              <div className="h-3 w-12 bg-gray-400 rounded"></div>
            </div>
          </div>

          <div className="p-4">
            {/* Pet Info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full border-2 border-white shadow-sm"></div>
            </div>

            {/* Distance */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Temperament Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 px-2 bg-gray-200 rounded-full"></div>
              ))}
            </div>

            {/* Message Button */}
            <div>
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}