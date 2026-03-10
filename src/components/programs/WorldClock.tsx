import { useState, useEffect } from 'react';

const zones = [
  { name: 'New York', offset: -5, flag: '🇺🇸' },
  { name: 'London', offset: 0, flag: '🇬🇧' },
  { name: 'Berlin', offset: 1, flag: '🇩🇪' },
  { name: 'Tokyo', offset: 9, flag: '🇯🇵' },
  { name: 'Sydney', offset: 11, flag: '🇦🇺' },
  { name: 'Dubai', offset: 4, flag: '🇦🇪' },
  { name: 'São Paulo', offset: -3, flag: '🇧🇷' },
  { name: 'Seoul', offset: 9, flag: '🇰🇷' },
];

const WorldClock = () => {
  const [time, setTime] = useState(new Date());
  const [tab, setTab] = useState<'clock' | 'stopwatch' | 'timer'>('clock');
  const [swRunning, setSwRunning] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [timerSec, setTimerSec] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!swRunning) return;
    const id = setInterval(() => setSwTime(t => t + 10), 10);
    return () => clearInterval(id);
  }, [swRunning]);

  useEffect(() => {
    if (!timerRunning || timerSec <= 0) return;
    const id = setInterval(() => setTimerSec(t => { if (t <= 1) { setTimerRunning(false); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSec]);

  const fmtSw = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  const fmtTimer = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex border-b border-border">
        {(['clock', 'stopwatch', 'timer'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm capitalize ${tab === t ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {tab === 'clock' && (
          <div className="grid grid-cols-2 gap-3">
            {zones.map(z => {
              const utc = time.getTime() + time.getTimezoneOffset() * 60000;
              const local = new Date(utc + z.offset * 3600000);
              return (
                <div key={z.name} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{z.flag}</span>
                    <span className="text-sm font-medium text-foreground">{z.name}</span>
                  </div>
                  <div className="text-2xl font-light text-foreground">{local.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="text-xs text-muted-foreground">UTC{z.offset >= 0 ? '+' : ''}{z.offset}</div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'stopwatch' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl font-mono text-foreground mb-8">{fmtSw(swTime)}</div>
            <div className="flex gap-3">
              <button onClick={() => setSwRunning(!swRunning)} className={`px-6 py-2 rounded ${swRunning ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}>
                {swRunning ? 'Stop' : 'Start'}
              </button>
              <button onClick={() => { setSwRunning(false); setSwTime(0); }} className="px-6 py-2 bg-muted text-foreground rounded">Reset</button>
            </div>
          </div>
        )}

        {tab === 'timer' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`text-5xl font-mono mb-8 ${timerSec === 0 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>{fmtTimer(timerSec)}</div>
            <div className="flex gap-2 mb-4">
              {[60, 120, 300, 600].map(s => (
                <button key={s} onClick={() => { setTimerSec(s); setTimerRunning(false); }} className="px-3 py-1 bg-muted text-foreground rounded text-sm">{s / 60}m</button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setTimerRunning(!timerRunning)} className={`px-6 py-2 rounded ${timerRunning ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'}`}>
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button onClick={() => { setTimerRunning(false); setTimerSec(300); }} className="px-6 py-2 bg-muted text-foreground rounded">Reset</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldClock;
