import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixRain from './MatrixRain';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import Window from './Window';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import FileExplorer from './programs/FileExplorer';
import Minecraft3D from './programs/Minecraft3D';
import Subjects from './programs/Subjects';
import Tracking from './programs/Tracking';
import Themes from './programs/Themes';
import Store from './programs/Store';
import AccountSettings from './programs/AccountSettings';
import RachiroBrowser from './programs/RachiroBrowser';
import Chattigs from './programs/Chattigs';
import CMD from './programs/CMD';
import LeconBrowser from './programs/LeconBrowser';
import CalculatorPro from './programs/CalculatorPro';
import NotepadPlus from './programs/NotepadPlus';
import MusicPlayer from './programs/MusicPlayer';
import VideoPlayer from './programs/VideoPlayer';
import PhotoEditor from './programs/PhotoEditor';
import CalendarApp from './programs/CalendarApp';
import WorldClock from './programs/WorldClock';
import MailClient from './programs/MailClient';
import CameraApp from './programs/CameraApp';
import RetroArcade from './programs/RetroArcade';
import NavigatorMaps from './programs/NavigatorMaps';
import WeatherApp from './programs/WeatherApp';
import PaintStudio from './programs/PaintStudio';
import EbookReader from './programs/EbookReader';
import TerminalPro from './programs/TerminalPro';
import VPNShield from './programs/VPNShield';
import WifiAnalyzer from './programs/WifiAnalyzer';
import TaskRunner from './programs/TaskRunner';
import CoffeeTracker from './programs/CoffeeTracker';
import FitnessApp from './programs/FitnessApp';
import CompassApp from './programs/CompassApp';
import MovieDB from './programs/MovieDB';
import RadioApp from './programs/RadioApp';
import PodcastHub from './programs/PodcastHub';
import SystemSettings from './programs/SystemSettings';

interface DesktopProps {
  onLogout: () => void;
  onShutdown: () => void;
}

interface DesktopItem {
  id: string;
  label: string;
  icon: string;
  type: 'app' | 'folder' | 'file';
  component?: string;
}

