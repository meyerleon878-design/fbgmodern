import { useState, useEffect } from 'react';
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

interface DesktopProps {
  onLogout: () => void;
  onShutdown: () => void;
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

  useEffect(() => {
    localStorage.setItem('fbg-installed-apps', JSON.stringify(installedApps));
  }, [installedApps]);

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

  const desktopIcons = [...baseDesktopIcons, ...installedDesktopIcons];

  const handleRestart = () => {
    setIsRestarting(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleOpenAccountSettings = () => {
    openWindow('account-settings', 'Account Settings', '⚙️', 'AccountSettings');
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
      default: return <div className="p-4 text-foreground">Unknown program</div>;
    }
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
    <div className={`relative min-h-screen overflow-hidden ${
      theme === 'matrix' ? 'bg-background' : 
      theme === 'windows11' ? 'win11-wallpaper' : 
      theme === 'windows11-dark' ? 'win11-dark-wallpaper' :
      theme === 'aero2010' ? 'aero-wallpaper' :
      'bg-background'
    }`}>
      {theme === 'matrix' && <MatrixRain />}
      <div className="relative z-10 min-h-screen pb-12">
        <div className="p-4 grid grid-cols-1 gap-2 w-fit">
          {desktopIcons.map((icon, index) => (
            <motion.div key={icon.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <DesktopIcon icon={icon.icon} label={icon.label} onClick={() => openWindow(icon.id, icon.label, icon.icon, icon.component)} />
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {windows.map(window => (
            <Window key={window.id} window={window} onClose={() => closeWindow(window.id)} onMinimize={() => minimizeWindow(window.id)} onMaximize={() => maximizeWindow(window.id)} onFocus={() => focusWindow(window.id)}>
              {renderWindowContent(window.component)}
            </Window>
          ))}
        </AnimatePresence>
      </div>
      <Taskbar windows={windows} onWindowClick={focusWindow} onOpenWindow={openWindow} onLogout={onLogout} onRestart={handleRestart} onShutdown={onShutdown} onOpenAccountSettings={handleOpenAccountSettings} installedApps={installedApps} />
    </div>
  );
};

export default Desktop;
