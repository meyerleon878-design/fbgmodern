import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Palette, Lock, Save, Check } from 'lucide-react';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    displayName: 'FBG_ADMIN',
    email: 'admin@fbg-systems.net',
    status: 'Online',
    notifications: true,
    soundEffects: true,
    autoLock: false,
    lockTimeout: '5',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-48 border-r border-border p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-sm font-medium text-foreground">FBG_ADMIN</span>
          <span className="text-xs text-muted-foreground">Administrator</span>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Display Name</label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Status</label>
                <select
                  value={settings.status}
                  onChange={(e) => setSettings({ ...settings, status: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Online">🟢 Online</option>
                  <option value="Away">🟡 Away</option>
                  <option value="Busy">🔴 Busy</option>
                  <option value="Invisible">⚫ Invisible</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Security Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Auto-Lock</p>
                    <p className="text-xs text-muted-foreground">Lock system after inactivity</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoLock: !settings.autoLock })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.autoLock ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.autoLock ? 24 : 2 }}
                    className="w-5 h-5 bg-foreground rounded-full"
                  />
                </button>
              </div>

              {settings.autoLock && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Lock after (minutes)</label>
                  <select
                    value={settings.lockTimeout}
                    onChange={(e) => setSettings({ ...settings, lockTimeout: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                  >
                    <option value="1">1 minute</option>
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                </div>
              )}

              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Desktop Notifications</p>
                  <p className="text-xs text-muted-foreground">Show popup notifications</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.notifications ? 24 : 2 }}
                    className="w-5 h-5 bg-foreground rounded-full"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Sound Effects</p>
                  <p className="text-xs text-muted-foreground">Play sounds for system events</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, soundEffects: !settings.soundEffects })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.soundEffects ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.soundEffects ? 24 : 2 }}
                    className="w-5 h-5 bg-foreground rounded-full"
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Appearance Settings</h2>
            <p className="text-muted-foreground">
              Use the <strong>Themes</strong> app on the desktop to change your theme.
            </p>
          </div>
        )}

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium flex items-center gap-2"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>
    </div>
  );
};

export default AccountSettings;
