import React from 'react';
import { Award, Heart, Star } from 'lucide-react';
import { useUserStats } from '../../hooks/useUserStats';

interface UserStatsProps {
  userId: string;
}

export function UserStats({ userId }: UserStatsProps) {
  const { stats, loading } = useUserStats(userId);

  if (loading || !stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Statistics</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm text-gray-600">Successful Matches</span>
          </div>
          <span className="font-medium text-gray-900">{stats.totalMatches}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm text-gray-600">Breedings</span>
          </div>
          <span className="font-medium text-gray-900">{stats.successfulBreedings}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-gray-400 mr-3" />
            <span className="text-sm text-gray-600">Average Rating</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-900">{stats.averageRating}</span>
            <span className="text-sm text-gray-500 ml-1">/ 5</span>
          </div>
        </div>

        <div className="pt-6 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reviews Given</span>
            <span className="font-medium text-gray-900">{stats.reviewsGiven}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Reviews Received</span>
            <span className="font-medium text-gray-900">{stats.reviewsReceived}</span>
          </div>
        </div>
      </div>
    </div>
  );
}