import React from 'react';
import { Bell, Mail, Globe, Lock } from 'lucide-react';
import type { User } from '../../types/user';

interface UserSettingsProps {
  user: User;
}

export function UserSettings({ user }: UserSettingsProps) {
  const preferences = user.preferences || {
    emailNotifications: true,
    pushNotifications: true,
    matchingAlerts: true,
    privateProfile: false,
    language: 'en',
    timezone: 'UTC'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                <p className="text-sm text-gray-500">Get updates via email</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                <p className="text-sm text-gray-500">Get updates on your device</p>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.matchingAlerts}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-900">Matching Alerts</span>
                <p className="text-sm text-gray-500">Get notified about new matches</p>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Privacy</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.privateProfile}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-900">Private Profile</span>
              <p className="text-sm text-gray-500">Only show profile to followers</p>
            </div>
          </label>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select
                value={preferences.language}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <select
                value={preferences.timezone}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}