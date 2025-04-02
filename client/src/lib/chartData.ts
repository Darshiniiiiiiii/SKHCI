// Chart.js configs
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
      status: 'In Progress'
    },
    {
      name: 'Design Homepage',
      project: 'Project Beta',
      assignedTo: 'Sam Smith',
      dueDate: 'April 11, 2025',
      status: 'To Do'
    },
    {
      name: 'Fix Checkout Process',
      project: 'E-commerce Platform',
      assignedTo: 'Alex Johnson',
      dueDate: 'April 12, 2025',
      status: 'Blocked'
    },
    {
      name: 'Database Optimization',
      project: 'Project Alpha',
      assignedTo: 'Alex Johnson',
      dueDate: 'April 16, 2025',
      status: 'To Do'
    },
    {
      name: 'API Documentation',
      project: 'Developer Portal',
      assignedTo: 'Sam Smith',
      dueDate: 'April 18, 2025',
      status: 'In Progress'
    }
  ]
};

export const performanceChartData = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Performance',
      data: [65, 59, 80, 81, 56],
      borderColor: '#3f51b5',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Performance Analysis'
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
  }
};

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
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Completed Work Overview'
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
  ]
};

export const notificationsChartData = {
  type: 'doughnut',
  data: {
    labels: ['Mentions', 'Meeting Reminders', 'Deadlines', 'Updates'],
    datasets: [{
      data: [10, 15, 8, 12],
      backgroundColor: ['#3f51b5', '#ff4081', '#ff9800', '#4caf50']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Notifications Dashboard'
      }
    }
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
  ]
};
