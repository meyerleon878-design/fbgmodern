import { useState } from 'react';
import { Coffee, Plus, Minus } from 'lucide-react';

const CoffeeTracker = () => {
  const [cups, setCups] = useState(0);
  const [goal] = useState(4);
  const [log, setLog] = useState<{ time: string; type: string }[]>([]);

  const types = ['☕ Espresso', '🥤 Latte', '🫖 Cappuccino', '🧋 Iced Coffee'];

  const addCoffee = (type: string) => {
    setCups(c => c + 1);
    setLog(prev => [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type }, ...prev]);
  };

  const caffeine = cups * 95; // mg per cup average
  const progress = Math.min((cups / goal) * 100, 100);

  return (
    <div className="h-full flex flex-col bg-card p-4 overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <Coffee className="w-6 h-6 text-amber-700" />
        <h2 className="text-lg font-semibold text-foreground">Caffeine Log</h2>
      </div>

      {/* Stats */}
      <div className="text-center mb-6">
        <div className="text-5xl font-light text-foreground mb-1">{cups}</div>
        <div className="text-sm text-muted-foreground">cups today</div>

        {/* Progress ring */}
        <div className="w-32 h-2 bg-muted rounded-full mx-auto mt-3">
          <div className={`h-full rounded-full transition-all ${cups > goal ? 'bg-red-500' : 'bg-amber-600'}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">{cups}/{goal} daily goal</div>

        <div className="mt-3 text-sm">
          <span className="text-foreground font-medium">{caffeine}mg</span>
          <span className="text-muted-foreground"> caffeine</span>
          {caffeine > 400 && <span className="text-red-500 text-xs ml-2">⚠ High</span>}
        </div>
      </div>

      {/* Add buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {types.map(t => (
          <button
            key={t}
            onClick={() => addCoffee(t)}
            className="p-3 bg-muted rounded-lg text-sm text-foreground hover:bg-muted/80 transition-colors"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">TODAY'S LOG</h3>
          {log.map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-foreground">{entry.type}</span>
              <span className="text-xs text-muted-foreground">{entry.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoffeeTracker;
