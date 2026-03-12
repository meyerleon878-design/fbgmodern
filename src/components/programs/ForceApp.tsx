import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ForceApp = () => {
  const [activeError, setActiveError] = useState<string | null>(null);

  const errors = [
    { id: 'bsod', label: '💀 Blue Screen of Death (BSOD)', color: '#0078d4', description: 'Force a Windows-style BSOD' },
    { id: 'kernel', label: '🔥 Kernel Panic', color: '#aa0000', description: 'Force a Linux kernel panic' },
    { id: 'gpu', label: '🖥️ GPU Driver Crash', color: '#333333', description: 'Simulate a GPU driver failure' },
    { id: 'memory', label: '💾 Memory Dump', color: '#004400', description: 'Trigger a memory dump screen' },
    { id: 'boot', label: '🔄 Boot Loop', color: '#1a1a2e', description: 'Simulate an infinite boot loop' },
    { id: 'glitch', label: '📺 Display Glitch', color: '#000000', description: 'Cause visual display corruption' },
  ];

  if (activeError === 'bsod') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-[#0078d4] text-white p-12 font-['Segoe_UI',sans-serif] flex flex-col justify-center">
        <div className="text-8xl mb-8">:(</div>
        <h1 className="text-2xl mb-4">Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</h1>
        <div className="mt-8 text-sm space-y-1">
          <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}>
            {Math.floor(Math.random() * 100)}% complete
          </motion.p>
          <p className="mt-4">Stop code: CRITICAL_PROCESS_DIED</p>
          <p>If you'd like to know more, search online: STOP 0x{Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0')}</p>
        </div>
        <button onClick={() => setActiveError(null)} className="mt-8 text-xs underline opacity-60 self-start hover:opacity-100">
          [Click to dismiss]
        </button>
      </motion.div>
    );
  }

  if (activeError === 'kernel') {
    const panicLines = [
      'Kernel panic - not syncing: Attempted to kill init! exitcode=0x0000000b',
      '',
      'CPU: 0 PID: 1 Comm: init Not tainted 6.1.0-fbg #1',
      'Hardware name: FBG Corporation FBG_PC/FBG_BOARD, BIOS FBG v4.20 01/01/2024',
      'Call Trace:',
      ' <TASK>',
      ' dump_stack_lvl+0x49/0x63',
      ' dump_stack+0x10/0x16',
      ' panic+0x10f/0x33b',
      ' do_exit.cold+0x63/0x99',
      ' do_group_exit+0x35/0xb0',
      ' __x64_sys_exit_group+0x1a/0x20',
      ' do_syscall_64+0x5b/0x80',
      ' ? do_syscall_64+0x67/0x80',
      ' entry_SYSCALL_64_after_hwframe+0x63/0xcd',
      'RIP: 0033:0x7f2a8c0bc3f1',
      'RSP: 002b:00007ffd4a1b0c38 EFLAGS: 00000246 ORIG_RAX: 00000000000000e7',
      'RAX: ffffffffffffffda RBX: 00007f2a8c1a5a00 RCX: 00007f2a8c0bc3f1',
      'RDX: 000000000000000b RSI: 00000000000000e7 RDI: 000000000000000b',
      'RBP: 000000000000000b R08: ffffffffffffff80 R09: 0000000000000000',
      'R10: 0000000000000000 R11: 0000000000000246 R12: 00007f2a8c1a5a00',
      'R13: 0000000000000000 R14: 00007f2a8c1a76a0 R15: 0000000000000000',
      ' </TASK>',
      'Kernel Offset: 0x1e000000 from 0xffffffff81000000 (relocation range: 0xffffffff80000000-0xffffffffbfffffff)',
      '---[ end Kernel panic - not syncing: Attempted to kill init! exitcode=0x0000000b ]---',
    ];
    return (
      <div className="h-full bg-black text-white font-mono text-xs p-4 overflow-auto">
        {panicLines.map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
            className={line.startsWith('Kernel panic') ? 'text-red-500 font-bold' : ''}>
            {line || '\u00A0'}
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: panicLines.length * 0.05 }}>
          <button onClick={() => setActiveError(null)} className="mt-4 text-yellow-400 underline text-xs hover:text-yellow-200">
            [Click to dismiss]
          </button>
        </motion.div>
      </div>
    );
  }

  if (activeError === 'gpu') {
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div key={i} className="absolute" style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 200}px`, height: `${2 + Math.random() * 20}px`,
            background: `hsl(${Math.random() * 360}, 100%, 50%)`,
          }}
            animate={{ x: [0, Math.random() * 100 - 50], opacity: [1, 0.3, 1] }}
            transition={{ duration: Math.random() * 2 + 0.5, repeat: Infinity }}
          />
        ))}
        <div className="relative z-10 text-white text-center">
          <p className="text-xl font-bold mb-2">Display driver nvlddmkm stopped responding</p>
          <p className="text-sm opacity-70">and has successfully recovered.</p>
          <button onClick={() => setActiveError(null)} className="mt-6 px-4 py-2 bg-white/20 rounded hover:bg-white/30 text-sm">Dismiss</button>
        </div>
      </div>
    );
  }

  if (activeError === 'memory') {
    return (
      <div className="h-full bg-[#001100] text-[#00ff00] font-mono text-xs p-4 overflow-auto">
        <p className="text-lg mb-4">*** PHYSICAL MEMORY DUMP ***</p>
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
            {`0x${(0x80000000 + i * 0x100).toString(16).toUpperCase()}: ${Array.from({ length: 16 }).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(' ')}`}
          </motion.p>
        ))}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: [0, 1] }} transition={{ delay: 3, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="mt-4 text-yellow-400">Dumping physical memory to disk...</motion.p>
        <button onClick={() => setActiveError(null)} className="mt-4 text-cyan-400 underline hover:text-cyan-200">[Dismiss]</button>
      </div>
    );
  }

  if (activeError === 'boot') {
    return (
      <div className="h-full bg-black text-white font-mono flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mb-6" />
        <p className="text-lg mb-2">Restarting...</p>
        <motion.p animate={{ opacity: [1, 0, 1] }} transition={{ duration: 3, repeat: Infinity }} className="text-sm opacity-50">
          Attempting to recover...
        </motion.p>
        <button onClick={() => setActiveError(null)} className="mt-8 text-xs text-gray-500 underline hover:text-gray-300">[Stop boot loop]</button>
      </div>
    );
  }

  if (activeError === 'glitch') {
    return (
      <div className="h-full bg-black relative overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div key={i} className="absolute" style={{
            left: 0, right: 0,
            top: `${Math.random() * 100}%`,
            height: `${1 + Math.random() * 8}px`,
            background: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
            opacity: 0.7,
          }}
            animate={{ x: [-(Math.random() * 50), Math.random() * 50], opacity: [0, 0.8, 0] }}
            transition={{ duration: Math.random() * 0.5 + 0.1, repeat: Infinity, repeatType: 'mirror' }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div animate={{ skewX: [0, 5, -3, 0], skewY: [0, -2, 3, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }} className="text-white text-center">
            <p className="text-2xl font-bold">SIGNAL LOST</p>
            <p className="text-sm opacity-60 mt-2">No display signal detected</p>
            <button onClick={() => setActiveError(null)} className="mt-6 px-4 py-2 bg-white/20 rounded hover:bg-white/30 text-sm">Fix Display</button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-950 text-white p-6 overflow-auto">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-red-500 mb-2">⚡ Force Error Simulator</h1>
        <p className="text-sm text-gray-400 mb-6">Developer tool to force system errors for testing.</p>

        <div className="space-y-3">
          {errors.map(err => (
            <motion.button key={err.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveError(err.id)}
              className="w-full text-left p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors bg-gray-900">
              <div className="text-base font-semibold">{err.label}</div>
              <div className="text-xs text-gray-500 mt-1">{err.description}</div>
            </motion.button>
          ))}
        </div>

        <p className="text-xs text-gray-600 mt-6 text-center">⚠ These are simulated errors. No actual system damage will occur.</p>
      </div>
    </div>
  );
};

export default ForceApp;
