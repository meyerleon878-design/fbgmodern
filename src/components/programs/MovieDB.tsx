import { useState } from 'react';
import { Star, Search, Heart } from 'lucide-react';

const movies = [
  { title: 'The Matrix', year: 1999, rating: 8.7, genre: 'Sci-Fi', poster: '🤖', desc: 'A computer hacker learns about the true nature of reality.' },
  { title: 'Inception', year: 2010, rating: 8.8, genre: 'Sci-Fi', poster: '🌀', desc: 'A thief who steals corporate secrets through dream-sharing technology.' },
  { title: 'Interstellar', year: 2014, rating: 8.6, genre: 'Sci-Fi', poster: '🚀', desc: 'A team of explorers travel through a wormhole in space.' },
  { title: 'The Dark Knight', year: 2008, rating: 9.0, genre: 'Action', poster: '🦇', desc: 'Batman faces the Joker, a criminal mastermind.' },
  { title: 'Pulp Fiction', year: 1994, rating: 8.9, genre: 'Crime', poster: '💼', desc: 'The lives of two mob hitmen intertwine in four tales.' },
  { title: 'Fight Club', year: 1999, rating: 8.8, genre: 'Drama', poster: '🥊', desc: 'An insomniac office worker forms an underground fight club.' },
  { title: 'Forrest Gump', year: 1994, rating: 8.8, genre: 'Drama', poster: '🏃', desc: 'The presidencies of Kennedy and Johnson through the eyes of Forrest Gump.' },
  { title: 'The Shawshank Redemption', year: 1994, rating: 9.3, genre: 'Drama', poster: '⛓️', desc: 'Two imprisoned men bond over a number of years.' },
];

const MovieDB = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof movies[0] | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = movies.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  const toggleFav = (title: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  };

  return (
    <div className="h-full flex bg-card">
      {/* List */}
      <div className="w-72 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search movies..." className="w-full pl-9 pr-3 py-2 bg-input border border-border rounded text-foreground text-sm outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filtered.map(m => (
            <button key={m.title} onClick={() => setSelected(m)} className={`w-full text-left p-3 border-b border-border flex items-center gap-3 ${selected?.title === m.title ? 'bg-primary/10' : 'hover:bg-muted'}`}>
              <span className="text-2xl">{m.poster}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{m.title}</div>
                <div className="text-xs text-muted-foreground">{m.year} • {m.genre}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 p-6 overflow-auto">
        {selected ? (
          <>
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">{selected.poster}</div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{selected.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground">{selected.year}</span>
                  <span className="px-2 py-0.5 bg-muted rounded text-xs text-foreground">{selected.genre}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-foreground">{selected.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground mb-4">{selected.desc}</p>
            <button onClick={() => toggleFav(selected.title)} className={`flex items-center gap-2 px-4 py-2 rounded text-sm ${
              favorites.has(selected.title) ? 'bg-red-500/20 text-red-500' : 'bg-muted text-foreground hover:bg-muted/80'
            }`}>
              <Heart className={`w-4 h-4 ${favorites.has(selected.title) ? 'fill-red-500' : ''}`} />
              {favorites.has(selected.title) ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">Select a movie</div>
        )}
      </div>
    </div>
  );
};

export default MovieDB;
