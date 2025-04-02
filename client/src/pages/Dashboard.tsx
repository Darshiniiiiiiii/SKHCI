import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatSection from '@/components/ChatSection';
import DashboardSection from '@/components/DashboardSection';
import CalendarSection from '@/components/CalendarSection';
import SettingsSection from '@/components/SettingsSection';
import StatisticalDashboardSection from '@/components/StatisticalDashboardSection';
import { ActiveSection } from '@/lib/types';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard-section');

  useEffect(() => {
    // Check if there's a stored section preference
    const storedSection = localStorage.getItem('activeSection');
    if (storedSection) {
      setActiveSection(storedSection as ActiveSection);
    }
  }, []);

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  return (
    <div className="flex h-screen bg-light text-dark">
      <Sidebar onSectionChange={handleSectionChange} activeSection={activeSection} />
      
      <main id="main-content" className="flex-1 overflow-auto">
        <ChatSection isActive={activeSection === 'chat-section'} />
        <DashboardSection isActive={activeSection === 'dashboard-section'} />
        <StatisticalDashboardSection isActive={activeSection === 'statistical-dashboard-section'} />
        <CalendarSection isActive={activeSection === 'calendar-section'} />
        <SettingsSection isActive={activeSection === 'settings-section'} />
      </main>
    </div>
  );
}
