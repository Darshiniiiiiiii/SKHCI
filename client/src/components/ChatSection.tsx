import { useState, useEffect, useRef } from 'react';
import { Message, ActiveUser } from '@/lib/types';

interface ChatSectionProps {
  isActive: boolean;
}

export default function ChatSection({ isActive }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [activeUser, setActiveUser] = useState<ActiveUser>('user1');
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // Load saved active user from localStorage
    const savedUser = localStorage.getItem('activeUser') as ActiveUser | null;
    if (savedUser) {
      setActiveUser(savedUser);
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

  const switchUser = (user: ActiveUser) => {
    setActiveUser(user);
    localStorage.setItem('activeUser', user);
  };

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const newMessage: Message = {
      text: messageInput,
      user: activeUser,
      timestamp
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <section id="chat-section" className={`${isActive ? '' : 'hidden'} h-full flex flex-col p-6`}>
      <div className="bg-white rounded-lg shadow-md p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Chat</h3>
          {/* User Switcher */}
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button 
              id="user1Button" 
              className={`py-1 px-4 rounded-full transition ${activeUser === 'user1' ? 'bg-primary text-white font-medium' : ''}`}
              onClick={() => switchUser('user1')}
            >
              User 1
            </button>
            <button 
              id="user2Button" 
              className={`py-1 px-4 rounded-full transition ${activeUser === 'user2' ? 'bg-secondary text-white font-medium' : ''}`}
              onClick={() => switchUser('user2')}
            >
              User 2
            </button>
          </div>
        </div>
        
        <div 
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50" 
          id="chatBox"
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
                <span>{message.user === 'user1' ? 'U1' : 'U2'}</span>
              </div>
              <div 
                className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                  message.user === 'user1' 
                    ? 'bg-user1 rounded-bl-none' 
                    : 'bg-user2 rounded-br-none'
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex mt-2">
          <input 
            ref={inputRef}
            type="text" 
            id="chatInput" 
            className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:border-primary" 
            placeholder="Type a message..." 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            id="sendButton" 
            className="bg-primary text-white py-2 px-4 rounded-r-lg hover:bg-primary/90 transition" 
            onClick={sendMessage}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        
        {/* Active user indicator */}
        <div className="text-sm text-gray-500 mt-2">
          Typing as: <span 
            id="activeUserIndicator" 
            className={`font-medium ${activeUser === 'user1' ? 'text-primary' : 'text-secondary'}`}
          >
            {activeUser === 'user1' ? 'User 1' : 'User 2'}
          </span>
        </div>
      </div>
    </section>
  );
}
