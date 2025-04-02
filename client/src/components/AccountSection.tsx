import { useState, useEffect } from 'react';
import { ActiveUser } from '@/lib/types';
import { users, STORAGE_KEYS } from '@/lib/sampleData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AccountSectionProps {
  isActive: boolean;
}

export default function AccountSection({ isActive }: AccountSectionProps) {
  const [activeUser, setActiveUser] = useState<ActiveUser>('user1');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Load active user
    const savedUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER) as ActiveUser | null;
    if (savedUser) {
      setActiveUser(savedUser);
    }

    // Set initial form values based on active user
    setName(users[activeUser || 'user1'].name);
    
    // Set mock email based on username
    setEmail(users[activeUser || 'user1'].name.toLowerCase().replace(/\s+/g, '.') + '@process-planning.com');
  }, [activeUser]);

  const switchUser = (user: ActiveUser) => {
    setActiveUser(user);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, user);
    
    // Update form values
    setName(users[user].name);
    setEmail(users[user].name.toLowerCase().replace(/\s+/g, '.') + '@process-planning.com');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the server
    // Here we'll just show a success message
    alert('Profile saved successfully!');
  };

  return (
    <section id="account-section" className={`p-6 ${isActive ? '' : 'hidden'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-violet-600 to-purple-500 p-2 rounded-lg text-white mr-3">
            <i className="fas fa-user-circle text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
              Account Settings
            </h2>
            <p className="text-gray-500 text-sm">Manage your account preferences and profile</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
              {name.charAt(0)}
            </div>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-500">{email}</div>
            </div>
          </div>
          
          <div>
            <Badge variant="outline" className="bg-violet-100 text-violet-800 border-violet-200">
              {activeUser === 'user1' ? 'Process Manager' : 'Team Lead'}
            </Badge>
          </div>
        </div>

        <Tabs 
          defaultValue="profile" 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="text-sm">
              <i className="fas fa-user mr-2"></i>
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-sm">
              <i className="fas fa-bell mr-2"></i>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="text-sm">
              <i className="fas fa-shield-alt mr-2"></i>
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Active User</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <div 
                        className={`border rounded-full py-1.5 px-4 cursor-pointer transition duration-200 flex items-center ${
                          activeUser === 'user1' 
                            ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white border-transparent shadow-sm' 
                            : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => switchUser('user1')}
                      >
                        {activeUser === 'user1' && (
                          <i className="fas fa-check-circle mr-1.5 text-white"></i>
                        )}
                        {users.user1.name}
                      </div>
                      <div 
                        className={`border rounded-full py-1.5 px-4 cursor-pointer transition duration-200 flex items-center ${
                          activeUser === 'user2' 
                            ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white border-transparent shadow-sm' 
                            : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => switchUser('user2')}
                      >
                        {activeUser === 'user2' && (
                          <i className="fas fa-check-circle mr-1.5 text-white"></i>
                        )}
                        {users.user2.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                      <i className="fas fa-save mr-2"></i>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications about meetings and messages</p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sounds">Notification Sounds</Label>
                    <p className="text-sm text-gray-500">Play sounds for new notifications</p>
                  </div>
                  <Switch 
                    id="sounds" 
                    checked={soundsEnabled}
                    onCheckedChange={setSoundsEnabled}
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Notification Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="meeting-notifications" className="rounded text-violet-600" defaultChecked />
                      <Label htmlFor="meeting-notifications">Meeting Reminders</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="mention-notifications" className="rounded text-violet-600" defaultChecked />
                      <Label htmlFor="mention-notifications">Mentions in Chat</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="deadline-notifications" className="rounded text-violet-600" defaultChecked />
                      <Label htmlFor="deadline-notifications">Deadline Reminders</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="update-notifications" className="rounded text-violet-600" defaultChecked />
                      <Label htmlFor="update-notifications">Project Updates</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  <i className="fas fa-save mr-2"></i>
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Enter your current password" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Enter new password" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm new password" 
                  />
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm">Secure your account with 2FA</p>
                    </div>
                    <Button variant="outline">
                      <i className="fas fa-lock mr-2"></i>
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  <i className="fas fa-save mr-2"></i>
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}