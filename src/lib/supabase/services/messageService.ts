import { supabase } from '../../supabase';
import type { Message } from '../../../types/message';

class MessageService {
    async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),` +
            `and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
          )
          .order('created_at', { ascending: true });
      
        if (error) throw error;
        return data || [];
      }

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {

    // 
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return {
        id: data.id,
        senderId: data.sender_id,
        receiverId: data.receiver_id,
        content: data.content,
        read: data.read,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
  }

  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);

    if (error) throw error;
  }

  // Add these methods to your messageService
  async getConversation(userId: string, otherUserId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),` +
        `and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true });
  
    if (error) throw error;
  
    return (data || []).map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      createdAt: msg.created_at,
      read: msg.read,
      updatedAt : msg.updated_at
    }));
  }
  
  subscribeToConversation(userId: string, otherUserId: string, callback: (message: Message) => void) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId}))`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  }
}

export const messageService = new MessageService();