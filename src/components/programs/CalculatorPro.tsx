import { useState } from 'react';

const CalculatorPro = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleNumber = (n: string) => {
    if (reset) { setDisplay(n); setReset(false); }
    else setDisplay(display === '0' ? n : display + n);
  };

  const handleOp = (o: string) => {
    calculate();
    setPrev(parseFloat(display));
    setOp(o);
    setReset(true);
  };

  const calculate = () => {
    if (prev === null || !op) return;
    const curr = parseFloat(display);
    let result = 0;
    switch (op) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '×': result = prev * curr; break;
      case '÷': result = curr !== 0 ? prev / curr : 0; break;
    }
    const expr = `${prev} ${op} ${curr} = ${result}`;
    setHistory(h => [expr, ...h].slice(0, 10));
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setReset(true);
  };

  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); };

  const scientific = (fn: string) => {
    const n = parseFloat(display);
    let result = 0;
    switch (fn) {
      case 'sqrt': result = Math.sqrt(n); break;
      case 'sq': result = n * n; break;
      case 'sin': result = Math.sin(n * Math.PI / 180); break;
      case 'cos': result = Math.cos(n * Math.PI / 180); break;
      case 'tan': result = Math.tan(n * Math.PI / 180); break;
      case 'log': result = Math.log10(n); break;
      case 'ln': result = Math.log(n); break;
      case 'pi': result = Math.PI; break;
      case '1/x': result = 1 / n; break;
      case '%': result = n / 100; break;
    }
    setDisplay(String(+result.toFixed(10)));
    setReset(true);
  };

  const btn = (label: string, onClick: () => void, cls = '') => (
    <button onClick={onClick} className={`p-3 rounded text-sm font-medium hover:opacity-80 active:scale-95 transition-all ${cls}`}>
      {label}
    </button>
  );

  return (
    <div className="h-full flex bg-card">
      <div className="flex-1 flex flex-col p-3">
        {/* Display */}
        <div className="bg-muted rounded-lg p-4 mb-3 text-right">
          <div className="text-xs text-muted-foreground h-5">
            {prev !== null && `${prev} ${op}`}
          </div>
          <div className="text-3xl font-light text-foreground truncate">{display}</div>
        </div>

        {/* Scientific row */}
        <div className="grid grid-cols-5 gap-1 mb-1">
          {btn('sin', () => scientific('sin'), 'bg-secondary text-secondary-foreground text-xs')}
          {btn('cos', () => scientific('cos'), 'bg-secondary text-secondary-foreground text-xs')}
          {btn('tan', () => scientific('tan'), 'bg-secondary text-secondary-foreground text-xs')}
          {btn('log', () => scientific('log'), 'bg-secondary text-secondary-foreground text-xs')}
          {btn('ln', () => scientific('ln'), 'bg-secondary text-secondary-foreground text-xs')}
        </div>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {btn('√', () => scientific('sqrt'), 'bg-secondary text-secondary-foreground text-xs')}
          {btn('x²', () => scientific('sq'), 'bg-secondary text-secondary-foreground text-xs')}
          {btn('π', () => scientific('pi'), 'bg-secondary text-secondary-foreground text-xs')}
          {btn('1/x', () => scientific('1/x'), 'bg-secondary text-secondary-foreground text-xs')}
          {btn('%', () => scientific('%'), 'bg-secondary text-secondary-foreground text-xs')}
        </div>

        {/* Main pad */}
        <div className="grid grid-cols-4 gap-1 flex-1">
          {btn('C', clear, 'bg-destructive/20 text-destructive')}
          {btn('±', () => setDisplay(String(-parseFloat(display))), 'bg-muted text-foreground')}
          {btn('⌫', () => setDisplay(display.length > 1 ? display.slice(0, -1) : '0'), 'bg-muted text-foreground')}
          {btn('÷', () => handleOp('÷'), 'bg-primary text-primary-foreground')}
          {['7','8','9'].map(n => btn(n, () => handleNumber(n), 'bg-muted text-foreground'))}
          {btn('×', () => handleOp('×'), 'bg-primary text-primary-foreground')}
          {['4','5','6'].map(n => btn(n, () => handleNumber(n), 'bg-muted text-foreground'))}
          {btn('-', () => handleOp('-'), 'bg-primary text-primary-foreground')}
          {['1','2','3'].map(n => btn(n, () => handleNumber(n), 'bg-muted text-foreground'))}
          {btn('+', () => handleOp('+'), 'bg-primary text-primary-foreground')}
          {btn('0', () => handleNumber('0'), 'bg-muted text-foreground')}
          {btn('.', () => !display.includes('.') && setDisplay(display + '.'), 'bg-muted text-foreground')}
          {btn('', () => {}, 'bg-transparent')}
          {btn('=', calculate, 'bg-primary text-primary-foreground')}
        </div>
      </div>

      {/* History sidebar */}
      <div className="w-44 border-l border-border p-3 overflow-auto">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">History</h3>
        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground">No history</p>
        ) : history.map((h, i) => (
          <div key={i} className="text-xs text-foreground py-1 border-b border-border">{h}</div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorPro;
