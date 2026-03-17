import { AlertTriangle } from 'lucide-react';
import { useDeveloperRuntime } from '@/contexts/DeveloperRuntimeContext';

const ForceApp = () => {
  const { settings, triggerError, crashReports } = useDeveloperRuntime();

  const errors = [
    { id: 'bsod', label: 'Blue Screen of Death', description: 'Crash the entire desktop into a full-screen stop error.' },
    { id: 'kernel', label: 'Kernel Panic', description: 'Replace the desktop with a fatal kernel error screen.' },
    { id: 'gpu', label: 'GPU Driver Crash', description: 'Break display output until the driver is recovered.' },
    { id: 'memory', label: 'Memory Dump', description: 'Trigger a full-screen memory dump and restart path.' },
    { id: 'boot', label: 'Boot Loop', description: 'Force the session into a reboot loop state.' },
    { id: 'glitch', label: 'Display Glitch', description: 'Corrupt the entire desktop output with signal loss.' },
  ] as const;

  return (
    <div className="h-full bg-background text-foreground p-6 overflow-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-primary" /> Force</h1>
          <p className="text-sm text-muted-foreground mt-1">These faults now hit the whole desktop, not just this window.</p>
        </div>

        {!settings.devMode && (
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Developer Mode is disabled in Developer Settings, so Force is locked.
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {errors.map((error) => (
            <button
              key={error.id}
              type="button"
              onClick={() => triggerError(error.id)}
              disabled={!settings.devMode}
              className="rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="text-base font-semibold">{error.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{error.description}</div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-sm font-medium">Recent crash reports</div>
          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            {crashReports.length === 0 ? (
              <p>No crash reports recorded yet.</p>
            ) : (
              crashReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-3 py-2">
                  <span className="font-medium uppercase text-foreground">{report.mode}</span>
                  <span>{new Date(report.createdAt).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForceApp;
