// Chart.js configs

// 1. Pending Work Tracker
export const pendingWorkChartData = {
  type: 'pie',
  data: {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [12, 19, 8],
      backgroundColor: ['#f44336', '#ff9800', '#4caf50']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Pending Work Tracker'
      },
      legend: {
        position: 'bottom'
      }
    }
  },
  // Additional data for dashboard components
  development: 45,
  design: 20,
  testing: 10,
  planning: 25,
  tasks: [
    {
      name: 'Implement Authentication',
      project: 'Project Alpha',
      assignedTo: 'Alex Johnson',
      dueDate: 'April 10, 2025',
      status: 'In Progress',
      priority: 'High'
    },
    {
      name: 'Design Homepage',
      project: 'Project Beta',
      assignedTo: 'Sam Smith',
      dueDate: 'April 11, 2025',
      status: 'To Do',
      priority: 'Medium'
    },
    {
      name: 'Fix Checkout Process',
      project: 'E-commerce Platform',
      assignedTo: 'Alex Johnson',
      dueDate: 'April 12, 2025',
      status: 'Blocked',
      priority: 'High'
    },
    {
      name: 'Database Optimization',
      project: 'Project Alpha',
      assignedTo: 'Alex Johnson',
      dueDate: 'April 16, 2025',
      status: 'To Do',
      priority: 'Medium'
    },
    {
      name: 'API Documentation',
      project: 'Developer Portal',
      assignedTo: 'Sam Smith',
      dueDate: 'April 18, 2025',
      status: 'In Progress',
      priority: 'Low'
    }
  ]
};

// 2. Performance Improvement Analysis
export const performanceChartData = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Alex Johnson',
        data: [65, 59, 80, 81, 56],
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Sam Smith',
        data: [45, 70, 65, 75, 85],
        borderColor: '#ff4081',
        backgroundColor: 'rgba(255, 64, 129, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Performance Improvement Analysis'
      },
      legend: {
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Efficiency Score'
        }
      }
    }
  },
  // Additional data for dashboard components
  week: {
    percentage: 78,
    completed: 23,
    inProgress: 12,
    overdue: 7
  },
  month: {
    percentage: 82,
    completed: 56,
    inProgress: 18,
    overdue: 9
  },
  // Individual performance metrics
  userMetrics: {
    'Alex Johnson': {
      taskCompletionRate: 85,
      efficiency: 76,
      feedbackScore: 92
    },
    'Sam Smith': {
      taskCompletionRate: 79,
      efficiency: 85,
      feedbackScore: 88
    }
  }
};

// 3. Completed Work Overview
export const completedWorkChartData = {
  type: 'bar',
  data: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Bugs Fixed',
        data: [10, 15, 20, 25],
        backgroundColor: '#3f51b5',
      },
      {
        label: 'Features Developed',
        data: [5, 10, 15, 20],
        backgroundColor: '#ff4081',
      },
      {
        label: 'Documents Completed',
        data: [8, 12, 15, 18],
        backgroundColor: '#4caf50',
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Completed Work Overview'
      },
      legend: {
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    }
  },
  // Additional data for activity feed
  activities: [
    {
      user: 'Alex Johnson',
      action: 'completed',
      task: 'Database Schema',
      time: 'Today, 10:30 AM'
    },
    {
      user: 'Sam Smith',
      action: 'added comments to',
      task: 'API Integration',
      time: 'Today, 9:15 AM'
    },
    {
      user: 'Alex Johnson',
      action: 'started',
      task: 'Frontend Development',
      time: 'Yesterday, 4:30 PM'
    },
    {
      user: 'Sam Smith',
      action: 'updated',
      task: 'Project Timeline',
      time: 'Yesterday, 2:00 PM'
    }
  ],
  // Categorized by project
  projectCompletionData: {
    'Project Alpha': {
      bugsFixed: 32,
      featuresDeveloped: 18,
      documentsCompleted: 24,
      completionRate: 78
    },
    'Project Beta': {
      bugsFixed: 25,
      featuresDeveloped: 15,
      documentsCompleted: 12,
      completionRate: 64
    },
    'E-commerce Platform': {
      bugsFixed: 45,
      featuresDeveloped: 22,
      documentsCompleted: 18,
      completionRate: 85
    }
  }
};

