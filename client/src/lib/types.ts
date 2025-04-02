export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  text: string;
  user: 'user1' | 'user2';
  timestamp: string;
  tags?: string[];
  isPrivate?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: ('user1' | 'user2')[];
  isGroup: boolean;
  messages: string[]; // Message IDs
}

export interface Meeting {
  id: string;
  title: string;
  start: Date;
  end: Date;
  participants: ('user1' | 'user2')[];
  room?: string;
  description?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  features: string[];
  isAvailable: boolean;
}

export interface Notification {
  id: string;
  text: string;
  timestamp: string;
  type: 'mention' | 'meeting' | 'deadline' | 'update';
  read: boolean;
  relatedId?: string; // Meeting ID, Message ID, etc.
  tags?: string[];
}

export type ActiveUser = 'user1' | 'user2';

export type ActiveSection = 'chat-section' | 'dashboard-section' | 'calendar-section' | 'settings-section' | 'statistical-dashboard-section';

export type ChatView = 'direct' | 'group' | 'all';
