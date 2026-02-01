import { motion, useDragControls } from 'framer-motion';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { WindowState } from '@/types/os';
import { useRef } from 'react';

interface WindowProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

const Window = ({ window, onClose, onMinimize, onMaximize, onFocus, children }: WindowProps) => {
  const dragControls = useDragControls();
  const constraintsRef = useRef(null);

  if (!window.isOpen || window.isMinimized) return null;

  return (
    <motion.div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: window.zIndex }}
    >
      <motion.div
        drag={!window.isMaximized}
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: window.isMaximized ? 0 : window.position.x,
          y: window.isMaximized ? 0 : window.position.y,
          width: window.isMaximized ? '100%' : window.size.width,
          height: window.isMaximized ? 'calc(100vh - 48px)' : window.size.height,
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        onPointerDown={onFocus}
        className="window-chrome pointer-events-auto overflow-hidden flex flex-col"
        style={{
          position: 'absolute',
          minWidth: 400,
          minHeight: 300,
        }}
      >
        {/* Title Bar */}
        <div
          onPointerDown={(e) => {
            if (!window.isMaximized) {
              dragControls.start(e);
            }
          }}
          className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border cursor-move select-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{window.icon}</span>
            <span className="text-sm font-medium text-foreground">{window.title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="p-1.5 rounded hover:bg-muted transition-colors"
            >
              <Minus className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="p-1.5 rounded hover:bg-muted transition-colors"
            >
              {window.isMaximized ? (
                <Square className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-1.5 rounded hover:bg-destructive transition-colors group"
            >
              <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-card">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Window;
