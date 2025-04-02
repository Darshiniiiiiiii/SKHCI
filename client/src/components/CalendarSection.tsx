import { useState, useEffect, useRef } from 'react';
import { Meeting, Room, ActiveUser } from '@/lib/types';
import { initializeData, STORAGE_KEYS, defaultMeetings, defaultRooms, createMeeting, users } from '@/lib/sampleData';

interface CalendarSectionProps {
  isActive: boolean;
}

export default function CalendarSection({ isActive }: CalendarSectionProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [activeUser, setActiveUser] = useState<ActiveUser>('user1');
  
  // Form states for new meeting
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingStartDate, setMeetingStartDate] = useState('');
  const [meetingStartTime, setMeetingStartTime] = useState('');
  const [meetingEndDate, setMeetingEndDate] = useState('');
  const [meetingEndTime, setMeetingEndTime] = useState('');
  const [meetingRoom, setMeetingRoom] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<ActiveUser[]>(['user1', 'user2']);
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // Initialize data if not present
    initializeData();
    
    // Load active user
    const savedUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) as ActiveUser | null;
    if (savedUser) {
      setActiveUser(savedUser);
    }
    
    // Load meetings
    loadMeetings();
    
    // Load rooms
    loadRooms();
  }, []);
  
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
        events: meetings.map(meeting => ({
          id: meeting.id,
          title: meeting.title,
          start: meeting.start,
          end: meeting.end,
          description: meeting.description,
          roomId: meeting.room,
          className: meeting.participants.includes(activeUser) ? 'my-meeting' : '',
          color: meeting.participants.includes(activeUser) ? '#3f51b5' : '#7986cb'
        })),
        eventClick: function(calEvent: any) {
          alert(`Meeting: ${calEvent.title}\n${calEvent.start.format('h:mm A')} - ${calEvent.end.format('h:mm A')}\n${calEvent.description || 'No description'}\nRoom: ${getRoomNameById(calEvent.roomId) || 'No room'}`);
        }
      });
    }
    
    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .fc-event.my-meeting {
        border-left: 4px solid #ff4081;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup calendar when component unmounts
    return () => {
      if ($ && calendarRef.current) {
        $(calendarRef.current).fullCalendar('destroy');
      }
      document.head.removeChild(style);
    };
  }, [isActive, meetings, activeUser]);
  
  const loadMeetings = () => {
    const meetingsString = localStorage.getItem(STORAGE_KEYS.MEETINGS);
    if (meetingsString) {
      const loadedMeetings = JSON.parse(meetingsString);
      
      // Fix date objects (they come as strings from JSON)
      const parsedMeetings = loadedMeetings.map((meeting: any) => ({
        ...meeting,
        start: new Date(meeting.start),
        end: new Date(meeting.end)
      }));
      
      setMeetings(parsedMeetings);
    } else {
      setMeetings(defaultMeetings);
    }
  };
  
  const loadRooms = () => {
    const roomsString = localStorage.getItem(STORAGE_KEYS.AVAILABLE_ROOMS);
    if (roomsString) {
      setRooms(JSON.parse(roomsString));
    } else {
      setRooms(defaultRooms);
    }
  };
  
  const refreshCalendar = () => {
    const $ = (window as any).jQuery;
    if ($ && calendarRef.current) {
      $(calendarRef.current).fullCalendar('destroy');
      $(calendarRef.current).fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        events: meetings.map(meeting => ({
          id: meeting.id,
          title: meeting.title,
          start: meeting.start,
          end: meeting.end,
          description: meeting.description,
          roomId: meeting.room,
          className: meeting.participants.includes(activeUser) ? 'my-meeting' : '',
          color: meeting.participants.includes(activeUser) ? '#3f51b5' : '#7986cb'
        }))
      });
    }
  };
  
  const getRoomNameById = (roomId?: string) => {
    if (!roomId) return '';
    const room = rooms.find(r => r.id === roomId);
    return room?.name || '';
  };
  
  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetingTitle || !meetingStartDate || !meetingStartTime || !meetingEndDate || !meetingEndTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    const startDateTime = new Date(`${meetingStartDate}T${meetingStartTime}`);
    const endDateTime = new Date(`${meetingEndDate}T${meetingEndTime}`);
    
    if (endDateTime <= startDateTime) {
      alert('End time must be after start time');
      return;
    }
    
    const newMeeting = createMeeting(
      meetingTitle,
      startDateTime,
      endDateTime,
      selectedParticipants,
      meetingRoom || undefined,
      meetingDescription || undefined
    );
    
    // Reload meetings
    loadMeetings();
    
    // Reset form
    setMeetingTitle('');
    setMeetingStartDate('');
    setMeetingStartTime('');
    setMeetingEndDate('');
    setMeetingEndTime('');
    setMeetingRoom('');
    setMeetingDescription('');
    setSelectedParticipants(['user1', 'user2']);
    setShowNewMeetingForm(false);
    
    // Refresh calendar
    setTimeout(refreshCalendar, 100);
  };
  
  const toggleParticipant = (user: ActiveUser) => {
    if (selectedParticipants.includes(user)) {
      // Don't remove if it's the last participant
      if (selectedParticipants.length > 1) {
        setSelectedParticipants(selectedParticipants.filter(p => p !== user));
      }
    } else {
      setSelectedParticipants([...selectedParticipants, user]);
    }
  };
  
  const switchUser = (user: ActiveUser) => {
    setActiveUser(user);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, user);
    
    // Refresh the calendar to update color-coding for meetings
    setTimeout(refreshCalendar, 100);
  };
  
  // Set today's date as default for date pickers
  useEffect(() => {
    if (showNewMeetingForm) {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      
      setMeetingStartDate(today);
      setMeetingStartTime(`${currentHour}:${currentMinute}`);
      
      // Set end time 1 hour later
      const endHour = (now.getHours() + 1).toString().padStart(2, '0');
      setMeetingEndDate(today);
      setMeetingEndTime(`${endHour}:${currentMinute}`);
    }
  }, [showNewMeetingForm]);

  return (
    <section id="calendar-section" className={`p-6 ${isActive ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header with user switcher and meeting button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">Calendar</h3>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button 
                className={`py-1 px-4 rounded-full transition ${activeUser === 'user1' ? 'bg-primary text-white font-medium' : ''}`}
                onClick={() => switchUser('user1')}
              >
                {users.user1.name}
              </button>
              <button 
                className={`py-1 px-4 rounded-full transition ${activeUser === 'user2' ? 'bg-secondary text-white font-medium' : ''}`}
                onClick={() => switchUser('user2')}
              >
                {users.user2.name}
              </button>
            </div>
            
            <button 
              className="bg-primary text-white py-1 px-4 rounded hover:bg-primary/90 transition"
              onClick={() => setShowNewMeetingForm(!showNewMeetingForm)}
            >
              {showNewMeetingForm ? 'Cancel' : 'New Meeting'}
            </button>
          </div>
        </div>
        
        {/* Meeting form */}
        {showNewMeetingForm && (
          <form 
            ref={formRef}
            onSubmit={handleCreateMeeting}
            className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h4 className="font-medium mb-3">Schedule New Meeting</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title*</label>
                <input 
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Room</label>
                <select 
                  className="w-full border border-gray-300 rounded p-2"
                  value={meetingRoom}
                  onChange={(e) => setMeetingRoom(e.target.value)}
                >
                  <option value="">-- Select a room --</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Date*</label>
                <input 
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  value={meetingStartDate}
                  onChange={(e) => setMeetingStartDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Time*</label>
                <input 
                  type="time"
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  value={meetingStartTime}
                  onChange={(e) => setMeetingStartTime(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Date*</label>
                <input 
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  value={meetingEndDate}
                  onChange={(e) => setMeetingEndDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Time*</label>
                <input 
                  type="time"
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  value={meetingEndTime}
                  onChange={(e) => setMeetingEndTime(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-2"
                  rows={3}
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Participants</label>
                <div className="flex flex-wrap gap-2">
                  <div 
                    className={`border rounded-full py-1 px-3 cursor-pointer ${
                      selectedParticipants.includes('user1') 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100'
                    }`}
                    onClick={() => toggleParticipant('user1')}
                  >
                    {users.user1.name}
                  </div>
                  <div 
                    className={`border rounded-full py-1 px-3 cursor-pointer ${
                      selectedParticipants.includes('user2') 
                        ? 'bg-secondary text-white' 
                        : 'bg-gray-100'
                    }`}
                    onClick={() => toggleParticipant('user2')}
                  >
                    {users.user2.name}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
              >
                Schedule Meeting
              </button>
            </div>
          </form>
        )}
        
        {/* Calendar view */}
        <div 
          ref={calendarRef}
          id="calendar" 
          className="border border-gray-200 rounded p-4 min-h-[500px]"
        ></div>
        
        <div className="mt-4 text-sm text-gray-500 flex items-center">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
            <span>My Meetings</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#7986cb] mr-1"></div>
            <span>Other Meetings</span>
          </div>
        </div>
      </div>
    </section>
  );
}
