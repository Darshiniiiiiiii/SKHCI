import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js';
import { 
  pendingWorkChartData, 
  performanceChartData, 
  completedWorkChartData, 
  notificationsChartData,
  workloadDistributionData,
  projectAnalyticsData
} from '@/lib/chartData';
import { ActiveUser } from '@/lib/types';
import { initializeData, STORAGE_KEYS, users } from '@/lib/sampleData';

interface StatisticalDashboardSectionProps {
  isActive: boolean;
}

export default function StatisticalDashboardSection({ isActive }: StatisticalDashboardSectionProps) {
  const [activeUser, setActiveUser] = useState<ActiveUser>('user1');
  const [timeFrame, setTimeFrame] = useState<'week' | 'month'>('week');
  const [projectView, setProjectView] = useState<string>('Project Alpha');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSizeAdjustment, setFontSizeAdjustment] = useState(0);
  
  // Chart references
  const pendingWorkChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const completedWorkChartRef = useRef<HTMLCanvasElement>(null);
  const notificationsChartRef = useRef<HTMLCanvasElement>(null);
  const workloadHeatmapRef = useRef<HTMLCanvasElement>(null);
  const projectAnalyticsRef = useRef<HTMLCanvasElement>(null);

  // Chart instances (for cleanup)
  const charts = useRef<Chart[]>([]);
  
  useEffect(() => {
    // Initialize data if not present
    initializeData();
    
    // Load active user
    const savedUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) as ActiveUser | null;
    if (savedUser) {
      setActiveUser(savedUser);
    }
    
    // Check if dark mode preference exists
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    }
    
    // Load font size preference
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
      setFontSizeAdjustment(parseInt(fontSize));
      applyFontSize(parseInt(fontSize));
    }
  }, []);
  
  useEffect(() => {
    if (!isActive) return;
    
    // Destroy any existing charts to avoid duplicates
    charts.current.forEach(chart => chart.destroy());
    charts.current = [];
    
    // Initialize charts when section becomes active
    initializeCharts();
    
    // Cleanup function to destroy charts when component unmounts
    return () => {
      charts.current.forEach(chart => chart.destroy());
      charts.current = [];
    };
  }, [isActive, isDarkMode, timeFrame, projectView]);
  
  const initializeCharts = () => {
    if (!isActive) return;
    
    // Apply dark mode theme to charts if needed
    const chartTheme = isDarkMode ? getDarkTheme() : {};
    
    // 1. Pending Work Tracker
    if (pendingWorkChartRef.current) {
      const pendingWorkCtx = pendingWorkChartRef.current.getContext('2d');
      if (pendingWorkCtx) {
        const chart = new Chart(pendingWorkCtx, {
          type: 'pie',
          data: pendingWorkChartData.data,
          options: {
            ...pendingWorkChartData.options,
            ...chartTheme
          } as any
        });
        charts.current.push(chart);
      }
    }
    
    // 2. Performance Improvement Analysis
    if (performanceChartRef.current) {
      const performanceCtx = performanceChartRef.current.getContext('2d');
      if (performanceCtx) {
        const chart = new Chart(performanceCtx, {
          type: 'line',
          data: performanceChartData.data,
          options: {
            ...performanceChartData.options,
            ...chartTheme
          } as any
        });
        charts.current.push(chart);
      }
    }
    
    // 3. Completed Work Overview
    if (completedWorkChartRef.current) {
      const completedWorkCtx = completedWorkChartRef.current.getContext('2d');
      if (completedWorkCtx) {
        const chart = new Chart(completedWorkCtx, {
          type: 'bar',
          data: completedWorkChartData.data,
          options: {
            ...completedWorkChartData.options,
            ...chartTheme
          } as any
        });
        charts.current.push(chart);
      }
    }
    
    // 4. Notifications Dashboard
    if (notificationsChartRef.current) {
      const notificationsCtx = notificationsChartRef.current.getContext('2d');
      if (notificationsCtx) {
        const chart = new Chart(notificationsCtx, {
          type: 'doughnut',
          data: notificationsChartData.data,
          options: {
            ...notificationsChartData.options,
            ...chartTheme
          } as any
        });
        charts.current.push(chart);
      }
    }
    
    // 5. Workload Heatmap (requires custom rendering)
    if (workloadHeatmapRef.current) {
      const workloadCtx = workloadHeatmapRef.current.getContext('2d');
      if (workloadCtx) {
        renderHeatmap(workloadCtx);
      }
    }
    
    // 6. Project Analytics
    if (projectAnalyticsRef.current) {
      const projectCtx = projectAnalyticsRef.current.getContext('2d');
      if (projectCtx) {
        const chart = new Chart(projectCtx, {
          type: 'bar',
          data: projectAnalyticsData.data,
          options: {
            ...projectAnalyticsData.options,
            ...chartTheme
          } as any
        });
        charts.current.push(chart);
      }
    }
  };
  
  // Custom render for heatmap
  const renderHeatmap = (ctx: CanvasRenderingContext2D) => {
    if (!ctx) return;
    
    const { labels, data, maxValue, colorScale } = workloadDistributionData;
    const cellWidth = ctx.canvas.width / (labels.days.length + 1);
    const cellHeight = ctx.canvas.height / (labels.teams.length + 1);
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Set text color based on dark mode
    ctx.fillStyle = isDarkMode ? '#ffffff' : '#000000';
    ctx.font = `${14 + fontSizeAdjustment}px Arial`;
    
    // Draw column headers (days)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < labels.days.length; i++) {
      ctx.fillText(labels.days[i], (i + 1) * cellWidth + cellWidth / 2, cellHeight / 2);
    }
    
    // Draw row headers (teams)
    ctx.textAlign = 'right';
    for (let i = 0; i < labels.teams.length; i++) {
      ctx.fillText(labels.teams[i], cellWidth - 10, (i + 1) * cellHeight + cellHeight / 2);
    }
    
    // Draw heatmap cells
    for (let i = 0; i < labels.teams.length; i++) {
      for (let j = 0; j < labels.days.length; j++) {
        const value = data[i][j];
        const colorIndex = Math.floor((value / maxValue) * (colorScale.length - 1));
        ctx.fillStyle = colorScale[colorIndex];
        
        // Draw cell
        ctx.fillRect(
          (j + 1) * cellWidth + 2, 
          (i + 1) * cellHeight + 2, 
          cellWidth - 4, 
          cellHeight - 4
        );
        
        // Draw text
        ctx.fillStyle = isDarkMode ? '#ffffff' : '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          value.toString(), 
          (j + 1) * cellWidth + cellWidth / 2, 
          (i + 1) * cellHeight + cellHeight / 2
        );
      }
    }
  };
  
  const getDarkTheme = () => {
    return {
      color: '#ffffff',
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        },
        title: {
          color: '#ffffff'
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          ticks: {
            color: '#ffffff'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    };
  };
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };
  
  const adjustFontSize = (adjustment: number) => {
    const newSize = fontSizeAdjustment + adjustment;
    setFontSizeAdjustment(newSize);
    localStorage.setItem('fontSize', newSize.toString());
    applyFontSize(newSize);
  };
  
  const applyFontSize = (size: number) => {
    // Apply font size adjustment to the document
    document.documentElement.style.setProperty('--font-size-adjustment', `${size}px`);
  };
  
  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only apply shortcuts when this section is active
      if (!isActive) return;
      
      // Ctrl + D for dark mode toggle
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
      
      // Ctrl + Plus for larger font
      if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        adjustFontSize(1);
      }
      
      // Ctrl + Minus for smaller font
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        adjustFontSize(-1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isDarkMode, fontSizeAdjustment]);
  
  // Define the type for root cause items
  interface RootCause {
    cause: string;
    percentage: number;
  }

  // Get root causes for the selected project
  const getRootCauses = (): RootCause[] => {
    // Use type assertion to tell TypeScript this is a valid key
    const validProjects = ['Project Alpha', 'Project Beta', 'E-commerce', 'Mobile App', 'CMS Upgrade'];
    const project = validProjects.includes(projectView) ? projectView : 'Project Alpha';
    
    // Type assertion to access the property safely
    const causes = projectAnalyticsData.rootCauseAnalysis[project as keyof typeof projectAnalyticsData.rootCauseAnalysis] || [];
    return causes;
  };
  
  return (
    <section 
      id="statistical-dashboard-section" 
      className={`p-6 ${isActive ? '' : 'hidden'} ${isDarkMode ? 'dark-mode' : ''}`}
      role="region" 
      aria-label="Statistical Dashboard"
    >
      <div className={`bg-white ${isDarkMode ? 'dark:bg-gray-800 dark:text-white' : ''} rounded-lg shadow-md p-6 transition-colors`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Statistical Dashboard</h3>
          
          <div className="flex items-center space-x-4">
            {/* User Switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1">
              <button 
                className={`py-1 px-4 rounded-full transition ${activeUser === 'user1' ? 'bg-primary text-white font-medium' : ''}`}
                onClick={() => setActiveUser('user1')}
                aria-pressed={activeUser === 'user1'}
              >
                {users.user1.name}
              </button>
              <button 
                className={`py-1 px-4 rounded-full transition ${activeUser === 'user2' ? 'bg-secondary text-white font-medium' : ''}`}
                onClick={() => setActiveUser('user2')}
                aria-pressed={activeUser === 'user2'}
              >
                {users.user2.name}
              </button>
            </div>
            
            {/* Time Frame Filter */}
            <div className="flex border rounded overflow-hidden">
              <button 
                className={`py-1 px-3 text-sm ${timeFrame === 'week' ? 'bg-primary text-white' : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                onClick={() => setTimeFrame('week')}
                aria-pressed={timeFrame === 'week'}
              >
                Week
              </button>
              <button 
                className={`py-1 px-3 text-sm ${timeFrame === 'month' ? 'bg-primary text-white' : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                onClick={() => setTimeFrame('month')}
                aria-pressed={timeFrame === 'month'}
              >
                Month
              </button>
            </div>
            
            {/* Accessibility Controls */}
            <div className="flex items-center space-x-2">
              <button 
                className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
                onClick={toggleDarkMode}
                aria-pressed={isDarkMode}
                aria-label="Toggle dark mode"
                title="Toggle dark mode (Ctrl+D)"
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
              
              <button 
                className="p-2 rounded bg-gray-200 dark:bg-gray-700"
                onClick={() => adjustFontSize(-1)}
                aria-label="Decrease font size"
                title="Decrease font size (Ctrl+-)"
              >
                <i className="fas fa-minus"></i>
              </button>
              
              <button 
                className="p-2 rounded bg-gray-200 dark:bg-gray-700"
                onClick={() => adjustFontSize(1)}
                aria-label="Increase font size"
                title="Increase font size (Ctrl++)"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Pending Work Tracker */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow border border-gray-200 dark:border-gray-600`}>
            <h4 className="font-medium mb-3">Pending Work Tracker</h4>
            <div aria-label="Pending work by priority chart" role="img">
              <canvas ref={pendingWorkChartRef} height="200"></canvas>
            </div>
            
            <div className="mt-3 text-sm">
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span className="flex items-center">
                    <span className="w-3 h-3 inline-block rounded-full bg-red-500 mr-2"></span>
                    High Priority
                  </span>
                  <span>12 tasks</span>
                </li>
                <li className="flex justify-between">
                  <span className="flex items-center">
                    <span className="w-3 h-3 inline-block rounded-full bg-orange-500 mr-2"></span>
                    Medium Priority
                  </span>
                  <span>19 tasks</span>
                </li>
                <li className="flex justify-between">
                  <span className="flex items-center">
                    <span className="w-3 h-3 inline-block rounded-full bg-green-500 mr-2"></span>
                    Low Priority
                  </span>
                  <span>8 tasks</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 2. Performance Improvement Analysis */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow border border-gray-200 dark:border-gray-600`}>
            <h4 className="font-medium mb-3">Performance Analysis</h4>
            <div aria-label="Performance improvement analysis chart" role="img">
              <canvas ref={performanceChartRef} height="200"></canvas>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-primary">{users.user1.name}</h5>
                <div className="flex justify-between">
                  <span>Task Completion:</span>
                  <span>{performanceChartData.userMetrics['Alex Johnson'].taskCompletionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span>{performanceChartData.userMetrics['Alex Johnson'].efficiency}%</span>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-secondary">{users.user2.name}</h5>
                <div className="flex justify-between">
                  <span>Task Completion:</span>
                  <span>{performanceChartData.userMetrics['Sam Smith'].taskCompletionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span>{performanceChartData.userMetrics['Sam Smith'].efficiency}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3. Completed Work Overview */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow border border-gray-200 dark:border-gray-600`}>
            <h4 className="font-medium mb-3">Completed Work Overview</h4>
            <div aria-label="Completed work overview chart" role="img">
              <canvas ref={completedWorkChartRef} height="200"></canvas>
            </div>
            
            <div className="mt-3 text-sm">
              <div className="flex justify-between">
                <span>Total Bugs Fixed:</span>
                <span>{70}</span>
              </div>
              <div className="flex justify-between">
                <span>Features Developed:</span>
                <span>{50}</span>
              </div>
              <div className="flex justify-between">
                <span>Documents Completed:</span>
                <span>{53}</span>
              </div>
            </div>
          </div>
          
          {/* 4. Notifications Dashboard */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow border border-gray-200 dark:border-gray-600`}>
            <h4 className="font-medium mb-3">Notifications Dashboard</h4>
            <div aria-label="Notifications type distribution chart" role="img">
              <canvas ref={notificationsChartRef} height="200"></canvas>
            </div>
            
            <h5 className="font-medium mt-3 mb-2 text-sm">Weekly Distribution</h5>
            <div className="text-xs grid grid-cols-5 gap-1">
              {notificationsChartData.timelineData.map((day, index) => (
                <div key={index} className="text-center">
                  <div>{day.date}</div>
                  <div className={`mt-1 h-12 relative ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'} rounded overflow-hidden`}>
                    <div className="absolute bottom-0 left-0 w-full bg-blue-500" style={{ height: `${day.mentions * 12}%` }}></div>
                    <div className="absolute bottom-0 left-0 w-full bg-pink-500" style={{ height: `${day.meetings * 8}%` }}></div>
                    <div className="absolute bottom-0 left-0 w-full bg-orange-500" style={{ height: `${day.deadlines * 10}%` }}></div>
                    <div className="absolute bottom-0 left-0 w-full bg-green-500" style={{ height: `${day.updates * 6}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 5. Workload Distribution Analysis */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow border border-gray-200 dark:border-gray-600`}>
            <h4 className="font-medium mb-3">Workload Distribution</h4>
            <div aria-label="Workload distribution heatmap" role="img" className="relative">
              <canvas ref={workloadHeatmapRef} height="200"></canvas>
            </div>
            
            <div className="mt-3 text-sm">
              <h5 className="font-medium mb-1">Most Overloaded Teams</h5>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>DevOps Team:</span>
                  <span className="font-medium text-red-500">4.7/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Development Team:</span>
                  <span className="font-medium text-orange-500">4.2/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Design Team:</span>
                  <span className="font-medium text-yellow-500">3.5/5</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 6. Project Success and Failure Analytics */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow border border-gray-200 dark:border-gray-600`}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Project Success/Failure</h4>
              <select 
                value={projectView} 
                onChange={(e) => setProjectView(e.target.value)}
                className={`text-sm p-1 rounded border ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                aria-label="Select project for detailed view"
              >
                <option value="Project Alpha">Project Alpha</option>
                <option value="Project Beta">Project Beta</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Mobile App">Mobile App</option>
                <option value="CMS Upgrade">CMS Upgrade</option>
              </select>
            </div>
            
            <div aria-label="Project success and failure rates chart" role="img">
              <canvas ref={projectAnalyticsRef} height="170"></canvas>
            </div>
            
            <div className="mt-3 text-sm">
              <h5 className="font-medium mb-1">Root Cause Analysis: {projectView}</h5>
              <ul className="space-y-1">
                {getRootCauses().map((cause: RootCause, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{cause.cause}</span>
                    <span>{cause.percentage}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Improvement Strategies */}
        <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow border border-gray-200 dark:border-gray-600`}>
          <h4 className="font-medium mb-3">Improvement Strategies</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {projectAnalyticsData.improvementStrategies.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </div>
        
        {/* Keyboard Shortcuts Help */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Keyboard Shortcuts: <kbd className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600">Ctrl+D</kbd> Dark Mode, <kbd className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600">Ctrl++</kbd> Increase Font, <kbd className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600">Ctrl+-</kbd> Decrease Font</p>
        </div>
      </div>
    </section>
  );
}