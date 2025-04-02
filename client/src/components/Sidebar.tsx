import { useState, useEffect } from 'react';
import { ActiveSection, Notification } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { defaultNotifications, STORAGE_KEYS } from '@/lib/sampleData';

interface SidebarProps {
  onSectionChange: (section: ActiveSection) => void;
  activeSection: ActiveSection;
  userPresenceStatus?: 'present' | 'away' | 'fake-presence';
}

export default function Sidebar({ onSectionChange, activeSection, userPresenceStatus = 'present' }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCounts, setUnreadCounts] = useState({
    mention: 0,
    meeting: 0,
    deadline: 0,
    update: 0
  });
  
  // Load notifications
  useEffect(() => {
    const notificationsString = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let loadedNotifications: Notification[];
    
    if (notificationsString) {
      loadedNotifications = JSON.parse(notificationsString);
    } else {
      loadedNotifications = defaultNotifications;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifications));
    }
    
    setNotifications(loadedNotifications);
    
    // Count unread notifications by type
    const counts = {
      mention: 0,
      meeting: 0,
      deadline: 0,
      update: 0
    };
    
    loadedNotifications.forEach(notification => {
      if (!notification.read) {
        counts[notification.type]++;
      }
    });
    
    setUnreadCounts(counts);
  }, []);
  
  const totalUnread = unreadCounts.mention + unreadCounts.meeting + unreadCounts.deadline + unreadCounts.update;
  
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
                    <div className="relative">
                      <i className="fas fa-comments text-lg"></i>
                      {unreadCounts.mention > 0 && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] font-bold">
                          {unreadCounts.mention}
                        </div>
                      )}
                    </div>
                    {expanded && (
                      <div className="ml-3 flex items-center justify-between flex-1">
                        <span>Chats</span>
                        {totalUnread > 0 && (
                          <div className="flex space-x-1">
                            {unreadCounts.mention > 0 && (
                              <Badge variant="destructive" className="h-5 bg-rose-500 text-[10px] px-1.5">
                                <i className="fas fa-at mr-1"></i> {unreadCounts.mention}
                              </Badge>
                            )}
                            {unreadCounts.meeting > 0 && (
                              <Badge variant="destructive" className="h-5 bg-blue-500 text-[10px] px-1.5">
                                <i className="fas fa-calendar mr-1"></i> {unreadCounts.meeting}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="flex flex-col">
                    <p>Chats</p>
                    {unreadCounts.mention > 0 && (
                      <p className="text-xs text-rose-500">{unreadCounts.mention} new mentions</p>
                    )}
                  </div>
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
                    <div className="relative">
                      <i className="fas fa-chart-line text-lg"></i>
                      {unreadCounts.deadline > 0 && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold">
                          {unreadCounts.deadline}
                        </div>
                      )}
                    </div>
                    {expanded && (
                      <div className="ml-3 flex items-center justify-between flex-1">
                        <span>Dashboards</span>
                        {unreadCounts.deadline > 0 && (
                          <Badge variant="destructive" className="h-5 bg-amber-500 text-[10px] px-1.5">
                            <i className="fas fa-clock mr-1"></i> {unreadCounts.deadline}
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="flex flex-col">
                    <p>Dashboards</p>
                    {unreadCounts.deadline > 0 && (
                      <p className="text-xs text-amber-500">{unreadCounts.deadline} approaching deadlines</p>
                    )}
                  </div>
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
                    <div className="relative">
                      <i className="fas fa-chart-bar text-lg"></i>
                      {unreadCounts.update > 0 && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-bold">
                          {unreadCounts.update}
                        </div>
                      )}
                    </div>
                    {expanded && (
                      <div className="ml-3 flex items-center justify-between flex-1">
                        <span>Stats Dashboard</span>
                        {unreadCounts.update > 0 && (
                          <Badge variant="destructive" className="h-5 bg-green-500 text-[10px] px-1.5">
                            <i className="fas fa-sync-alt mr-1"></i> {unreadCounts.update}
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="flex flex-col">
                    <p>Statistical Dashboard</p>
                    {unreadCounts.update > 0 && (
                      <p className="text-xs text-green-500">{unreadCounts.update} project updates</p>
                    )}
                  </div>
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
                    <div className="relative">
                      <i className="fas fa-calendar-alt text-lg"></i>
                      {unreadCounts.meeting > 0 && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold">
                          {unreadCounts.meeting}
                        </div>
                      )}
                    </div>
                    {expanded && (
                      <div className="ml-3 flex items-center justify-between flex-1">
                        <span>Calendar</span>
                        {unreadCounts.meeting > 0 && (
                          <Badge variant="destructive" className="h-5 bg-blue-500 text-[10px] px-1.5">
                            <i className="fas fa-bell mr-1"></i> {unreadCounts.meeting}
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="flex flex-col">
                    <p>Calendar</p>
                    {unreadCounts.meeting > 0 && (
                      <p className="text-xs text-blue-500">{unreadCounts.meeting} meeting reminders</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </li>
            
            <li className="px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center w-full p-3 rounded-lg transition-all ${
                      activeSection === 'eye-gaze-section' 
                        ? 'bg-violet-800 text-white' 
                        : 'text-violet-200 hover:bg-violet-800/50'
                    }`}
                    onClick={() => onSectionChange('eye-gaze-section')}
                    aria-label="Eye Gazing"
                  >
                    <i className="fas fa-eye text-lg"></i>
                    {expanded && <span className="ml-3">Eye Gazing</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Eye Gazing Tracker</p>
                </TooltipContent>
              </Tooltip>
            </li>
            
            <li className="px-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center justify-center w-full p-3 rounded-lg transition-all ${
                      activeSection === 'account-section' 
                        ? 'bg-violet-800 text-white' 
                        : 'text-violet-200 hover:bg-violet-800/50'
                    }`}
                    onClick={() => onSectionChange('account-section')}
                    aria-label="Account"
                  >
                    <i className="fas fa-user-circle text-lg"></i>
                    {expanded && <span className="ml-3">Account</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Account Settings</p>
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
