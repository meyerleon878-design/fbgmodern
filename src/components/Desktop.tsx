import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixRain from './MatrixRain';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import Window from './Window';
import { useWindowManager } from '@/hooks/useWindowManager';
import FileExplorer from './programs/FileExplorer';
import Minecraft3D from './programs/Minecraft3D';
import Subjects from './programs/Subjects';
import Tracking from './programs/Tracking';

interface DesktopProps {
  onLogout: () => void;
  onShutdown: () => void;
}

const Desktop = ({ onLogout, onShutdown }: DesktopProps) => {
  const {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
  } = useWindowManager();

  const [isRestarting, setIsRestarting] = useState(false);

  const desktopIcons = [
    { id: 'file-explorer', label: 'File Explorer', icon: '📁', component: 'FileExplorer' },
    { id: 'minecraft', label: 'Minecraft', icon: '⛏️', component: 'Minecraft' },
    { id: 'subjects', label: 'SUBJECTS', icon: '👤', component: 'Subjects' },
    { id: 'tracking', label: 'TRACKING', icon: '📡', component: 'Tracking' },
  ];

  const handleRestart = () => {
    setIsRestarting(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const renderWindowContent = (component: string) => {
    switch (component) {
      case 'FileExplorer':
        return <FileExplorer />;
      case 'Minecraft':
        return <Minecraft3D />;
      case 'Subjects':
        return <Subjects />;
      case 'Tracking':
        return <Tracking />;
      default:
        return <div className="p-4 text-foreground">Unknown program</div>;
    }
  };

  if (isRestarting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <MatrixRain />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-foreground text-xl text-glow">Restarting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Matrix Background */}
      <MatrixRain />

      {/* Desktop Area */}
      <div className="relative z-10 min-h-screen pb-12">
        {/* Desktop Icons */}
        <div className="p-4 grid grid-cols-1 gap-2 w-fit">
          {desktopIcons.map((icon, index) => (
            <motion.div
              key={icon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DesktopIcon
                icon={icon.icon}
                label={icon.label}
                onClick={() => openWindow(icon.id, icon.label, icon.icon, icon.component)}
              />
            </motion.div>
          ))}
        </div>

        {/* Windows */}
        <AnimatePresence>
          {windows.map(window => (
            <Window
              key={window.id}
              window={window}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
            >
              {renderWindowContent(window.component)}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowClick={focusWindow}
        onOpenWindow={openWindow}
        onLogout={onLogout}
        onRestart={handleRestart}
        onShutdown={onShutdown}
      />
    </div>
  );
};

export default Desktop;
