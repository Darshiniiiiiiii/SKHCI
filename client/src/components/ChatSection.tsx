import { useState, useEffect, useRef } from 'react';
import { Message, ActiveUser, ChatRoom, ChatView, User } from '@/lib/types';
import { initializeData, STORAGE_KEYS, users, createMessage, addMessageToRoom, getMessagesForRoom, createRoom } from '@/lib/sampleData';

interface ChatSectionProps {
  isActive: boolean;
}

export default function ChatSection({ isActive }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [activeUser, setActiveUser] = useState<ActiveUser>('user1');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>('');
  const [chatView, setChatView] = useState<ChatView>('all');
  const [isPrivate, setIsPrivate] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const newRoomNameRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Initialize data if not present
    initializeData();
    
    // Load saved messages and rooms from localStorage
    loadChatRooms();
    
    // Load saved active user from localStorage
    const savedUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) as ActiveUser | null;
    if (savedUser) {
      setActiveUser(savedUser);
    }
    
    // Load saved active room from localStorage
    const savedRoom = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROOM);
    if (savedRoom) {
      setActiveRoom(savedRoom);
      loadMessagesForRoom(savedRoom);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Focus input when section becomes active
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);
  
  const loadChatRooms = () => {
    const roomsString = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (roomsString) {
      const rooms = JSON.parse(roomsString);
      setChatRooms(rooms);
      
      // If no active room is set, use the first one
      if (!activeRoom && rooms.length > 0) {
        setActiveRoom(rooms[0].id);
        loadMessagesForRoom(rooms[0].id);
      }
    }
  };
  
  const loadMessagesForRoom = (roomId: string) => {
    const roomMessages = getMessagesForRoom(roomId);
    setMessages(roomMessages);
  };

  const switchUser = (user: ActiveUser) => {
    setActiveUser(user);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, user);
  };
  
  const switchRoom = (roomId: string) => {
    setActiveRoom(roomId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROOM, roomId);
    loadMessagesForRoom(roomId);
  };
  
  const filterRooms = (view: ChatView) => {
    setChatView(view);
  };
  
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    // Don't add duplicate tags
    if (!activeTags.includes(tagInput)) {
      const newTags = [...activeTags, tagInput];
      setActiveTags(newTags);
    }
    
    setTagInput('');
  };
  
  const removeTag = (tag: string) => {
    const newTags = activeTags.filter(t => t !== tag);
    setActiveTags(newTags);
  };

  const createNewRoom = () => {
    if (!newRoomNameRef.current || !newRoomNameRef.current.value.trim()) return;
    
    const roomName = newRoomNameRef.current.value.trim();
    const isGroup = true; // We'll make this a group chat
    
    const newRoom = createRoom(roomName, ['user1', 'user2'], isGroup);
    
    setChatRooms([...chatRooms, newRoom]);
    newRoomNameRef.current.value = '';
    
    // Switch to the new room
    switchRoom(newRoom.id);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !activeRoom) return;

    const newMessage = createMessage(messageInput, activeUser, isPrivate, activeTags);
    addMessageToRoom(activeRoom, newMessage);
    
    // Reload messages for the room
    loadMessagesForRoom(activeRoom);
    
    setMessageInput('');
    
    // Clear tags after sending
    setActiveTags([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  // Get the current room name
  const activeRoomData = chatRooms.find(room => room.id === activeRoom);
  const activeRoomName = activeRoomData?.name || 'Chat';
  
  // Filter rooms based on the selected view
  const filteredRooms = chatView === 'all' 
    ? chatRooms 
    : chatView === 'direct' 
      ? chatRooms.filter(room => !room.isGroup) 
      : chatRooms.filter(room => room.isGroup);

  return (
    <section id="chat-section" className={`${isActive ? '' : 'hidden'} h-full flex flex-col p-6`}>
      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-medium">Chat Center</h3>
          {/* User Switcher */}
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button 
              id="user1Button" 
              className={`py-1 px-4 rounded-full transition ${activeUser === 'user1' ? 'bg-primary text-white font-medium' : ''}`}
              onClick={() => switchUser('user1')}
            >
              {users.user1.name}
            </button>
            <button 
              id="user2Button" 
              className={`py-1 px-4 rounded-full transition ${activeUser === 'user2' ? 'bg-secondary text-white font-medium' : ''}`}
              onClick={() => switchUser('user2')}
            >
              {users.user2.name}
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar with chat rooms */}
          <div className="w-64 border-r overflow-y-auto flex flex-col">
            <div className="p-3 border-b">
              <div className="mb-2 flex space-x-1">
                <button 
                  className={`text-sm py-1 px-2 rounded ${chatView === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  onClick={() => filterRooms('all')}
                >
                  All
                </button>
                <button 
                  className={`text-sm py-1 px-2 rounded ${chatView === 'direct' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  onClick={() => filterRooms('direct')}
                >
                  Direct
                </button>
                <button 
                  className={`text-sm py-1 px-2 rounded ${chatView === 'group' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                  onClick={() => filterRooms('group')}
                >
                  Group
                </button>
              </div>
              
              <div className="flex">
                <input 
                  ref={newRoomNameRef}
                  type="text" 
                  placeholder="New group name..." 
                  className="flex-1 text-sm border border-gray-300 rounded-l py-1 px-2" 
                />
                <button 
                  onClick={createNewRoom}
                  className="bg-primary text-white py-1 px-2 rounded-r text-sm"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredRooms.map(room => (
                <div 
                  key={room.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center ${activeRoom === room.id ? 'bg-gray-100' : ''}`}
                  onClick={() => switchRoom(room.id)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${room.isGroup ? 'bg-green-500' : 'bg-blue-500'}`}>
                    <i className={`fas ${room.isGroup ? 'fa-users' : 'fa-user'}`}></i>
                  </div>
                  <div className="ml-2 flex-1">
                    <div className="font-medium">{room.name}</div>
                    <div className="text-xs text-gray-500">
                      {room.isGroup ? `${room.participants.length} members` : 'Private chat'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="p-3 border-b flex justify-between items-center">
              <div className="font-medium">{activeRoomName}</div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isPrivate} 
                    onChange={() => setIsPrivate(!isPrivate)} 
                    className="mr-1" 
                  />
                  Private
                </label>
              </div>
            </div>
            
            {/* Chat messages */}
            <div 
              ref={chatBoxRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50" 
            >
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex mb-4 items-end ${message.user === 'user1' ? '' : 'flex-row-reverse'}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      message.user === 'user1' ? 'bg-primary mr-2' : 'bg-secondary ml-2'
                    }`}
                  >
                    <span>{message.user === 'user1' ? users.user1.avatar : users.user2.avatar}</span>
                  </div>
                  <div 
                    className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                      message.user === 'user1' 
                        ? 'bg-primary text-white rounded-bl-none' 
                        : 'bg-secondary text-white rounded-br-none'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium">
                        {message.user === 'user1' ? users.user1.name : users.user2.name}
                        {message.isPrivate && <i className="fas fa-lock ml-2 text-xs"></i>}
                      </span>
                      <span className="text-xs opacity-80 ml-2">{message.timestamp}</span>
                    </div>
                    <p className="mt-1">{message.text}</p>
                    
                    {/* Tags */}
                    {message.tags && message.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tag input */}
            {activeTags.length > 0 && (
              <div className="p-2 border-t flex flex-wrap gap-1 bg-gray-50">
                {activeTags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                    {tag}
                    <button 
                      className="ml-1 text-primary/70 hover:text-primary"
                      onClick={() => removeTag(tag)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Input area with tag support */}
            <div className="p-3 border-t flex flex-col">
              <div className="flex mb-2">
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded-l py-1 px-3 text-sm" 
                  placeholder="Add a tag... (e.g. @name, #topic)" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                />
                <button 
                  className="bg-gray-200 text-gray-700 py-1 px-3 rounded-r text-sm"
                  onClick={addTag}
                >
                  Add Tag
                </button>
              </div>
              
              <div className="flex">
                <textarea 
                  ref={inputRef}
                  id="chatInput" 
                  rows={2}
                  className="flex-1 border border-gray-300 rounded-l py-2 px-3 focus:outline-none focus:border-primary resize-none" 
                  placeholder="Type a message..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button 
                  id="sendButton" 
                  className="bg-primary text-white py-2 px-4 rounded-r hover:bg-primary/90 transition" 
                  onClick={sendMessage}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
