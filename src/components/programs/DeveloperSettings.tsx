import { useState } from 'react';

const DeveloperSettings = () => {
  const [debugOverlay, setDebugOverlay] = useState(false);
  const [verboseLogging, setVerboseLogging] = useState(true);
  const [fpsCounter, setFpsCounter] = useState(false);
  const [crashReporting, setCrashReporting] = useState(true);
  const [devMode, setDevMode] = useState(true);

  const settings = [
    { label: 'Debug Overlay', desc: 'Show debug info overlay on screen', value: debugOverlay, set: setDebugOverlay },
    { label: 'Verbose Logging', desc: 'Enable detailed system logging', value: verboseLogging, set: setVerboseLogging },
    { label: 'FPS Counter', desc: 'Display frames per second', value: fpsCounter, set: setFpsCounter },
    { label: 'Crash Reporting', desc: 'Send crash reports to dev team', value: crashReporting, set: setCrashReporting },
    { label: 'Developer Mode', desc: 'System is in developer mode', value: devMode, set: setDevMode },
  ];

  return (
    <div className="h-full bg-gray-950 text-white p-6 overflow-auto">
      <h1 className="text-2xl font-bold text-yellow-500 mb-1">🛠️ Developer Settings</h1>
      <p className="text-sm text-gray-500 mb-6">System developer configuration panel</p>

      <div className="space-y-4 max-w-lg">
        {settings.map(s => (
          <div key={s.label} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div>
              <div className="font-medium text-sm">{s.label}</div>
              <div className="text-xs text-gray-500">{s.desc}</div>
            </div>
            <button onClick={() => s.set(!s.value)}
              className={`w-12 h-6 rounded-full transition-colors relative ${s.value ? 'bg-yellow-500' : 'bg-gray-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${s.value ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800 max-w-lg">
        <h3 className="text-sm font-bold text-yellow-500 mb-2">System Info</h3>
        <div className="text-xs text-gray-400 space-y-1">
          <p>Build: FBG_OS-DEV-{Math.floor(Math.random() * 9000 + 1000)}</p>
          <p>Kernel: 6.1.0-fbg-dev</p>
          <p>Mode: Developer</p>
          <p>Apps: Developer Settings, DEBUG CMD, Force</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-6">To exit developer mode, reboot into BIOS and perform a factory reset.</p>
    </div>
  );
};

export default DeveloperSettings;
