import React from 'react';
import { Heart } from 'lucide-react';

export function MatchingHero() {
  return (
    <div className="relative bg-sage-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <Heart className="h-12 w-12 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-semibold text-white sm:text-5xl">
            Find the Perfect Match
          </h1>
          <p className="mt-4 text-xl text-white opacity-90 max-w-2xl mx-auto">
            Connect with compatible breeding partners for your pet through our safe and verified matching system.
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}