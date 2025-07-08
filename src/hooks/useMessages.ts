import { useState, useEffect, useCallback } from 'react';
import { messageService } from '../lib/supabase/services/messageService';
import { useAuth } from '../context/AuthContext';
import type { Message } from '../types/message';

export function useMessages(otherUserId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMessages = useCallback(async () => {
    if (!user?.id || !otherUserId) return;

    try {
      setLoading(true);
      // Fetch conversation between current user and other user
      const data = await messageService.getConversation(user.id, otherUserId);
      
      // Mark all received messages as read
      const unreadMessages = data.filter(msg => 
        msg.receiverId === user.id && !msg.read
      );
      
      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map(msg => messageService.markAsRead(msg.id))
        );
      }
      
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err : new Error('Failed to load messages'));
    } finally {
      setLoading(false);
    }
  }, [user?.id, otherUserId]);


  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !otherUserId) return;

    try {
      const message = await messageService.sendMessage(user.id, otherUserId, content);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [user?.id, otherUserId]);

  useEffect(() => {
    loadMessages();

    if (user?.id && otherUserId) {
      const subscription = messageService.subscribeToConversation(
        user.id, 
        otherUserId, 
        (newMessage) => {
          setMessages(prev => [...prev, newMessage]);
          // Mark message as read if we're the receiver
          if (newMessage.receiverId === user.id) {
            messageService.markAsRead(newMessage.id);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id, otherUserId, loadMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refresh: loadMessages
  };
}