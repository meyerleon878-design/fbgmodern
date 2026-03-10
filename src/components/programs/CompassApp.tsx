import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CompassApp = () => {
  const [heading, setHeading] = useState(0);
  const [altitude] = useState(42);
  const [lat] = useState('40.7128° N');
  const [lng] = useState('74.0060° W');

  useEffect(() => {
    const id = setInterval(() => {
      setHeading(prev => (prev + (Math.random() * 2 - 1)) % 360);
    }, 500);
    return () => clearInterval(id);
  }, []);

  const direction = heading < 45 || heading > 315 ? 'N' : heading < 135 ? 'E' : heading < 225 ? 'S' : 'W';

  return (
    <div className="h-full flex flex-col items-center justify-center bg-card p-6">
      {/* Compass */}
      <div className="relative w-64 h-64 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-border" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: -heading }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* N */}
          <div className="absolute top-2 text-red-500 font-bold text-lg">N</div>
          <div className="absolute bottom-2 text-muted-foreground font-medium">S</div>
          <div className="absolute right-2 text-muted-foreground font-medium">E</div>
          <div className="absolute left-2 text-muted-foreground font-medium">W</div>
          {/* Tick marks */}
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-muted-foreground"
              style={{
                height: i % 9 === 0 ? 12 : 6,
                top: i % 9 === 0 ? 10 : 14,
                left: '50%',
                transformOrigin: `50% ${128}px`,
                transform: `rotate(${i * 10}deg)`,
              }}
            />
          ))}
          {/* Needle */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-[90px] bg-gradient-to-b from-red-500 to-red-500/20 rounded-full" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1 h-[90px] bg-gradient-to-t from-gray-400 to-gray-400/20 rounded-full" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-foreground" />
        </div>
      </div>

      {/* Info */}
      <div className="text-center">
        <div className="text-4xl font-light text-foreground">{Math.round(Math.abs(heading))}°</div>
        <div className="text-lg text-primary font-medium">{direction}</div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div>
          <div className="text-xs text-muted-foreground">Latitude</div>
          <div className="text-sm text-foreground">{lat}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Longitude</div>
          <div className="text-sm text-foreground">{lng}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Altitude</div>
          <div className="text-sm text-foreground">{altitude}m</div>
        </div>
      </div>
    </div>
  );
};

export default CompassApp;
