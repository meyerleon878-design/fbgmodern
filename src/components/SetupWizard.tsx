import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { User, Lock, ChevronRight, Loader2, Check } from 'lucide-react';

interface SetupWizardProps {
  onComplete: () => void;
}

type SetupStep = 'welcome' | 'region' | 'account' | 'installing' | 'done';

const INSTALL_DURATION = 300; // 5 minutes in seconds

const installSteps = [
  'Preparing system files...',
  'Configuring hardware drivers...',
  'Setting up display adapters...',
  'Installing system components...',
  'Configuring network services...',
  'Setting up audio subsystem...',
  'Installing default applications...',
  'Configuring File Explorer...',
  'Setting up Minecraft integration...',
  'Installing security modules...',
  'Configuring firewall...',
  'Setting up user interface...',
  'Installing theme engine...',
  'Configuring taskbar...',
  'Setting up start menu...',
  'Installing system fonts...',
  'Configuring input devices...',
  'Setting up power management...',
  'Installing update service...',
  'Configuring system restore...',
  'Setting up scheduled tasks...',
  'Installing Store framework...',
  'Configuring app runtime...',
  'Setting up notification service...',
  'Installing CMD terminal...',
  'Configuring environment variables...',
  'Setting up file associations...',
  'Installing codec packs...',
  'Configuring display settings...',
  'Finalizing installation...',
];

const SetupWizard = ({ onComplete }: SetupWizardProps) => {
  const { setUser } = useUser();
  const [step, setStep] = useState<SetupStep>('welcome');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [region, setRegion] = useState('United States');
  const [installProgress, setInstallProgress] = useState(0);
  const [currentInstallStep, setCurrentInstallStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (step !== 'installing') return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        const progress = Math.min((next / INSTALL_DURATION) * 100, 100);
        setInstallProgress(progress);
        setCurrentInstallStep(Math.min(
          Math.floor((next / INSTALL_DURATION) * installSteps.length),
          installSteps.length - 1
        ));
        
        if (next >= INSTALL_DURATION) {
          clearInterval(interval);
          setTimeout(() => setStep('done'), 1000);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const handleCreateAccount = () => {
    setError('');
    if (!username.trim()) { setError('Username is required'); return; }
    if (username.length < 3) { setError('Username must be at least 3 characters'); return; }
    if (!password) { setError('Password is required'); return; }
    if (password.length < 4) { setError('Password must be at least 4 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    
    setStep('installing');
  };

  const handleFinish = () => {
    setUser({
      username: username.trim(),
      password,
      displayName: displayName.trim() || username.trim(),
      createdAt: new Date().toISOString(),
    });
    onComplete();
  };

  const formatTime = (seconds: number) => {
    const remaining = Math.max(INSTALL_DURATION - seconds, 0);
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0078d4] via-[#0063b1] to-[#004c8a] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center text-white max-w-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-8xl mb-8"
            >
              🖥️
            </motion.div>
            <h1 className="text-4xl font-light mb-4">Welcome to FBG_OS</h1>
            <p className="text-lg text-white/70 mb-8">Let's set up your computer. This will only take a few minutes.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('region')}
              className="px-8 py-3 bg-white text-[#0078d4] rounded font-semibold flex items-center gap-2 mx-auto hover:bg-white/90"
            >
              Get Started <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {step === 'region' && (
          <motion.div
            key="region"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-lg shadow-2xl p-8 w-[500px] max-w-[90vw]"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Select your region</h2>
            <p className="text-sm text-gray-500 mb-6">Choose your country or region</p>
            
            <div className="space-y-1 max-h-60 overflow-auto border rounded p-2 mb-6">
              {['United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Netherlands', 'Canada', 'Australia', 'Brazil', 'India', 'South Korea', 'Sweden'].map(r => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    region === r ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setStep('account')}
                className="px-6 py-2 bg-[#0078d4] text-white rounded hover:bg-[#006abc] font-medium"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 'account' && (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-lg shadow-2xl p-8 w-[500px] max-w-[90vw]"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create your account</h2>
            <p className="text-sm text-gray-500 mb-6">Set up a username and password for this PC</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-gray-800 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Username *</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-800 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-gray-800 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-800 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep('region')}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleCreateAccount}
                className="px-6 py-2 bg-[#0078d4] text-white rounded hover:bg-[#006abc] font-medium"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        )}

        {step === 'installing' && (
          <motion.div
            key="installing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-white max-w-2xl w-full px-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-8"
            >
              <Loader2 className="w-16 h-16" />
            </motion.div>

            <h1 className="text-3xl font-light mb-2">Installing FBG_OS</h1>
            <p className="text-white/60 mb-8">This might take a while. Your PC will restart a few times.</p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full mb-4">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${installProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex justify-between text-sm text-white/70 mb-8">
              <span>{Math.floor(installProgress)}%</span>
              <span>Time remaining: {formatTime(elapsedSeconds)}</span>
            </div>

            {/* Current step */}
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-white"
                />
                <span className="text-sm text-white/80">{installSteps[currentInstallStep]}</span>
              </div>
              
              {/* Recent steps */}
              <div className="mt-3 space-y-1">
                {installSteps.slice(Math.max(0, currentInstallStep - 3), currentInstallStep).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-white/40">
                    <Check className="w-3 h-3" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/40 mt-8">Don't turn off your PC</p>
          </motion.div>
        )}

        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-3xl font-light mb-2">All set!</h1>
            <p className="text-white/70 mb-2">Welcome, {displayName || username}!</p>
            <p className="text-white/50 text-sm mb-8">FBG_OS has been installed successfully.</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="px-8 py-3 bg-white text-[#0078d4] rounded font-semibold hover:bg-white/90"
            >
              Start using FBG_OS
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SetupWizard;
