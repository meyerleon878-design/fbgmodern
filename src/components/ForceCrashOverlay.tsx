import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wrench } from 'lucide-react';
import { type ForceErrorMode } from '@/contexts/DeveloperRuntimeContext';

interface ForceCrashOverlayProps {
  mode: ForceErrorMode;
  onClear: () => void;
}

const KERNEL_PANIC_LINES = [
  'Kernel panic - not syncing: Attempted to kill init! exitcode=0x0000000b',
  'CPU: 0 PID: 1 Comm: init Not tainted 6.1.0-fbg-dev #1',
  'Hardware name: FBG Corporation / Developer Board',
  'Call Trace:',
  ' dump_stack_lvl+0x49/0x63',
  ' panic+0x10f/0x33b',
  ' do_exit.cold+0x63/0x99',
  ' entry_SYSCALL_64_after_hwframe+0x63/0xcd',
  '---[ end Kernel panic ]---',
];

const ForceCrashOverlay = ({ mode, onClear }: ForceCrashOverlayProps) => {
  const dumpLines = useMemo(() => Array.from({ length: 28 }, (_, index) => {
    const address = `0x${(0x80000000 + index * 0x100).toString(16).toUpperCase()}`;
    const bytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(' ');
    return `${address}: ${bytes}`;
  }), [mode]);

  if (!mode) return null;

  if (mode === 'bsod') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] flex flex-col justify-center px-8 text-primary-foreground bg-primary">
        <div className="text-7xl mb-6">:(</div>
        <h1 className="text-2xl font-semibold max-w-4xl">Your FBG_OS session ran into a problem and needs to restart.</h1>
        <p className="mt-6 text-sm opacity-90">Stop code: CRITICAL_PROCESS_DIED</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-8 w-fit rounded-lg border border-primary-foreground/40 px-4 py-2 text-sm font-medium">
          <RefreshCw className="inline w-4 h-4 mr-2" /> Restart desktop
        </button>
      </motion.div>
    );
  }

  if (mode === 'kernel') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] bg-foreground text-background p-4 font-mono text-xs overflow-auto">
        {KERNEL_PANIC_LINES.map((line, index) => <div key={index}>{line}</div>)}
        <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-lg border border-background/20 px-4 py-2 text-xs">
          <RefreshCw className="inline w-4 h-4 mr-2" /> Reboot system
        </button>
      </motion.div>
    );
  }

  if (mode === 'memory') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] bg-card text-foreground p-4 font-mono text-xs overflow-auto">
        <p className="text-lg mb-4 text-primary">*** PHYSICAL MEMORY DUMP ***</p>
        {dumpLines.map((line, index) => <p key={index}>{line}</p>)}
        <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-lg border border-border px-4 py-2 text-xs bg-background">
          <RefreshCw className="inline w-4 h-4 mr-2" /> Restart desktop
        </button>
      </motion.div>
    );
  }

  if (mode === 'boot') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] bg-background text-foreground flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent mb-6" />
        <h1 className="text-2xl font-semibold">Restarting…</h1>
        <p className="mt-2 text-sm text-muted-foreground">The system is stuck in a boot loop.</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-8 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Force reboot
        </button>
      </motion.div>
    );
  }

  if (mode === 'gpu') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] bg-background overflow-hidden">
        {Array.from({ length: 48 }).map((_, index) => (
          <motion.div
            key={index}
            className={`absolute left-0 right-0 ${index % 3 === 0 ? 'bg-primary/70' : index % 3 === 1 ? 'bg-accent/70' : 'bg-destructive/70'}`}
            style={{ top: `${(index / 48) * 100}%`, height: `${1 + (index % 6)}vh` }}
            animate={{ x: [-(index % 15), (index % 21) - 10, 0], opacity: [0.3, 0.85, 0.45] }}
            transition={{ duration: 0.22 + (index % 5) * 0.05, repeat: Infinity }}
          />
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-foreground">
          <h1 className="text-3xl font-bold">Display driver crashed</h1>
          <p className="mt-2 text-sm text-muted-foreground">Video output recovery required.</p>
          <button type="button" onClick={onClear} className="mt-8 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Wrench className="inline w-4 h-4 mr-2" /> Recover display
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[120] bg-background overflow-hidden">
      {Array.from({ length: 80 }).map((_, index) => (
        <motion.div
          key={index}
          className={`absolute left-0 right-0 ${index % 2 === 0 ? 'bg-primary/60' : 'bg-accent/60'}`}
          style={{ top: `${(index / 80) * 100}%`, height: `${0.5 + (index % 4)}vh` }}
          animate={{ x: [0, (index % 11) * 6 - 30, 0], opacity: [0.1, 0.9, 0.15] }}
          transition={{ duration: 0.18 + (index % 5) * 0.03, repeat: Infinity }}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-foreground">
        <h1 className="text-4xl font-black tracking-[0.2em]">SIGNAL LOST</h1>
        <p className="mt-3 text-sm text-muted-foreground">Severe display corruption detected.</p>
        <button type="button" onClick={onClear} className="mt-8 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Wrench className="inline w-4 h-4 mr-2" /> Restore signal
        </button>
      </div>
    </motion.div>
  );
};

export default ForceCrashOverlay;
