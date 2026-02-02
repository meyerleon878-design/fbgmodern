import { motion } from 'framer-motion';
import { Monitor, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';

const themes: { id: ThemeMode; name: string; description: string; preview: string }[] = [
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Classic green-on-black hacker aesthetic with scanlines and glow effects',
    preview: 'linear-gradient(135deg, #001100 0%, #003300 50%, #001100 100%)',
  },
  {
    id: 'windows11',
    name: 'Windows 11',
    description: 'Modern blue Windows 11 theme with clean design and fluent effects',
    preview: 'linear-gradient(135deg, #0078D4 0%, #106EBE 50%, #005A9E 100%)',
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

      <div className="grid grid-cols-2 gap-4">
        {themes.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme(t.id)}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              theme === t.id
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            {/* Theme Preview */}
            <div
              className="w-full h-24 rounded-lg mb-3 flex items-center justify-center"
              style={{ background: t.preview }}
            >
              <div className="w-16 h-10 bg-white/20 rounded border border-white/30 backdrop-blur" />
            </div>

            {/* Theme Info */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
              </div>
              {theme === t.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          💡 Tip: Your theme preference is saved automatically and will persist across sessions.
        </p>
      </div>
    </div>
  );
};

export default Themes;
