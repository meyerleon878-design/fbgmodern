import { useState } from 'react';
import { Camera, RotateCcw, Aperture } from 'lucide-react';

const CameraApp = () => {
  const [filter, setFilter] = useState('none');
  const [captured, setCaptured] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);

  const capture = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setCaptured(prev => [`Photo ${prev.length + 1} (${filter})`, ...prev].slice(0, 8));
  };

  const filters = ['none', 'grayscale(100%)', 'sepia(80%)', 'contrast(150%)', 'saturate(200%)', 'hue-rotate(90deg)'];
  const filterNames = ['Normal', 'B&W', 'Sepia', 'Vivid', 'Saturated', 'Cool'];

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div
          className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center"
          style={{ filter }}
        >
          <div className="text-center">
            <Camera className="w-16 h-16 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Camera Preview</p>
          </div>
          {/* Grid overlay */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/10" />
            ))}
          </div>
        </div>
        {flash && <div className="absolute inset-0 bg-white animate-pulse" />}
      </div>

      {/* Filter strip */}
      <div className="flex gap-2 p-2 bg-gray-900 overflow-x-auto">
        {filters.map((f, i) => (
          <button
            key={i}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              filter === f ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {filterNames[i]}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 p-4 bg-gray-900">
        <button className="text-gray-400"><RotateCcw className="w-6 h-6" /></button>
        <button onClick={capture} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform">
          <Aperture className="w-8 h-8 text-white" />
        </button>
        <div className="w-10 h-10 rounded bg-gray-700 text-xs text-gray-300 flex items-center justify-center">
          {captured.length}
        </div>
      </div>
    </div>
  );
};

export default CameraApp;
