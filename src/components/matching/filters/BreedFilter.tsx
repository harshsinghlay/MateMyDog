import React from 'react';
import { Search } from 'lucide-react';

interface BreedFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const popularBreeds = [
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'French Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Boxer',
  'Dachshund'
];

export function BreedFilter({ value, onChange }: BreedFilterProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search breeds..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Popular Breeds</p>
        <div className="flex flex-wrap gap-2">
          {popularBreeds.map((breed) => (
            <button
              key={breed}
              onClick={() => onChange(breed)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                value === breed
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {breed}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}