import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { User, Lock, ChevronRight, Loader2, Check, FileText, Key } from 'lucide-react';

interface SetupWizardProps {
  onComplete: () => void;
  developerMode?: boolean;
}

type SetupStep = 'welcome' | 'license' | 'productkey' | 'region' | 'account' | 'installing' | 'done';
type DevSetupStep = 'dev-installing' | 'dev-done';

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

const LICENSE_TEXT = `FBG_OS END-USER LICENSE AGREEMENT (EULA)

IMPORTANT - READ CAREFULLY: This End-User License Agreement ("EULA") is a legal agreement between you (either an individual or a single entity) and FBG Corporation for the FBG_OS operating system software product, which includes computer software and may include associated media, printed materials, and "online" or electronic documentation ("SOFTWARE PRODUCT").

By installing, copying, or otherwise using the SOFTWARE PRODUCT, you agree to be bound by the terms of this EULA. If you do not agree to the terms of this EULA, do not install or use the SOFTWARE PRODUCT.

1. GRANT OF LICENSE
FBG Corporation grants you a non-exclusive, non-transferable license to install and use the SOFTWARE PRODUCT on a single computer. You may make one backup copy of the SOFTWARE PRODUCT for archival purposes.

2. RESTRICTIONS
You may not reverse engineer, decompile, or disassemble the SOFTWARE PRODUCT, except and only to the extent that such activity is expressly permitted by applicable law.

3. INTELLECTUAL PROPERTY
The SOFTWARE PRODUCT is protected by copyright laws and international copyright treaties, as well as other intellectual property laws and treaties. The SOFTWARE PRODUCT is licensed, not sold.

4. NO WARRANTIES
FBG Corporation expressly disclaims any warranty for the SOFTWARE PRODUCT. The SOFTWARE PRODUCT is provided "AS IS" without any express or implied warranty of any kind.

5. LIMITATION OF LIABILITY
In no event shall FBG Corporation be liable for any damages (including, without limitation, lost profits, business interruption, or lost information) arising out of the use of or inability to use the SOFTWARE PRODUCT.

6. TERMINATION
Without prejudice to any other rights, FBG Corporation may terminate this EULA if you fail to comply with the terms and conditions of this EULA.

7. GOVERNING LAW
This EULA shall be governed by the laws of the jurisdiction in which FBG Corporation is headquartered.

8. ENTIRE AGREEMENT
This EULA constitutes the entire agreement between you and FBG Corporation relating to the SOFTWARE PRODUCT and supersedes all prior or contemporaneous understandings.

9. DATA COLLECTION
FBG_OS may collect anonymous usage data to improve system performance and user experience. No personally identifiable information is collected without explicit consent.

10. UPDATES
FBG Corporation may provide updates to the SOFTWARE PRODUCT from time to time. These updates may be installed automatically and are subject to this EULA.

Copyright (C) 2024 FBG Corporation. All rights reserved.
FBG_OS is a trademark of FBG Corporation.`;

const generateProductKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segments = [];
  for (let i = 0; i < 5; i++) {
    let seg = '';
    for (let j = 0; j < 5; j++) {
      seg += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(seg);
  }
  return segments.join('-');
};

