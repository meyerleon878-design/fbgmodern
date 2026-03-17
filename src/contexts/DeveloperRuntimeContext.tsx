import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ForceErrorMode = 'bsod' | 'kernel' | 'gpu' | 'memory' | 'boot' | 'glitch' | null;

export interface DeveloperSettingsState {
  debugOverlay: boolean;
  verboseLogging: boolean;
  fpsCounter: boolean;
  crashReporting: boolean;
  devMode: boolean;
}

interface CrashReport {
  id: string;
  mode: Exclude<ForceErrorMode, null>;
  createdAt: string;
}

interface DeveloperRuntimeContextType {
  settings: DeveloperSettingsState;
  updateSetting: (key: keyof DeveloperSettingsState, value: boolean) => void;
  activeError: ForceErrorMode;
  triggerError: (mode: Exclude<ForceErrorMode, null>) => void;
  clearError: () => void;
  crashReports: CrashReport[];
  logEvent: (message: string, data?: unknown) => void;
}

const SETTINGS_STORAGE_KEY = 'fbg-developer-settings';
const CRASH_REPORTS_STORAGE_KEY = 'fbg-crash-reports';

const DEFAULT_SETTINGS: DeveloperSettingsState = {
  debugOverlay: false,
  verboseLogging: true,
  fpsCounter: false,
  crashReporting: true,
  devMode: true,
};

const DeveloperRuntimeContext = createContext<DeveloperRuntimeContextType | undefined>(undefined);

export const DeveloperRuntimeProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<DeveloperSettingsState>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const [activeError, setActiveError] = useState<ForceErrorMode>(null);
  const [crashReports, setCrashReports] = useState<CrashReport[]>(() => {
    const saved = localStorage.getItem(CRASH_REPORTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(CRASH_REPORTS_STORAGE_KEY, JSON.stringify(crashReports));
  }, [crashReports]);

  const logEvent = useCallback((message: string, data?: unknown) => {
    if (!settings.verboseLogging) return;
    console.info(`[Developer] ${message}`, data ?? '');
  }, [settings.verboseLogging]);

  const updateSetting = useCallback((key: keyof DeveloperSettingsState, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearError = useCallback(() => {
    setActiveError(null);
    logEvent('Force error cleared');
  }, [logEvent]);

  const triggerError = useCallback((mode: Exclude<ForceErrorMode, null>) => {
    setActiveError(mode);
    logEvent('Force error triggered', { mode });

    if (settings.crashReporting) {
      setCrashReports((prev) => [
        {
          id: `crash-${Date.now()}`,
          mode,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 25));
    }
  }, [logEvent, settings.crashReporting]);

  const value = useMemo(() => ({
    settings,
    updateSetting,
    activeError,
    triggerError,
    clearError,
    crashReports,
    logEvent,
  }), [settings, updateSetting, activeError, triggerError, clearError, crashReports, logEvent]);

  return <DeveloperRuntimeContext.Provider value={value}>{children}</DeveloperRuntimeContext.Provider>;
};

export const useDeveloperRuntime = () => {
  const context = useContext(DeveloperRuntimeContext);
  if (!context) throw new Error('useDeveloperRuntime must be used within DeveloperRuntimeProvider');
  return context;
};
