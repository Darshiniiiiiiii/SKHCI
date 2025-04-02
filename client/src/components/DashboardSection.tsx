import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { 
  pendingWorkChartData, 
  performanceChartData, 
  completedWorkChartData, 
  notificationsChartData 
} from '@/lib/chartData';
import { ActiveUser, Notification } from '@/lib/types';
import { initializeData, STORAGE_KEYS, users, defaultNotifications } from '@/lib/sampleData';

Chart.register(...registerables);

interface DashboardSectionProps {
  isActive: boolean;
}

export default function DashboardSection({ isActive }: DashboardSectionProps) {
  const [pendingWorkFilter, setPendingWorkFilter] = useState('all');
  const [timeFrameFilter, setTimeFrameFilter] = useState('week');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeUser, setActiveUser] = useState<ActiveUser>('user1');
  
  const pendingWorkChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const completedWorkChartRef = useRef<HTMLCanvasElement>(null);
  const notificationsChartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Initialize data if not present
    initializeData();
    
    // Load active user
    const savedUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) as ActiveUser | null;
    if (savedUser) {
      setActiveUser(savedUser);
    }
    
    // Load notifications
    loadNotifications();
  }, []);
  
  useEffect(() => {
    if (!isActive) return;
    
    // Initialize charts when section becomes active
    if (pendingWorkChartRef.current) {
      const pendingWorkCtx = pendingWorkChartRef.current.getContext('2d');
      if (pendingWorkCtx) {
        new Chart(pendingWorkCtx, {
          type: pendingWorkChartData.type as any,
          data: pendingWorkChartData.data,
          options: pendingWorkChartData.options
        });
      }
    }
    
    if (performanceChartRef.current) {
      const performanceCtx = performanceChartRef.current.getContext('2d');
      if (performanceCtx) {
        new Chart(performanceCtx, {
          type: performanceChartData.type as any,
          data: performanceChartData.data,
          options: performanceChartData.options
        });
      }
    }
    
    if (completedWorkChartRef.current) {
      const completedWorkCtx = completedWorkChartRef.current.getContext('2d');
      if (completedWorkCtx) {
        new Chart(completedWorkCtx, {
          type: completedWorkChartData.type as any,
          data: completedWorkChartData.data,
          options: completedWorkChartData.options
        });
      }
    }
    
    if (notificationsChartRef.current) {
      const notificationsCtx = notificationsChartRef.current.getContext('2d');
      if (notificationsCtx) {
        new Chart(notificationsCtx, {
          type: notificationsChartData.type as any,
          data: notificationsChartData.data,
          options: notificationsChartData.options
        });
      }
    }
    
    // Cleanup function to destroy charts when component unmounts
    return () => {
      Chart.getChart(pendingWorkChartRef.current as HTMLCanvasElement)?.destroy();
      Chart.getChart(performanceChartRef.current as HTMLCanvasElement)?.destroy();
      Chart.getChart(completedWorkChartRef.current as HTMLCanvasElement)?.destroy();
      Chart.getChart(notificationsChartRef.current as HTMLCanvasElement)?.destroy();
    };
  }, [isActive]);
  
  const loadNotifications = () => {
    const notificationsString = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (notificationsString) {
      const loadedNotifications = JSON.parse(notificationsString);
      setNotifications(loadedNotifications);
      
      // Count unread notifications
      const unread = loadedNotifications.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
    } else {
      setNotifications(defaultNotifications);
      const unread = defaultNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    }
  };
  
  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
    
    // Update unread count
    const unread = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  };
  
  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifications));
    setUnreadCount(0);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return 'fas fa-at';
      case 'meeting':
        return 'fas fa-calendar';
      case 'deadline':
        return 'fas fa-clock';
      case 'update':
        return 'fas fa-bell';
      default:
        return 'fas fa-bell';
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'mention':
        return 'bg-blue-500';
      case 'meeting':
        return 'bg-green-500';
      case 'deadline':
        return 'bg-red-500';
      case 'update':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <section id="dashboard-section" className={`p-6 ${isActive ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-medium mb-6">Process Planning Dashboard</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weekly Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Performance</h4>
              <div className="flex border rounded overflow-hidden">
                <button 
                  className={`py-1 px-3 text-sm ${timeFrameFilter === 'week' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setTimeFrameFilter('week')}
                >
                  Week
                </button>
                <button 
                  className={`py-1 px-3 text-sm ${timeFrameFilter === 'month' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setTimeFrameFilter('month')}
                >
                  Month
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <canvas ref={performanceChartRef} id="performanceChart" height="120"></canvas>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mt-4">
              <div>
                <div className="text-xl font-semibold text-green-500">
                  {timeFrameFilter === 'week' ? performanceChartData.week.completed : performanceChartData.month.completed}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-blue-500">
                  {timeFrameFilter === 'week' ? performanceChartData.week.inProgress : performanceChartData.month.inProgress}
                </div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              <div>
                <div className="text-xl font-semibold text-red-500">
                  {timeFrameFilter === 'week' ? performanceChartData.week.overdue : performanceChartData.month.overdue}
                </div>
                <div className="text-xs text-gray-500">Overdue</div>
              </div>
            </div>
          </div>
          
          {/* Work Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h4 className="font-medium mb-4">Work Breakdown</h4>
            <div className="mb-4">
              <canvas ref={pendingWorkChartRef} id="pendingWorkChart" height="120"></canvas>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm">Development ({pendingWorkChartData.development}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Design ({pendingWorkChartData.design}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Testing ({pendingWorkChartData.testing}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-sm">Planning ({pendingWorkChartData.planning}%)</span>
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">
                Notifications
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center ml-2 w-5 h-5 text-xs font-medium text-white bg-primary rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h4>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="h-36 mb-4">
              <canvas ref={notificationsChartRef} id="notificationsChart" height="120"></canvas>
            </div>
            
            {notifications.length === 0 ? (
              <div className="text-center py-3 text-gray-500 text-sm">
                <i className="fas fa-bell mb-1"></i>
                <p>No notifications</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-[150px] overflow-y-auto mt-4">
                {notifications.slice(0, 3).map(notification => (
                  <li 
                    key={notification.id}
                    className={`p-2 rounded flex ${notification.read ? 'bg-gray-50' : 'bg-blue-50'} cursor-pointer text-sm`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className={`w-6 h-6 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center text-white mr-2 flex-shrink-0`}>
                      <i className={getNotificationIcon(notification.type)}></i>
                    </div>
                    <div className="flex-1">
                      <div className={`${notification.read ? 'font-normal' : 'font-medium'}`}>
                        {notification.text}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Pending Work */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Pending Work</h4>
              <div className="flex border rounded overflow-hidden">
                <button 
                  className={`py-1 px-3 text-sm ${pendingWorkFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setPendingWorkFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`py-1 px-3 text-sm ${pendingWorkFilter === 'mine' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setPendingWorkFilter('mine')}
                >
                  Mine
                </button>
                <button 
                  className={`py-1 px-3 text-sm ${pendingWorkFilter === 'team' ? 'bg-primary text-white' : 'bg-gray-50'}`}
                  onClick={() => setPendingWorkFilter('team')}
                >
                  Team
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left text-sm font-medium">Task</th>
                    <th className="py-2 text-left text-sm font-medium">Project</th>
                    <th className="py-2 text-left text-sm font-medium">Assigned To</th>
                    <th className="py-2 text-left text-sm font-medium">Due Date</th>
                    <th className="py-2 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWorkChartData.tasks
                    .filter(task => {
                      if (pendingWorkFilter === 'all') return true;
                      if (pendingWorkFilter === 'mine') return task.assignedTo === users[activeUser].name;
                      if (pendingWorkFilter === 'team') return task.assignedTo !== users[activeUser].name;
                      return true;
                    })
                    .map((task, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 text-sm">{task.name}</td>
                        <td className="py-2 text-sm">{task.project}</td>
                        <td className="py-2 text-sm">{task.assignedTo}</td>
                        <td className="py-2 text-sm">{task.dueDate}</td>
                        <td className="py-2 text-sm">
                          <span className={`${
                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'To Do' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                          } text-xs py-1 px-2 rounded`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Completed Work & Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h4 className="font-medium mb-4">Recent Activity</h4>
            <div className="mb-4">
              <canvas ref={completedWorkChartRef} id="completedWorkChart" height="120"></canvas>
            </div>
            
            <div className="space-y-3 max-h-[150px] overflow-y-auto mt-4">
              {completedWorkChartData.activities.map((activity, index) => (
                <div key={index} className="flex items-start text-sm">
                  <div className={`w-6 h-6 rounded-full ${
                    activity.user === users.user1.name ? 'bg-primary' : 'bg-secondary'
                  } flex items-center justify-center text-white mr-2 flex-shrink-0`}>
                    <span>{activity.user === users.user1.name ? users.user1.avatar : users.user2.avatar}</span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {activity.user} {activity.action} <span className="text-primary">{activity.task}</span>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
