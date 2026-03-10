import { useState } from 'react';
import { Radio, Play, Pause, Volume2 } from 'lucide-react';

const stations = [
  { name: 'FBG Radio', genre: 'Electronic', freq: '101.1 FM', icon: '📻' },
  { name: 'Classic Hits', genre: 'Classic Rock', freq: '95.5 FM', icon: '🎸' },
  { name: 'Jazz Lounge', genre: 'Jazz', freq: '88.3 FM', icon: '🎷' },
  { name: 'Pop Central', genre: 'Pop', freq: '104.7 FM', icon: '🎤' },
  { name: 'Country Roads', genre: 'Country', freq: '92.1 FM', icon: '🤠' },
  { name: 'Hip Hop Nation', genre: 'Hip Hop', freq: '98.9 FM', icon: '🎧' },
  { name: 'Classical FM', genre: 'Classical', freq: '91.5 FM', icon: '🎻' },
  { name: 'Chill Vibes', genre: 'Lo-Fi', freq: '107.3 FM', icon: '🌊' },
];

const RadioApp = () => {
  const [playing, setPlaying] = useState<number | null>(null);
  const [volume, setVolume] = useState(70);
  const [genre, setGenre] = useState('All');

  const genres = ['All', ...new Set(stations.map(s => s.genre))];
  const filtered = genre === 'All' ? stations : stations.filter(s => s.genre === genre);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Now playing bar */}
      {playing !== null && (
        <div className="p-3 bg-primary/10 border-b border-border flex items-center gap-3">
          <span className="text-2xl">{stations[playing].icon}</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">{stations[playing].name}</div>
            <div className="text-xs text-muted-foreground">{stations[playing].freq}</div>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)} className="w-20 accent-primary" />
          </div>
          <button onClick={() => setPlaying(null)} className="p-2 hover:bg-muted rounded">
            <Pause className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}

      {/* Genre filter */}
      <div className="flex gap-2 p-3 overflow-x-auto border-b border-border">
        {genres.map(g => (
          <button key={g} onClick={() => setGenre(g)} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
            genre === g ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>{g}</button>
        ))}
      </div>

      {/* Stations */}
      <div className="flex-1 overflow-auto p-3">
        {filtered.map((s, i) => {
          const realIdx = stations.indexOf(s);
          return (
            <button
              key={i}
              onClick={() => setPlaying(playing === realIdx ? null : realIdx)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 ${
                playing === realIdx ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted'
              }`}
            >
              <span className="text-3xl">{s.icon}</span>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-foreground">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.genre} • {s.freq}</div>
              </div>
              {playing === realIdx ? (
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map(b => (
                    <div key={b} className="w-1 bg-primary rounded animate-pulse" style={{ height: 8 + Math.random() * 12, animationDelay: `${b * 0.2}s` }} />
                  ))}
                </div>
              ) : (
                <Play className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RadioApp;
