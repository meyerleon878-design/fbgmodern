import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginScreen from '@/components/LoginScreen';
import Desktop from '@/components/Desktop';
import MatrixRain from '@/components/MatrixRain';

type SystemState = 'boot' | 'login' | 'desktop' | 'shutdown';

const Index = () => {
  const [systemState, setSystemState] = useState<SystemState>('boot');

  // Boot sequence
  if (systemState === 'boot') {
    return (
      <motion.div
        className="min-h-screen bg-background flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onAnimationComplete={() => {
          setTimeout(() => setSystemState('login'), 2000);
        }}
      >
        <MatrixRain />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="text-6xl mb-4">🖥️</div>
            <h1 className="text-3xl font-bold text-foreground text-glow mb-2">
              FBG_OS
            </h1>
            <p className="text-muted-foreground">Matrix Edition v11.0</p>
          </motion.div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-1 bg-primary rounded-full mx-auto"
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Initializing system...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Shutdown screen
  if (systemState === 'shutdown') {
    return (
      <motion.div
        className="min-h-screen bg-background flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <MatrixRain />
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-foreground text-xl text-glow">Shutting down...</p>
          <p className="text-muted-foreground text-sm mt-2">Goodbye.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {systemState === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoginScreen onLogin={() => setSystemState('desktop')} />
        </motion.div>
      )}

      {systemState === 'desktop' && (
        <motion.div
          key="desktop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Desktop
            onLogout={() => setSystemState('login')}
            onShutdown={() => setSystemState('shutdown')}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Index;
