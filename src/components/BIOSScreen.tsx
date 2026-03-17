import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BIOSScreenProps {
  onExit: () => void;
  onFactoryReset: () => void;
  onDeveloperReset: () => void;
}

// Generate massive boot script - runs fast but takes 4 minutes
const generateBootLines = (): string[] => {
  const lines: string[] = [];
  // Phase 1: Hardware init
  const hwLines = [
    'ide1: BM-DMA at 0xc008-0xc00f, BIOS settings: hdc:pio, hdd:pio',
    'ne2k-pci.c:v1.03 9/22/2003 D. Becker/P. Gortmaker',
    '  http://www.scyld.com/network/ne2k-pci.html',
    'hda: QEMU HARDDISK, ATA DISK drive',
    'ide0 at 0x1f0-0x1f7,0x3f6 on irq 14',
    'hdc: QEMU CD-ROM, ATAPI CD/DVD-ROM drive',
    'ide1 at 0x170-0x177,0x376 on irq 15',
    'ACPI: PCI Interrupt Link [LNKC] enabled at IRQ 10',
    'ACPI: PCI Interrupt 0000:00:03.0[A] -> Link [LNKC] -> GSI 10 (level, low) -> IRQ 10',
    'eth0: RealTek RTL-8029 found at 0xc100, IRQ 10, 52:54:00:12:34:56.',
    'hda: max request size: 512KiB',
    'hda: 180224 sectors (92 MB) w/256KiB Cache, CHS=178/255/63, (U)DMA',
    'hda: set_multmode: status=0x41 { DriveReady Error }',
    'hda: set_multmode: error=0x04 { DriveStatusError }',
    'ide: failed opcode was: 0xef',
    'hda: cache flushes supported',
    ' hda: hda1',
    'hdc: ATAPI 4X CD-ROM drive, 512kB Cache, (U)DMA',
    'Uniform CD-ROM driver Revision: 3.20',
    'Done.',
    'Begin: Mounting root file system... ...',
  ];
  lines.push(...hwLines);

  // Phase 2: Header
  lines.push('', 'FBG_OS Developer System Reset v4.2', '========================================', 'Initializing developer environment...', '');

  // Phase 3: Wiping - generate massive sector lines
  lines.push('Clearing user partition /dev/sda2...');
  for (let i = 0; i < 2000; i++) {
    const sector = Math.floor(Math.random() * 999999);
    const size = (Math.random() * 64).toFixed(1);
    lines.push(`[    ${(i * 0.012).toFixed(3)}] Wiping sector ${sector}... ${size}KB cleared`);
  }

  // Phase 4: Reformatting
  lines.push('', 'Reformatting ext4 on /dev/sda2...');
  for (let i = 0; i < 1500; i++) {
    const block = Math.floor(Math.random() * 65535);
    lines.push(`[   ${(24 + i * 0.008).toFixed(3)}] Writing superblock ${block} to inode table...`);
  }

  // Phase 5: Creating filesystem tree
  lines.push('', 'Creating developer filesystem tree...');
  const dirs = ['/dev', '/proc', '/sys', '/tmp', '/var', '/usr', '/bin', '/sbin', '/etc', '/home', '/opt', '/lib', '/lib64', '/boot', '/mnt', '/srv', '/run'];
  for (const dir of dirs) {
    lines.push(`  mkdir -p ${dir}`);
    for (let j = 0; j < 30; j++) {
      const sub = `${dir}/${Math.random().toString(36).substring(2, 8)}`;
      lines.push(`  mkdir -p ${sub}`);
    }
  }

  // Phase 6: Installing kernel modules
  lines.push('', 'Installing developer kernel modules...');
  const modules = ['fbg-debug', 'fbg-force', 'fbg-devsettings', 'fbg-bsod', 'fbg-panic', 'fbg-gpu-crash', 'fbg-bootloop', 'fbg-memtest', 'fbg-netstack', 'fbg-crypto', 'fbg-vfs', 'fbg-sched', 'fbg-irq', 'fbg-dma', 'fbg-pci', 'fbg-usb', 'fbg-acpi', 'fbg-thermal', 'fbg-power', 'fbg-audit'];
  for (const mod of modules) {
    lines.push(`  Loading ${mod}.ko...`);
    for (let j = 0; j < 20; j++) {
      const addr = `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0')}`;
      lines.push(`    Mapping symbol table at ${addr}`);
    }
    lines.push(`    [OK] ${mod} loaded successfully`);
  }

  // Phase 7: Network config
  lines.push('', 'Configuring developer network stack...');
  for (let i = 0; i < 60; i++) {
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    lines.push(`  Binding interface eth${i % 4} to ${ip}:${1024 + i}`);
  }

  // Phase 8: Debug symbols
  lines.push('', 'Setting up debug symbols...');
  for (let i = 0; i < 120; i++) {
    const sym = Math.random().toString(36).substring(2, 14);
    const addr = `0x${Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0')}`;
    lines.push(`  [${addr}] __${sym}_debug_${i}`);
  }

  // Phase 9: Installing tools
  lines.push('', 'Installing developer CMD...');
  lines.push('  Extracting binaries...');
  for (let i = 0; i < 40; i++) {
    lines.push(`  Installing /usr/bin/fbg-tool-${i}... OK`);
  }
  lines.push('', 'Configuring Force Error Framework...');
  lines.push('  Installing BSOD generator module...');
  lines.push('  Installing kernel panic simulator...');
  lines.push('  Installing GPU crash handler...');
  lines.push('  Installing boot loop trigger...');
  for (let i = 0; i < 80; i++) {
    const hash = Math.random().toString(36).substring(2, 10);
    lines.push(`  Registering error handler ${hash}...`);
  }

  // Phase 10: Removing apps
  lines.push('', 'Removing standard applications...');
  const apps = ['Calculator', 'Calendar', 'Camera', 'Coffee Tracker', 'Compass', 'Ebook Reader', 'Fitness', 'Mail', 'MovieDB', 'Music Player', 'Navigator Maps', 'Notepad+', 'Paint Studio', 'Photo Editor', 'Podcast Hub', 'Radio', 'Retro Arcade', 'Store', 'Subjects', 'Task Runner', 'Terminal Pro', 'Video Player', 'VPN Shield', 'Weather', 'WiFi Analyzer', 'World Clock'];
  for (const app of apps) {
    lines.push(`  Removing ${app}...`);
    for (let j = 0; j < 3; j++) {
      lines.push(`    Deleting /opt/fbg/apps/${app.toLowerCase().replace(/\s+/g, '-')}/lib${j}.so`);
    }
    lines.push(`    [OK] ${app} removed`);
  }

  // Phase 11: Stripping UI
  lines.push('', 'Stripping user interface components...');
  for (let i = 0; i < 80; i++) {
    const comp = Math.random().toString(36).substring(2, 12);
    lines.push(`  Removing UI component ${comp}.dll`);
  }

  // Phase 12: Final config
  lines.push('', 'Installing minimal developer shell...');
  lines.push('Configuring developer authentication (none)...');
  lines.push('Setting boot target to developer.target...');
  lines.push('', 'Rebuilding initramfs...');
  for (let i = 0; i < 100; i++) {
    const pct = ((i / 100) * 100).toFixed(0);
    lines.push(`  [${pct}%] Packing initramfs image...`);
  }
  lines.push('', 'Updating GRUB configuration...');
  lines.push('  Found FBG_OS Developer on /dev/sda2');
  lines.push('  Generating grub.cfg...');
  lines.push('', 'Verifying filesystem integrity...');
  lines.push('  Running fsck on /dev/sda2...');
  for (let i = 0; i < 50; i++) {
    lines.push(`  Pass ${(i % 5) + 1}: Checking inodes ${i * 2048}-${(i + 1) * 2048}`);
  }
  lines.push('  /dev/sda2: clean, 11234/65536 files, 28901/131072 blocks');
  lines.push('');
  lines.push('========================================');
  lines.push('DEVELOPER SYSTEM RESET COMPLETE');
  lines.push('========================================');
  lines.push('');
  lines.push('Rebooting system...');

  return lines;
};

