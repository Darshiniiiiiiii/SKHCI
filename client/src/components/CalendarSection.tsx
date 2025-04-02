import { useEffect, useRef } from 'react';

interface CalendarSectionProps {
  isActive: boolean;
}

export default function CalendarSection({ isActive }: CalendarSectionProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !calendarRef.current) return;
    
    // Initialize FullCalendar when section becomes active
    // We need to use the jQuery-based API because that's what our included script uses
    const $ = (window as any).jQuery;
    if ($) {
      $(calendarRef.current).fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        events: [
          {
            title: 'Project Meeting',
            start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 10, 0),
            end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 11, 30),
          },
          {
            title: 'Sprint Planning',
            start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3),
            end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3),
            allDay: true
          }
        ]
      });
    }
    
    // Cleanup calendar when component unmounts
    return () => {
      if ($ && calendarRef.current) {
        $(calendarRef.current).fullCalendar('destroy');
      }
    };
  }, [isActive]);

  return (
    <section id="calendar-section" className={`p-6 ${isActive ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-medium mb-4">Calendar</h3>
        <div 
          ref={calendarRef}
          id="calendar" 
          className="border border-gray-200 rounded p-4 min-h-[500px]"
        ></div>
      </div>
    </section>
  );
}
