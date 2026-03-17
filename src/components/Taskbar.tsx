import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, RefreshCw, LogOut, Folder, Gamepad2, Users, Radar, Search, Palette, Store, Globe, MessageCircle, Settings, Terminal, Bug, Wrench, AlertTriangle } from 'lucide-react';
import { WindowState } from '@/types/os';
import { useUser } from '@/contexts/UserContext';

interface TaskbarProps {
  windows: WindowState[];
  onWindowClick: (id: string) => void;
  onOpenWindow: (id: string, title: string, icon: string, component: string) => void;
  onLogout: () => void;
  onRestart: () => void;
  onShutdown: () => void;
  onOpenAccountSettings: () => void;
  installedApps: string[];
}

// Taskbar pinned apps (always visible in taskbar)
const TASKBAR_PINNED = [
  { id: 'cmd', title: 'CMD', icon: '💻', component: 'CMD', Icon: Terminal },
];

const Taskbar = ({ 
  windows, 
  onWindowClick, 
  onOpenWindow,
  onLogout,
  onRestart,
  onShutdown,
  onOpenAccountSettings,
  installedApps
}: TaskbarProps) => {
  const { user } = useUser();
  const isDeveloper = user?.isDeveloper === true;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const normalPrograms = [
    { id: 'file-explorer', title: 'File Explorer', icon: '📁', component: 'FileExplorer', Icon: Folder },
    { id: 'minecraft', title: 'Minecraft', icon: '⛏️', component: 'Minecraft', Icon: Gamepad2 },
    { id: 'subjects', title: 'SUBJECTS', icon: '👤', component: 'Subjects', Icon: Users },
    { id: 'tracking', title: 'TRACKING', icon: '📡', component: 'Tracking', Icon: Radar },
    { id: 'themes', title: 'Themes', icon: '🎨', component: 'Themes', Icon: Palette },
    { id: 'store', title: 'Store', icon: '🛒', component: 'Store', Icon: Store },
    { id: 'settings', title: 'Settings', icon: '⚙️', component: 'SystemSettings', Icon: Settings },
  ];

  const devPrograms = [
    { id: 'file-explorer', title: 'File Explorer', icon: '📁', component: 'FileExplorer', Icon: Folder },
    { id: 'debug-cmd', title: 'DEBUG CMD', icon: '🐛', component: 'DebugCMD', Icon: Bug },
    { id: 'developer-settings', title: 'Dev Settings', icon: '🛠️', component: 'DeveloperSettings', Icon: Wrench },
    { id: 'benchmark', title: 'Benchmark', icon: '📊', component: 'BenchmarkApp', Icon: AlertTriangle },
    { id: 'force', title: 'Force', icon: '⚡', component: 'ForceApp', Icon: AlertTriangle },
  ];

  const basePrograms = isDeveloper ? devPrograms : normalPrograms;

  // Add installed apps to programs list (only in normal mode)
  const installedPrograms = isDeveloper ? [] : installedApps.map((appId) => {
    if (appId === 'rachiro-browser') {
      return { id: 'rachiro-browser', title: 'Rachiro Browser', icon: '🌐', component: 'RachiroBrowser', Icon: Globe };
    }
    if (appId === 'chattigs') {
      return { id: 'chattigs', title: 'Chattigs', icon: '💬', component: 'Chattigs', Icon: MessageCircle };
    }
    return null;
  }).filter(Boolean) as typeof basePrograms;

  const programs = [...basePrograms, ...installedPrograms];

  return (
    <>
      {/* Start Menu Overlay */}
      <AnimatePresence>
        {startMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            onClick={() => setStartMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[600px] glass window-chrome border-glow overflow-hidden"
            >
              {/* Search */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search programs..."
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Programs Grid */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-3">PROGRAMS</p>
                <div className="grid grid-cols-4 gap-2">
                  {programs.map(program => (
                    <motion.button
                      key={program.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onOpenWindow(program.id, program.title, program.icon, program.component);
                        setStartMenuOpen(false);
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="text-2xl">{program.icon}</span>
                      <span className="text-xs text-foreground">{program.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Power Options */}
              <div className="p-4 border-t border-border flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'hsl(var(--muted))' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onOpenAccountSettings();
                    setStartMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">F</span>
                  </div>
                  <span className="text-sm text-foreground">{user?.displayName || user?.username || 'FBG_ADMIN'}</span>
                  <Settings className="w-4 h-4 text-muted-foreground ml-1" />
                </motion.button>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onLogout}
                    className="p-2 rounded hover:bg-muted transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onRestart}
                    className="p-2 rounded hover:bg-muted transition-colors"
                    title="Restart"
                  >
                    <RefreshCw className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onShutdown}
                    className="p-2 rounded hover:bg-destructive transition-colors"
                    title="Shut Down"
                  >
                    <Power className="w-5 h-5 text-muted-foreground hover:text-destructive-foreground" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 glass border-t border-border z-40 flex items-center justify-between px-2">
        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          className="p-2 rounded hover:bg-muted transition-colors"
        >
          <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
            <div className="bg-primary rounded-sm" />
            <div className="bg-primary rounded-sm" />
            <div className="bg-primary rounded-sm" />
            <div className="bg-primary rounded-sm" />
          </div>
        </motion.button>

        {/* Pinned Taskbar Apps */}
        <div className="flex items-center gap-1 px-2 border-r border-border mr-2">
          {TASKBAR_PINNED.map(app => (
            <motion.button
              key={app.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenWindow(app.id, app.title, app.icon, app.component)}
              className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted transition-colors"
              title={app.title}
            >
              <app.Icon className="w-5 h-5 text-primary" />
            </motion.button>
          ))}
        </div>

        {/* Open Windows */}
        <div className="flex-1 flex items-center gap-1 px-2 overflow-x-auto">
          {windows.filter(w => w.isOpen).map(window => (
            <motion.button
              key={window.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onWindowClick(window.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors min-w-0 ${
                window.isMinimized ? 'bg-muted/50' : 'bg-muted border-b-2 border-primary'
              }`}
            >
              <span className="text-sm">{window.icon}</span>
              <span className="text-xs text-foreground truncate max-w-24">{window.title}</span>
            </motion.button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-4 px-3">
          <div className="text-xs text-muted-foreground">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;
