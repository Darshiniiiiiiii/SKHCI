import { ActiveSection } from '@/lib/types';

interface SidebarProps {
  onSectionChange: (section: ActiveSection) => void;
  activeSection: ActiveSection;
}

export default function Sidebar({ onSectionChange, activeSection }: SidebarProps) {
  return (
    <aside className="w-64 bg-primary text-white">
      <div className="p-5">
        <h2 className="text-xl font-medium mb-6">Process Planning</h2>
        <nav>
          <ul className="space-y-2">
            <li 
              className={`p-2 hover:bg-white/10 rounded cursor-pointer transition ${activeSection === 'chat-section' ? 'bg-white/20' : ''}`} 
              onClick={() => onSectionChange('chat-section')}
            >
              <i className="fas fa-comments mr-2"></i> Chats
            </li>
            <li 
              className={`p-2 hover:bg-white/10 rounded cursor-pointer transition ${activeSection === 'dashboard-section' ? 'bg-white/20' : ''}`}
              onClick={() => onSectionChange('dashboard-section')}
            >
              <i className="fas fa-chart-line mr-2"></i> Dashboards
            </li>
            <li 
              className={`p-2 hover:bg-white/10 rounded cursor-pointer transition ${activeSection === 'calendar-section' ? 'bg-white/20' : ''}`}
              onClick={() => onSectionChange('calendar-section')}
            >
              <i className="fas fa-calendar-alt mr-2"></i> Calendar
            </li>
            <li 
              className={`p-2 hover:bg-white/10 rounded cursor-pointer transition ${activeSection === 'settings-section' ? 'bg-white/20' : ''}`}
              onClick={() => onSectionChange('settings-section')}
            >
              <i className="fas fa-cog mr-2"></i> Settings
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