const SetupWizard = ({ onComplete, developerMode = false }: SetupWizardProps) => {
  const { setUser } = useUser();
  const [step, setStep] = useState<SetupStep | DevSetupStep>(developerMode ? 'dev-installing' : 'welcome');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [region, setRegion] = useState('United States');
  const [installProgress, setInstallProgress] = useState(0);
  const [currentInstallStep, setCurrentInstallStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const [productKey, setProductKey] = useState(['', '', '', '', '']);
  const [validProductKey] = useState(generateProductKey());
  const [productKeyError, setProductKeyError] = useState('');

  // Dev mode install - quick, just 10 seconds
  useEffect(() => {
    if (step !== 'dev-installing') return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        setInstallProgress(Math.min((next / 10) * 100, 100));
        if (next >= 10) {
          clearInterval(interval);
          setTimeout(() => setStep('dev-done'), 500);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Normal install
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
    setElapsedSeconds(0);
    setInstallProgress(0);
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

  const handleDevFinish = () => {
    setUser({
      username: 'developer',
      password: '',
      displayName: 'Developer',
      createdAt: new Date().toISOString(),
      isDeveloper: true,
    });
    onComplete();
  };

  const handleProductKeyNext = () => {
    const entered = productKey.join('-');
    // Accept any key that has 5 segments of 5 chars each
    if (productKey.some(seg => seg.length !== 5)) {
      setProductKeyError('Please enter a valid product key (5 groups of 5 characters)');
      return;
    }
    setProductKeyError('');
    setStep('region');
  };

  const updateProductKeySegment = (index: number, value: string) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    const newKey = [...productKey];
    newKey[index] = clean;
    setProductKey(newKey);
    // Auto-focus next segment
    if (clean.length === 5 && index < 4) {
      const next = document.getElementById(`pk-${index + 1}`);
      next?.focus();
    }
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
        {/* Developer mode installing */}
        {step === 'dev-installing' && (
          <motion.div key="dev-installing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center text-white max-w-lg">
            <h1 className="text-3xl font-light mb-4">Developer System Setup</h1>
            <p className="text-white/60 mb-6">Installing developer tools... Skipping standard setup.</p>
            <div className="w-full h-1.5 bg-white/20 rounded-full mb-4">
              <motion.div className="h-full bg-yellow-400 rounded-full" style={{ width: `${installProgress}%` }} />
            </div>
            <p className="text-sm text-white/50">{Math.floor(installProgress)}%</p>
          </motion.div>
        )}

        {step === 'dev-done' && (
          <motion.div key="dev-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center text-white">
            <div className="text-6xl mb-6">🛠️</div>
            <h1 className="text-3xl font-light mb-2">Developer Mode Ready</h1>
            <p className="text-white/60 mb-6">System installed in developer configuration.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleDevFinish}
              className="px-8 py-3 bg-yellow-500 text-black rounded font-semibold hover:bg-yellow-400">
              Enter Developer System
            </motion.button>
          </motion.div>
        )}

        {step === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            className="text-center text-white max-w-lg">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-8xl mb-8">
              🖥️
            </motion.div>
            <h1 className="text-4xl font-light mb-4">Welcome to FBG_OS</h1>
            <p className="text-lg text-white/70 mb-8">Let's set up your computer. This will only take a few minutes.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setStep('license')}
              className="px-8 py-3 bg-white text-[#0078d4] rounded font-semibold flex items-center gap-2 mx-auto hover:bg-white/90">
              Get Started <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {step === 'license' && (
          <motion.div key="license" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-lg shadow-2xl p-8 w-[600px] max-w-[90vw]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#0078d4]" />
              <h2 className="text-2xl font-semibold text-gray-800">License Agreement</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Please read the following license agreement carefully.</p>
            
            <div className="h-64 overflow-auto border border-gray-300 rounded p-4 mb-4 bg-gray-50">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{LICENSE_TEXT}</pre>
            </div>

            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input type="checkbox" checked={licenseAccepted} onChange={e => setLicenseAccepted(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]" />
              <span className="text-sm text-gray-700">I accept the terms of the License Agreement</span>
            </label>

            <div className="flex justify-between">
              <button onClick={() => setStep('welcome')} className="px-6 py-2 text-gray-600 hover:text-gray-800">Back</button>
              <button onClick={() => setStep('productkey')} disabled={!licenseAccepted}
                className="px-6 py-2 bg-[#0078d4] text-white rounded hover:bg-[#006abc] font-medium disabled:opacity-40 disabled:cursor-not-allowed">
                I Agree
              </button>
            </div>
          </motion.div>
        )}

        {step === 'productkey' && (
          <motion.div key="productkey" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-lg shadow-2xl p-8 w-[550px] max-w-[90vw]">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-[#0078d4]" />
              <h2 className="text-2xl font-semibold text-gray-800">Product Key</h2>
            </div>
            <p className="text-sm text-gray-500 mb-2">Enter your FBG_OS product key to continue.</p>
            <p className="text-xs text-gray-400 mb-6">Your product key is located on the Certificate of Authenticity or in your confirmation email.</p>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6">
              <p className="text-xs text-blue-700 mb-1">💡 Your product key:</p>
              <p className="text-sm font-mono font-bold text-blue-900 tracking-wider">{validProductKey}</p>
            </div>

            <div className="flex items-center gap-2 justify-center mb-4">
              {productKey.map((seg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    id={`pk-${i}`}
                    type="text"
                    value={seg}
                    onChange={e => updateProductKeySegment(i, e.target.value)}
                    maxLength={5}
                    className="w-16 text-center px-1 py-2.5 border border-gray-300 rounded text-gray-800 font-mono text-sm tracking-widest uppercase focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none"
                    placeholder="XXXXX"
                  />
                  {i < 4 && <span className="text-gray-400 font-bold">-</span>}
                </div>
              ))}
            </div>

            {productKeyError && <p className="text-red-500 text-sm text-center mb-4">{productKeyError}</p>}

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep('license')} className="px-6 py-2 text-gray-600 hover:text-gray-800">Back</button>
              <button onClick={handleProductKeyNext}
                className="px-6 py-2 bg-[#0078d4] text-white rounded hover:bg-[#006abc] font-medium">
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 'region' && (
          <motion.div key="region" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-lg shadow-2xl p-8 w-[500px] max-w-[90vw]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Select your region</h2>
            <p className="text-sm text-gray-500 mb-6">Choose your country or region</p>
            <div className="space-y-1 max-h-60 overflow-auto border rounded p-2 mb-6">
              {['United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Netherlands', 'Canada', 'Australia', 'Brazil', 'India', 'South Korea', 'Sweden'].map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${region === r ? 'bg-[#0078d4] text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep('productkey')} className="px-6 py-2 text-gray-600 hover:text-gray-800">Back</button>
              <button onClick={() => setStep('account')} className="px-6 py-2 bg-[#0078d4] text-white rounded hover:bg-[#006abc] font-medium">Next</button>
            </div>
          </motion.div>
        )}

        {step === 'account' && (
          <motion.div key="account" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-lg shadow-2xl p-8 w-[500px] max-w-[90vw]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create your account</h2>
            <p className="text-sm text-gray-500 mb-6">Set up a username and password for this PC</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-gray-800 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Username *</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-800 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-gray-800 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password *</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded text-gray-800 focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] outline-none" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep('region')} className="px-6 py-2 text-gray-600 hover:text-gray-800">Back</button>
              <button onClick={handleCreateAccount} className="px-6 py-2 bg-[#0078d4] text-white rounded hover:bg-[#006abc] font-medium">Create Account</button>
            </div>
          </motion.div>
        )}

        {step === 'installing' && (
          <motion.div key="installing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center text-white max-w-2xl w-full px-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 mx-auto mb-8">
              <Loader2 className="w-16 h-16" />
            </motion.div>
            <h1 className="text-3xl font-light mb-2">Installing FBG_OS</h1>
            <p className="text-white/60 mb-8">This might take a while. Your PC will restart a few times.</p>
            <div className="w-full h-1.5 bg-white/20 rounded-full mb-4">
              <motion.div className="h-full bg-white rounded-full" style={{ width: `${installProgress}%` }} transition={{ duration: 0.5 }} />
            </div>
            <div className="flex justify-between text-sm text-white/70 mb-8">
              <span>{Math.floor(installProgress)}%</span>
              <span>Time remaining: {formatTime(elapsedSeconds)}</span>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-white" />
                <span className="text-sm text-white/80">{installSteps[currentInstallStep]}</span>
              </div>
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
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center text-white">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-light mb-2">All set!</h1>
            <p className="text-white/70 mb-2">Welcome, {displayName || username}!</p>
            <p className="text-white/50 text-sm mb-8">FBG_OS has been installed successfully.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleFinish}
              className="px-8 py-3 bg-white text-[#0078d4] rounded font-semibold hover:bg-white/90">
              Start using FBG_OS
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SetupWizard;
