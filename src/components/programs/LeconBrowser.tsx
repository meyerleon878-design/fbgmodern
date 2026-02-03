import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCw, Home, Download, Check, X } from 'lucide-react';
import { useDownloads } from '@/contexts/DownloadsContext';

interface Tab {
  id: string;
  title: string;
  url: string;
}

interface DownloadableProgram {
  id: string;
  name: string;
  description: string;
  version: string;
  size: string;
  icon: string;
  fileName: string;
  fileContent: string;
}

const DOWNLOADABLE_PROGRAMS: DownloadableProgram[] = [
  {
    id: 'notepad-plus',
    name: 'Notepad++',
    description: 'Advanced text editor with syntax highlighting',
    version: '8.5.6',
    size: '4.2 MB',
    icon: '📝',
    fileName: 'notepad_plus_installer.exe',
    fileContent: '=== NOTEPAD++ INSTALLER ===\n\nVersion: 8.5.6\nSize: 4.2 MB\nStatus: Ready to install\n\n[Run this file to install Notepad++]',
  },
  {
    id: 'vlc-player',
    name: 'VLC Media Player',
    description: 'Free and open-source multimedia player',
    version: '3.0.18',
    size: '42 MB',
    icon: '🎬',
    fileName: 'vlc_setup.exe',
    fileContent: '=== VLC MEDIA PLAYER INSTALLER ===\n\nVersion: 3.0.18\nSize: 42 MB\nStatus: Ready to install\n\n[Run this file to install VLC]',
  },
  {
    id: '7zip',
    name: '7-Zip',
    description: 'High compression file archiver',
    version: '23.01',
    size: '1.5 MB',
    icon: '📦',
    fileName: '7zip_installer.exe',
    fileContent: '=== 7-ZIP INSTALLER ===\n\nVersion: 23.01\nSize: 1.5 MB\nStatus: Ready to install\n\n[Run this file to install 7-Zip]',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Voice, video, and text chat for gamers',
    version: '1.0.9023',
    size: '85 MB',
    icon: '💬',
    fileName: 'discord_setup.exe',
    fileContent: '=== DISCORD INSTALLER ===\n\nVersion: 1.0.9023\nSize: 85 MB\nStatus: Ready to install\n\n[Run this file to install Discord]',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Digital music streaming service',
    version: '1.2.14',
    size: '120 MB',
    icon: '🎵',
    fileName: 'spotify_installer.exe',
    fileContent: '=== SPOTIFY INSTALLER ===\n\nVersion: 1.2.14\nSize: 120 MB\nStatus: Ready to install\n\n[Run this file to install Spotify]',
  },
  {
    id: 'steam',
    name: 'Steam',
    description: 'Digital game distribution platform',
    version: '2.10.91.91',
    size: '3.1 MB',
    icon: '🎮',
    fileName: 'steam_setup.exe',
    fileContent: '=== STEAM INSTALLER ===\n\nVersion: 2.10.91.91\nSize: 3.1 MB (Bootstrapper)\nStatus: Ready to install\n\n[Run this file to install Steam]',
  },
];

