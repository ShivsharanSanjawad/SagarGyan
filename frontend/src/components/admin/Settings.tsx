import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Save, RefreshCw, Shield, Bell, Database, Globe } from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    systemName: 'SagarGyaan',
    systemEmail: 'admin@cmrle.gov.in',
    maxUploadSize: '500',
    sessionTimeout: '30',
    enableNotifications: true,
    enableBackup: true,
    enableLogging: true,
    backupFrequency: 'daily',
    logLevel: 'info',
    maintenanceMode: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div
        className="w-11 h-6 bg-gray-200 rounded-full peer transition-colors duration-300
                   peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300
                   relative after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                   after:bg-white after:border-gray-300 after:border after:rounded-full
                   after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white
                   peer-checked:bg-sky-600"
      />
    </label>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure system parameters and preferences</p>
      </div>

      {/* match SystemManagement layout: cream page band and white cards with stronger shadow */}
      <section className="py-6" style={{ backgroundColor: '#fdf2df' }}>
        <div className="max-w-[1200px] mx-auto px-4">
          {/* grid children stretch so cards display evenly (prevents 'squimmed center') */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* General Settings */}
            <Card className="shadow-xl bg-white border border-transparent h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-sky-600" />
                  General Settings
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3">
                  <Input
                    label="System Name"
                    value={settings.systemName}
                    onChange={(e) => setSettings((prev) => ({ ...prev, systemName: e.target.value }))}
                  />
                  <Input
                    label="System Email"
                    type="email"
                    value={settings.systemEmail}
                    onChange={(e) => setSettings((prev) => ({ ...prev, systemEmail: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <Input
                    label="Max Upload Size (MB)"
                    type="number"
                    value={settings.maxUploadSize}
                    onChange={(e) => setSettings((prev) => ({ ...prev, maxUploadSize: e.target.value }))}
                  />
                  <Input
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
                  />
                </div>

                <div className="mt-auto text-sm text-gray-500">Changes here affect the entire system. Proceed with caution.</div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-xl bg-white border border-transparent h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-sky-600" />
                  Security Settings
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Temporarily disable system access</p>
                  </div>
                  <Toggle
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings((prev) => ({ ...prev, maintenanceMode: e.target.checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Enable Logging</p>
                    <p className="text-sm text-gray-500">Record system activities</p>
                  </div>
                  <Toggle
                    checked={settings.enableLogging}
                    onChange={(e) => setSettings((prev) => ({ ...prev, enableLogging: e.target.checked }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
                  <select
                    value={settings.logLevel}
                    onChange={(e) => setSettings((prev) => ({ ...prev, logLevel: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>

                <div className="mt-auto text-sm text-gray-500">Logging helps with audits and troubleshooting.</div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-xl bg-white border border-transparent h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-sky-600" />
                  Notifications
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">System Notifications</p>
                    <p className="text-sm text-gray-500">Receive alerts and updates</p>
                  </div>
                  <Toggle
                    checked={settings.enableNotifications}
                    onChange={(e) => setSettings((prev) => ({ ...prev, enableNotifications: e.target.checked }))}
                  />
                </div>

                <div className="mt-auto text-sm text-gray-500">Notification volume can be adjusted per user in Profiles.</div>
              </CardContent>
            </Card>

            {/* Backup & Recovery */}
            <Card className="shadow-xl bg-white border border-transparent h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-sky-600" />
                  Backup & Recovery
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Automatic Backup</p>
                    <p className="text-sm text-gray-500">Schedule regular backups</p>
                  </div>
                  <Toggle
                    checked={settings.enableBackup}
                    onChange={(e) => setSettings((prev) => ({ ...prev, enableBackup: e.target.checked }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings((prev) => ({ ...prev, backupFrequency: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Create Backup Now
                  </Button>
                </div>

                <div className="mt-auto text-sm text-gray-500">Backups are stored offsite by default.</div>
              </CardContent>
            </Card>
          </div>

          {/* Save button aligned like SystemManagement */}
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
              className="bg-sky-600 text-white hover:bg-sky-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
