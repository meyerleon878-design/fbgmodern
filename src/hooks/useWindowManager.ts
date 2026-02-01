import { useState, useCallback } from 'react';
import { WindowState } from '@/types/os';

const initialWindows: WindowState[] = [];

let nextZIndex = 100;

export const useWindowManager = () => {
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);

  const openWindow = useCallback((id: string, title: string, icon: string, component: string) => {
    setWindows(prev => {
      const existingWindow = prev.find(w => w.id === id);
      if (existingWindow) {
        // Bring to front
        return prev.map(w => 
          w.id === id 
            ? { ...w, isOpen: true, isMinimized: false, zIndex: ++nextZIndex }
            : w
        );
      }
      
      // Create new window
      const newWindow: WindowState = {
        id,
        title,
        icon,
        component,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: ++nextZIndex,
        position: { x: 100 + (prev.length * 30), y: 50 + (prev.length * 30) },
        size: { width: 800, height: 500 },
      };
      
      return [...prev, newWindow];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: ++nextZIndex, isMinimized: false } : w
    ));
  }, []);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  };
};
