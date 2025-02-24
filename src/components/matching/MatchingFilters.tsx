import React from 'react';
import { Filter } from 'lucide-react';
import { BreedFilter } from './filters/BreedFilter';
import { PurposeFilter } from './filters/PurposeFilter';
import { TemperamentFilter } from './filters/TemperamentFilter';
import { Slider } from '../ui/Slider';
import type { MatchingFilters as FilterType } from '../../types/matching';

interface MatchingFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

export function MatchingFilters({ filters, onFilterChange }: MatchingFiltersProps) {
  const handleChange = (key: keyof FilterType, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700">
          <Filter className="h-4 w-4 inline-block mr-1" />
          Reset
        </button>
      </div>

      <div className="space-y-8">
        <PurposeFilter
          value={filters.purpose}
          onChange={(value) => handleChange('purpose', value)}
        />

        <BreedFilter
          value={filters.breed}
          onChange={(value) => handleChange('breed', value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={filters.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Any gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Range (years)
          </label>
          <Slider
            min={0}
            max={15}
            value={filters.ageRange}
            onChange={(value) => handleChange('ageRange', value)}
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{filters.ageRange[0]} years</span>
            <span>{filters.ageRange[1]} years</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance
          </label>
          <Slider
            min={0}
            max={100}
            value={[filters.distance]}
            onChange={(value) => handleChange('distance', value[0])}
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>0 km</span>
            <span>{filters.distance} km</span>
          </div>
        </div>

        <TemperamentFilter
          value={filters.temperament || []}
          onChange={(value) => handleChange('temperament', value)}
        />

        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.healthChecked}
              onChange={(e) => handleChange('healthChecked', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Health Checked</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.vaccinated}
              onChange={(e) => handleChange('vaccinated', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Vaccinated</span>
          </label>
        </div>
      </div>
    </div>
  );
}