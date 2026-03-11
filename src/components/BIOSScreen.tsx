import { useState } from 'react';
import { motion } from 'framer-motion';

interface BIOSScreenProps {
  onExit: () => void;
  onFactoryReset: () => void;
}

const BIOSScreen = ({ onExit, onFactoryReset }: BIOSScreenProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetProgress, setResetProgress] = useState(0);

  const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Factory Reset', 'Exit'];

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
    5: [
      { label: 'Save Changes and Exit', value: '', action: onExit },
      { label: 'Discard Changes and Exit', value: '', action: onExit },
      { label: 'Load Optimized Defaults', value: '' },
    ],
  };

  const currentItems = tabContents[selectedTab] || [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showResetConfirm || isResetting) return;
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

      <div className="flex border-b border-gray-400 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => { setSelectedTab(i); setSelectedItem(0); }}
            className={`px-4 py-1 text-sm ${
              i === 4 ? (selectedTab === i ? 'bg-[#aa0000] text-white font-bold' : 'text-[#ff5555] hover:bg-[#880000]') :
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
              selectedTab === 4 && i === 0 ? 'text-[#ff5555] font-bold' : ''
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
