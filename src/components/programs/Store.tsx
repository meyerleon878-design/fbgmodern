import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store as StoreIcon, Download, Check, Globe, MessageCircle, Search, Star } from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconComponent: React.ReactNode;
  rating: number;
  downloads: string;
  category: string;
  component: string;
}

interface StoreProps {
  onInstallApp: (appId: string, name: string, icon: string, component: string) => void;
  installedApps: string[];
}

const Store = ({ onInstallApp, installedApps }: StoreProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const apps: App[] = [
    {
      id: 'rachiro-browser',
      name: 'Rachiro Browser',
      description: 'A fast and secure web browser with built-in privacy features and ad blocking.',
      icon: '🌐',
      iconComponent: <Globe className="w-8 h-8 text-blue-400" />,
      rating: 4.5,
      downloads: '10M+',
      category: 'Utilities',
      component: 'RachiroBrowser',
    },
    {
      id: 'chattigs',
      name: 'Chattigs',
      description: 'Modern chat application for secure messaging with friends and colleagues.',
      icon: '💬',
      iconComponent: <MessageCircle className="w-8 h-8 text-green-400" />,
      rating: 4.8,
      downloads: '5M+',
      category: 'Communication',
      component: 'Chattigs',
    },
  ];

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <StoreIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">FBG Store</h1>
            <p className="text-xs text-muted-foreground">Download apps for your system</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">AVAILABLE APPS</h2>
        
        <div className="space-y-3">
          {filteredApps.map((app) => {
            const isInstalled = installedApps.includes(app.id);

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-start gap-4">
                  {/* App Icon */}
                  <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    {app.iconComponent}
                  </div>

                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{app.name}</h3>
                        <p className="text-xs text-muted-foreground">{app.category}</p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !isInstalled && onInstallApp(app.id, app.name, app.icon, app.component)}
                        disabled={isInstalled}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                          isInstalled
                            ? 'bg-muted text-muted-foreground cursor-default'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {isInstalled ? (
                          <>
                            <Check className="w-4 h-4" />
                            Installed
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Install
                          </>
                        )}
                      </motion.button>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {app.description}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                      {renderStars(app.rating)}
                      <span className="text-xs text-muted-foreground">{app.downloads} downloads</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No apps found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
