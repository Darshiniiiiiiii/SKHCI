export interface Message {
  text: string;
  user: 'user1' | 'user2';
  timestamp: string;
}

export type ActiveUser = 'user1' | 'user2';

export type ActiveSection = 'chat-section' | 'dashboard-section' | 'calendar-section' | 'settings-section';
