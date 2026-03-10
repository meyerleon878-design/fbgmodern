import { useState } from 'react';
import { Zap, Play, Pause, Trash2, Plus } from 'lucide-react';

interface Task {
  id: number;
  name: string;
  schedule: string;
  status: 'active' | 'paused' | 'completed';
  lastRun: string;
}

const TaskRunner = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Clear temp files', schedule: 'Every hour', status: 'active', lastRun: '10:30 AM' },
    { id: 2, name: 'Backup documents', schedule: 'Daily', status: 'active', lastRun: '8:00 AM' },
    { id: 3, name: 'Check for updates', schedule: 'Weekly', status: 'paused', lastRun: 'Mon 9:00 AM' },
    { id: 4, name: 'Defrag disk', schedule: 'Monthly', status: 'completed', lastRun: 'Mar 1' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), name: newTask, schedule: 'Manual', status: 'active', lastRun: 'Never' }]);
    setNewTask('');
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Task Turbo</h2>
        </div>
        <div className="flex gap-2">
          <input
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="New task name..."
            className="flex-1 px-3 py-2 bg-input border border-border rounded text-foreground text-sm outline-none"
          />
          <button onClick={addTask} className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                task.status === 'active' ? 'bg-green-500' : task.status === 'paused' ? 'bg-yellow-500' : 'bg-muted-foreground'
              }`} />
              <div>
                <div className="text-sm font-medium text-foreground">{task.name}</div>
                <div className="text-xs text-muted-foreground">{task.schedule} • Last: {task.lastRun}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleTask(task.id)} className="p-1.5 hover:bg-muted rounded">
                {task.status === 'active' ? <Pause className="w-4 h-4 text-muted-foreground" /> : <Play className="w-4 h-4 text-muted-foreground" />}
              </button>
              <button onClick={() => deleteTask(task.id)} className="p-1.5 hover:bg-destructive/20 rounded">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskRunner;
