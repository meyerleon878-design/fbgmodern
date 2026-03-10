import { useState, useRef, useEffect } from 'react';

const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff', '#888888', '#ff4444'];
const sizes = [2, 4, 8, 12, 20];

const PaintStudio = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(4);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);

    ctx.beginPath();
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? size * 3 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
    } else {
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y);
    }
    ctx.stroke();
    lastPos.current = pos;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border flex-wrap">
        <button onClick={() => setTool('pen')} className={`px-3 py-1 rounded text-xs ${tool === 'pen' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>✏️ Pen</button>
        <button onClick={() => setTool('eraser')} className={`px-3 py-1 rounded text-xs ${tool === 'eraser' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>🧹 Eraser</button>
        <span className="w-px h-6 bg-border" />
        {sizes.map(s => (
          <button key={s} onClick={() => setSize(s)} className={`w-7 h-7 rounded flex items-center justify-center ${size === s ? 'bg-primary/20 border border-primary' : 'hover:bg-muted'}`}>
            <div className="rounded-full bg-foreground" style={{ width: Math.min(s, 14), height: Math.min(s, 14) }} />
          </button>
        ))}
        <span className="w-px h-6 bg-border" />
        {colors.map(c => (
          <button
            key={c}
            onClick={() => { setColor(c); setTool('pen'); }}
            className={`w-6 h-6 rounded border ${color === c && tool === 'pen' ? 'border-primary ring-2 ring-primary' : 'border-border'}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <span className="flex-1" />
        <button onClick={clearCanvas} className="px-3 py-1 bg-destructive/20 text-destructive rounded text-xs">Clear</button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-200 p-2">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="bg-white shadow-lg cursor-crosshair max-w-full max-h-full"
          onMouseDown={e => { setDrawing(true); lastPos.current = getPos(e); }}
          onMouseMove={draw}
          onMouseUp={() => { setDrawing(false); lastPos.current = null; }}
          onMouseLeave={() => { setDrawing(false); lastPos.current = null; }}
        />
      </div>
    </div>
  );
};

export default PaintStudio;
