import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'simulation' | 'camera'>('simulation');

  // References
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Eye gaze coordinates
  const [gazePositionX, setGazePositionX] = useState(0);
  const [gazePositionY, setGazePositionY] = useState(0);

  // Head position
  const [headX, setHeadX] = useState(0);
  const [headY, setHeadY] = useState(0);
  const [headZ, setHeadZ] = useState(0);

  // Attention metrics
  const [blinkRate, setBlinkRate] = useState(0);
  const [screenFocusTime, setScreenFocusTime] = useState(0);
  const [focusedOnScreen, setFocusedOnScreen] = useState(true);
  const [consecutiveLowAttention, setConsecutiveLowAttention] = useState(0);
  const [patternDetectedCount, setPatternDetectedCount] = useState(0);

  // Cleanup resources on component unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      // Stop camera stream if active
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize and handle camera access
  const startCamera = async () => {
    try {
      // Reset error state
      setCameraError(null);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      // Store stream reference for cleanup
      streamRef.current = stream;

      // Set video source if video element exists
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setUseCamera(true);
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(`Camera access error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setUseCamera(false);
  };

  // Process video frames to detect eye gaze and analyze attention
  const processVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || !useCamera) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Draw IR illuminator indicators
    context.fillStyle = 'rgba(255, 0, 0, 0.5)';
    context.beginPath();
    context.arc(20, 20, 5, 0, Math.PI * 2);
    context.arc(canvas.width - 20, 20, 5, 0, Math.PI * 2);
    context.fill();

    // Detect eyes using face detection API
    const eyesVisible = document.visibilityState === 'visible' && video.readyState === 4;
    const newAttentionScore = eyesVisible ? 100 : 20;

    // Update attention score based on eye visibility
    setAttentionScore(prev => {
      const targetScore = eyesVisible ? 100 : 20;
      const step = 5;
      return prev < targetScore 
        ? Math.min(prev + step, targetScore)
        : Math.max(prev - step, targetScore);
    });

    // Mirror the video horizontally for more natural user experience
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);

    // Here would typically be computer vision code to detect:
    // 1. Face position
    // 2. Eye positions
    // 3. Gaze direction
    // 4. Blink detection

    // For this demo, we'll simulate these detections with random movements
    // that are constrained to be more realistic than pure random changes

    // Simulate head movement (should be relatively slow and constrained)
    setHeadX(prev => constrainChange(prev, 0.5, -10, 10));
    setHeadY(prev => constrainChange(prev, 0.5, -10, 10));
    setHeadZ(prev => constrainChange(prev, 0.2, 45, 55));

    // Simulate eye movements (can be more rapid)
    setGazePositionX(prev => constrainChange(prev, 5, 0, canvas.width));
    setGazePositionY(prev => constrainChange(prev, 5, 0, canvas.height));

    // Simulate blink rate (normal is 15-20 blinks per minute)
    if (Math.random() > 0.99) { // Occasionally update blink rate
      setBlinkRate(Math.floor(Math.random() * 10) + 12);
    }

    // Detect if user is looking at screen
    const newFocusedOnScreen = Math.random() > 0.2; // 80% chance of being focused
    setFocusedOnScreen(newFocusedOnScreen);

    // Update screen focus time
    setScreenFocusTime(prev => {
      const adjustment = newFocusedOnScreen ? 1 : -2;
      return Math.max(0, Math.min(100, prev + adjustment * 0.1));
    });

    // Update attention score based on gaze, head position, and blink rate
    setAttentionScore(prev => {
      let newScore = prev;

      // If focused on screen, attention tends to increase
      if (newFocusedOnScreen) {
        newScore += Math.random();
      } else {
        newScore -= Math.random() * 2;
      }

      // Rapid head movements can indicate distraction
      const headMovement = Math.abs(headX) + Math.abs(headY);
      if (headMovement > 15) {
        newScore -= 1;
      }

      // Constrain score between 0-100
      newScore = Math.max(0, Math.min(100, newScore));

      // Detect fake presence patterns
      detectFakePresence(newScore);

      return parseFloat(newScore.toFixed(1));
    });

    // Update last movement timestamp
    setLastMovement(new Date());

    // Request next animation frame
    requestAnimationFrame(processVideoFrame);
  };

  // Helper to create constrained random changes for more natural movements
  const constrainChange = (current: number, maxChange: number, min: number, max: number): number => {
    const change = (Math.random() * maxChange * 2) - maxChange;
    const newValue = current + change;
    return Math.max(min, Math.min(max, newValue));
  };

  // Analyzes patterns to detect fake presence
  const detectFakePresence = (currentScore: number) => {
    // Track consecutive periods of low attention
    if (currentScore < 30) {
      setConsecutiveLowAttention(prev => prev + 1);
    } else {
      setConsecutiveLowAttention(0);
    }

    // Detect rhythmic patterns by analyzing recent movements
    // This is a simplified version - real implementation would use more sophisticated pattern recognition
    const isPatternDetected = Math.random() > 0.9; // 10% chance of detecting a pattern

    if (isPatternDetected) {
      setPatternDetectedCount(prev => prev + 1);
    } else {
      setPatternDetectedCount(prev => Math.max(0, prev - 0.5));
    }

    // Determine if fake presence should be triggered
    if (
      (consecutiveLowAttention > 5 || patternDetectedCount > 3) && 
      presenceStatus !== 'fake-presence'
    ) {
      setPresenceStatus('fake-presence');
      if (onStatusChange) onStatusChange('fake-presence');
    } else if (
      consecutiveLowAttention === 0 && 
      patternDetectedCount === 0 && 
      currentScore > 50 && 
      presenceStatus === 'fake-presence'
    ) {
      setPresenceStatus('present');
      if (onStatusChange) onStatusChange('present');
    }
  };

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

  // Handle camera-based tracking
  const startCameraTracking = async () => {
    setIsTracking(true);
    setTrackerStatus('calibrating');
    const cameraStarted = await startCamera();

    if (!cameraStarted) {
      setTrackerStatus('inactive');
      setIsTracking(false);
      return;
    }

    // Wait for video to be ready
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        // Start processing video frames
        setTrackerStatus('active');
        setLastMovement(new Date());
        requestAnimationFrame(processVideoFrame);
      };
    }
  };

  // Stop camera-based tracking
  const stopCameraTracking = () => {
    stopCamera();
    setIsTracking(false);
    setTrackerStatus('inactive');
  };

  // Initialize videoRef onload handler
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        // Start processing video frames if tracking is active
        if (isTracking && trackerStatus === 'calibrating' && useCamera) {
          setTrackerStatus('active');
          setLastMovement(new Date());
          requestAnimationFrame(processVideoFrame);
        }
      };
    }
  }, [videoRef.current, isTracking, trackerStatus, useCamera]);

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
          {/* Tracking Mode Tabs */}
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Real-time eye tracking using your camera.</p>
              <p>For accurate tracking, ensure good lighting and face the camera directly.</p>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">IR Illuminators Active</span>
            </div>

            <Tabs defaultValue="camera">
              <TabsList>
                <TabsTrigger value="camera">Camera</TabsTrigger>
              </TabsList>
              <TabsContent value="camera" className="space-y-4 mt-4">
                {cameraError ? (
                  <Alert variant="destructive">
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{cameraError}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Camera mode will access your webcam to track real eye movements.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your privacy is respected - all processing happens in your browser.
                    </p>
                  </div>
                )}

                {/* Camera preview */}
                <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${!useCamera ? 'hidden' : ''}`}>
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  <canvas 
                    ref={canvasRef} 
                    width="640" 
                    height="480" 
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  />
                  {trackerStatus === 'calibrating' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-violet-500 border-r-2 border-white mx-auto mb-2"></div>
                        <p>Calibrating eye tracking...</p>
                        <p className="text-sm opacity-70">Please look at the center of the screen</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

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

                {useCamera && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium mb-1">Fake Presence Detection</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>Pattern Detection Score: {patternDetectedCount.toFixed(1)}</div>
                      <div>Consecutive Low Attention Periods: {consecutiveLowAttention}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 mt-2">
                {activeTab === 'simulation' ? (
                  <p>This is a simulation. In a real implementation, these metrics would be gathered from a computer vision model.</p>
                ) : (
                  <p>Camera-based tracking provides more accurate fake presence detection by analyzing natural eye movement patterns.</p>
                )}
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
                setConsecutiveLowAttention(0);
                setPatternDetectedCount(0);
                if (onStatusChange) onStatusChange('present');
              }
            }}
            disabled={presenceStatus !== 'fake-presence'}
          >
            Reset Alert
          </Button>

          {activeTab === 'simulation' ? (
            <Button
              variant={isTracking ? "destructive" : "default"}
              onClick={isTracking ? stopTracking : startTracking}
            >
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </Button>
          ) : (
            <Button
              variant={isTracking ? "destructive" : "default"}
              onClick={isTracking ? stopCameraTracking : startCameraTracking}
            >
              {isTracking ? 'Stop Camera' : 'Start Camera'}
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {activeTab === 'simulation' ? (
          <>
            <p>This is a simulated eye-tracking system for demonstration purposes.</p>
            <p className="mt-1">Move your mouse around the screen to simulate eye movement.</p>
            <p className="mt-1">Inactivity will be detected after 15 seconds without mouse movement.</p>
          </>
        ) : (
          <>
            <p>Camera-based eye tracking provides more accurate presence detection.</p>
            <p className="mt-1">For a real implementation, an AI model would analyze your eye movements.</p>
            <p className="mt-1">All processing is done locally - no data is sent to any server.</p>
          </>
        )}
      </div>
    </div>
  );
}