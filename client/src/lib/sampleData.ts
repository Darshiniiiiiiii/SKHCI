import { Message, ChatRoom, Meeting, Room, Notification, User } from './types';

// Sample Users
export const users: Record<string, User> = {
  user1: {
    id: 'user1',
    name: 'Darshini',
    avatar: 'D',
  },
  user2: {
    id: 'user2',
    name: 'Gowtham',
    avatar: 'G',
  }
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Sample Chat Rooms
export const defaultChatRooms: ChatRoom[] = [
  {
    id: 'direct-1',
    name: 'Private Chat',
    participants: ['user1', 'user2'],
    isGroup: false,
    messages: [],
  },
  {
    id: 'group-1',
    name: 'Project Planning',
    participants: ['user1', 'user2'],
    isGroup: true,
    messages: [],
  },
  {
    id: 'group-2',
    name: 'Design Team',
    participants: ['user1', 'user2'],
    isGroup: true,
    messages: [],
  },
];

// Sample Meetings
export const defaultMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    title: 'Sprint Planning',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 10, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 11, 30),
    participants: ['user1', 'user2'],
    room: 'room-1',
    description: 'Plan tasks for the upcoming sprint',
  },
  {
    id: 'meeting-2',
    title: 'Design Review',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 14, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 15, 0),
    participants: ['user1', 'user2'],
    room: 'room-2',
    description: 'Review design proposals for the new feature',
  },
];

// Sample Rooms
export const defaultRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Conference Room A',
    capacity: 10,
    features: ['Projector', 'Whiteboard', 'Video Conferencing'],
    isAvailable: true,
  },
  {
    id: 'room-2',
    name: 'Meeting Room B',
    capacity: 6,
    features: ['TV Screen', 'Whiteboard'],
    isAvailable: true,
  },
  {
    id: 'room-3',
    name: 'Collaboration Space',
    capacity: 15,
    features: ['Projector', 'Whiteboard', 'Video Conferencing', 'Standing Desks'],
    isAvailable: true,
  },
];

// Sample Notifications
export const defaultNotifications: Notification[] = [
  {
    id: 'notif-1',
    text: 'You were mentioned in Project Planning chat',
    timestamp: new Date().toISOString(),
    type: 'mention',
    read: false,
    relatedId: 'group-1',
    tags: ['@Darshini', 'urgent'],
  },
  {
    id: 'notif-2',
    text: 'Sprint Planning meeting starts in 1 hour',
    timestamp: new Date().toISOString(),
    type: 'meeting',
    read: false,
    relatedId: 'meeting-1',
  },
  {
    id: 'notif-3',
    text: 'Deadline for UI mockups is tomorrow',
    timestamp: new Date().toISOString(),
    type: 'deadline',
    read: true,
    tags: ['UI/UX', 'design'],
  },
];

// Local Storage Keys
export const STORAGE_KEYS = {
  MESSAGES: 'chatMessages',
  ROOMS: 'chatRooms',
  MEETINGS: 'meetings',
  AVAILABLE_ROOMS: 'availableRooms',
  NOTIFICATIONS: 'notifications',
  ACTIVE_USER: 'activeUser',
  ACTIVE_ROOM: 'activeRoom',
};

// Initialize data in localStorage if not present
export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(defaultChatRooms));
  }

  if (!localStorage.getItem(STORAGE_KEYS.MEETINGS)) {
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(defaultMeetings));
  }

  if (!localStorage.getItem(STORAGE_KEYS.AVAILABLE_ROOMS)) {
    localStorage.setItem(STORAGE_KEYS.AVAILABLE_ROOMS, JSON.stringify(defaultRooms));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifications));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_ROOM)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROOM, defaultChatRooms[0].id);
  }
};

// Helper function to create a new message
export const createMessage = (text: string, user: 'user1' | 'user2', isPrivate = false, tags: string[] = []): Message => {
  return {
    id: generateId(),
    text,
    user,
    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    isPrivate,
    tags
  };
};

// Helper function to add a message to a chat room
export const addMessageToRoom = (roomId: string, message: Message) => {
  const roomsString = localStorage.getItem(STORAGE_KEYS.ROOMS);
  if (!roomsString) return false;
  
  const rooms: ChatRoom[] = JSON.parse(roomsString);
  
  // Save the message first
  const messagesString = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  let messages: Record<string, Message> = messagesString ? JSON.parse(messagesString) : {};
  messages[message.id] = message;
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  
  // Then update the room
  const roomIndex = rooms.findIndex(r => r.id === roomId);
  if (roomIndex === -1) return false;
  
  rooms[roomIndex].messages.push(message.id);
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  
  return true;
};

// Helper function to get all messages for a room
export const getMessagesForRoom = (roomId: string): Message[] => {
  const roomsString = localStorage.getItem(STORAGE_KEYS.ROOMS);
  const messagesString = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  
  if (!roomsString || !messagesString) return [];
  
  const rooms: ChatRoom[] = JSON.parse(roomsString);
  const messages: Record<string, Message> = JSON.parse(messagesString);
  
  const room = rooms.find(r => r.id === roomId);
  if (!room) return [];
  
  return room.messages.map(id => messages[id]).filter(Boolean);
};

// Helper function to create a new room
export const createRoom = (name: string, participants: ('user1' | 'user2')[], isGroup: boolean): ChatRoom => {
  const newRoom: ChatRoom = {
    id: `${isGroup ? 'group' : 'direct'}-${generateId()}`,
    name,
    participants,
    isGroup,
    messages: [],
  };
  
  const roomsString = localStorage.getItem(STORAGE_KEYS.ROOMS);
  const rooms: ChatRoom[] = roomsString ? JSON.parse(roomsString) : [];
  
  rooms.push(newRoom);
  localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  
  return newRoom;
};

// Helper function to create a new meeting
export const createMeeting = (
  title: string, 
  start: Date, 
  end: Date, 
  participants: ('user1' | 'user2')[], 
  room?: string, 
  description?: string
): Meeting => {
  const newMeeting: Meeting = {
    id: `meeting-${generateId()}`,
    title,
    start,
    end,
    participants,
    room,
    description,
  };
  
  const meetingsString = localStorage.getItem(STORAGE_KEYS.MEETINGS);
  const meetings: Meeting[] = meetingsString ? JSON.parse(meetingsString) : [];
  
  meetings.push(newMeeting);
  localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  
  // Create a notification for this meeting
  const newNotification: Notification = {
    id: `notif-${generateId()}`,
    text: `New meeting: ${title}`,
    timestamp: new Date().toISOString(),
    type: 'meeting',
    read: false,
    relatedId: newMeeting.id,
  };
  
  const notificationsString = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications: Notification[] = notificationsString ? JSON.parse(notificationsString) : [];
  
  notifications.push(newNotification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  
  return newMeeting;
};