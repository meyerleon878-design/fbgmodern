import { useState } from 'react';

const filters = [
  { name: 'Normal', filter: 'none' },
  { name: 'Grayscale', filter: 'grayscale(100%)' },
  { name: 'Sepia', filter: 'sepia(100%)' },
  { name: 'Blur', filter: 'blur(3px)' },
  { name: 'Bright', filter: 'brightness(150%)' },
  { name: 'Contrast', filter: 'contrast(200%)' },
  { name: 'Saturate', filter: 'saturate(200%)' },
  { name: 'Invert', filter: 'invert(100%)' },
  { name: 'Hue +90', filter: 'hue-rotate(90deg)' },
  { name: 'Hue +180', filter: 'hue-rotate(180deg)' },
];

const PhotoEditor = () => {
  const [activeFilter, setActiveFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const combinedFilter = activeFilter !== 'none'
    ? activeFilter
    : `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

  return (
    <div className="h-full flex bg-card">
      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
        <div
          className="w-72 h-72 rounded-lg bg-gradient-to-br from-sky-400 via-purple-500 to-pink-500 flex items-center justify-center text-6xl shadow-lg"
          style={{ filter: combinedFilter }}
        >
          🏔️
        </div>
      </div>

      {/* Tools panel */}
      <div className="w-56 border-l border-border p-3 overflow-auto">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">ADJUSTMENTS</h3>
        
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs text-foreground">Brightness: {brightness}%</label>
            <input type="range" min="0" max="200" value={brightness} onChange={e => { setBrightness(+e.target.value); setActiveFilter('none'); }} className="w-full accent-primary" />
          </div>
          <div>
            <label className="text-xs text-foreground">Contrast: {contrast}%</label>
            <input type="range" min="0" max="200" value={contrast} onChange={e => { setContrast(+e.target.value); setActiveFilter('none'); }} className="w-full accent-primary" />
          </div>
          <div>
            <label className="text-xs text-foreground">Saturation: {saturation}%</label>
            <input type="range" min="0" max="200" value={saturation} onChange={e => { setSaturation(+e.target.value); setActiveFilter('none'); }} className="w-full accent-primary" />
          </div>
        </div>

        <h3 className="text-xs font-medium text-muted-foreground mb-2">FILTERS</h3>
        <div className="grid grid-cols-2 gap-1">
          {filters.map(f => (
            <button
              key={f.name}
              onClick={() => setActiveFilter(f.filter)}
              className={`p-2 rounded text-xs text-center ${
                activeFilter === f.filter ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => { setActiveFilter('none'); setBrightness(100); setContrast(100); setSaturation(100); }}
          className="w-full mt-3 px-3 py-2 bg-destructive/20 text-destructive rounded text-xs hover:bg-destructive/30"
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default PhotoEditor;
