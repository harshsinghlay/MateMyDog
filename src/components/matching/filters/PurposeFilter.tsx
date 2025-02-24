import React from 'react';
import { Heart, Users, Home } from 'lucide-react';
import type { MatchingPurpose } from '../../../types/matching';

interface PurposeFilterProps {
  value: MatchingPurpose;
  onChange: (value: MatchingPurpose) => void;
}

const purposes = [
  {
    value: 'breeding',
    label: 'Breeding',
    icon: Heart,
    description: 'Find a breeding partner'
  },
  {
    value: 'playdate',
    label: 'Playdate',
    icon: Users,
    description: 'Find playmates nearby'
  },
  {
    value: 'adoption',
    label: 'Adoption',
    icon: Home,
    description: 'Find a forever home'
  }
] as const;

export function PurposeFilter({ value, onChange }: PurposeFilterProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">Purpose</p>
      <div className="grid grid-cols-1 gap-4">
        {purposes.map((purpose) => (
          <button
            key={purpose.value}
            onClick={() => onChange(purpose.value)}
            className={`flex items-start p-4 rounded-lg border-2 transition-colors ${
              value === purpose.value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <purpose.icon className={`h-5 w-5 mt-0.5 ${
              value === purpose.value ? 'text-indigo-500' : 'text-gray-400'
            }`} />
            <div className="ml-3 text-left">
              <p className={`font-medium ${
                value === purpose.value ? 'text-indigo-700' : 'text-gray-900'
              }`}>
                {purpose.label}
              </p>
              <p className="text-sm text-gray-500">{purpose.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}