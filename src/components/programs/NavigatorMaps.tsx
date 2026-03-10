import { useState } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';

const locations = [
  { name: 'FBG Headquarters', lat: '40.7128°N', lng: '74.0060°W', type: 'Building' },
  { name: 'Central Park', lat: '40.7829°N', lng: '73.9654°W', type: 'Park' },
  { name: 'Times Square', lat: '40.7580°N', lng: '73.9855°W', type: 'Landmark' },
  { name: 'Brooklyn Bridge', lat: '40.7061°N', lng: '73.9969°W', type: 'Bridge' },
  { name: 'Statue of Liberty', lat: '40.6892°N', lng: '74.0445°W', type: 'Monument' },
];

const NavigatorMaps = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof locations[0] | null>(null);

  const filtered = locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex bg-card">
      {/* Sidebar */}
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search locations..."
              className="w-full pl-9 pr-3 py-2 bg-input border border-border rounded text-foreground text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filtered.map((loc, i) => (
            <button
              key={i}
              onClick={() => setSelected(loc)}
              className={`w-full text-left p-3 border-b border-border flex items-start gap-2 ${
                selected?.name === loc.name ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
            >
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">{loc.name}</div>
                <div className="text-xs text-muted-foreground">{loc.type}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative bg-gradient-to-br from-[#e8f4e8] via-[#d4e8d4] to-[#c0dcc0]">
        {/* Simulated map */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>
              <div className="absolute border-t border-gray-500" style={{ top: `${i * 5}%`, left: 0, right: 0 }} />
              <div className="absolute border-l border-gray-500" style={{ left: `${i * 5}%`, top: 0, bottom: 0 }} />
            </div>
          ))}
        </div>

        {/* Pins */}
        {locations.map((loc, i) => (
          <div
            key={i}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
            style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%` }}
            onClick={() => setSelected(loc)}
          >
            <MapPin className={`w-6 h-6 ${selected?.name === loc.name ? 'text-red-500' : 'text-primary'}`} />
          </div>
        ))}

        {/* Selected info */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur rounded-lg p-4 shadow-lg border border-border">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">{selected.type}</p>
                <p className="text-xs text-muted-foreground mt-1">{selected.lat}, {selected.lng}</p>
              </div>
              <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm flex items-center gap-1">
                <Navigation className="w-3 h-3" /> Navigate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigatorMaps;
