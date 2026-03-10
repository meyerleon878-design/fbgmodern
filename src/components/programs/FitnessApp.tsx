import { useState } from 'react';
import { Heart, Flame, Footprints, Timer } from 'lucide-react';

const exercises = [
  { name: 'Push-ups', icon: '💪', sets: 3, reps: 15 },
  { name: 'Squats', icon: '🦵', sets: 3, reps: 20 },
  { name: 'Plank', icon: '🧘', sets: 3, reps: 60 },
  { name: 'Lunges', icon: '🏃', sets: 3, reps: 12 },
  { name: 'Burpees', icon: '⚡', sets: 3, reps: 10 },
  { name: 'Sit-ups', icon: '🔥', sets: 3, reps: 20 },
];

const FitnessApp = () => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<'workout' | 'stats'>('workout');

  const toggle = (name: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const progress = (completed.size / exercises.length) * 100;

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex border-b border-border">
        <button onClick={() => setTab('workout')} className={`flex-1 py-3 text-sm ${tab === 'workout' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Workout</button>
        <button onClick={() => setTab('stats')} className={`flex-1 py-3 text-sm ${tab === 'stats' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Stats</button>
      </div>

      {tab === 'workout' ? (
        <div className="flex-1 overflow-auto p-4">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground font-medium">Today's Progress</span>
              <span className="text-primary">{completed.size}/{exercises.length}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Exercises */}
          {exercises.map(ex => (
            <button
              key={ex.name}
              onClick={() => toggle(ex.name)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 border ${
                completed.has(ex.name) ? 'border-primary/30 bg-primary/5' : 'border-border hover:bg-muted'
              }`}
            >
              <span className="text-2xl">{ex.icon}</span>
              <div className="flex-1 text-left">
                <div className={`text-sm font-medium ${completed.has(ex.name) ? 'text-primary line-through' : 'text-foreground'}`}>{ex.name}</div>
                <div className="text-xs text-muted-foreground">{ex.sets} sets × {ex.reps} {ex.name === 'Plank' ? 'sec' : 'reps'}</div>
              </div>
              {completed.has(ex.name) && <span className="text-primary">✓</span>}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <div className="text-2xl font-semibold text-foreground">{completed.size * 45}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <Timer className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <div className="text-2xl font-semibold text-foreground">{completed.size * 8}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <div className="text-2xl font-semibold text-foreground">128</div>
              <div className="text-xs text-muted-foreground">Avg BPM</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <Footprints className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <div className="text-2xl font-semibold text-foreground">5,230</div>
              <div className="text-xs text-muted-foreground">Steps</div>
            </div>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-foreground">🔥 {completed.size >= 4 ? 'Great workout!' : 'Keep going!'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessApp;
