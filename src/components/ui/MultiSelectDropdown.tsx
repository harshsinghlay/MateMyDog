import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MultiSelectDropdownProps {
  options: { id: string; name: string }[];
  defaultSelected?: { id: string; name: string }[];
  onChange: (selectedItems: { id: string; name: string }[]) => void;
}

export default function MultiSelectDropdown({
  options,
  defaultSelected = [],
  onChange,
}: MultiSelectDropdownProps) {
  const [selected, setSelected] =
    useState<{ id: string; name: string }[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChange(selected);
  }, [selected, options]);

  const handleSelect = (item: { id: string; name: string }) => {
    if (!selected.some((sel) => sel.id === item.id)) {
      setSelected([...selected, item]);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemove = (item: { id: string; name: string }) => {
    setSelected(selected.filter((sel) => sel.id !== item.id));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white cursor-pointer px-1 py-[4px] flex justify-between items-center "
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selected.length > 0 ? (
            selected.map((item) => (
              <span
                key={item.id}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center"
              >
                {item.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className="ml-1 text-gray-500 hover:text-gray-700 text-sm"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">Select options...</span>
          )}
        </div>
        <span className="text-gray-500 text-sm">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-10 sm:text-sm">
          {options.map((item) => (
            <div
              key={item.id}
              className="p-1 cursor-pointer hover:bg-[#0078d7] hover:text-white transition text-gray-700 "
              onClick={() => handleSelect(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