// 4. Notifications Dashboard
export const notificationsChartData = {
  type: 'doughnut',
  data: {
    labels: ['Mentions', 'Meeting Reminders', 'Deadlines', 'Project Updates'],
    datasets: [{
      data: [10, 15, 8, 12],
      backgroundColor: ['#3f51b5', '#ff4081', '#ff9800', '#4caf50'],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Notifications Dashboard'
      },
      legend: {
        position: 'bottom'
      }
    },
    cutout: '70%'
  },
  // Additional data for notifications
  recentNotifications: [
    {
      id: 'notif-1',
      text: 'You were mentioned in Project Planning chat',
      timestamp: new Date().toISOString(),
      type: 'mention',
      read: false
    },
    {
      id: 'notif-2',
      text: 'Sprint Planning meeting starts in 1 hour',
      timestamp: new Date().toISOString(),
      type: 'meeting',
      read: false
    },
    {
      id: 'notif-3',
      text: 'Deadline for UI mockups is tomorrow',
      timestamp: new Date().toISOString(),
      type: 'deadline',
      read: true
    }
  ],
  // Timeline data
  timelineData: [
    { date: 'Mon', mentions: 3, meetings: 2, deadlines: 1, updates: 2 },
    { date: 'Tue', mentions: 5, meetings: 3, deadlines: 0, updates: 4 },
    { date: 'Wed', mentions: 2, meetings: 4, deadlines: 3, updates: 1 },
    { date: 'Thu', mentions: 4, meetings: 1, deadlines: 2, updates: 3 },
    { date: 'Fri', mentions: 3, meetings: 5, deadlines: 2, updates: 2 }
  ]
};

// 5. Workload Distribution Analysis (Heatmap)
export const workloadDistributionData = {
  labels: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    teams: ['Development', 'Design', 'QA', 'DevOps', 'Marketing']
  },
  data: [
    [4, 3, 5, 2, 3], // Development team workload by day
    [2, 4, 3, 1, 2], // Design team
    [1, 2, 4, 3, 2], // QA team
    [3, 1, 2, 5, 4], // DevOps team
    [2, 3, 1, 2, 5]  // Marketing team
  ],
  maxValue: 5, // Maximum workload value (5 = extremely busy)
  colorScale: ['#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4'],
  employees: {
    'Alex Johnson': { team: 'Development', workloadScore: 4.2, tasks: 12 },
    'Sam Smith': { team: 'Design', workloadScore: 3.5, tasks: 8 },
    'Emily Chen': { team: 'QA', workloadScore: 2.8, tasks: 6 },
    'Michael Brown': { team: 'DevOps', workloadScore: 4.7, tasks: 14 },
    'Olivia Davis': { team: 'Marketing', workloadScore: 3.1, tasks: 7 }
  }
};

// 6. Project Success and Failure Analytics
export const projectAnalyticsData = {
  type: 'bar',
  data: {
    labels: ['Project Alpha', 'Project Beta', 'E-commerce', 'Mobile App', 'CMS Upgrade'],
    datasets: [
      {
        label: 'Success Rate',
        data: [85, 65, 92, 78, 70],
        backgroundColor: '#4caf50'
      },
      {
        label: 'Failure Rate',
        data: [15, 35, 8, 22, 30],
        backgroundColor: '#f44336'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Project Success & Failure Analytics'
      },
      legend: {
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)'
        }
      }
    }
  },
  // Root cause analysis insights
  rootCauseAnalysis: {
    'Project Alpha': [
      { cause: 'Technical challenges', percentage: 45 },
      { cause: 'Resource constraints', percentage: 30 },
      { cause: 'Requirement changes', percentage: 25 }
    ],
    'Project Beta': [
      { cause: 'Scope creep', percentage: 55 },
      { cause: 'Technical debt', percentage: 25 },
      { cause: 'Team communication', percentage: 20 }
    ],
    'E-commerce': [
      { cause: 'Integration issues', percentage: 40 },
      { cause: 'Testing coverage', percentage: 35 },
      { cause: 'Performance bottlenecks', percentage: 25 }
    ],
    'Mobile App': [
      { cause: 'UI/UX complexity', percentage: 50 },
      { cause: 'Cross-platform issues', percentage: 30 },
      { cause: 'API limitations', percentage: 20 }
    ],
    'CMS Upgrade': [
      { cause: 'Data migration issues', percentage: 65 },
      { cause: 'Plugin compatibility', percentage: 20 },
      { cause: 'Training gaps', percentage: 15 }
    ]
  },
  // Improvement strategies
  improvementStrategies: [
    'Implement more thorough risk assessment during planning phase',
    'Enhance team communication with daily stand-ups and better documentation',
    'Improve testing coverage and automation',
    'Allocate more resources to high-risk tasks',
    'Conduct more frequent stakeholder reviews to catch requirement changes early'
  ]
};
