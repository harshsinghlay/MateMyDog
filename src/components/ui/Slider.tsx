import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number[];
  onChange: (value: number[]) => void;
}

export function Slider({ min, max, value, onChange }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = [...value];
    newValue[index] = parseInt(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="relative">
      {value.length === 2 ? (
        // Range slider
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            onChange={(e) => handleChange(e, 0)}
            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={(e) => handleChange(e, 1)}
            className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
          />
        </div>
      ) : (
        // Single slider
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => handleChange(e, 0)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      )}
    </div>
  );
}