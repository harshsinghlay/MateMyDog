import React from 'react';
import { Heart, MapPin, Award, Clock } from 'lucide-react';
import type { MatchResult } from '../../types/matching';
import { UserAvatar } from '../ui/UserAvatar';

interface MatchCardProps {
  match: MatchResult;
  onMessage: () => void;
}

export function MatchCard({ match, onMessage }: MatchCardProps) {

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative aspect-square">
        <img
          src={match.imageUrl}
          alt={match.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-md">
          <Heart className="h-4 w-4 text-rose-500" />
          <span className="text-sm font-medium">{match.matchScore}%</span>
        </div>
        {match.isVerified && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Award className="h-3 w-3 mr-1" />
            Verified
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{match.name}</h3>
            <p className="text-sm text-gray-500">
              {match.breed} • {match.age} 
            </p>
          </div>
          
           <UserAvatar img={match.owner.avatarUrl} />  
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{match.distance} km away</span>
          </div>
          {/* <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Last active {match.lastActive}</span>
          </div> */}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {match.temperament.map((trait, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>

        <div >
          <button
            onClick={onMessage}
            className="flex w-full items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
}