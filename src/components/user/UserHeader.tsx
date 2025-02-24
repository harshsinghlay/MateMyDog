import React from 'react';
import { MapPin, Calendar, Shield, Settings } from 'lucide-react';
import type { User } from '../../types/user';

interface UserHeaderProps {
  user: User;
  isCurrentUser: boolean;
}

export function UserHeader({ user, isCurrentUser }: UserHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <img
              src={user.imageUrl}
              alt={user.name}
              className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-serif font-semibold text-gray-900">
                {user.name}
              </h1>
              {user.verified && (
                <Shield className="h-5 w-5 text-blue-500" />
              )}
            </div>

            {user.bio && (
              <p className="mt-2 text-gray-600 max-w-2xl">{user.bio}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {user.location.city}, {user.location.state}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex space-x-8">
                <div>
                  <span className="font-medium text-gray-900">{user.pets.length}</span>
                  <span className="ml-1 text-gray-500">pets</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{user.following}</span>
                  <span className="ml-1 text-gray-500">following</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{user.followers}</span>
                  <span className="ml-1 text-gray-500">followers</span>
                </div>
              </div>

              {isCurrentUser ? (
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}