import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { 
  pendingWorkChartData, 
  performanceChartData, 
  completedWorkChartData, 
  notificationsChartData 
} from '@/lib/chartData';

Chart.register(...registerables);

interface DashboardSectionProps {
  isActive: boolean;
}

export default function DashboardSection({ isActive }: DashboardSectionProps) {
  const pendingWorkChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const completedWorkChartRef = useRef<HTMLCanvasElement>(null);
  const notificationsChartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!isActive) return;
    
    // Initialize charts when section becomes active
    if (pendingWorkChartRef.current) {
      const pendingWorkCtx = pendingWorkChartRef.current.getContext('2d');
      if (pendingWorkCtx) {
        new Chart(pendingWorkCtx, pendingWorkChartData);
      }
    }
    
    if (performanceChartRef.current) {
      const performanceCtx = performanceChartRef.current.getContext('2d');
      if (performanceCtx) {
        new Chart(performanceCtx, performanceChartData);
      }
    }
    
    if (completedWorkChartRef.current) {
      const completedWorkCtx = completedWorkChartRef.current.getContext('2d');
      if (completedWorkCtx) {
        new Chart(completedWorkCtx, completedWorkChartData);
      }
    }
    
    if (notificationsChartRef.current) {
      const notificationsCtx = notificationsChartRef.current.getContext('2d');
      if (notificationsCtx) {
        new Chart(notificationsCtx, notificationsChartData);
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

  return (
    <section id="dashboard-section" className={`p-6 ${isActive ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-medium mb-4">Dashboard</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Pending Work */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <canvas ref={pendingWorkChartRef} id="pendingWorkChart" height="200"></canvas>
          </div>
          
          {/* Card 2: Performance */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <canvas ref={performanceChartRef} id="performanceChart" height="200"></canvas>
          </div>
          
          {/* Card 3: Completed Work */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <canvas ref={completedWorkChartRef} id="completedWorkChart" height="200"></canvas>
          </div>
          
          {/* Card 4: Notifications */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <canvas ref={notificationsChartRef} id="notificationsChart" height="200"></canvas>
          </div>
        </div>
      </div>
    </section>
  );
}
