interface SettingsSectionProps {
  isActive: boolean;
}

export default function SettingsSection({ isActive }: SettingsSectionProps) {
  return (
    <section id="settings-section" className={`p-6 ${isActive ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-medium mb-4">Settings</h3>
        <ul className="space-y-4">
          <li className="p-3 hover:bg-gray-50 rounded cursor-pointer transition border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Profile Settings</h4>
                <p className="text-sm text-gray-600">Update your profile information</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>
          </li>
          <li className="p-3 hover:bg-gray-50 rounded cursor-pointer transition border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Notification Settings</h4>
                <p className="text-sm text-gray-600">Configure alerts and notifications</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>
          </li>
          <li className="p-3 hover:bg-gray-50 rounded cursor-pointer transition border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Privacy Settings</h4>
                <p className="text-sm text-gray-600">Manage your privacy preferences</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>
          </li>
          <li className="p-3 hover:bg-gray-50 rounded cursor-pointer transition">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Account Settings</h4>
                <p className="text-sm text-gray-600">Update account information</p>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
