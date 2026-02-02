import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Star, 
  Shield, 
  Lock,
  Search,
  Plus,
  X
} from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
  content: string;
}

const RachiroBrowser = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'New Tab',
      url: 'rachiro://newtab',
      content: 'newtab',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [urlInput, setUrlInput] = useState('');

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const pages: Record<string, { title: string; content: React.ReactNode }> = {
    'newtab': {
      title: 'New Tab',
      content: (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-card to-background">
          <h1 className="text-4xl font-bold text-foreground mb-2">Rachiro</h1>
          <p className="text-muted-foreground mb-8">Fast. Secure. Private.</p>
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search the web..."
              className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-8">
            {['📧 Email', '📰 News', '🎮 Games', '📺 Videos'].map((item) => (
              <button
                key={item}
                className="px-6 py-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-foreground">{item}</span>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    'fbg': {
      title: 'FBG Systems',
      content: (
        <div className="p-8 bg-background">
          <h1 className="text-3xl font-bold text-foreground mb-4">FBG Systems</h1>
          <p className="text-muted-foreground mb-6">Welcome to FBG Systems - Your trusted partner in surveillance and security solutions.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-bold text-foreground mb-2">🔒 Security</h3>
              <p className="text-sm text-muted-foreground">Advanced security protocols</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-bold text-foreground mb-2">📡 Tracking</h3>
              <p className="text-sm text-muted-foreground">Real-time surveillance systems</p>
            </div>
          </div>
        </div>
      ),
    },
    'error': {
      title: 'Page Not Found',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">The requested page could not be loaded.</p>
        </div>
      ),
    },
  };

  const navigate = (url: string) => {
    let pageName = 'error';
    let title = 'Page Not Found';

    if (url === '' || url === 'rachiro://newtab') {
      pageName = 'newtab';
      title = 'New Tab';
    } else if (url.includes('fbg')) {
      pageName = 'fbg';
      title = 'FBG Systems';
    }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url, title, content: pageName }
          : t
      )
    );
    setUrlInput(url === 'rachiro://newtab' ? '' : url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(urlInput);
  };

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'rachiro://newtab',
      content: 'newtab',
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setUrlInput('');
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    
    if (tabId === activeTabId) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      setActiveTabId(newTabs[newActiveIndex].id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tab Bar */}
      <div className="flex items-center bg-card border-b border-border">
        <div className="flex-1 flex items-center overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setUrlInput(tab.url === 'rachiro://newtab' ? '' : tab.url);
              }}
              className={`flex items-center gap-2 px-4 py-2 border-r border-border cursor-pointer min-w-[140px] max-w-[200px] ${
                tab.id === activeTabId ? 'bg-background' : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <span className="text-xs text-foreground truncate flex-1">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="p-0.5 hover:bg-muted rounded"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addTab} className="p-2 hover:bg-muted">
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-card border-b border-border">
        <button className="p-1.5 hover:bg-muted rounded">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-1.5 hover:bg-muted rounded">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={() => navigate(activeTab.url)} className="p-1.5 hover:bg-muted rounded">
          <RotateCw className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={() => navigate('rachiro://newtab')} className="p-1.5 hover:bg-muted rounded">
          <Home className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* URL Bar */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="flex items-center bg-input border border-border rounded-lg px-3 py-1.5">
            <Lock className="w-3 h-3 text-green-500 mr-2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search or enter URL"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </form>

        <button className="p-1.5 hover:bg-muted rounded">
          <Star className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-1.5 hover:bg-muted rounded">
          <Shield className="w-4 h-4 text-green-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {pages[activeTab.content]?.content || pages['error'].content}
      </div>
    </div>
  );
};

export default RachiroBrowser;
