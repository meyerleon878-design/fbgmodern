import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store as StoreIcon, Download, Check, Globe, MessageCircle, Search, Star, Calculator, FileText, Music, Video, Image, Calendar, Clock, Mail, Camera, Gamepad2, Map, Cloud, Palette, BookOpen, Terminal, Shield, Wifi, Zap, Coffee, Heart, Compass, Film, Radio, Headphones } from 'lucide-react';

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
  onInstallApp: (appId: string) => void;
  installedApps: string[];
}

const Store = ({ onInstallApp, installedApps }: StoreProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    {
      id: 'calculator-pro',
      name: 'Calculator Pro',
      description: 'Advanced calculator with scientific functions, unit conversion, and history.',
      icon: '🧮',
      iconComponent: <Calculator className="w-8 h-8 text-orange-400" />,
      rating: 4.6,
      downloads: '8M+',
      category: 'Utilities',
      component: 'CalculatorPro',
    },
    {
      id: 'notepad-plus',
      name: 'Notepad++',
      description: 'Feature-rich text editor with syntax highlighting and code folding.',
      icon: '📝',
      iconComponent: <FileText className="w-8 h-8 text-yellow-400" />,
      rating: 4.7,
      downloads: '15M+',
      category: 'Productivity',
      component: 'NotepadPlus',
    },
    {
      id: 'music-player',
      name: 'Harmony Music',
      description: 'Beautiful music player with equalizer, playlists, and streaming support.',
      icon: '🎵',
      iconComponent: <Music className="w-8 h-8 text-pink-400" />,
      rating: 4.4,
      downloads: '3M+',
      category: 'Entertainment',
      component: 'MusicPlayer',
    },
    {
      id: 'video-player',
      name: 'CineMax Player',
      description: 'HD video player supporting all formats with subtitle and streaming features.',
      icon: '🎬',
      iconComponent: <Video className="w-8 h-8 text-red-400" />,
      rating: 4.5,
      downloads: '7M+',
      category: 'Entertainment',
      component: 'VideoPlayer',
    },
    {
      id: 'photo-editor',
      name: 'PixelCraft',
      description: 'Professional photo editing with filters, layers, and AI enhancement.',
      icon: '🖼️',
      iconComponent: <Image className="w-8 h-8 text-purple-400" />,
      rating: 4.3,
      downloads: '4M+',
      category: 'Creativity',
      component: 'PhotoEditor',
    },
    {
      id: 'calendar-app',
      name: 'CalendarX',
      description: 'Smart calendar with event scheduling, reminders, and sync across devices.',
      icon: '📅',
      iconComponent: <Calendar className="w-8 h-8 text-teal-400" />,
      rating: 4.6,
      downloads: '6M+',
      category: 'Productivity',
      component: 'CalendarApp',
    },
    {
      id: 'clock-world',
      name: 'World Clock',
      description: 'Multi-timezone clock with alarms, timers, and stopwatch functionality.',
      icon: '⏰',
      iconComponent: <Clock className="w-8 h-8 text-amber-400" />,
      rating: 4.2,
      downloads: '2M+',
      category: 'Utilities',
      component: 'WorldClock',
    },
    {
      id: 'mail-client',
      name: 'MailBox Pro',
      description: 'Unified inbox for all your email accounts with smart filtering.',
      icon: '📧',
      iconComponent: <Mail className="w-8 h-8 text-blue-500" />,
      rating: 4.4,
      downloads: '9M+',
      category: 'Communication',
      component: 'MailClient',
    },
    {
      id: 'camera-app',
      name: 'SnapShot Camera',
      description: 'Camera app with filters, portrait mode, and pro manual controls.',
      icon: '📷',
      iconComponent: <Camera className="w-8 h-8 text-gray-400" />,
      rating: 4.1,
      downloads: '5M+',
      category: 'Creativity',
      component: 'CameraApp',
    },
    {
      id: 'retro-games',
      name: 'Retro Arcade',
      description: 'Collection of classic arcade games including Snake, Tetris, and Pong.',
      icon: '🎮',
      iconComponent: <Gamepad2 className="w-8 h-8 text-indigo-400" />,
      rating: 4.7,
      downloads: '12M+',
      category: 'Games',
      component: 'RetroArcade',
    },
    {
      id: 'maps-nav',
      name: 'Navigator Maps',
      description: 'GPS navigation with real-time traffic, offline maps, and street view.',
      icon: '🗺️',
      iconComponent: <Map className="w-8 h-8 text-green-500" />,
      rating: 4.5,
      downloads: '8M+',
      category: 'Utilities',
      component: 'NavigatorMaps',
    },
    {
      id: 'weather-app',
      name: 'SkyWatch Weather',
      description: 'Accurate weather forecasts with radar, hourly updates, and severe alerts.',
      icon: '🌤️',
      iconComponent: <Cloud className="w-8 h-8 text-sky-400" />,
      rating: 4.3,
      downloads: '6M+',
      category: 'Utilities',
      component: 'WeatherApp',
    },
    {
      id: 'paint-studio',
      name: 'Paint Studio',
      description: 'Digital art canvas with brushes, layers, and vector drawing tools.',
      icon: '🎨',
      iconComponent: <Palette className="w-8 h-8 text-rose-400" />,
      rating: 4.4,
      downloads: '3M+',
      category: 'Creativity',
      component: 'PaintStudio',
    },
    {
      id: 'ebook-reader',
      name: 'BookWorm Reader',
      description: 'E-book reader supporting PDF, EPUB, and MOBI with annotations.',
      icon: '📚',
      iconComponent: <BookOpen className="w-8 h-8 text-amber-600" />,
      rating: 4.6,
      downloads: '4M+',
      category: 'Productivity',
      component: 'EbookReader',
    },
    {
      id: 'terminal-pro',
      name: 'Terminal Pro',
      description: 'Advanced terminal emulator with tabs, themes, and SSH support.',
      icon: '💻',
      iconComponent: <Terminal className="w-8 h-8 text-emerald-400" />,
      rating: 4.8,
      downloads: '2M+',
      category: 'Development',
      component: 'TerminalPro',
    },
    {
      id: 'vpn-shield',
      name: 'VPN Shield',
      description: 'Secure VPN with 100+ server locations and military-grade encryption.',
      icon: '🛡️',
      iconComponent: <Shield className="w-8 h-8 text-blue-600" />,
      rating: 4.5,
      downloads: '7M+',
      category: 'Security',
      component: 'VPNShield',
    },
    {
      id: 'wifi-analyzer',
      name: 'WiFi Analyzer',
      description: 'Network analysis tool to optimize WiFi signal and find best channels.',
      icon: '📶',
      iconComponent: <Wifi className="w-8 h-8 text-cyan-400" />,
      rating: 4.2,
      downloads: '1M+',
      category: 'Utilities',
      component: 'WifiAnalyzer',
    },
    {
      id: 'task-runner',
      name: 'Task Turbo',
      description: 'Automation tool for scheduling tasks and creating custom workflows.',
      icon: '⚡',
      iconComponent: <Zap className="w-8 h-8 text-yellow-500" />,
      rating: 4.4,
      downloads: '800K+',
      category: 'Productivity',
      component: 'TaskRunner',
    },
    {
      id: 'coffee-tracker',
      name: 'Caffeine Log',
      description: 'Track your daily coffee intake and monitor caffeine levels.',
      icon: '☕',
      iconComponent: <Coffee className="w-8 h-8 text-amber-700" />,
      rating: 4.0,
      downloads: '500K+',
      category: 'Health',
      component: 'CoffeeTracker',
    },
    {
      id: 'fitness-app',
      name: 'FitPulse',
      description: 'Workout tracker with exercise library, progress charts, and goals.',
      icon: '❤️',
      iconComponent: <Heart className="w-8 h-8 text-red-500" />,
      rating: 4.6,
      downloads: '5M+',
      category: 'Health',
      component: 'FitnessApp',
    },
    {
      id: 'compass-app',
      name: 'True North',
      description: 'Digital compass with altitude, coordinates, and navigation tools.',
      icon: '🧭',
      iconComponent: <Compass className="w-8 h-8 text-orange-500" />,
      rating: 4.1,
      downloads: '1M+',
      category: 'Utilities',
      component: 'CompassApp',
    },
    {
      id: 'movie-db',
      name: 'CinemaDB',
      description: 'Browse movies and TV shows with ratings, trailers, and watchlists.',
      icon: '🎞️',
      iconComponent: <Film className="w-8 h-8 text-violet-400" />,
      rating: 4.5,
      downloads: '3M+',
      category: 'Entertainment',
      component: 'MovieDB',
    },
    {
      id: 'radio-app',
      name: 'Global Radio',
      description: 'Stream 50,000+ radio stations from around the world.',
      icon: '📻',
      iconComponent: <Radio className="w-8 h-8 text-lime-500" />,
      rating: 4.3,
      downloads: '2M+',
      category: 'Entertainment',
      component: 'RadioApp',
    },
    {
      id: 'podcast-app',
      name: 'PodcastHub',
      description: 'Discover and subscribe to podcasts with offline downloading.',
      icon: '🎧',
      iconComponent: <Headphones className="w-8 h-8 text-fuchsia-400" />,
      rating: 4.7,
      downloads: '4M+',
      category: 'Entertainment',
      component: 'PodcastHub',
    },
  ];

  const categories = ['All', ...new Set(apps.map(app => app.category))];

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <p className="text-xs text-muted-foreground">{apps.length} apps available</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          {selectedCategory === 'All' ? 'ALL APPS' : selectedCategory.toUpperCase()} ({filteredApps.length})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredApps.map((app) => {
            const isInstalled = installedApps.includes(app.id);

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-card border border-border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  {/* App Icon */}
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    {app.iconComponent}
                  </div>

                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{app.name}</h3>
                        <p className="text-xs text-muted-foreground">{app.category}</p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !isInstalled && onInstallApp(app.id)}
                        disabled={isInstalled}
                        className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 flex-shrink-0 ${
                          isInstalled
                            ? 'bg-muted text-muted-foreground cursor-default'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {isInstalled ? (
                          <>
                            <Check className="w-3 h-3" />
                            Installed
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            Install
                          </>
                        )}
                      </motion.button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {app.description}
                    </p>

                    <div className="flex items-center gap-3 mt-1">
                      {renderStars(app.rating)}
                      <span className="text-xs text-muted-foreground">{app.downloads}</span>
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
