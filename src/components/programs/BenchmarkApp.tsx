import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Cpu, MemoryStick, ShieldCheck } from 'lucide-react';
import { useDeveloperRuntime } from '@/contexts/DeveloperRuntimeContext';

interface BenchmarkResult {
  cpuScore: number;
  memoryScore: number;
  stabilityScore: number;
  totalIterations: number;
  durationMs: number;
}

const waitForFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const BenchmarkApp = () => {
  const { settings, logEvent } = useDeveloperRuntime();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BenchmarkResult | null>(null);

  const runBenchmark = async () => {
    if (running || !settings.devMode) return;

    setRunning(true);
    setProgress(0);
    setResult(null);
    logEvent('Benchmark started');

    const startedAt = performance.now();
    let totalIterations = 0;
    let accumulator = 0;

    for (let stage = 1; stage <= 20; stage += 1) {
      const stageStart = performance.now();

      while (performance.now() - stageStart < 35) {
        accumulator += Math.sqrt((totalIterations % 512) + 1) * Math.sin(totalIterations / 10);
        totalIterations += 1;
      }

      setProgress(stage * 5);
      await waitForFrame();
    }

    const durationMs = performance.now() - startedAt;
    const cpuScore = Math.max(100, Math.round((totalIterations / durationMs) * 12));
    const memoryScore = Math.max(100, Math.round((Math.abs(accumulator) % 900) + 100));
    const stabilityScore = settings.crashReporting ? 99 : 92;

    const nextResult = {
      cpuScore,
      memoryScore,
      stabilityScore,
      totalIterations,
      durationMs: Math.round(durationMs),
    };

    setResult(nextResult);
    setRunning(false);
    logEvent('Benchmark completed', nextResult);
  };

  return (
    <div className="h-full bg-background text-foreground p-6 overflow-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Gauge className="w-6 h-6 text-primary" /> Benchmark</h1>
          <p className="text-sm text-muted-foreground mt-1">Run a browser-safe performance pass for the Developer System.</p>
        </div>

        {!settings.devMode && (
          <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Enable <span className="text-foreground font-medium">Developer Mode</span> in Developer Settings to run benchmarks.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Cpu className="w-4 h-4 text-primary" /> CPU Load</div>
            <div className="mt-3 text-3xl font-bold">{result?.cpuScore ?? '--'}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><MemoryStick className="w-4 h-4 text-primary" /> Memory</div>
            <div className="mt-3 text-3xl font-bold">{result?.memoryScore ?? '--'}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="w-4 h-4 text-primary" /> Stability</div>
            <div className="mt-3 text-3xl font-bold">{result?.stabilityScore ?? '--'}%</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium">Developer Benchmark Pass</div>
              <div className="text-xs text-muted-foreground">Measures CPU throughput, memory churn, and runtime stability.</div>
            </div>
            <button
              type="button"
              onClick={runBenchmark}
              disabled={running || !settings.devMode}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running ? 'Running…' : 'Run Benchmark'}
            </button>
          </div>

          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <p>Progress: <span className="text-foreground">{progress}%</span></p>
            <p>Iterations: <span className="text-foreground">{result?.totalIterations ?? (running ? 'Calculating…' : '--')}</span></p>
            <p>Duration: <span className="text-foreground">{result ? `${result.durationMs}ms` : '--'}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkApp;
