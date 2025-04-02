import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface EyeGazeTrackerProps {
  isActive: boolean;
  onStatusChange?: (status: 'present' | 'away' | 'fake-presence') => void;
}

export default function EyeGazeTracker({ isActive, onStatusChange }: EyeGazeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [trackerStatus, setTrackerStatus] = useState<'inactive' | 'calibrating' | 'active'>('inactive');
  const [presenceStatus, setPresenceStatus] = useState<'present' | 'away' | 'fake-presence'>('present');
  const [attentionScore, setAttentionScore] = useState(100);
  const [lastMovement, setLastMovement] = useState<Date | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Simulated eye gaze coordinates
  const [gazePositionX, setGazePositionX] = useState(0);
  const [gazePositionY, setGazePositionY] = useState(0);
  
  // Simulated head position
  const [headX, setHeadX] = useState(0);
  const [headY, setHeadY] = useState(0);
  const [headZ, setHeadZ] = useState(0);
  
  // Attention metrics
  const [blinkRate, setBlinkRate] = useState(0);
  const [screenFocusTime, setScreenFocusTime] = useState(0);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle mouse movement to simulate eye tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isTracking || trackerStatus !== 'active') return;
      
      // Update simulated gaze position based on mouse coordinates
      setGazePositionX(e.clientX);
      setGazePositionY(e.clientY);
      
      // Simulate head position
      setHeadX(Math.sin(e.clientX / window.innerWidth * Math.PI) * 10);
      setHeadY(Math.sin(e.clientY / window.innerHeight * Math.PI) * 10);
      setHeadZ(50 + Math.sin(Date.now() / 5000) * 5); // Subtle z-axis movement
      
      // Reset away status and update last movement time
      if (presenceStatus === 'away') {
        setPresenceStatus('present');
        if (onStatusChange) onStatusChange('present');
      }
      setLastMovement(new Date());
      
      // Clear previous timeout
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      
      // Set timeout to detect inactivity
      mouseTimeoutRef.current = setTimeout(() => {
        setPresenceStatus('away');
        if (onStatusChange) onStatusChange('away');
      }, 15000); // 15 seconds of inactivity
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTracking, trackerStatus, presenceStatus, onStatusChange]);
  
  // Start eye-tracking simulation
  const startTracking = () => {
    setIsTracking(true);
    setTrackerStatus('calibrating');
    
    // Simulate calibration process
    setTimeout(() => {
      setTrackerStatus('active');
      setLastMovement(new Date());
      
      // Start simulated metrics
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
      
      simulationIntervalRef.current = setInterval(() => {
        // Simulate blink rate (normal is 15-20 blinks per minute)
        setBlinkRate(Math.floor(Math.random() * 10) + 12);
        
        // Simulate screen focus time
        setScreenFocusTime(prev => {
          const newValue = prev + (Math.random() * 2) - 0.5;
          return Math.max(0, Math.min(100, newValue));
        });
        
        // Update attention score
        setAttentionScore(prev => {
          // Calculate new score
          let newScore = prev;
          
          // Detect fake presence patterns
          if (Math.random() > 0.7) {
            // Simulate detection of repeated patterns (indicative of fake presence)
            const isFakeDetected = Math.random() > 0.8;
            
            if (isFakeDetected) {
              newScore = Math.max(0, newScore - Math.random() * 30);
              if (newScore < 30 && presenceStatus !== 'fake-presence') {
                setPresenceStatus('fake-presence');
                if (onStatusChange) onStatusChange('fake-presence');
              }
            } else {
              newScore = Math.min(100, newScore + Math.random() * 5);
              if (newScore > 50 && presenceStatus === 'fake-presence') {
                setPresenceStatus('present');
                if (onStatusChange) onStatusChange('present');
              }
            }
          }
          
          return parseFloat(newScore.toFixed(1));
        });
      }, 2000);
      
    }, 3000); // Calibration takes 3 seconds
  };
  
  // Stop eye-tracking
  const stopTracking = () => {
    setIsTracking(false);
    setTrackerStatus('inactive');
    
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    
    if (mouseTimeoutRef.current) {
      clearTimeout(mouseTimeoutRef.current);
      mouseTimeoutRef.current = null;
    }
  };
  
  // Determine status color
  const getStatusColor = () => {
    switch (presenceStatus) {
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
    switch (presenceStatus) {
      case 'present':
        return 'Actively Present';
      case 'away':
        return 'Away';
      case 'fake-presence':
        return 'Fake Presence Detected';
      default:
        return 'Unknown';
    }
  };
  
  // Display time since last movement
  const getTimeSinceLastMovement = () => {
    if (!lastMovement) return 'N/A';
    
    const now = new Date();
    const diffMs = now.getTime() - lastMovement.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else {
      const diffMin = Math.floor(diffSec / 60);
      return `${diffMin} minutes ago`;
    }
  };
  
  return (
    <div className={`p-4 ${isActive ? '' : 'hidden'}`}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Eye Gaze Tracking</span>
            <Badge 
              variant={trackerStatus === 'active' ? 'default' : 'outline'}
              className={`ml-2 ${trackerStatus === 'active' ? 'bg-violet-600' : ''}`}
            >
              {trackerStatus === 'inactive' ? 'Inactive' : 
               trackerStatus === 'calibrating' ? 'Calibrating...' : 'Active'}
            </Badge>
          </CardTitle>
          <CardDescription>
            Monitor real-time eye movement to detect presence and engagement levels
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status section */}
          <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${getStatusColor()} mr-2`}></div>
              <span className="font-medium">Status: {getStatusText()}</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last movement: {getTimeSinceLastMovement()}
            </div>
          </div>
          
          {/* Attention score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Attention Score</span>
              <span 
                className={`font-bold ${
                  attentionScore > 70 ? 'text-green-500' : 
                  attentionScore > 40 ? 'text-yellow-500' : 
                  'text-red-500'
                }`}
              >
                {attentionScore}%
              </span>
            </div>
            <Progress value={attentionScore} className="h-2" />
          </div>
          
          {/* Debug information (toggleable) */}
          <div className="flex items-center justify-between pt-2">
            <span>Show Debug Information</span>
            <Switch
              checked={showDebugInfo}
              onCheckedChange={setShowDebugInfo}
            />
          </div>
          
          {showDebugInfo && (
            <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Eye Gaze Position</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    X: {gazePositionX.toFixed(2)}, Y: {gazePositionY.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Head Position</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    X: {headX.toFixed(2)}, Y: {headY.toFixed(2)}, Z: {headZ.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Blink Rate</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {blinkRate} blinks/minute
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Screen Focus</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {screenFocusTime.toFixed(1)}% on-screen time
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Note: This is a simulation. In a real implementation, these metrics would be gathered from a computer vision model.
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => {
              if (presenceStatus === 'fake-presence') {
                setPresenceStatus('present');
                setAttentionScore(100);
                if (onStatusChange) onStatusChange('present');
              }
            }}
            disabled={presenceStatus !== 'fake-presence'}
          >
            Reset Alert
          </Button>
          
          <Button
            variant={isTracking ? "destructive" : "default"}
            onClick={isTracking ? stopTracking : startTracking}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>This is a simulated eye-tracking system for demonstration purposes.</p>
        <p className="mt-1">Move your mouse around the screen to simulate eye movement.</p>
        <p className="mt-1">Inactivity will be detected after 15 seconds without mouse movement.</p>
      </div>
    </div>
  );
}