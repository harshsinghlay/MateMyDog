export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Notification {
    id: string;
    userId: string;
    type: 'message' | 'like' | 'comment';
    content: string;
    read: boolean;
    data: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  }