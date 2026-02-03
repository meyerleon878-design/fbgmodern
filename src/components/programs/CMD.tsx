import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CommandHistory {
  command: string;
  output: string[];
}

const CMD = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: '',
      output: [
        'FBG Command Prompt [Version 11.0.22621.1992]',
        '(c) FBG Corporation. All rights reserved.',
        '',
        'Type "help" for available commands.',
        '',
      ],
    },
  ]);
  const [currentDir, setCurrentDir] = useState('C:\\Users\\FBG_ADMIN');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const processCommand = (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    let output: string[] = [];

    switch (command) {
      case '':
        output = [];
        break;
      case 'help':
        output = [
          'Available commands:',
          '  help       - Display this help message',
          '  cls        - Clear the screen',
          '  dir        - List directory contents',
          '  cd         - Change directory',
          '  echo       - Display a message',
          '  date       - Display current date',
          '  time       - Display current time',
          '  whoami     - Display current user',
          '  systeminfo - Display system information',
          '  ipconfig   - Display IP configuration',
          '  ping       - Ping a host',
          '  tree       - Display directory tree',
          '  matrix     - Enter the Matrix',
          '  exit       - Close CMD',
          '',
        ];
        break;
      case 'cls':
        setHistory([{ command: '', output: [] }]);
        return;
      case 'dir':
        output = [
          ` Volume in drive C is FBG_OS`,
          ` Volume Serial Number is FBG-2024`,
          '',
          ` Directory of ${currentDir}`,
          '',
          new Date().toLocaleDateString() + '  ' + new Date().toLocaleTimeString() + '    <DIR>          .',
          new Date().toLocaleDateString() + '  ' + new Date().toLocaleTimeString() + '    <DIR>          ..',
          new Date().toLocaleDateString() + '  ' + new Date().toLocaleTimeString() + '    <DIR>          Desktop',
          new Date().toLocaleDateString() + '  ' + new Date().toLocaleTimeString() + '    <DIR>          Documents',
          new Date().toLocaleDateString() + '  ' + new Date().toLocaleTimeString() + '    <DIR>          Downloads',
          new Date().toLocaleDateString() + '  ' + new Date().toLocaleTimeString() + '             1,337 secret.txt',
          '               1 File(s)          1,337 bytes',
          '               5 Dir(s)   42,069,420,420 bytes free',
          '',
        ];
        break;
      case 'cd':
        if (args[0]) {
          if (args[0] === '..') {
            const parts = currentDir.split('\\');
            if (parts.length > 1) {
              parts.pop();
              setCurrentDir(parts.join('\\') || 'C:');
            }
          } else {
            setCurrentDir(currentDir + '\\' + args[0]);
          }
          output = [];
        } else {
          output = [currentDir, ''];
        }
        break;
      case 'echo':
        output = [args.join(' ') || '', ''];
        break;
      case 'date':
        output = [`The current date is: ${new Date().toLocaleDateString()}`, ''];
        break;
      case 'time':
        output = [`The current time is: ${new Date().toLocaleTimeString()}`, ''];
        break;
      case 'whoami':
        output = ['fbg_os\\fbg_admin', ''];
        break;
      case 'systeminfo':
        output = [
          'Host Name:                 FBG-WORKSTATION',
          'OS Name:                   FBG_OS Matrix Edition',
          'OS Version:                11.0.22621 N/A Build 22621',
          'OS Manufacturer:           FBG Corporation',
          'OS Configuration:          Standalone Workstation',
          'Registered Owner:          FBG_ADMIN',
          'System Type:               x64-based PC',
          'Processor(s):              1 Processor(s) Installed.',
          '                           [01]: Intel64 Family 6 Model 142',
          'Total Physical Memory:     16,384 MB',
          'Available Physical Memory: 8,192 MB',
          '',
        ];
        break;
      case 'ipconfig':
        output = [
          '',
          'Windows IP Configuration',
          '',
          'Ethernet adapter Ethernet:',
          '',
          '   Connection-specific DNS Suffix  . : fbg.local',
          '   IPv4 Address. . . . . . . . . . . : 192.168.1.100',
          '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
          '   Default Gateway . . . . . . . . . : 192.168.1.1',
          '',
        ];
        break;
      case 'ping':
        const target = args[0] || 'localhost';
        output = [
          '',
          `Pinging ${target} with 32 bytes of data:`,
          `Reply from ${target === 'localhost' ? '127.0.0.1' : '192.168.1.' + Math.floor(Math.random() * 255)}: bytes=32 time<1ms TTL=128`,
          `Reply from ${target === 'localhost' ? '127.0.0.1' : '192.168.1.' + Math.floor(Math.random() * 255)}: bytes=32 time<1ms TTL=128`,
          `Reply from ${target === 'localhost' ? '127.0.0.1' : '192.168.1.' + Math.floor(Math.random() * 255)}: bytes=32 time<1ms TTL=128`,
          `Reply from ${target === 'localhost' ? '127.0.0.1' : '192.168.1.' + Math.floor(Math.random() * 255)}: bytes=32 time<1ms TTL=128`,
          '',
          `Ping statistics for ${target}:`,
          '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),',
          'Approximate round trip times in milli-seconds:',
          '    Minimum = 0ms, Maximum = 0ms, Average = 0ms',
          '',
        ];
        break;
      case 'tree':
        output = [
          'Folder PATH listing',
          'C:.',
          '├───FBG_DATA',
          '│   └───MC_ACCOUNTS',
          '│       ├───FBG_MC_ACC_1234',
          '│       └───FBG_MC_ACC_5678',
          '├───System32',
          '└───Users',
          '    └───FBG_ADMIN',
          '        ├───Desktop',
          '        ├───Documents',
          '        └───Downloads',
          '',
        ];
        break;
      case 'matrix':
        output = [
          '',
          '  ████████╗██╗  ██╗███████╗    ███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗',
          '  ╚══██╔══╝██║  ██║██╔════╝    ████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝',
          '     ██║   ███████║█████╗      ██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ ',
          '     ██║   ██╔══██║██╔══╝      ██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ ',
          '     ██║   ██║  ██║███████╗    ██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗',
          '     ╚═╝   ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝',
          '',
          '  Wake up, Neo...',
          '  The Matrix has you...',
          '  Follow the white rabbit.',
          '',
          '  Knock, knock, Neo.',
          '',
        ];
        break;
      case 'exit':
        output = ['Goodbye!', ''];
        break;
      default:
        output = [
          `'${command}' is not recognized as an internal or external command,`,
          'operable program or batch file.',
          '',
        ];
    }

    setHistory(prev => [
      ...prev,
      {
        command: `${currentDir}>${cmd}`,
        output,
      },
    ]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([{ command: '', output: [] }]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-black text-green-400 font-mono text-sm p-2 overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {history.map((item, i) => (
          <div key={i}>
            {item.command && (
              <div className="text-green-300">{item.command}</div>
            )}
            {item.output.map((line, j) => (
              <div key={j} className="whitespace-pre">
                {line}
              </div>
            ))}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex">
          <span className="text-green-300">{currentDir}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400 ml-1"
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </motion.div>
  );
};

export default CMD;