const DownloadsPage = () => {
  const { addDownload, downloads } = useDownloads();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const handleDownload = (program: DownloadableProgram) => {
    if (downloading || completed.has(program.id)) return;
    
    setDownloading(program.id);
    
    // Simulate download
    setTimeout(() => {
      addDownload({
        name: program.fileName,
        type: 'file',
        content: program.fileContent,
      });
      setDownloading(null);
      setCompleted(prev => new Set([...prev, program.id]));
    }, 1500);
  };

  const isDownloaded = (id: string) => {
    return completed.has(id) || downloads.some(d => 
      DOWNLOADABLE_PROGRAMS.find(p => p.id === id)?.fileName === d.name
    );
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-900 to-indigo-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Download className="w-10 h-10" />
            DOWNLOADS
          </h1>
          <p className="text-blue-200">Free software downloads - Fast & Secure</p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOWNLOADABLE_PROGRAMS.map(program => (
            <motion.div
              key={program.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{program.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{program.name}</h3>
                  <p className="text-sm text-blue-200 mb-2">{program.description}</p>
                  <div className="flex items-center gap-4 text-xs text-blue-300">
                    <span>v{program.version}</span>
                    <span>{program.size}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload(program)}
                  disabled={downloading === program.id || isDownloaded(program.id)}
                  className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isDownloaded(program.id)
                      ? 'bg-green-600 text-white cursor-default'
                      : downloading === program.id
                      ? 'bg-yellow-600 text-white cursor-wait'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isDownloaded(program.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      Downloaded
                    </>
                  ) : downloading === program.id ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RotateCw className="w-4 h-4" />
                      </motion.div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-blue-300 text-sm">
          <p>All downloads are virus-free and verified ✓</p>
          <p className="mt-1">Downloaded files appear in your Downloads folder</p>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => (
  <div className="min-h-full bg-gradient-to-b from-slate-800 to-slate-900 p-8">
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-5xl font-bold text-white mb-4">Lecon Browser</h1>
      <p className="text-slate-400 mb-8">Fast. Secure. Private.</p>
      <div className="bg-white/10 rounded-2xl p-8 backdrop-blur border border-white/10">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-white text-sm">Secure Browsing</div>
          </button>
          <button className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-white text-sm">Fast Loading</div>
          </button>
          <button className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="text-white text-sm">Ad Blocker</div>
          </button>
          <button className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="text-3xl mb-2">📥</div>
            <div className="text-white text-sm">Downloads</div>
          </button>
        </div>
        <p className="text-slate-500 text-sm">
          Type "downloads" in the address bar to access the downloads page
        </p>
      </div>
    </div>
  </div>
);

const ErrorPage = ({ url }: { url: string }) => (
  <div className="min-h-full bg-slate-900 flex items-center justify-center p-8">
    <div className="text-center">
      <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">This site can't be reached</h1>
      <p className="text-slate-400 mb-4">{url} refused to connect.</p>
      <p className="text-slate-500 text-sm">Try typing "downloads" to visit the downloads page</p>
    </div>
  </div>
);

const LeconBrowser = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'lecon://home' },
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [urlInput, setUrlInput] = useState('');

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  const navigateTo = (url: string) => {
    let finalUrl = url.toLowerCase().trim();
    let title = 'New Tab';

    if (finalUrl === 'downloads' || finalUrl === 'lecon://downloads') {
      finalUrl = 'lecon://downloads';
      title = 'Downloads';
    } else if (finalUrl === '' || finalUrl === 'home' || finalUrl === 'lecon://home') {
      finalUrl = 'lecon://home';
      title = 'New Tab';
    } else {
      if (!finalUrl.includes('://')) {
        finalUrl = 'https://' + finalUrl;
      }
      title = finalUrl;
    }

    setTabs(prev =>
      prev.map(t =>
        t.id === activeTab ? { ...t, url: finalUrl, title } : t
      )
    );
    setUrlInput(finalUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  const addTab = () => {
    const newId = Date.now().toString();
    setTabs(prev => [...prev, { id: newId, title: 'New Tab', url: 'lecon://home' }]);
    setActiveTab(newId);
    setUrlInput('');
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const renderPage = () => {
    if (currentTab.url === 'lecon://home') {
      return <HomePage />;
    }
    if (currentTab.url === 'lecon://downloads') {
      return <DownloadsPage />;
    }
    return <ErrorPage url={currentTab.url} />;
  };

  return (
    <div className="h-full flex flex-col bg-slate-800">
      {/* Tab Bar */}
      <div className="flex items-center bg-slate-900 border-b border-slate-700 h-9">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setUrlInput(tab.url);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 min-w-[120px] max-w-[200px] cursor-pointer border-r border-slate-700 ${
                activeTab === tab.id ? 'bg-slate-800' : 'bg-slate-900 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xs text-white truncate flex-1">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addTab}
          className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          +
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-2 bg-slate-800 border-b border-slate-700">
        <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400">
          <ArrowRight className="w-4 h-4" />
        </button>
        <button 
          onClick={() => navigateTo(currentTab.url)}
          className="p-1.5 rounded hover:bg-slate-700 text-slate-400"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigateTo('lecon://home')}
          className="p-1.5 rounded hover:bg-slate-700 text-slate-400"
        >
          <Home className="w-4 h-4" />
        </button>

        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search or enter URL"
            className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigateTo('downloads')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded flex items-center gap-1"
        >
          <Download className="w-3 h-3" />
          DOWNLOADS
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default LeconBrowser;