const Desktop = ({ onLogout, onShutdown }: DesktopProps) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const {
    windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow,
  } = useWindowManager();

  const [isRestarting, setIsRestarting] = useState(false);
  const [installedApps, setInstalledApps] = useState<string[]>(() => {
    const saved = localStorage.getItem('fbg-installed-apps');
    return saved ? JSON.parse(saved) : [];
  });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(() => {
    const saved = localStorage.getItem('fbg-desktop-items');
    return saved ? JSON.parse(saved) : [];
  });
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('fbg-installed-apps', JSON.stringify(installedApps));
  }, [installedApps]);

  useEffect(() => {
    localStorage.setItem('fbg-desktop-items', JSON.stringify(desktopItems));
  }, [desktopItems]);

  const handleInstallApp = (appId: string) => {
    setInstalledApps((prev) => [...prev, appId]);
  };

  const baseDesktopIcons = [
    { id: 'file-explorer', label: 'File Explorer', icon: '📁', component: 'FileExplorer' },
    { id: 'minecraft', label: 'Minecraft', icon: '⛏️', component: 'Minecraft' },
    { id: 'subjects', label: 'SUBJECTS', icon: '👤', component: 'Subjects' },
    { id: 'tracking', label: 'TRACKING', icon: '📡', component: 'Tracking' },
    { id: 'themes', label: 'Themes', icon: '🎨', component: 'Themes' },
    { id: 'store', label: 'Store', icon: '🛒', component: 'Store' },
    { id: 'cmd', label: 'CMD', icon: '💻', component: 'CMD' },
    { id: 'settings', label: 'Settings', icon: '⚙️', component: 'SystemSettings' },
  ];

  const appIconMap: Record<string, { label: string; icon: string; component: string }> = {
    'rachiro-browser': { label: 'Rachiro Browser', icon: '🌐', component: 'RachiroBrowser' },
    'chattigs': { label: 'Chattigs', icon: '💬', component: 'Chattigs' },
    'calculator-pro': { label: 'Calculator Pro', icon: '🧮', component: 'CalculatorPro' },
    'notepad-plus': { label: 'Notepad++', icon: '📝', component: 'NotepadPlus' },
    'music-player': { label: 'Harmony Music', icon: '🎵', component: 'MusicPlayer' },
    'video-player': { label: 'CineMax Player', icon: '🎬', component: 'VideoPlayer' },
    'photo-editor': { label: 'PixelCraft', icon: '🖼️', component: 'PhotoEditor' },
    'calendar-app': { label: 'CalendarX', icon: '📅', component: 'CalendarApp' },
    'clock-world': { label: 'World Clock', icon: '⏰', component: 'WorldClock' },
    'mail-client': { label: 'MailBox Pro', icon: '📧', component: 'MailClient' },
    'camera-app': { label: 'SnapShot Camera', icon: '📷', component: 'CameraApp' },
    'retro-games': { label: 'Retro Arcade', icon: '🎮', component: 'RetroArcade' },
    'maps-nav': { label: 'Navigator Maps', icon: '🗺️', component: 'NavigatorMaps' },
    'weather-app': { label: 'SkyWatch Weather', icon: '🌤️', component: 'WeatherApp' },
    'paint-studio': { label: 'Paint Studio', icon: '🎨', component: 'PaintStudio' },
    'ebook-reader': { label: 'BookWorm Reader', icon: '📚', component: 'EbookReader' },
    'terminal-pro': { label: 'Terminal Pro', icon: '💻', component: 'TerminalPro' },
    'vpn-shield': { label: 'VPN Shield', icon: '🛡️', component: 'VPNShield' },
    'wifi-analyzer': { label: 'WiFi Analyzer', icon: '📶', component: 'WifiAnalyzer' },
    'task-runner': { label: 'Task Turbo', icon: '⚡', component: 'TaskRunner' },
    'coffee-tracker': { label: 'Caffeine Log', icon: '☕', component: 'CoffeeTracker' },
    'fitness-app': { label: 'FitPulse', icon: '❤️', component: 'FitnessApp' },
    'compass-app': { label: 'True North', icon: '🧭', component: 'CompassApp' },
    'movie-db': { label: 'CinemaDB', icon: '🎞️', component: 'MovieDB' },
    'radio-app': { label: 'Global Radio', icon: '📻', component: 'RadioApp' },
    'podcast-app': { label: 'PodcastHub', icon: '🎧', component: 'PodcastHub' },
  };

  const installedDesktopIcons = installedApps
    .map(appId => appIconMap[appId] ? { id: appId, ...appIconMap[appId] } : null)
    .filter(Boolean) as typeof baseDesktopIcons;

  const allDesktopIcons = [...baseDesktopIcons, ...installedDesktopIcons];

  const handleRestart = () => {
    setIsRestarting(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleOpenAccountSettings = () => {
    openWindow('account-settings', 'Account Settings', '⚙️', 'AccountSettings');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCreateFolder = () => {
    const name = prompt('Folder name:') || 'New Folder';
    setDesktopItems(prev => [...prev, { id: `folder-${Date.now()}`, label: name, icon: '📁', type: 'folder' }]);
    setContextMenu(null);
  };

  const handleCreateTextFile = () => {
    const name = prompt('File name:') || 'New Document';
    setDesktopItems(prev => [...prev, { id: `file-${Date.now()}`, label: name + '.txt', icon: '📄', type: 'file' }]);
    setContextMenu(null);
  };

  const handleOpenPersonalize = () => {
    openWindow('themes', 'Personalize', '🎨', 'Themes');
    setContextMenu(null);
  };

  const handleOpenSettings = () => {
    openWindow('settings', 'Settings', '⚙️', 'SystemSettings');
    setContextMenu(null);
  };

  const renderWindowContent = (component: string) => {
    switch (component) {
      case 'FileExplorer': return <FileExplorer />;
      case 'Minecraft': return <Minecraft3D />;
      case 'Subjects': return <Subjects />;
      case 'Tracking': return <Tracking />;
      case 'Themes': return <Themes />;
      case 'Store': return <Store onInstallApp={handleInstallApp} installedApps={installedApps} />;
      case 'AccountSettings': return <AccountSettings />;
      case 'RachiroBrowser': return <RachiroBrowser />;
      case 'Chattigs': return <Chattigs />;
      case 'CMD': return <CMD />;
      case 'LeconBrowser': return <LeconBrowser />;
      case 'CalculatorPro': return <CalculatorPro />;
      case 'NotepadPlus': return <NotepadPlus />;
      case 'MusicPlayer': return <MusicPlayer />;
      case 'VideoPlayer': return <VideoPlayer />;
      case 'PhotoEditor': return <PhotoEditor />;
      case 'CalendarApp': return <CalendarApp />;
      case 'WorldClock': return <WorldClock />;
      case 'MailClient': return <MailClient />;
      case 'CameraApp': return <CameraApp />;
      case 'RetroArcade': return <RetroArcade />;
      case 'NavigatorMaps': return <NavigatorMaps />;
      case 'WeatherApp': return <WeatherApp />;
      case 'PaintStudio': return <PaintStudio />;
      case 'EbookReader': return <EbookReader />;
      case 'TerminalPro': return <TerminalPro />;
      case 'VPNShield': return <VPNShield />;
      case 'WifiAnalyzer': return <WifiAnalyzer />;
      case 'TaskRunner': return <TaskRunner />;
      case 'CoffeeTracker': return <CoffeeTracker />;
      case 'FitnessApp': return <FitnessApp />;
      case 'CompassApp': return <CompassApp />;
      case 'MovieDB': return <MovieDB />;
      case 'RadioApp': return <RadioApp />;
      case 'PodcastHub': return <PodcastHub />;
      case 'SystemSettings': return <SystemSettings />;
      default: return <div className="p-4 text-foreground">Unknown program</div>;
    }
  };

  const getWallpaperClass = () => {
    const wallpapers: Record<string, string> = {
      matrix: 'bg-background',
      windows11: 'win11-wallpaper',
      'windows11-dark': 'win11-dark-wallpaper',
      aero2010: 'aero-wallpaper',
      cyberpunk: 'cyberpunk-wallpaper',
      nord: 'nord-wallpaper',
      dracula: 'dracula-wallpaper',
      solarized: 'solarized-wallpaper',
      monokai: 'monokai-wallpaper',
      rosepine: 'rosepine-wallpaper',
      sunset: 'sunset-wallpaper',
      ocean: 'ocean-wallpaper',
      forest: 'forest-wallpaper',
      retro: 'retro-wallpaper',
    };
    return wallpapers[theme] || 'bg-background';
  };

  if (isRestarting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {theme === 'matrix' && <MatrixRain />}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-foreground text-xl text-glow">Restarting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${getWallpaperClass()}`}>
      {theme === 'matrix' && <MatrixRain />}
      
      {/* Desktop area - stops before taskbar */}
      <div
        ref={desktopRef}
        className="relative z-10 pb-14 overflow-hidden"
        style={{ height: 'calc(100vh - 48px)' }}
        onContextMenu={handleContextMenu}
        onClick={() => setContextMenu(null)}
      >
        <div className="p-4 h-full flex flex-col flex-wrap gap-1 content-start">
          {allDesktopIcons.map((icon, index) => (
            <motion.div key={icon.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <DesktopIcon icon={icon.icon} label={icon.label} onClick={() => openWindow(icon.id, icon.label, icon.icon, icon.component)} />
            </motion.div>
          ))}
          {/* User-created desktop items */}
          {desktopItems.map((item) => (
            <DesktopIcon
              key={item.id}
              icon={item.icon}
              label={item.label}
              onClick={() => {
                if (item.type === 'folder') {
                  openWindow(item.id, item.label, '📁', 'FileExplorer');
                } else if (item.type === 'file') {
                  openWindow(item.id, item.label, '📄', 'NotepadPlus');
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[60] glass window-chrome border border-border rounded-lg py-1 min-w-[200px] shadow-lg"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleCreateFolder} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
              📁 New Folder
            </button>
            <button onClick={handleCreateTextFile} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
              📄 New Text Document
            </button>
            <div className="border-t border-border my-1" />
            <button onClick={handleOpenPersonalize} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
              🎨 Personalize
            </button>
            <button onClick={handleOpenSettings} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
              ⚙️ Settings
            </button>
            <div className="border-t border-border my-1" />
            <button onClick={() => { window.location.reload(); }} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
              🔄 Refresh Desktop
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows */}
      <AnimatePresence>
        {windows.map(window => (
          <Window key={window.id} window={window} onClose={() => closeWindow(window.id)} onMinimize={() => minimizeWindow(window.id)} onMaximize={() => maximizeWindow(window.id)} onFocus={() => focusWindow(window.id)}>
            {renderWindowContent(window.component)}
          </Window>
        ))}
      </AnimatePresence>

      <Taskbar windows={windows} onWindowClick={focusWindow} onOpenWindow={openWindow} onLogout={onLogout} onRestart={handleRestart} onShutdown={onShutdown} onOpenAccountSettings={handleOpenAccountSettings} installedApps={installedApps} />
    </div>
  );
};

export default Desktop;
