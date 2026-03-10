import { useState } from 'react';
import { Play, Pause, Maximize, Volume2, SkipBack, SkipForward } from 'lucide-react';

const videos = [
  { title: 'Big Buck Bunny', duration: '9:56', thumb: '🐰' },
  { title: 'Sintel', duration: '14:48', thumb: '🐉' },
  { title: 'Tears of Steel', duration: '12:14', thumb: '🤖' },
  { title: 'Elephant Dream', duration: '10:54', thumb: '🐘' },
];

const VideoPlayer = () => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Video area */}
      <div className="flex-1 flex items-center justify-center bg-black relative group">
        <div className="text-8xl">{videos[current].thumb}</div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-full h-1 bg-white/30 rounded cursor-pointer mb-3" onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress((e.clientX - rect.left) / rect.width * 100);
          }}>
            <div className="h-full bg-red-500 rounded" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setPlaying(!playing)} className="text-white">
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <SkipBack className="w-4 h-4 text-white/70 cursor-pointer" />
              <SkipForward className="w-4 h-4 text-white/70 cursor-pointer" />
              <Volume2 className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs">0:00 / {videos[current].duration}</span>
            </div>
            <Maximize className="w-4 h-4 text-white/70 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="bg-card border-t border-border p-2">
        <div className="flex gap-2 overflow-x-auto">
          {videos.map((v, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setProgress(0); }}
              className={`flex items-center gap-2 px-3 py-2 rounded min-w-max ${
                i === current ? 'bg-primary/20' : 'hover:bg-muted'
              }`}
            >
              <span className="text-lg">{v.thumb}</span>
              <div className="text-left">
                <div className="text-xs text-foreground font-medium">{v.title}</div>
                <div className="text-xs text-muted-foreground">{v.duration}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
