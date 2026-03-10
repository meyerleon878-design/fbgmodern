import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';

const tracks = [
  { title: 'Digital Dreams', artist: 'SynthWave', duration: '3:42', album: 'Neon Nights' },
  { title: 'Midnight Drive', artist: 'RetroFuture', duration: '4:15', album: 'Neon Nights' },
  { title: 'Electric Sunset', artist: 'ChromeVox', duration: '3:58', album: 'Horizons' },
  { title: 'Neon Memories', artist: 'SynthWave', duration: '5:01', album: 'Neon Nights' },
  { title: 'Starlight Highway', artist: 'Galaxy FM', duration: '4:33', album: 'Cosmos' },
  { title: 'Binary Love', artist: 'DataStream', duration: '3:27', album: 'Digital Hearts' },
  { title: 'Cyber Rain', artist: 'NeonDrift', duration: '4:44', album: 'Horizons' },
  { title: 'Pixel Paradise', artist: 'RetroFuture', duration: '3:19', album: 'Nostalgia' },
];

const MusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(35);

  const track = tracks[currentTrack];

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Now Playing */}
      <div className="p-6 bg-gradient-to-b from-primary/20 to-transparent">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-lg bg-primary/30 flex items-center justify-center text-4xl">🎵</div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{track.title}</h2>
            <p className="text-sm text-muted-foreground">{track.artist} • {track.album}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="w-full h-1.5 bg-muted rounded-full cursor-pointer" onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress((e.clientX - rect.left) / rect.width * 100);
          }}>
            <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1:18</span>
            <span>{track.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button className="text-muted-foreground hover:text-foreground"><Shuffle className="w-4 h-4" /></button>
          <button onClick={() => setCurrentTrack(i => Math.max(0, i - 1))} className="text-foreground hover:text-primary"><SkipBack className="w-5 h-5" /></button>
          <button onClick={() => setPlaying(!playing)} className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90">
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button onClick={() => setCurrentTrack(i => Math.min(tracks.length - 1, i + 1))} className="text-foreground hover:text-primary"><SkipForward className="w-5 h-5" /></button>
          <button className="text-muted-foreground hover:text-foreground"><Repeat className="w-4 h-4" /></button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 justify-center mt-3">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)} className="w-24 accent-primary" />
        </div>
      </div>

      {/* Playlist */}
      <div className="flex-1 overflow-auto p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">QUEUE</h3>
        {tracks.map((t, i) => (
          <button
            key={i}
            onClick={() => { setCurrentTrack(i); setPlaying(true); setProgress(0); }}
            className={`w-full flex items-center gap-3 p-2 rounded hover:bg-muted text-left ${
              i === currentTrack ? 'bg-primary/10' : ''
            }`}
          >
            <span className="w-6 text-center text-xs text-muted-foreground">{i === currentTrack && playing ? '▶' : i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm truncate ${i === currentTrack ? 'text-primary font-medium' : 'text-foreground'}`}>{t.title}</div>
              <div className="text-xs text-muted-foreground">{t.artist}</div>
            </div>
            <span className="text-xs text-muted-foreground">{t.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
