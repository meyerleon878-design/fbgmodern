import { Cpu, Gauge, ShieldAlert, TerminalSquare, Wrench } from 'lucide-react';
import { useDeveloperRuntime } from '@/contexts/DeveloperRuntimeContext';

const DeveloperSettings = () => {
  const { settings, updateSetting, crashReports, activeError } = useDeveloperRuntime();

  const settingRows = [
    { key: 'debugOverlay', label: 'Debug Overlay', desc: 'Show live runtime metrics on the desktop' },
    { key: 'verboseLogging', label: 'Verbose Logging', desc: 'Write developer actions to the browser console' },
    { key: 'fpsCounter', label: 'FPS Counter', desc: 'Display live frame rate in the desktop overlay' },
    { key: 'crashReporting', label: 'Crash Reporting', desc: 'Record Force-triggered crashes in the developer log' },
    { key: 'devMode', label: 'Developer Mode', desc: 'Enable Developer System tools like Force and Benchmark' },
  ] as const;

  return (
    <div className="h-full bg-background text-foreground p-6 overflow-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Wrench className="w-6 h-6 text-primary" /> Developer Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">All switches below now control real Developer System behavior.</p>
        </div>

        <div className="space-y-4">
          {settingRows.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
              <div>
                <div className="font-medium text-sm">{setting.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{setting.desc}</div>
              </div>
              <button
                type="button"
                aria-pressed={settings[setting.key]}
                onClick={() => updateSetting(setting.key, !settings[setting.key])}
                className={`relative h-7 w-14 rounded-full transition-colors ${settings[setting.key] ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-primary-foreground transition-transform ${settings[setting.key] ? 'translate-x-8' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldAlert className="w-4 h-4 text-primary" /> Crash reports</div>
            <div className="mt-3 text-2xl font-bold">{crashReports.length}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Gauge className="w-4 h-4 text-primary" /> FPS counter</div>
            <div className="mt-3 text-2xl font-bold">{settings.fpsCounter ? 'ON' : 'OFF'}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><TerminalSquare className="w-4 h-4 text-primary" /> Logging</div>
            <div className="mt-3 text-2xl font-bold">{settings.verboseLogging ? 'LIVE' : 'MUTE'}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Cpu className="w-4 h-4 text-primary" /> Active fault</div>
            <div className="mt-3 text-lg font-bold uppercase">{activeError ?? 'None'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettings;
