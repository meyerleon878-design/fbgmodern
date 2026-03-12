import { useState, useRef, useEffect } from 'react';

const DebugCMD = () => {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<string[]>([
    'FBG_OS Developer Debug Console v1.0',
    'Type "help" for available debug commands.',
    '',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [lines]);

  const exec = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const c = parts[0].toLowerCase();
    let output: string[] = [`root@fbg-dev:~# ${cmd}`];

    switch (c) {
      case 'help':
        output.push('=== DEBUG COMMANDS ===');
        output.push('sysinfo      - Display system information');
        output.push('meminfo      - Show memory usage');
        output.push('proclist     - List running processes');
        output.push('dmesg        - Show kernel ring buffer');
        output.push('lsmod        - List loaded kernel modules');
        output.push('lspci        - List PCI devices');
        output.push('ifconfig     - Show network interfaces');
        output.push('top          - Show resource usage');
        output.push('strace       - Trace system calls');
        output.push('debug [lvl]  - Set debug level (0-5)');
        output.push('hexdump      - Dump random memory');
        output.push('clear        - Clear terminal');
        break;
      case 'sysinfo':
        output.push('FBG_OS Developer Build');
        output.push(`Kernel: 6.1.0-fbg-dev`);
        output.push(`Uptime: ${Math.floor(Math.random() * 10000)}s`);
        output.push(`CPU: Intel i9-13900K @ 5.8GHz (24 cores)`);
        output.push(`Memory: ${Math.floor(Math.random() * 16384 + 16384)} MB / 32768 MB`);
        output.push(`Mode: DEVELOPER`);
        break;
      case 'meminfo':
        output.push('MemTotal:       32768000 kB');
        output.push(`MemFree:        ${Math.floor(Math.random() * 16000000)} kB`);
        output.push(`MemAvailable:   ${Math.floor(Math.random() * 20000000)} kB`);
        output.push(`Buffers:        ${Math.floor(Math.random() * 500000)} kB`);
        output.push(`Cached:         ${Math.floor(Math.random() * 8000000)} kB`);
        output.push(`SwapTotal:      8388608 kB`);
        output.push(`SwapFree:       ${Math.floor(Math.random() * 8388608)} kB`);
        break;
      case 'proclist':
        const procs = ['init', 'systemd', 'kthreadd', 'fbg-shell', 'debug-cmd', 'force-daemon', 'dev-settings', 'fbg-compositor', 'fbg-dbus'];
        procs.forEach((p, i) => output.push(`  ${i + 1}  root  ${Math.floor(Math.random() * 50)}%  ${p}`));
        break;
      case 'dmesg':
        output.push(`[    0.000000] Linux version 6.1.0-fbg-dev (root@fbg-build)`);
        output.push(`[    0.000001] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda2 ro quiet`);
        output.push(`[    0.523456] fbg-debug: Developer module loaded`);
        output.push(`[    0.623456] fbg-force: Force error framework initialized`);
        output.push(`[    1.234567] fbg-dev: Developer system active`);
        break;
      case 'lsmod':
        output.push('Module                  Size  Used by');
        output.push('fbg_debug             16384  1');
        output.push('fbg_force             24576  0');
        output.push('fbg_devsettings        8192  1');
        output.push('fbg_compositor        32768  2');
        break;
      case 'lspci':
        output.push('00:00.0 Host bridge: FBG Corporation System Controller');
        output.push('00:01.0 VGA: FBG Graphics Adapter (rev 02)');
        output.push('00:02.0 Network: FBG Ethernet Controller');
        output.push('00:03.0 Audio: FBG HD Audio Controller');
        break;
      case 'ifconfig':
        output.push('eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>');
        output.push('        inet 192.168.1.' + Math.floor(Math.random() * 254 + 1));
        output.push('        ether 52:54:00:12:34:56');
        output.push('        RX packets ' + Math.floor(Math.random() * 100000));
        output.push('        TX packets ' + Math.floor(Math.random() * 100000));
        break;
      case 'top':
        output.push(`Tasks: 9 total, 1 running, 8 sleeping`);
        output.push(`%Cpu(s): ${(Math.random() * 30).toFixed(1)} us, ${(Math.random() * 10).toFixed(1)} sy`);
        output.push(`MiB Mem: 32768.0 total, ${(Math.random() * 16000).toFixed(1)} free`);
        break;
      case 'strace':
        for (let i = 0; i < 5; i++) {
          const syscalls = ['read', 'write', 'open', 'close', 'mmap', 'brk', 'ioctl'];
          output.push(`${syscalls[Math.floor(Math.random() * syscalls.length)]}(${Math.floor(Math.random() * 20)}, 0x${Math.floor(Math.random() * 0xFFFF).toString(16)}) = ${Math.floor(Math.random() * 100)}`);
        }
        break;
      case 'debug':
        const lvl = parseInt(parts[1]);
        if (!isNaN(lvl) && lvl >= 0 && lvl <= 5) output.push(`Debug level set to ${lvl}`);
        else output.push('Usage: debug [0-5]');
        break;
      case 'hexdump':
        for (let i = 0; i < 8; i++) {
          const addr = (0x7fff0000 + i * 16).toString(16);
          const hex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ');
          output.push(`0x${addr}: ${hex}`);
        }
        break;
      case 'clear':
        setLines([]);
        setInput('');
        return;
      case '':
        break;
      default:
        output.push(`debug-cmd: ${c}: command not found`);
    }

    setLines(prev => [...prev, ...output]);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-black text-[#00ff00] font-mono" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center gap-1 px-2 py-1 border-b border-[#00ff00]/20 bg-[#001100]">
        <span className="text-xs px-2 py-0.5 rounded bg-[#00ff00]/10">DEBUG CMD</span>
        <span className="text-xs text-red-500 ml-2">⚡ DEVELOPER MODE</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 text-sm">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre">{l}</div>
        ))}
        <form onSubmit={e => { e.preventDefault(); exec(input); }} className="flex">
          <span className="text-yellow-400">root@fbg-dev:~# </span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none ml-1 text-[#00ff00]" autoFocus spellCheck={false} />
        </form>
      </div>
    </div>
  );
};

export default DebugCMD;
