import React, { useEffect, useRef } from 'react';
import { useMessages } from '../../hooks/useMessages';
import TextareaAutosize from 'react-textarea-autosize';
import { Send } from 'lucide-react';
import type { User } from '../../types/user';
import { useAuth } from '../../context/AuthContext';

interface ChatWindowProps {
  otherUser: User;
}

export function ChatWindow({ otherUser }: ChatWindowProps) {
    const { messages, loading, sendMessage } = useMessages(otherUser.id);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user: currentUser } = useAuth();
  
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const input = form.elements.namedItem('message') as HTMLTextAreaElement;
      const content = input.value.trim();
  
      if (!content) return;
  
      try {
        await sendMessage(content);
        input.value = '';
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
  
    const formatMessageTime = (timestamp: string) => {
      try {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }).format(date);
      } catch (error) {
        return '';
      }
    };
  
    if (!currentUser) {
      return <div>Loading user data...</div>;
    }
  
    return (
      <div className="flex flex-col h-full overflow-y-hidden bg-[#efeae2] bg-opacity-50">
        {/* Fixed Header */}
        <div className=" px-6 py-4 bg-[#f0f2f5] border-b flex items-center space-x-3 ">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {otherUser.avatarUrl ? (
              <img src={otherUser.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="text-gray-500 text-sm">{otherUser.fullName?.[0]}</span>
            )}
          </div>
          <div>
            <h2 className="font-medium text-gray-900">{otherUser.fullName}</h2>
            <p className="text-sm text-gray-500">{otherUser.email}</p>
          </div>
        </div>
  
        {/* Scrollable Messages */}
        <div className=" overflow-y-auto  p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isSentByMe = currentUser && message.senderId === currentUser.id;
  
              return (
                <div
                  key={message.id}
                  className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`relative max-w-[65%] px-3 py-2 rounded-lg ${
                      isSentByMe
                        ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none'
                        : 'bg-white text-gray-900 rounded-tl-none'
                    }`}
                  >
                    <p className="break-words text-sm">{message.content}</p>
                    <div className="text-[11px] text-gray-500 mt-1 ">
                      {formatMessageTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
  
        {/* Fixed Input */}
        <form onSubmit={handleSubmit} className="bg-[#f0f2f5] p-4 ">
          <div className="flex items-end space-x-2">
            <TextareaAutosize
              name="message"
              placeholder="Type a message..."
              minRows={1}
              maxRows={5}
              className="flex-1 resize-none rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2 bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button
              type="submit"
              className="p-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    );
  }
  