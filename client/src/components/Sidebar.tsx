import { useState } from 'react';
import { ActiveSection } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  onSectionChange: (section: ActiveSection) => void;
  activeSection: ActiveSection;
  userPresenceStatus?: 'present' | 'away' | 'fake-presence';
}

export default function Sidebar({ onSectionChange, activeSection, userPresenceStatus = 'present' }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  // Determine status color
  const getStatusColor = () => {
    switch (userPresenceStatus) {
      case 'present':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'fake-presence':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Determine status text
  const getStatusText = () => {
    switch (userPresenceStatus) {
      case 'present':
        return 'Available';
      case 'away':
        return 'Away';
      case 'fake-presence':
        return 'Fake Presence';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <aside 
      className={`${expanded ? 'w-64' : 'w-16'} bg-violet-900 text-white transition-all duration-300 flex flex-col shadow-lg`}
    >
      <div className="flex items-center justify-between p-4 border-b border-violet-700">
        {expanded && <h2 className="text-lg font-medium">Planning</h2>}
        <button 
          onClick={toggleSidebar} 
          className={`${expanded ? 'ml-auto' : 'mx-auto'} text-violet-300 hover:text-white transition-colors p-1`}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <i className={`fas ${expanded ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>
      </div>
      
      {/* User presence indicator */}
      <div className="flex items-center px-4 py-2 border-b border-violet-700">
        {expanded ? (
          <div className="flex items-center w-full">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} mr-2`}></div>
            <span className="text-sm">{getStatusText()}</span>
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} mx-auto`}></div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{getStatusText()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <nav className="flex-1">
        <TooltipProvider>
          <ul className="py-4 space-y-3">
            <li className="px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center w-full p-3 rounded-lg transition-all ${
                      activeSection === 'chat-section' 
                        ? 'bg-violet-800 text-white' 
                        : 'text-violet-200 hover:bg-violet-800/50'
                    }`}
                    onClick={() => onSectionChange('chat-section')}
                    aria-label="Chats"
                  >
                    <i className="fas fa-comments text-lg"></i>
                    {expanded && <span className="ml-3">Chats</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Chats</p>
                </TooltipContent>
              </Tooltip>
            </li>
            
            <li className="px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center w-full p-3 rounded-lg transition-all ${
                      activeSection === 'dashboard-section' 
                        ? 'bg-violet-800 text-white' 
                        : 'text-violet-200 hover:bg-violet-800/50'
                    }`}
                    onClick={() => onSectionChange('dashboard-section')}
                    aria-label="Dashboards"
                  >
                    <i className="fas fa-chart-line text-lg"></i>
                    {expanded && <span className="ml-3">Dashboards</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Dashboards</p>
                </TooltipContent>
              </Tooltip>
            </li>
            
            <li className="px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center w-full p-3 rounded-lg transition-all ${
                      activeSection === 'statistical-dashboard-section' 
                        ? 'bg-violet-800 text-white' 
                        : 'text-violet-200 hover:bg-violet-800/50'
                    }`}
                    onClick={() => onSectionChange('statistical-dashboard-section')}
                    aria-label="Statistical Dashboard"
                  >
                    <i className="fas fa-chart-bar text-lg"></i>
                    {expanded && <span className="ml-3">Stats Dashboard</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Statistical Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </li>
            
            <li className="px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center w-full p-3 rounded-lg transition-all ${
                      activeSection === 'calendar-section' 
                        ? 'bg-violet-800 text-white' 
                        : 'text-violet-200 hover:bg-violet-800/50'
                    }`}
                    onClick={() => onSectionChange('calendar-section')}
                    aria-label="Calendar"
                  >
                    <i className="fas fa-calendar-alt text-lg"></i>
                    {expanded && <span className="ml-3">Calendar</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Calendar</p>
                </TooltipContent>
              </Tooltip>
            </li>
            
            <li className="px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center w-full p-3 rounded-lg transition-all ${
                      activeSection === 'settings-section' 
                        ? 'bg-violet-800 text-white' 
                        : 'text-violet-200 hover:bg-violet-800/50'
                    }`}
                    onClick={() => onSectionChange('settings-section')}
                    aria-label="Settings"
                  >
                    <i className="fas fa-cog text-lg"></i>
                    {expanded && <span className="ml-3">Settings</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
