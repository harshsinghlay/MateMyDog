import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../lib/supabase/services/notifcationService';
import type { Notification } from '../../types/message';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

export function NotificationPanel({ notifications, onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark notification as read
      await notificationService.markAsRead(notification.id);
      
      // Navigate based on notification type
      if (notification.type === 'message') {
        navigate('/chats', { 
          state: { userId: notification.data?.sender_id } 
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAllAsRead(user.id);
      onClose();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No new notifications
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-start space-x-3"
              >
                <div className="flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}