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
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Professional Header with user switcher and meeting button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-violet-600 to-purple-500 p-2 rounded-lg text-white mr-3">
              <i className="fas fa-calendar-alt text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                Meeting Calendar
              </h3>
              <p className="text-gray-500 text-sm">Manage and schedule your meetings</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-sm">
              <button 
                className={`py-1.5 px-4 rounded-full transition font-medium ${
                  activeUser === 'user1' 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => switchUser('user1')}
              >
                {users.user1.name}
              </button>
              <button 
                className={`py-1.5 px-4 rounded-full transition font-medium ${
                  activeUser === 'user2' 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => switchUser('user2')}
              >
                {users.user2.name}
              </button>
            </div>
            
            <button 
              className={`flex items-center py-1.5 px-4 rounded-md shadow-sm transition duration-200 ${
                showNewMeetingForm
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-md'
              }`}
              onClick={() => setShowNewMeetingForm(!showNewMeetingForm)}
            >
              <i className={`fas ${showNewMeetingForm ? 'fa-times' : 'fa-plus'} mr-2`}></i>
              {showNewMeetingForm ? 'Cancel' : 'New Meeting'}
            </button>
          </div>
        </div>
        
        {/* Professional Meeting form */}
        {showNewMeetingForm && (
          <form 
            ref={formRef}
            onSubmit={handleCreateMeeting}
            className="mb-6 p-6 bg-white rounded-lg border border-gray-200 shadow-md"
          >
            <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-2 rounded-lg mr-3">
                <i className="fas fa-users text-lg"></i>
              </div>
              <h4 className="text-xl font-semibold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                Schedule New Meeting
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  <i className="fas fa-heading text-violet-500 mr-1.5"></i>
                  Title*
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Enter meeting title"
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-200 shadow-sm"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  <i className="fas fa-door-open text-violet-500 mr-1.5"></i>
                  Room
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-200 shadow-sm"
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
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  <i className="fas fa-calendar-day text-violet-500 mr-1.5"></i>
                  Start Date*
                </label>
                <input 
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-200 shadow-sm"
                  value={meetingStartDate}
                  onChange={(e) => setMeetingStartDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  <i className="fas fa-clock text-violet-500 mr-1.5"></i>
                  Start Time*
                </label>
                <input 
                  type="time"
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-200 shadow-sm"
                  value={meetingStartTime}
                  onChange={(e) => setMeetingStartTime(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  <i className="fas fa-calendar-check text-violet-500 mr-1.5"></i>
                  End Date*
                </label>
                <input 
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-200 shadow-sm"
                  value={meetingEndDate}
                  onChange={(e) => setMeetingEndDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  <i className="fas fa-hourglass-end text-violet-500 mr-1.5"></i>
                  End Time*
                </label>
                <input 
                  type="time"
                  required
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-200 shadow-sm"
                  value={meetingEndTime}
                  onChange={(e) => setMeetingEndTime(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  <i className="fas fa-align-left text-violet-500 mr-1.5"></i>
                  Description
                </label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition duration-200 shadow-sm"
                  rows={3}
                  placeholder="Enter meeting description or agenda"
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5 text-gray-700">
                  <i className="fas fa-user-friends text-violet-500 mr-1.5"></i>
                  Participants
                </label>
                <div className="flex flex-wrap gap-2">
                  <div 
                    className={`border rounded-full py-1.5 px-4 cursor-pointer transition duration-200 flex items-center ${
                      selectedParticipants.includes('user1') 
                        ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white border-transparent shadow-sm' 
                        : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleParticipant('user1')}
                  >
                    {selectedParticipants.includes('user1') && (
                      <i className="fas fa-check-circle mr-1.5 text-white"></i>
                    )}
                    {users.user1.name}
                  </div>
                  <div 
                    className={`border rounded-full py-1.5 px-4 cursor-pointer transition duration-200 flex items-center ${
                      selectedParticipants.includes('user2') 
                        ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white border-transparent shadow-sm' 
                        : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleParticipant('user2')}
                  >
                    {selectedParticipants.includes('user2') && (
                      <i className="fas fa-check-circle mr-1.5 text-white"></i>
                    )}
                    {users.user2.name}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end border-t border-gray-100 pt-4">
              <button 
                type="button"
                className="mr-3 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-200"
                onClick={() => setShowNewMeetingForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-2 px-6 rounded-md shadow-sm hover:shadow transition duration-200 font-medium"
              >
                <i className="fas fa-calendar-plus mr-2"></i>
                Schedule Meeting
              </button>
            </div>
          </form>
        )}
        
        {/* Professional layout with calendar and upcoming meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Calendar view */}
          <div className="lg:col-span-2">
            <div 
              ref={calendarRef}
              id="calendar" 
              className="border border-gray-200 rounded p-4 min-h-[500px] bg-white shadow-sm"
            ></div>
          </div>

          {/* Professional Upcoming Meetings */}
          <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-600">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <i className="fas fa-calendar-check mr-2"></i>
                Upcoming Meetings
              </h4>
              <p className="text-violet-100 text-sm opacity-90">Your next scheduled meetings</p>
            </div>
            
            <div className="p-4">
              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar">
                {meetings
                  .filter(meeting => meeting.start >= new Date()) // Only future meetings
                  .sort((a, b) => a.start.getTime() - b.start.getTime()) // Sort by date
                  .slice(0, 5) // Only show next 5 meetings
                  .map((meeting, index) => {
                    const isMyMeeting = meeting.participants.includes(activeUser);
                    const startTime = meeting.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    const endTime = meeting.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    const meetingDate = meeting.start.toLocaleDateString([], {month: 'short', day: 'numeric'});
                    
                    // Calculate if meeting is today
                    const today = new Date();
                    const isToday = meeting.start.getDate() === today.getDate() && 
                                    meeting.start.getMonth() === today.getMonth() &&
                                    meeting.start.getFullYear() === today.getFullYear();
                                    
                    // Calculate if meeting is happening soon (within the next hour)
                    const soon = new Date(today.getTime() + 60 * 60 * 1000);
                    const startingSoon = meeting.start <= soon && meeting.start > today;
                    
                    return (
                      <div 
                        key={meeting.id} 
                        className={`p-4 rounded-lg shadow-sm transition duration-200 border ${
                          isMyMeeting 
                            ? 'bg-violet-50 border-violet-200 hover:shadow-md' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`min-w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            startingSoon
                              ? 'bg-red-100 text-red-600'
                              : isToday
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-violet-100 text-violet-600'
                          }`}>
                            <i className={`fas ${
                              startingSoon
                                ? 'fa-bell'
                                : isToday
                                  ? 'fa-calendar-day'
                                  : 'fa-calendar-alt'
                            } text-lg`}></i>
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-violet-900">
                                  {meeting.title}
                                  {startingSoon && (
                                    <span className="ml-2 text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                                      Starting Soon
                                    </span>
                                  )}
                                  {isToday && !startingSoon && (
                                    <span className="ml-2 text-xs font-bold text-amber-500 bg-amber-100 px-2 py-0.5 rounded-full">
                                      Today
                                    </span>
                                  )}
                                </h5>
                                <div className="text-sm text-gray-600 mt-1">
                                  <div className="flex items-center">
                                    <i className="fas fa-clock mr-1 text-violet-400"></i>
                                    {meetingDate}, {startTime} - {endTime}
                                  </div>
                                  {meeting.room && (
                                    <div className="flex items-center mt-1">
                                      <i className="fas fa-map-marker-alt mr-1 text-violet-400"></i>
                                      {getRoomNameById(meeting.room)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {meeting.participants.length > 0 && (
                              <div className="mt-3 flex items-center">
                                <span className="text-xs text-gray-500 mr-2">Participants:</span>
                                <div className="flex -space-x-2">
                                  {meeting.participants.map(participant => (
                                    <div 
                                      key={participant} 
                                      className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center text-xs font-medium border border-white"
                                      title={users[participant].name}
                                    >
                                      {users[participant].name.charAt(0)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-3 flex justify-end">
                              <button 
                                className="flex items-center bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-3 py-1.5 rounded text-xs font-medium transition duration-200 shadow-sm"
                                onClick={() => alert(`Joining meeting: ${meeting.title}`)}
                              >
                                <i className="fas fa-video mr-1.5"></i>
                                Join Meeting
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                {meetings.filter(meeting => meeting.start >= new Date()).length === 0 && (
                  <div className="text-center p-6 text-gray-500 bg-white rounded-lg border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-calendar-times text-2xl text-gray-400"></i>
                    </div>
                    <h5 className="text-lg font-medium text-gray-700 mb-1">No Upcoming Meetings</h5>
                    <p className="text-gray-500 mb-4">Your schedule is clear for now</p>
                    <button 
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-2 px-4 rounded-md font-medium transition duration-200"
                      onClick={() => setShowNewMeetingForm(true)}
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Schedule New Meeting
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 flex items-center justify-end">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 rounded-full bg-violet-600 mr-1"></div>
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
