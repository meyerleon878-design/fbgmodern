import { useState } from 'react';

const NotepadPlus = () => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');
  const [saved, setSaved] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);

  const lines = text.split('\n');
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleSave = () => {
    localStorage.setItem(`notepad-${fileName}`, text);
    setSaved(true);
  };

  const handleNew = () => {
    setText('');
    setFileName('untitled.txt');
    setSaved(true);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Menu bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-muted border-b border-border text-xs">
        <button onClick={handleNew} className="px-2 py-1 hover:bg-secondary rounded text-foreground">New</button>
        <button onClick={handleSave} className="px-2 py-1 hover:bg-secondary rounded text-foreground">Save</button>
        <span className="mx-2 text-border">|</span>
        <button onClick={() => setFontSize(f => Math.min(f + 2, 24))} className="px-2 py-1 hover:bg-secondary rounded text-foreground">A+</button>
        <button onClick={() => setFontSize(f => Math.max(f - 2, 10))} className="px-2 py-1 hover:bg-secondary rounded text-foreground">A-</button>
        <button onClick={() => setWordWrap(!wordWrap)} className={`px-2 py-1 rounded ${wordWrap ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-foreground'}`}>Wrap</button>
        <span className="flex-1" />
        <span className="text-muted-foreground">{fileName}{!saved ? ' •' : ''}</span>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
        <div className="w-12 bg-muted/50 text-right pr-2 pt-2 overflow-hidden select-none border-r border-border">
          {lines.map((_, i) => (
            <div key={i} className="text-muted-foreground leading-6" style={{ fontSize: fontSize - 2 }}>{i + 1}</div>
          ))}
        </div>

        {/* Text area */}
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setSaved(false); }}
          className="flex-1 p-2 bg-card text-foreground outline-none resize-none font-mono leading-6"
          style={{ fontSize, whiteSpace: wordWrap ? 'pre-wrap' : 'pre', overflowWrap: wordWrap ? 'break-word' : 'normal' }}
          spellCheck={false}
          placeholder="Start typing..."
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-muted border-t border-border text-xs text-muted-foreground">
        <span>Ln {lines.length}, Col {(text.split('\n').pop()?.length || 0) + 1}</span>
        <span>{wordCount} words, {charCount} chars</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default NotepadPlus;
