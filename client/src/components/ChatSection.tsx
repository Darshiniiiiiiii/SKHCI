import { useState, useEffect, useRef } from 'react';
import { Message, ActiveUser, ChatRoom, ChatView, User } from '@/lib/types';
import { initializeData, STORAGE_KEYS, users, createMessage, addMessageToRoom, getMessagesForRoom, createRoom } from '@/lib/sampleData';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMemberUser1Selected, setNewMemberUser1Selected] = useState(false);
  const [newMemberUser2Selected, setNewMemberUser2Selected] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  
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
  
  // Add member functionality
  const addMemberToGroup = () => {
    if (!activeRoom) return;
    
    const currentRoom = chatRooms.find(room => room.id === activeRoom);
    if (!currentRoom || !currentRoom.isGroup) return;
    
    // Create copy of current room
    const updatedRoom = { ...currentRoom };
    
    // Add selected members if they're not already in the room
    let membersAdded = false;
    
    if (newMemberUser1Selected && !updatedRoom.participants.includes('user1')) {
      updatedRoom.participants.push('user1');
      membersAdded = true;
    }
    
    if (newMemberUser2Selected && !updatedRoom.participants.includes('user2')) {
      updatedRoom.participants.push('user2');
      membersAdded = true;
    }
    
    if (newMemberName.trim() !== '') {
      // In a real app, we would add this user to the database
      // For this demo, just add a notification message
      const notificationMessage = createMessage(`New member "${newMemberName}" was added to the group.`, 'user1', false, ['system']);
      addMessageToRoom(activeRoom, notificationMessage);
      membersAdded = true;
    }
    
    if (membersAdded) {
      // Update the rooms array
      const updatedRooms = chatRooms.map(room => 
        room.id === activeRoom ? updatedRoom : room
      );
      
      setChatRooms(updatedRooms);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(updatedRooms));
      
      // Reload messages
      loadMessagesForRoom(activeRoom);
      
      // Reset the form
      setNewMemberUser1Selected(false);
      setNewMemberUser2Selected(false);
      setNewMemberName('');
    }
    
    // Close the dialog
    setShowAddMemberDialog(false);
  };
  
  // Get the current room name
  const activeRoomData = chatRooms.find(room => room.id === activeRoom);
  const activeRoomName = activeRoomData?.name || 'Chat';
  const isGroupChat = activeRoomData?.isGroup || false;
  
  // Filter rooms based on the selected view
  const filteredRooms = chatView === 'all' 
    ? chatRooms 
    : chatView === 'direct' 
      ? chatRooms.filter(room => !room.isGroup) 
      : chatRooms.filter(room => room.isGroup);

  return (
    <section id="chat-section" className={`${isActive ? '' : 'hidden'} h-full flex flex-col p-6`}>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <h3 className="text-xl font-medium flex items-center">
            <i className="fas fa-comments mr-2"></i>
            Chat Center
          </h3>
          {/* User Switcher */}
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1">
            <button 
              id="user1Button" 
              className={`py-1 px-4 rounded-full transition ${activeUser === 'user1' ? 'bg-white text-violet-700 font-medium shadow-md' : 'text-white hover:bg-white/20'}`}
              onClick={() => switchUser('user1')}
            >
              <span className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center mr-1">
                  {users.user1.avatar}
                </span>
                {users.user1.name}
              </span>
            </button>
            <button 
              id="user2Button" 
              className={`py-1 px-4 rounded-full transition ${activeUser === 'user2' ? 'bg-white text-violet-700 font-medium shadow-md' : 'text-white hover:bg-white/20'}`}
              onClick={() => switchUser('user2')}
            >
              <span className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center mr-1">
                  {users.user2.avatar}
                </span>
                {users.user2.name}
              </span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar with chat rooms */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-800">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
              <div className="mb-2 flex space-x-1">
                <button 
                  className={`text-sm py-1 px-2 rounded-md transition ${
                    chatView === 'all' 
                      ? 'bg-violet-600 text-white font-medium shadow-sm' 
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => filterRooms('all')}
                >
                  All
                </button>
                <button 
                  className={`text-sm py-1 px-2 rounded-md transition ${
                    chatView === 'direct' 
                      ? 'bg-violet-600 text-white font-medium shadow-sm' 
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => filterRooms('direct')}
                >
                  Direct
                </button>
                <button 
                  className={`text-sm py-1 px-2 rounded-md transition ${
                    chatView === 'group' 
                      ? 'bg-violet-600 text-white font-medium shadow-sm' 
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
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
                  className="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md py-1 px-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500" 
                />
                <button 
                  onClick={createNewRoom}
                  className="bg-violet-600 text-white py-1 px-2 rounded-r-md text-sm hover:bg-violet-700 transition"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredRooms.map(room => (
                <div 
                  key={room.id}
                  className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                    activeRoom === room.id 
                      ? 'bg-violet-50 dark:bg-violet-900/30 border-l-4 border-violet-600' 
                      : 'border-l-4 border-transparent'
                  }`}
                  onClick={() => switchRoom(room.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    room.isGroup 
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600' 
                      : 'bg-gradient-to-br from-violet-600 to-indigo-700'
                  }`}>
                    <i className={`fas ${room.isGroup ? 'fa-users' : 'fa-user'} text-lg`}></i>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="font-medium dark:text-white">{room.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      {room.isGroup ? (
                        <>
                          <i className="fas fa-users text-xs mr-1"></i>
                          <span>{room.participants.length} members</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-lock text-xs mr-1"></i>
                          <span>Private chat</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  isGroupChat 
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600' 
                    : 'bg-gradient-to-br from-violet-600 to-indigo-700'
                } mr-2`}>
                  <i className={`fas ${isGroupChat ? 'fa-users' : 'fa-user'}`}></i>
                </div>
                <div>
                  <div className="font-medium dark:text-white">{activeRoomName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {activeRoomData?.participants.length || 0} participants
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isGroupChat && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 bg-violet-50 border-violet-200 hover:bg-violet-100 dark:bg-gray-700 dark:border-gray-600"
                          onClick={() => setShowAddMemberDialog(true)}
                        >
                          <i className="fas fa-user-plus text-violet-600 dark:text-violet-400"></i>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add member to group</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <div className="flex items-center">
                  <Checkbox 
                    id="private-msg" 
                    checked={isPrivate} 
                    onCheckedChange={() => setIsPrivate(!isPrivate)}
                    className="data-[state=checked]:bg-violet-600"
                  />
                  <label 
                    htmlFor="private-msg" 
                    className="ml-2 text-sm dark:text-gray-300 cursor-pointer"
                  >
                    Private
                  </label>
                </div>
              </div>
            </div>
            
            {/* Chat messages */}
            <div 
              ref={chatBoxRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900" 
            >
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex mb-4 items-end ${message.user === 'user1' ? '' : 'flex-row-reverse'}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      message.user === 'user1' 
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600 mr-2' 
                        : 'bg-gradient-to-br from-purple-600 to-indigo-700 ml-2'
                    }`}
                  >
                    <span>{message.user === 'user1' ? users.user1.avatar : users.user2.avatar}</span>
                  </div>
                  
                  <div 
                    className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                      message.user === 'user1' 
                        ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-bl-none' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                    } ${message.tags?.includes('system') ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium flex items-center">
                        {message.user === 'user1' ? users.user1.name : users.user2.name}
                        {message.isPrivate && (
                          <span className="ml-2 inline-flex items-center bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                            <i className="fas fa-lock text-xs mr-1"></i> Private
                          </span>
                        )}
                      </span>
                      <span className="text-xs opacity-80 ml-2">{message.timestamp}</span>
                    </div>
                    
                    <p className="mt-1 leading-relaxed">{message.text}</p>
                    
                    {/* Tags */}
                    {message.tags && message.tags.length > 0 && !message.tags.includes('system') && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="inline-block bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                            {tag.startsWith('@') ? (
                              <i className="fas fa-at mr-1 text-xs"></i>
                            ) : tag.startsWith('#') ? (
                              <i className="fas fa-hashtag mr-1 text-xs"></i>
                            ) : (
                              <i className="fas fa-tag mr-1 text-xs"></i>
                            )}
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
              <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800">
                {activeTags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-violet-50 text-violet-700 border-violet-200 dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 px-2 py-1 flex items-center"
                  >
                    {tag.startsWith('@') ? (
                      <i className="fas fa-at mr-1.5 text-xs"></i>
                    ) : tag.startsWith('#') ? (
                      <i className="fas fa-hashtag mr-1.5 text-xs"></i>
                    ) : (
                      <i className="fas fa-tag mr-1.5 text-xs"></i>
                    )}
                    {tag}
                    <button 
                      className="ml-1.5 text-violet-500 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                      onClick={() => removeTag(tag)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Input area with tag support */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
              <div className="flex mb-2">
                <Input
                  type="text" 
                  className="flex-1 rounded-l-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus-visible:ring-violet-500" 
                  placeholder="Add a tag... (e.g. @name, #topic)" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                />
                <Button 
                  variant="secondary"
                  className="rounded-l-none rounded-r-md dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  onClick={addTag}
                >
                  Add Tag
                </Button>
              </div>
              
              <div className="flex">
                <textarea 
                  ref={inputRef}
                  id="chatInput" 
                  rows={2}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none dark:bg-gray-700 dark:text-white" 
                  placeholder="Type a message..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button 
                  className="rounded-l-none rounded-r-md bg-violet-600 hover:bg-violet-700"
                  onClick={sendMessage}
                >
                  <i className="fas fa-paper-plane mr-1"></i>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Members to {activeRoomName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Select existing users:</h4>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="user1-checkbox" 
                    checked={newMemberUser1Selected}
                    onCheckedChange={(checked) => setNewMemberUser1Selected(checked === true)}
                    className="data-[state=checked]:bg-violet-600"
                  />
                  <label 
                    htmlFor="user1-checkbox" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mr-2">
                      {users.user1.avatar}
                    </span>
                    {users.user1.name}
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="user2-checkbox" 
                    checked={newMemberUser2Selected}
                    onCheckedChange={(checked) => setNewMemberUser2Selected(checked === true)}
                    className="data-[state=checked]:bg-violet-600"
                  />
                  <label 
                    htmlFor="user2-checkbox" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mr-2">
                      {users.user2.avatar}
                    </span>
                    {users.user2.name}
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Add a new member:</h4>
              <Input
                placeholder="Enter new member name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="dark:bg-gray-800 dark:border-gray-700 focus-visible:ring-violet-500"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={addMemberToGroup}
              disabled={!newMemberUser1Selected && !newMemberUser2Selected && newMemberName.trim() === ''}
            >
              <i className="fas fa-user-plus mr-2"></i>
              Add to Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
