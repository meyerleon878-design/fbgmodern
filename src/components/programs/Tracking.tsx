import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrackingDot } from '@/types/os';

// Generate tracking dots
const generateDots = (): TrackingDot[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `dot-${i}`,
    name: `SUBJECT_${1000 + Math.floor(Math.random() * 9000)}`,
    x: 50 + Math.random() * 300,
    y: 50 + Math.random() * 200,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
  }));
};

const Tracking = () => {
  const [dots, setDots] = useState<TrackingDot[]>(generateDots);
  const [selectedDot, setSelectedDot] = useState<TrackingDot | null>(null);
  const [radarAngle, setRadarAngle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => prevDots.map(dot => {
        let newX = dot.x + dot.vx;
        let newY = dot.y + dot.vy;
        let newVx = dot.vx;
        let newVy = dot.vy;

        // Bounce off walls
        if (newX < 20 || newX > 380) {
          newVx = -dot.vx;
          newX = Math.max(20, Math.min(380, newX));
        }
        if (newY < 20 || newY > 280) {
          newVy = -dot.vy;
          newY = Math.max(20, Math.min(280, newY));
        }

        // Random direction changes
        if (Math.random() > 0.98) {
          newVx = (Math.random() - 0.5) * 3;
          newVy = (Math.random() - 0.5) * 3;
        }

        return { ...dot, x: newX, y: newY, vx: newVx, vy: newVy };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Radar sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex">
      {/* Radar Display */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div 
          ref={containerRef}
          className="relative w-[400px] h-[300px] border-2 border-primary rounded-lg overflow-hidden bg-background/50"
        >
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Horizontal lines */}
            {[1, 2, 3, 4].map(i => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 border-t border-primary/20"
                style={{ top: `${i * 20}%` }}
              />
            ))}
            {/* Vertical lines */}
            {[1, 2, 3, 4].map(i => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 border-l border-primary/20"
                style={{ left: `${i * 20}%` }}
              />
            ))}
          </div>

          {/* Radar Sweep */}
          <div
            className="absolute top-1/2 left-1/2 w-full h-full pointer-events-none origin-center"
            style={{
              transform: `translate(-50%, -50%) rotate(${radarAngle}deg)`,
              background: `conic-gradient(from 0deg, transparent 0deg, hsl(var(--matrix-green) / 0.3) 30deg, transparent 60deg)`,
            }}
          />

          {/* Room outline */}
          <div className="absolute inset-4 border border-dashed border-primary/40 rounded">
            <div className="absolute -top-3 left-4 bg-card px-2 text-xs text-primary">
              ROOM A-47
            </div>
          </div>

          {/* Tracking Dots */}
          {dots.map(dot => (
            <motion.div
              key={dot.id}
              animate={{ x: dot.x, y: dot.y }}
              transition={{ duration: 0.05, ease: 'linear' }}
              onClick={() => setSelectedDot(dot)}
              className="absolute w-3 h-3 cursor-pointer group"
              style={{ left: 0, top: 0 }}
            >
              {/* Dot */}
              <div className="w-3 h-3 bg-primary rounded-full pulse-glow" />
              
              {/* Label */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-card/90 border border-primary px-2 py-0.5 rounded text-xs text-primary font-mono">
                  {dot.name}
                </div>
              </div>

              {/* Selection ring */}
              {selectedDot?.id === dot.id && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  className="absolute inset-0 border-2 border-primary rounded-full"
                />
              )}
            </motion.div>
          ))}

          {/* Compass */}
          <div className="absolute top-2 right-2 text-xs text-primary/60 font-mono">
            N
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-primary/60 font-mono">
            S
          </div>
          <div className="absolute top-1/2 left-2 -translate-y-1/2 text-xs text-primary/60 font-mono">
            W
          </div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-primary/60 font-mono">
            E
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-64 border-l border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 text-glow">
          TRACKING SYSTEM v2.1
        </h3>
        
        <div className="space-y-4">
          {/* Status */}
          <div className="glass p-3 rounded">
            <div className="text-xs text-muted-foreground mb-1">STATUS</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-primary">ONLINE</span>
            </div>
          </div>

          {/* Active Targets */}
          <div className="glass p-3 rounded">
            <div className="text-xs text-muted-foreground mb-1">ACTIVE TARGETS</div>
            <div className="text-2xl font-bold text-foreground">{dots.length}</div>
          </div>

          {/* Selected Target */}
          {selectedDot && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-3 rounded border border-primary"
            >
              <div className="text-xs text-muted-foreground mb-1">SELECTED</div>
              <div className="text-sm font-mono text-primary">{selectedDot.name}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Position: ({Math.round(selectedDot.x)}, {Math.round(selectedDot.y)})
              </div>
              <div className="text-xs text-muted-foreground">
                Velocity: {Math.abs(selectedDot.vx).toFixed(1)} m/s
              </div>
            </motion.div>
          )}

          {/* Legend */}
          <div className="mt-6">
            <div className="text-xs text-muted-foreground mb-2">LEGEND</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-xs text-muted-foreground">Active Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 border border-primary rounded-full" />
                <span className="text-xs text-muted-foreground">Selected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
