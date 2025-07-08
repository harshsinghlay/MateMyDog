import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../lib/supabase/services/userService';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import type { User } from '../../types/user';
import { ChatWindow } from './ChatWindow';

export function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await userService.getAllUsers();
        const activeUsers = allUsers.filter(u => u.id !== user?.id && u.isActive);
        setUsers(activeUsers);
        setFilteredUsers(activeUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [user?.id]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredUsers(
      users.filter(
        u =>
          u.fullName?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, users]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className=" flex h-full overflow-hidden">
      {/* User List */}
      <div className={`${selectedUser ? 'hidden md:block' : 'w-full'} md:w-1/3 border-r border-gray-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b shrink-0">
          <h2 className="text-lg font-medium text-gray-900">Messages</h2>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Scrollable User List */}
        <div className=" overflow-y-auto flex-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                  selectedUser?.id === user.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-10 w-10 rounded-full" />
                  ) : (
                    <span className="text-gray-500 text-sm">{user.fullName?.[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">No users found.</p>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`${selectedUser ? 'w-full' : 'hidden'} md:flex-1 flex flex-col`}>
        {selectedUser ? (
          <>
            <div className="md:hidden px-4 py-2 border-b flex items-center shrink-0">
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            {/* <div className="flex-1 overflow-y-hidden"> */}
              <ChatWindow otherUser={selectedUser} />
            {/* </div> */}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
