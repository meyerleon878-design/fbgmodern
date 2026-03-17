import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixRain from './MatrixRain';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import Window from './Window';
import ForceCrashOverlay from './ForceCrashOverlay';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { useDeveloperRuntime } from '@/contexts/DeveloperRuntimeContext';
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
import ForceApp from './programs/ForceApp';
import DebugCMD from './programs/DebugCMD';
import DeveloperSettings from './programs/DeveloperSettings';
import BenchmarkApp from './programs/BenchmarkApp';

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
  content?: string;
  children?: string[]; // IDs of items inside folders
}

const Desktop = ({ onLogout, onShutdown }: DesktopProps) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { settings, activeError, clearError, logEvent } = useDeveloperRuntime();
  const {
    windows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow,
  } = useWindowManager();

  const isDeveloper = user?.isDeveloper === true;

  const [isRestarting, setIsRestarting] = useState(false);
  const [installedApps, setInstalledApps] = useState<string[]>(() => {
    const saved = localStorage.getItem('fbg-installed-apps');
    return saved ? JSON.parse(saved) : [];
  });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetId?: string } | null>(null);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(() => {
    const saved = localStorage.getItem('fbg-desktop-items');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const desktopRef = useRef<HTMLDivElement>(null);

  // For opening txt files with content
  const [openFileContents, setOpenFileContents] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem('fbg-installed-apps', JSON.stringify(installedApps));
  }, [installedApps]);

  useEffect(() => {
    localStorage.setItem('fbg-desktop-items', JSON.stringify(desktopItems));
  }, [desktopItems]);

  useEffect(() => {
    if (!settings.fpsCounter) {
      setFps(0);
      return;
    }

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const measure = (now: number) => {
      frameCount += 1;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      rafId = window.requestAnimationFrame(measure);
    };

    rafId = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(rafId);
  }, [settings.fpsCounter]);

  const devDesktopIcons = [
    { id: 'file-explorer', label: 'File Explorer', icon: '📁', component: 'FileExplorer' },
    { id: 'dev-settings', label: 'Developer Settings', icon: '🛠️', component: 'DeveloperSettings' },
    { id: 'benchmark', label: 'Benchmark', icon: '📊', component: 'BenchmarkApp' },
    { id: 'debug-cmd', label: 'DEBUG CMD', icon: '💻', component: 'DebugCMD' },
    { id: 'force', label: 'Force', icon: '⚡', component: 'ForceApp' },
  ];

  const baseDesktopIcons = isDeveloper ? devDesktopIcons : [
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

  const installedDesktopIcons = isDeveloper ? [] : installedApps
    .map(appId => appIconMap[appId] ? { id: appId, ...appIconMap[appId] } : null)
    .filter(Boolean) as typeof baseDesktopIcons;

  const allDesktopIcons = [...baseDesktopIcons, ...installedDesktopIcons];

  const handleRestart = () => {
    logEvent('Desktop restart requested');
    setIsRestarting(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  const handleOpenAccountSettings = () => {
    openWindow('account-settings', 'Account Settings', '⚙️', 'AccountSettings');
  };

  const handleContextMenu = (e: React.MouseEvent, targetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, targetId });
  };

  const handleCreateFolder = () => {
    const id = `folder-${Date.now()}`;
    setDesktopItems(prev => [...prev, { id, label: 'New Folder', icon: '📁', type: 'folder', children: [] }]);
    setContextMenu(null);
    // Start editing name
    setEditingItemId(id);
    setEditingName('New Folder');
  };

  const handleCreateTextFile = () => {
    const id = `file-${Date.now()}`;
    setDesktopItems(prev => [...prev, { id, label: 'New Document.txt', icon: '📄', type: 'file', content: '' }]);
    setContextMenu(null);
    setEditingItemId(id);
    setEditingName('New Document.txt');
  };

  const handleRenameItem = (id: string) => {
    const item = desktopItems.find(i => i.id === id);
    if (item) {
      setEditingItemId(id);
      setEditingName(item.label);
    }
    setContextMenu(null);
  };

  const handleDeleteItem = (id: string) => {
    setDesktopItems(prev => prev.filter(i => i.id !== id));
    setContextMenu(null);
  };

  const handleFinishRename = () => {
    if (editingItemId && editingName.trim()) {
      setDesktopItems(prev => prev.map(i => i.id === editingItemId ? { ...i, label: editingName.trim() } : i));
    }
    setEditingItemId(null);
    setEditingName('');
  };

  const handleOpenPersonalize = () => {
    openWindow('themes', 'Personalize', '🎨', 'Themes');
    setContextMenu(null);
  };

  const handleOpenSettings = () => {
    openWindow('settings', 'Settings', '⚙️', 'SystemSettings');
    setContextMenu(null);
  };

  // Handle opening a text file for editing
  const handleOpenTextFile = (item: DesktopItem) => {
    setOpenFileContents(prev => ({ ...prev, [item.id]: item.content || '' }));
    openWindow(item.id, item.label, '📄', 'TextEditor');
  };

  // Save text file content
  const handleSaveTextFile = (id: string, content: string) => {
    setDesktopItems(prev => prev.map(i => i.id === id ? { ...i, content } : i));
    setOpenFileContents(prev => ({ ...prev, [id]: content }));
  };

  // Handle opening a folder (show its children)
  const handleOpenFolder = (item: DesktopItem) => {
    openWindow(item.id, item.label, '📁', 'DesktopFolder');
  };

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnFolder = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === folderId) return;
    const draggedItem = desktopItems.find(i => i.id === draggedItemId);
    if (!draggedItem || draggedItem.type === 'folder') return; // Only files can go into folders
    
    setDesktopItems(prev => {
      const updated = prev.filter(i => i.id !== draggedItemId);
      return updated.map(i => {
        if (i.id === folderId && i.type === 'folder') {
          return { ...i, children: [...(i.children || []), draggedItemId], };
        }
        return i;
      });
    });
    // Store the dragged item data for the folder to access
    const existing = JSON.parse(localStorage.getItem('fbg-folder-files') || '{}');
    existing[draggedItemId] = draggedItem;
    localStorage.setItem('fbg-folder-files', JSON.stringify(existing));
    setDraggedItemId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const renderWindowContent = (component: string, windowId?: string) => {
    // Text editor for desktop files
    if (component === 'TextEditor' && windowId) {
      const content = openFileContents[windowId] || '';
      return (
        <div className="h-full flex flex-col bg-card">
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-muted/50">
            <button onClick={() => {
              const textarea = document.getElementById(`textarea-${windowId}`) as HTMLTextAreaElement;
              if (textarea) handleSaveTextFile(windowId, textarea.value);
            }}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">
              💾 Save
            </button>
          </div>
          <textarea
            id={`textarea-${windowId}`}
            defaultValue={content}
            className="flex-1 w-full p-3 bg-card text-foreground font-mono text-sm resize-none outline-none"
            spellCheck={false}
            placeholder="Start typing..."
          />
        </div>
      );
    }

    // Desktop folder viewer
    if (component === 'DesktopFolder' && windowId) {
      const folder = desktopItems.find(i => i.id === windowId);
      const folderFiles = JSON.parse(localStorage.getItem('fbg-folder-files') || '{}');
      const childItems = (folder?.children || []).map(cid => folderFiles[cid]).filter(Boolean);
      
      return (
        <div className="h-full bg-card p-4 overflow-auto"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnFolder(e, windowId)}>
          {childItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <span className="text-4xl mb-2">📂</span>
              <p className="text-sm">This folder is empty</p>
              <p className="text-xs mt-1">Drag files here to add them</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {childItems.map((item: DesktopItem) => (
                <button key={item.id} onDoubleClick={() => handleOpenTextFile(item)}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs text-foreground text-center break-all">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

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
      case 'ForceApp': return <ForceApp />;
      case 'DebugCMD': return <DebugCMD />;
      case 'DeveloperSettings': return <DeveloperSettings />;
      case 'BenchmarkApp': return <BenchmarkApp />;
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
      
      {/* Desktop area */}
      <div
        ref={desktopRef}
        className="relative z-10 overflow-hidden"
        style={{ height: 'calc(100vh - 48px)' }}
        onContextMenu={(e) => handleContextMenu(e)}
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
            <div
              key={item.id}
              draggable={item.type === 'file'}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={item.type === 'folder' ? handleDragOver : undefined}
              onDrop={item.type === 'folder' ? (e) => handleDropOnFolder(e, item.id) : undefined}
              onContextMenu={(e) => handleContextMenu(e, item.id)}
            >
              {editingItemId === item.id ? (
                <div className="flex flex-col items-center gap-1 p-3 w-24">
                  <span className="text-4xl">{item.icon}</span>
                  <input
                    autoFocus
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onBlur={handleFinishRename}
                    onKeyDown={e => e.key === 'Enter' && handleFinishRename()}
                    className="w-full text-xs text-center bg-primary/20 border border-primary rounded px-1 py-0.5 text-foreground outline-none"
                  />
                </div>
              ) : (
                <DesktopIcon
                  icon={item.icon}
                  label={item.label}
                  onClick={() => {
                    if (item.type === 'folder') {
                      handleOpenFolder(item);
                    } else if (item.type === 'file') {
                      handleOpenTextFile(item);
                    }
                  }}
                />
              )}
            </div>
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
            {contextMenu.targetId ? (
              <>
                <button onClick={() => handleRenameItem(contextMenu.targetId!)} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                  ✏️ Rename
                </button>
                <button onClick={() => handleDeleteItem(contextMenu.targetId!)} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                  🗑️ Delete
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows */}
      <AnimatePresence>
        {windows.map(window => (
          <Window key={window.id} window={window} onClose={() => closeWindow(window.id)} onMinimize={() => minimizeWindow(window.id)} onMaximize={() => maximizeWindow(window.id)} onFocus={() => focusWindow(window.id)}>
            {renderWindowContent(window.component, window.id)}
          </Window>
        ))}
      </AnimatePresence>

      <Taskbar windows={windows} onWindowClick={focusWindow} onOpenWindow={openWindow} onLogout={onLogout} onRestart={handleRestart} onShutdown={onShutdown} onOpenAccountSettings={handleOpenAccountSettings} installedApps={installedApps} />
    </div>
  );
};

export default Desktop;
