import { motion } from 'framer-motion';
import { Monitor, Check, Sun, Moon, Code } from 'lucide-react';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';

const themes: { id: ThemeMode; name: string; description: string; preview: string; icon: typeof Sun }[] = [
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Classic green-on-black hacker aesthetic with scanlines and glow effects',
    preview: 'linear-gradient(135deg, #001100 0%, #003300 50%, #001100 100%)',
    icon: Code,
  },
  {
    id: 'windows11',
    name: 'Windows 11 Light',
    description: 'Modern Windows 11 theme with clean design and fluent effects',
    preview: 'linear-gradient(135deg, #0078D4 0%, #106EBE 50%, #005A9E 100%)',
    icon: Sun,
  },
  {
    id: 'windows11-dark',
    name: 'Windows 11 Dark',
    description: 'Dark mode Windows 11 theme for comfortable nighttime use',
    preview: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    icon: Moon,
  },
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

      <div className="grid grid-cols-1 gap-4">
        {themes.map((t) => {
          const Icon = t.icon;
          return (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTheme(t.id)}
              className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                theme === t.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Theme Preview */}
                <div
                  className="w-24 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: t.preview }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Theme Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{t.name}</h3>
                    {theme === t.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          💡 Tip: Your theme preference is saved automatically and will persist across sessions, including the login screen.
        </p>
      </div>
    </div>
  );
};

export default Themes;
