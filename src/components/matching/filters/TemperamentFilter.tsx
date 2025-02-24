import React from 'react';

interface TemperamentFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const temperaments = [
  'Friendly',
  'Playful',
  'Calm',
  'Energetic',
  'Social',
  'Independent',
  'Gentle',
  'Protective',
  'Intelligent',
  'Affectionate'
];

export function TemperamentFilter({ value, onChange }: TemperamentFilterProps) {
  const toggleTemperament = (temperament: string) => {
    if (value.includes(temperament)) {
      onChange(value.filter(t => t !== temperament));
    } else {
      onChange([...value, temperament]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">Temperament</p>
      <div className="flex flex-wrap gap-2">
        {temperaments.map((temperament) => (
          <button
            key={temperament}
            onClick={() => toggleTemperament(temperament)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              value.includes(temperament)
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            {temperament}
          </button>
        ))}
      </div>
    </div>
  );
}