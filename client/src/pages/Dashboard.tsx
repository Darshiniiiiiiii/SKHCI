import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatSection from '@/components/ChatSection';
import DashboardSection from '@/components/DashboardSection';
import CalendarSection from '@/components/CalendarSection';
import SettingsSection from '@/components/SettingsSection';
import StatisticalDashboardSection from '@/components/StatisticalDashboardSection';
import { ActiveSection } from '@/lib/types';
import { Toaster } from '@/components/ui/toaster';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard-section');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if there's a stored section preference
    const storedSection = localStorage.getItem('activeSection');
    if (storedSection) {
      setActiveSection(storedSection as ActiveSection);
    }
    
    // Check if dark mode is enabled
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    setDarkMode(darkModeEnabled);
    
    if (darkModeEnabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Setup event listener for dark mode toggle
    const handleDarkModeToggle = (event: CustomEvent) => {
      const isDark = event.detail;
      setDarkMode(isDark);
      localStorage.setItem('darkMode', isDark.toString());
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    window.addEventListener('darkModeToggle', handleDarkModeToggle as EventListener);
    
    return () => {
      window.removeEventListener('darkModeToggle', handleDarkModeToggle as EventListener);
    };
  }, []);

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <Sidebar onSectionChange={handleSectionChange} activeSection={activeSection} />
      
      <main id="main-content" className="flex-1 overflow-auto">
        <ChatSection isActive={activeSection === 'chat-section'} />
        <DashboardSection isActive={activeSection === 'dashboard-section'} />
        <StatisticalDashboardSection isActive={activeSection === 'statistical-dashboard-section'} />
        <CalendarSection isActive={activeSection === 'calendar-section'} />
        <SettingsSection isActive={activeSection === 'settings-section'} />
      </main>
      
      <Toaster />
    </div>
  );
}
