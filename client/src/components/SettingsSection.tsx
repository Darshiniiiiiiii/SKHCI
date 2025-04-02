import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface SettingsSectionProps {
  isActive: boolean;
}

export default function SettingsSection({ isActive }: SettingsSectionProps) {
  // Theme Settings
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState<'blue' | 'purple' | 'green' | 'orange'>('blue');
  const [fontSize, setFontSize] = useState(14);
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [meetingReminders, setMeetingReminders] = useState(true);
  
  // Privacy Settings
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showReadReceipts, setShowReadReceipts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  
  // User Info Settings
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [timeZone, setTimeZone] = useState('UTC-5 (Eastern Time)');
  
  // Save settings
  const [saveMessage, setSaveMessage] = useState('');
  
  const handleSave = () => {
    // In a real app, this would save to server/localStorage
    setSaveMessage('Settings saved successfully!');
    
    // Apply theme changes
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Apply font size changes
    document.documentElement.style.setProperty('--font-size-adjustment', `${fontSize - 14}px`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };
  
  // Reset settings
  const handleReset = () => {
    setDarkMode(false);
    setColorTheme('blue');
    setFontSize(14);
    setEmailNotifications(true);
    setPushNotifications(true);
    setDailyDigest(false);
    setMeetingReminders(true);
    setShowOnlineStatus(true);
    setShowReadReceipts(true);
    setPublicProfile(false);
    document.body.classList.remove('dark-mode');
    document.documentElement.style.setProperty('--font-size-adjustment', '0px');
    setSaveMessage('Settings reset to defaults');
    
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };
  
  return (
    <section 
      id="settings-section" 
      className={`p-6 ${isActive ? '' : 'hidden'} ${darkMode ? 'dark-mode' : ''}`}
      aria-hidden={!isActive}
    >
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Settings</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              Reset
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
        
        {saveMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {saveMessage}
          </div>
        )}
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                />
              </div>
              
              <div>
                <Label className="font-medium">Color Theme</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Choose your preferred color accent</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setColorTheme('blue')} 
                    className={`w-8 h-8 rounded-full bg-blue-500 ${colorTheme === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    aria-label="Blue theme"
                  />
                  <button 
                    onClick={() => setColorTheme('purple')}
                    className={`w-8 h-8 rounded-full bg-purple-500 ${colorTheme === 'purple' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                    aria-label="Purple theme"
                  />
                  <button 
                    onClick={() => setColorTheme('green')}
                    className={`w-8 h-8 rounded-full bg-green-500 ${colorTheme === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                    aria-label="Green theme"
                  />
                  <button 
                    onClick={() => setColorTheme('orange')}
                    className={`w-8 h-8 rounded-full bg-orange-500 ${colorTheme === 'orange' ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`}
                    aria-label="Orange theme"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="font-size" className="font-medium">Font Size</Label>
                  <span>{fontSize}px</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Adjust the base font size</p>
                <Slider 
                  id="font-size"
                  min={10} 
                  max={20} 
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  className="py-4"
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications in browser</p>
                </div>
                <Switch 
                  id="push-notifications" 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-digest" className="font-medium">Daily Digest</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive a summary of activities daily</p>
                </div>
                <Switch 
                  id="daily-digest" 
                  checked={dailyDigest} 
                  onCheckedChange={setDailyDigest}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="meeting-reminders" className="font-medium">Meeting Reminders</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notifications before scheduled meetings</p>
                </div>
                <Switch 
                  id="meeting-reminders" 
                  checked={meetingReminders} 
                  onCheckedChange={setMeetingReminders}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="online-status" className="font-medium">Show Online Status</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Let others see when you're active</p>
                </div>
                <Switch 
                  id="online-status" 
                  checked={showOnlineStatus} 
                  onCheckedChange={setShowOnlineStatus}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="read-receipts" className="font-medium">Read Receipts</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Let others know when you've read messages</p>
                </div>
                <Switch 
                  id="read-receipts" 
                  checked={showReadReceipts} 
                  onCheckedChange={setShowReadReceipts}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-profile" className="font-medium">Public Profile</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Make your profile visible to everyone</p>
                </div>
                <Switch 
                  id="public-profile" 
                  checked={publicProfile} 
                  onCheckedChange={setPublicProfile}
                />
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-2">Data Management</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <span className="text-red-500 mr-2">&#x26A0;</span> Delete Account Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    Export Your Data
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-medium">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="timezone" className="font-medium">Time Zone</Label>
                <select 
                  id="timezone" 
                  value={timeZone} 
                  onChange={(e) => setTimeZone(e.target.value)}
                  className={`w-full mt-1 rounded-md border border-gray-300 p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
                >
                  <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                  <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                  <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                  <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                  <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                  <option value="UTC+1 (Central European Time)">UTC+1 (Central European Time)</option>
                  <option value="UTC+8 (China Standard Time)">UTC+8 (China Standard Time)</option>
                  <option value="UTC+9 (Japan Standard Time)">UTC+9 (Japan Standard Time)</option>
                </select>
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium mb-2">Password</h4>
                <Button variant="outline" className="w-full sm:w-auto">
                  Change Password
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-2">Account Status</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Account created on April 1, 2025</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            To apply Appearance settings site-wide, please click "Save Changes" at the top.
          </p>
        </div>
      </div>
    </section>
  );
}
