import React from 'react';
import { Link } from 'react-router-dom';
import { Dog } from 'lucide-react';

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Dog className="h-8 w-8" />
      <span className="text-xl font-serif">Tilting Heads</span>
    </Link>
  );
}