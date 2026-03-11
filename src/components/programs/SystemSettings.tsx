import { useState } from 'react';
import { Settings, Monitor, Bell, Volume2, Wifi, Shield, Palette, HardDrive, User, Info } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

const SystemSettings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('general');
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(75);

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'sound', label: 'Sound', icon: Volume2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'network', label: 'Network', icon: Wifi },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'personalization', label: 'Personalization', icon: Palette },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'accounts', label: 'Accounts', icon: User },
    { id: 'about', label: 'About', icon: Info },
  ];

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-muted'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-primary-foreground absolute top-0.5 transition-transform ${value ? 'translate-x-5.5 left-1' : 'left-0.5'}`} style={{ left: value ? '22px' : '2px' }} />
    </button>
  );

  const Slider = ({ value, onChange, max = 100 }: { value: number; onChange: (v: number) => void; max?: number }) => (
    <div className="flex items-center gap-3 w-full">
      <input
        type="range" min={0} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
      <span className="text-sm text-muted-foreground w-8">{value}%</span>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div><p className="text-sm font-medium text-foreground">Auto-update apps</p><p className="text-xs text-muted-foreground">Keep apps updated automatically</p></div>
                <Toggle value={autoUpdate} onChange={setAutoUpdate} />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div><p className="text-sm font-medium text-foreground">System sounds</p><p className="text-xs text-muted-foreground">Play sounds for system events</p></div>
                <Toggle value={sounds} onChange={setSounds} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Language</p>
                <select className="w-full bg-input border border-border rounded px-3 py-1.5 text-sm text-foreground">
                  <option>English (US)</option><option>Deutsch</option><option>Español</option><option>Français</option><option>日本語</option>
                </select>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Time Zone</p>
                <select className="w-full bg-input border border-border rounded px-3 py-1.5 text-sm text-foreground">
                  <option>UTC (GMT+0)</option><option>EST (GMT-5)</option><option>PST (GMT-8)</option><option>CET (GMT+1)</option><option>JST (GMT+9)</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'display':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Display Settings</h2>
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Brightness</p>
                <Slider value={brightness} onChange={setBrightness} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Resolution</p>
                <select className="w-full bg-input border border-border rounded px-3 py-1.5 text-sm text-foreground">
                  <option>1920 x 1080 (Recommended)</option><option>2560 x 1440</option><option>3840 x 2160</option><option>1280 x 720</option>
                </select>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Scale</p>
                <select className="w-full bg-input border border-border rounded px-3 py-1.5 text-sm text-foreground">
                  <option>100%</option><option>125%</option><option>150%</option><option>175%</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'sound':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Sound Settings</h2>
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Master Volume</p>
                <Slider value={volume} onChange={setVolume} />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div><p className="text-sm font-medium text-foreground">System Sounds</p></div>
                <Toggle value={sounds} onChange={setSounds} />
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Output Device</p>
                <select className="w-full bg-input border border-border rounded px-3 py-1.5 text-sm text-foreground">
                  <option>Speakers (Default)</option><option>Headphones</option><option>HDMI Audio</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div><p className="text-sm font-medium text-foreground">Enable Notifications</p><p className="text-xs text-muted-foreground">Show system and app notifications</p></div>
                <Toggle value={notifications} onChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div><p className="text-sm font-medium text-foreground">Sound Alerts</p></div>
                <Toggle value={sounds} onChange={setSounds} />
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">About FBG_OS</h2>
            <div className="space-y-3">
              {[
                ['OS Name', 'FBG_OS Matrix Edition'],
                ['Version', '11.0.0'],
                ['Build', '2024.03.11'],
                ['Kernel', 'FBG-NT 11.0.22631'],
                ['Architecture', 'x86_64'],
                ['Processor', 'Intel Core i9-13900K'],
                ['RAM', '32 GB DDR5'],
                ['Storage', '1 TB NVMe SSD'],
                ['User', user?.displayName || user?.username || 'FBG_ADMIN'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between p-2 bg-muted/30 rounded text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">{sections.find(s => s.id === activeSection)?.label}</h2>
            <div className="p-8 text-center text-muted-foreground">
              <p>Settings for this section are coming soon.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-52 border-r border-border p-2 overflow-y-auto flex-shrink-0">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === section.id ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>
      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SystemSettings;
