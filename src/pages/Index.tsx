import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginScreen from '@/components/LoginScreen';
import Desktop from '@/components/Desktop';
import MatrixRain from '@/components/MatrixRain';
import BIOSScreen from '@/components/BIOSScreen';
import SetupWizard from '@/components/SetupWizard';
import { useUser } from '@/contexts/UserContext';

type SystemState = 'boot' | 'bios' | 'setup' | 'setup-dev' | 'login' | 'desktop' | 'shutdown';

const Index = () => {
  const { user, clearUser, isSetupComplete } = useUser();
  const [systemState, setSystemState] = useState<SystemState>('boot');
  const [f2Pressed, setF2Pressed] = useState(false);

  // F2 listener during boot
  useEffect(() => {
    if (systemState !== 'boot') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setF2Pressed(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [systemState]);

  // Boot sequence
  useEffect(() => {
    if (systemState !== 'boot') return;
    const timer = setTimeout(() => {
      if (f2Pressed) {
        setSystemState('bios');
      } else if (!isSetupComplete) {
        setSystemState('setup');
      } else if (user?.isDeveloper) {
        setSystemState('desktop');
      } else {
        setSystemState('login');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [systemState, f2Pressed, isSetupComplete, user]);

  const handleFactoryReset = () => {
    clearUser();
    setSystemState('setup');
  };

  const handleDeveloperReset = () => {
    clearUser();
    setSystemState('setup-dev');
  };

  // Boot sequence
  if (systemState === 'boot') {
    return (
      <motion.div className="min-h-screen bg-background flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <MatrixRain />
        <div className="relative z-10 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-6">
            <div className="text-6xl mb-4">🖥️</div>
            <h1 className="text-3xl font-bold text-foreground text-glow mb-2">FBG_OS</h1>
            <p className="text-muted-foreground">Matrix Edition v11.0</p>
          </motion.div>
          <motion.div initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 1.5, delay: 0.5 }} className="h-1 bg-primary rounded-full mx-auto" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 text-sm text-muted-foreground">
            {f2Pressed ? 'Entering BIOS Setup...' : 'Press F2 repeatedly to enter BIOS'}
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (systemState === 'bios') {
    return <BIOSScreen onExit={() => setSystemState(isSetupComplete ? (user?.isDeveloper ? 'desktop' : 'login') : 'setup')} onFactoryReset={handleFactoryReset} onDeveloperReset={handleDeveloperReset} />;
  }

  if (systemState === 'setup') {
    return <SetupWizard onComplete={() => setSystemState('login')} />;
  }

  if (systemState === 'setup-dev') {
    return <SetupWizard onComplete={() => setSystemState('desktop')} developerMode />;
  }

  if (systemState === 'shutdown') {
    return (
      <motion.div className="min-h-screen bg-background flex flex-col items-center justify-center" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2, delay: 1 }}>
        <MatrixRain />
        <div className="relative z-10 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-foreground text-xl text-glow">Shutting down...</p>
          <p className="text-muted-foreground text-sm mt-2">Goodbye.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {systemState === 'login' && (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginScreen onLogin={() => setSystemState('desktop')} />
        </motion.div>
      )}
      {systemState === 'desktop' && (
        <motion.div key="desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Desktop onLogout={() => setSystemState(user?.isDeveloper ? 'boot' : 'login')} onShutdown={() => setSystemState('shutdown')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
