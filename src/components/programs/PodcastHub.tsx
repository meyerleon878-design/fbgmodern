import { useState } from 'react';
import { Headphones, Play, Clock, Star } from 'lucide-react';

const podcasts = [
  { title: 'Tech Today', host: 'FBG Studios', episodes: 142, icon: '💻', desc: 'Daily tech news and analysis', category: 'Technology' },
  { title: 'True Crime Files', host: 'Mystery Pod', episodes: 89, icon: '🔍', desc: 'Investigating unsolved cases', category: 'True Crime' },
  { title: 'Science Hour', host: 'Lab Talk', episodes: 210, icon: '🔬', desc: 'Breaking down complex science', category: 'Science' },
  { title: 'Comedy Central', host: 'Laugh Track', episodes: 300, icon: '😂', desc: 'Stand-up and sketch comedy', category: 'Comedy' },
  { title: 'History Unplugged', host: 'Past Masters', episodes: 175, icon: '📜', desc: 'Stories from history', category: 'History' },
  { title: 'Mindful Minutes', host: 'Zen Audio', episodes: 95, icon: '🧘', desc: 'Meditation and wellness', category: 'Health' },
];

const PodcastHub = () => {
  const [selected, setSelected] = useState<typeof podcasts[0] | null>(null);
  const [subscribed, setSubscribed] = useState<Set<string>>(new Set());

  const toggleSub = (title: string) => {
    setSubscribed(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  };

  return (
    <div className="h-full flex bg-card">
      {/* Podcast list */}
      <div className="w-72 border-r border-border overflow-auto">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">PodcastHub</h2>
          </div>
        </div>
        {podcasts.map(p => (
          <button key={p.title} onClick={() => setSelected(p)} className={`w-full text-left p-3 border-b border-border flex items-center gap-3 ${selected?.title === p.title ? 'bg-primary/10' : 'hover:bg-muted'}`}>
            <span className="text-2xl">{p.icon}</span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.host} • {p.episodes} eps</div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-auto">
        {selected ? (
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">{selected.icon}</div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{selected.title}</h2>
                <p className="text-sm text-muted-foreground">{selected.host}</p>
                <p className="text-xs text-muted-foreground mt-1">{selected.category} • {selected.episodes} episodes</p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-4">{selected.desc}</p>
            <button onClick={() => toggleSub(selected.title)} className={`px-4 py-2 rounded text-sm ${
              subscribed.has(selected.title) ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'
            }`}>
              {subscribed.has(selected.title) ? 'Subscribed ✓' : 'Subscribe'}
            </button>

            {/* Episodes */}
            <h3 className="text-sm font-medium text-foreground mt-6 mb-3">Latest Episodes</h3>
            {[1, 2, 3, 4, 5].map(ep => (
              <div key={ep} className="flex items-center gap-3 p-3 border-b border-border">
                <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="w-3 h-3 text-primary ml-0.5" />
                </button>
                <div className="flex-1">
                  <div className="text-sm text-foreground">Episode {selected.episodes - ep + 1}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {30 + Math.floor(Math.random() * 30)} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">Select a podcast</div>
        )}
      </div>
    </div>
  );
};

export default PodcastHub;
