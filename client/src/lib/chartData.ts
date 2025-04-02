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
  }
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
  }
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
  }
};
