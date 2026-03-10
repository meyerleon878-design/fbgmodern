import { useState, useRef, useEffect } from 'react';

const themes = {
  green: { bg: '#0a0a0a', fg: '#00ff00', prompt: '#00cc00' },
  blue: { bg: '#0a0a1a', fg: '#4488ff', prompt: '#2266dd' },
  amber: { bg: '#1a1200', fg: '#ffaa00', prompt: '#cc8800' },
  white: { bg: '#1a1a1a', fg: '#e0e0e0', prompt: '#888888' },
};

const TerminalPro = () => {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<string[]>(['Terminal Pro v2.0', 'Type "help" for commands.', '']);
  const [theme, setTheme] = useState<keyof typeof themes>('green');
  const [cwd, setCwd] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [lines]);

  const exec = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const c = parts[0];
    let output: string[] = [`${cwd} $ ${cmd}`];

    switch (c) {
      case 'help': output.push('Commands: help, ls, cd, pwd, echo, whoami, uname, clear, theme [green|blue|amber|white], neofetch, cowsay [msg]'); break;
      case 'ls': output.push('Desktop  Documents  Downloads  .config  .ssh  .bashrc'); break;
      case 'cd': setCwd(parts[1] || '~'); break;
      case 'pwd': output.push(`/home/user/${cwd}`); break;
      case 'echo': output.push(parts.slice(1).join(' ')); break;
      case 'whoami': output.push('root'); break;
      case 'uname': output.push('FBG_OS 11.0.0 x86_64 GNU/Linux'); break;
      case 'clear': setLines([]); setInput(''); return;
      case 'theme':
        if (parts[1] && parts[1] in themes) { setTheme(parts[1] as keyof typeof themes); output.push(`Theme set to ${parts[1]}`); }
        else output.push('Usage: theme [green|blue|amber|white]');
        break;
      case 'neofetch':
        output.push('  _____ ____   ____    ');
        output.push(' |  ___| __ ) / ___|   OS: FBG_OS 11.0');
        output.push(' | |_  |  _ \\| |  _    Kernel: 6.1.0');
        output.push(' |  _| | |_) | |_| |   Shell: Terminal Pro');
        output.push(' |_|   |____/ \\____|   Memory: 32GB DDR5');
        output.push('                        CPU: Intel i9-13900K');
        break;
      case 'cowsay':
        const msg = parts.slice(1).join(' ') || 'Moo!';
        const line = '-'.repeat(msg.length + 2);
        output.push(` ${line}`);
        output.push(`< ${msg} >`);
        output.push(` ${line}`);
        output.push('        \\   ^__^');
        output.push('         \\  (oo)\\_______');
        output.push('            (__)\\       )\\/\\');
        output.push('                ||----w |');
        output.push('                ||     ||');
        break;
      case '': break;
      default: output.push(`${c}: command not found`);
    }

    setLines(prev => [...prev, ...output]);
    setInput('');
  };

  const t = themes[theme];

  return (
    <div className="h-full flex flex-col" style={{ background: t.bg, color: t.fg }} onClick={() => inputRef.current?.focus()}>
      {/* Tabs */}
      <div className="flex items-center gap-1 px-2 py-1 border-b" style={{ borderColor: t.fg + '33' }}>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: t.fg + '22' }}>bash</span>
        <span className="text-xs opacity-50">+</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 font-mono text-sm">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre">{l}</div>
        ))}
        <form onSubmit={e => { e.preventDefault(); exec(input); }} className="flex">
          <span style={{ color: t.prompt }}>{cwd} $ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none ml-1"
            style={{ color: t.fg }}
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalPro;