const BOOT_LINES = generateBootLines();

const BIOSScreen = ({ onExit, onFactoryReset, onDeveloperReset }: BIOSScreenProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetProgress, setResetProgress] = useState(0);
  // Developer system state
  const [devPasswordPrompt, setDevPasswordPrompt] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const [devPasswordError, setDevPasswordError] = useState('');
  const [devScriptRunning, setDevScriptRunning] = useState(false);
  const [devScriptLines, setDevScriptLines] = useState<string[]>([]);
  const [devScriptDone, setDevScriptDone] = useState(false);
  const devTermRef = useRef<HTMLDivElement>(null);

  const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Developer System', 'Factory Reset', 'Exit'];

  const tabContents: Record<number, { label: string; value: string; action?: () => void }[]> = {
    0: [
      { label: 'BIOS Version', value: 'FBG BIOS v4.20.69' },
      { label: 'Processor Type', value: 'Intel Core i9-13900K' },
      { label: 'System Memory', value: '32768 MB (DDR5)' },
      { label: 'System Time', value: new Date().toLocaleTimeString() },
      { label: 'System Date', value: new Date().toLocaleDateString() },
      { label: 'Serial Number', value: 'FBG-2024-XXXX-ABCD' },
    ],
    1: [
      { label: 'CPU Configuration', value: '[Press Enter]' },
      { label: 'SATA Configuration', value: '[AHCI Mode]' },
      { label: 'USB Configuration', value: '[Enabled]' },
      { label: 'Onboard Devices', value: '[All Enabled]' },
      { label: 'Power Management', value: '[S3 (STR)]' },
      { label: 'Virtualization', value: '[Enabled]' },
      { label: 'Hyper-Threading', value: '[Enabled]' },
      { label: 'Turbo Boost', value: '[Enabled]' },
    ],
    2: [
      { label: 'Boot Mode', value: '[UEFI]' },
      { label: 'Secure Boot', value: '[Enabled]' },
      { label: 'Boot Priority #1', value: 'NVMe SSD 1TB' },
      { label: 'Boot Priority #2', value: 'USB Drive' },
      { label: 'Boot Priority #3', value: 'Network PXE' },
      { label: 'Fast Boot', value: '[Enabled]' },
      { label: 'Boot Logo', value: '[Enabled]' },
    ],
    3: [
      { label: 'Administrator Password', value: '[Set]' },
      { label: 'User Password', value: '[Not Set]' },
      { label: 'Secure Boot Control', value: '[Enabled]' },
      { label: 'TPM State', value: '[Enabled]' },
      { label: 'TPM Version', value: '2.0' },
      { label: 'Chassis Intrusion', value: '[Disabled]' },
    ],
    4: [
      { label: '🛠️ DEVELOPER SYSTEM', value: '' },
      { label: '', value: '' },
      { label: '>>> Enter Developer System <<<', value: '[Password Required]', action: () => setDevPasswordPrompt(true) },
      { label: '', value: '' },
      { label: 'This will:', value: '' },
      { label: '  - Reset system to developer mode', value: '' },
      { label: '  - Remove all standard applications', value: '' },
      { label: '  - Install: Developer Settings, DEBUG CMD, Force', value: '' },
      { label: '  - Disable login requirement', value: '' },
      { label: '', value: '' },
      { label: '⚠ Admin password required: ****', value: '' },
    ],
    5: [
      { label: '⚠ WARNING: This will erase ALL user data!', value: '' },
      { label: '', value: '' },
      { label: '>>> PERFORM FACTORY RESET <<<', value: '[Press Enter]', action: () => setShowResetConfirm(true) },
      { label: '', value: '' },
      { label: 'This action will:', value: '' },
      { label: '  - Delete all user accounts', value: '' },
      { label: '  - Remove installed applications', value: '' },
      { label: '  - Reset all settings to defaults', value: '' },
      { label: '  - Erase all saved files', value: '' },
    ],
    6: [
      { label: 'Save Changes and Exit', value: '', action: onExit },
      { label: 'Discard Changes and Exit', value: '', action: onExit },
      { label: 'Load Optimized Defaults', value: '' },
    ],
  };

  const currentItems = tabContents[selectedTab] || [];

  // Dev script animation - 4 minutes, lines fly by EXTREMELY fast
  useEffect(() => {
    if (!devScriptRunning) return;
    let lineIndex = 0;
    const totalLines = BOOT_LINES.length;
    // Tick every 16ms (~60fps) for blazing fast scroll, add huge batches per tick
    const tickMs = 16;
    const totalTicks = (240 * 1000) / tickMs; // total ticks in 4 min
    const linesPerTick = Math.max(1, Math.ceil(totalLines / totalTicks));

    const interval = setInterval(() => {
      if (lineIndex < totalLines) {
        const batch = BOOT_LINES.slice(lineIndex, lineIndex + linesPerTick);
        setDevScriptLines(prev => [...prev, ...batch]);
        lineIndex += linesPerTick;
        // Force scroll to bottom every tick
        if (devTermRef.current) {
          devTermRef.current.scrollTop = devTermRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setDevScriptDone(true);
      }
    }, tickMs);

    return () => clearInterval(interval);
  }, [devScriptRunning]);

  // Also scroll on every state update as backup
  useEffect(() => {
    if (devTermRef.current) {
      devTermRef.current.scrollTop = devTermRef.current.scrollHeight;
    }
  }, [devScriptLines]);

  // Auto-reboot when script finishes
  useEffect(() => {
    if (devScriptDone) {
      const timer = setTimeout(() => {
        onDeveloperReset();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [devScriptDone, onDeveloperReset]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showResetConfirm || isResetting || devPasswordPrompt || devScriptRunning || devScriptDone) return;
    if (e.key === 'ArrowRight') { setSelectedTab(prev => Math.min(prev + 1, tabs.length - 1)); setSelectedItem(0); }
    else if (e.key === 'ArrowLeft') { setSelectedTab(prev => Math.max(prev - 1, 0)); setSelectedItem(0); }
    else if (e.key === 'ArrowDown') { setSelectedItem(prev => Math.min(prev + 1, currentItems.length - 1)); }
    else if (e.key === 'ArrowUp') { setSelectedItem(prev => Math.max(prev - 1, 0)); }
    else if (e.key === 'Enter') { const item = currentItems[selectedItem]; if (item?.action) item.action(); }
    else if (e.key === 'Escape') { onExit(); }
  };

  const handleFactoryReset = () => {
    setIsResetting(true);
    setShowResetConfirm(false);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 100 / 60;
      setResetProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        onFactoryReset();
      }
    }, 1000);
  };

  const handleDevPasswordSubmit = () => {
    if (devPassword === '4584') {
      setDevPasswordPrompt(false);
      setDevPassword('');
      setDevPasswordError('');
      setDevScriptRunning(true);
      setDevScriptLines([]);
    } else {
      setDevPasswordError('Incorrect password');
    }
  };


  // Developer password prompt
  if (devPasswordPrompt) {
    return (
      <div className="min-h-screen bg-[#0000aa] text-white font-mono flex items-center justify-center">
        <div className="bg-[#000055] border-2 border-white p-8 max-w-md w-96">
          <h2 className="text-[#ffff00] text-lg font-bold mb-4">🔐 Developer System Access</h2>
          <p className="text-sm mb-4">Enter administrator password to continue:</p>
          <input
            type="password"
            value={devPassword}
            onChange={e => setDevPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleDevPasswordSubmit()}
            className="w-full bg-black text-green-400 border border-gray-500 px-3 py-2 font-mono mb-2 outline-none"
            autoFocus
            placeholder="Password..."
          />
          {devPasswordError && <p className="text-[#ff5555] text-sm mb-2">{devPasswordError}</p>}
          <div className="flex gap-4 mt-4">
            <button onClick={handleDevPasswordSubmit} className="px-4 py-2 bg-[#00aa00] text-white border border-white hover:bg-[#00cc00]">
              Submit
            </button>
            <button onClick={() => { setDevPasswordPrompt(false); setDevPassword(''); setDevPasswordError(''); }}
              className="px-4 py-2 bg-[#aaaaaa] text-[#0000aa] border border-white hover:bg-white">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Developer script running / terminal
  if (devScriptRunning || devScriptDone) {
    return (
      <div className="min-h-screen bg-black text-[#aaaaaa] font-mono p-2 flex flex-col">
        <div ref={devTermRef} className="flex-1 overflow-auto text-xs leading-relaxed">
          {devScriptLines.map((line, i) => (
            <div key={i} className={line.startsWith('[') ? 'text-[#00aa00]' : line.startsWith('===') ? 'text-[#ffff00] font-bold' : line.startsWith('FBG_OS') ? 'text-[#55ffff]' : ''}>{line || '\u00A0'}</div>
          ))}
          {devScriptDone && (
            <div className="flex mt-1 text-[#ffff00] font-bold animate-pulse">
              Rebooting system...
            </div>
          )}
        </div>
        {!devScriptDone && (
          <div className="text-xs text-[#555555] mt-2">
            Developer system reset in progress... ({Math.floor((devScriptLines.length / BOOT_LINES.length) * 100)}%)
          </div>
        )}
      </div>
    );
  }

  if (isResetting) {
    return (
      <div className="min-h-screen bg-[#0000aa] text-white font-mono flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-8">⚠ FACTORY RESET IN PROGRESS ⚠</h1>
        <div className="w-96">
          <div className="text-sm mb-2">Erasing user data and restoring defaults...</div>
          <div className="w-full h-6 bg-[#000066] border border-gray-400">
            <motion.div className="h-full bg-[#00aa00]" style={{ width: `${resetProgress}%` }} />
          </div>
          <div className="text-sm mt-2 text-center">{Math.floor(resetProgress)}%</div>
          <div className="text-xs mt-4 text-[#ff5555] text-center font-bold">DO NOT TURN OFF YOUR COMPUTER</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0000aa] text-white font-mono p-4 focus:outline-none" tabIndex={0} onKeyDown={handleKeyDown} autoFocus>
      <div className="text-center mb-2">
        <h1 className="text-xl font-bold text-[#ffff00]">FBG BIOS Setup Utility</h1>
        <p className="text-xs text-gray-300">Copyright (C) 2024 FBG Corporation</p>
      </div>

      <div className="flex border-b border-gray-400 mb-4 flex-wrap">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => { setSelectedTab(i); setSelectedItem(0); }}
            className={`px-3 py-1 text-sm ${
              i === 4 ? (selectedTab === i ? 'bg-[#aa8800] text-white font-bold' : 'text-[#ffaa00] hover:bg-[#886600]') :
              i === 5 ? (selectedTab === i ? 'bg-[#aa0000] text-white font-bold' : 'text-[#ff5555] hover:bg-[#880000]') :
              selectedTab === i ? 'bg-[#aaaaaa] text-[#0000aa] font-bold' : 'text-white hover:bg-[#000088]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {currentItems.map((item, i) => (
          <div
            key={i}
            onClick={() => { setSelectedItem(i); if (item.action) item.action(); }}
            className={`flex justify-between py-1 px-2 cursor-pointer ${
              selectedItem === i ? 'bg-[#aaaaaa] text-[#0000aa]' : ''
            } ${item.action ? 'text-[#ffff00] font-bold' : ''} ${
              selectedTab === 5 && i === 0 ? 'text-[#ff5555] font-bold' : ''
            }`}
          >
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-xs text-gray-300 flex justify-between">
        <span>←→ Select Tab | ↑↓ Select Item | Enter: Select | Esc: Exit</span>
        <span>F9: Load Defaults | F10: Save & Exit</span>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0000aa] border-2 border-white p-6 max-w-md">
            <h2 className="text-[#ffff00] text-lg font-bold mb-4">⚠ WARNING: Factory Reset</h2>
            <p className="mb-2">This will erase ALL user data including:</p>
            <ul className="text-[#ff5555] mb-4 list-disc pl-5">
              <li>User accounts and passwords</li>
              <li>Installed applications</li>
              <li>Theme preferences</li>
              <li>All saved files</li>
            </ul>
            <p className="text-[#ffff00] font-bold mb-4">Are you sure? This cannot be undone!</p>
            <div className="flex gap-4">
              <button onClick={handleFactoryReset} className="px-4 py-2 bg-[#aa0000] text-white border border-white hover:bg-[#ff0000]">
                YES - Factory Reset
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 bg-[#aaaaaa] text-[#0000aa] border border-white hover:bg-white">
                NO - Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BIOSScreen;
