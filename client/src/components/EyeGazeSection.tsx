import { useState, useEffect } from 'react';
import EyeGazeTracker from './EyeGazeTracker';

interface EyeGazeSectionProps {
  isActive: boolean;
}

export default function EyeGazeSection({ isActive }: EyeGazeSectionProps) {
  const [presenceStatus, setPresenceStatus] = useState<'present' | 'away' | 'fake-presence'>('present');

  const handleStatusChange = (status: 'present' | 'away' | 'fake-presence') => {
    setPresenceStatus(status);
  };

  return (
    <section id="eye-gaze-section" className={`p-6 ${isActive ? '' : 'hidden'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-violet-600 to-purple-500 p-2 rounded-lg text-white mr-3">
            <i className="fas fa-eye text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
              Eye Gazing Tracker
            </h2>
            <p className="text-gray-500 text-sm">Monitor presence and engagement during meetings</p>
          </div>
        </div>

        <EyeGazeTracker isActive={true} onStatusChange={handleStatusChange} />
      </div>
    </section>
  );
}