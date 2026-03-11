import { motion } from 'framer-motion';
import { Monitor, Check, Sun, Moon, Code, Sparkles, Zap, Snowflake, Ghost, Eclipse, Palette, Flower, Sunset, Waves, TreePine, Tv } from 'lucide-react';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';

const themes: { id: ThemeMode; name: string; description: string; preview: string; icon: typeof Sun }[] = [
  { id: 'matrix', name: 'Matrix', description: 'Classic green-on-black hacker aesthetic with scanlines', preview: 'linear-gradient(135deg, #001100 0%, #003300 50%, #001100 100%)', icon: Code },
  { id: 'windows11', name: 'Windows 11 Light', description: 'Modern clean design with fluent effects', preview: 'linear-gradient(135deg, #0078D4 0%, #106EBE 50%, #005A9E 100%)', icon: Sun },
  { id: 'windows11-dark', name: 'Windows 11 Dark', description: 'Dark mode for comfortable nighttime use', preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', icon: Moon },
  { id: 'aero2010', name: '2010 Aero', description: 'Frutiger Aero glass effects inspired by Vista/7', preview: 'linear-gradient(135deg, #1e5799 0%, #2989d8 50%, #7db9e8 100%)', icon: Sparkles },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon pink and cyan on dark — futuristic vibes', preview: 'linear-gradient(135deg, #0a0a1a 0%, #ff006e 50%, #00f5d4 100%)', icon: Zap },
  { id: 'nord', name: 'Nord', description: 'Arctic blue palette — clean and minimal', preview: 'linear-gradient(135deg, #2e3440 0%, #5e81ac 50%, #88c0d0 100%)', icon: Snowflake },
  { id: 'dracula', name: 'Dracula', description: 'Dark purple theme beloved by developers', preview: 'linear-gradient(135deg, #282a36 0%, #bd93f9 50%, #ff79c6 100%)', icon: Ghost },
  { id: 'solarized', name: 'Solarized', description: 'Warm precision colors designed for readability', preview: 'linear-gradient(135deg, #002b36 0%, #268bd2 50%, #b58900 100%)', icon: Eclipse },
  { id: 'monokai', name: 'Monokai', description: 'Vibrant code editor classic — bold and sharp', preview: 'linear-gradient(135deg, #272822 0%, #f92672 50%, #a6e22e 100%)', icon: Palette },
  { id: 'rosepine', name: 'Rosé Pine', description: 'Gentle and elegant with muted rose tones', preview: 'linear-gradient(135deg, #191724 0%, #c4a7e7 50%, #ebbcba 100%)', icon: Flower },
  { id: 'sunset', name: 'Sunset', description: 'Warm orange-to-purple gradient — golden hour feel', preview: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 50%, #ff8a00 100%)', icon: Sunset },
  { id: 'ocean', name: 'Ocean', description: 'Deep sea blues and aqua — calming and deep', preview: 'linear-gradient(135deg, #0a1628 0%, #1565c0 50%, #00bcd4 100%)', icon: Waves },
  { id: 'forest', name: 'Forest', description: 'Earth tones with lush green — natural and grounded', preview: 'linear-gradient(135deg, #1b2a1b 0%, #2e7d32 50%, #8bc34a 100%)', icon: TreePine },
  { id: 'retro', name: 'Retro CRT', description: 'Amber-on-black old-school terminal feel', preview: 'linear-gradient(135deg, #0a0800 0%, #ff8c00 50%, #4a3000 100%)', icon: Tv },
];

const Themes = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <Monitor className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Themes</h1>
          <p className="text-sm text-muted-foreground">Personalize your desktop experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {themes.map((t) => {
          const Icon = t.icon;
          return (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTheme(t.id)}
              className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                theme === t.id ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ background: t.preview }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                    {theme === t.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{t.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          💡 Tip: Your theme preference is saved automatically and persists across sessions.
        </p>
      </div>
    </div>
  );
};

export default Themes;
