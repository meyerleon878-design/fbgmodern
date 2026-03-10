import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Signal } from 'lucide-react';

const networks = [
  { ssid: 'FBG_NETWORK', signal: 95, channel: 6, security: 'WPA3', band: '5 GHz' },
  { ssid: 'HomeWiFi_5G', signal: 72, channel: 36, security: 'WPA2', band: '5 GHz' },
  { ssid: 'Guest_Network', signal: 60, channel: 1, security: 'WPA2', band: '2.4 GHz' },
  { ssid: 'TP-Link_8832', signal: 45, channel: 11, security: 'WPA2', band: '2.4 GHz' },
  { ssid: 'NETGEAR-5G', signal: 30, channel: 44, security: 'WPA3', band: '5 GHz' },
  { ssid: 'xfinity_wifi', signal: 20, channel: 6, security: 'Open', band: '2.4 GHz' },
];

const WifiAnalyzer = () => {
  const [scanning, setScanning] = useState(false);
  const [signals, setSignals] = useState(networks);

  useEffect(() => {
    const id = setInterval(() => {
      setSignals(prev => prev.map(n => ({
        ...n,
        signal: Math.max(5, Math.min(100, n.signal + Math.floor(Math.random() * 7) - 3))
      })));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const getSignalColor = (s: number) => s > 70 ? 'text-green-500' : s > 40 ? 'text-yellow-500' : 'text-red-500';
  const getSignalBars = (s: number) => s > 75 ? 4 : s > 50 ? 3 : s > 25 ? 2 : 1;

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">WiFi Analyzer</h2>
        </div>
        <button
          onClick={() => { setScanning(true); setTimeout(() => setScanning(false), 2000); }}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
        >
          {scanning ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {/* Signal bars visualization */}
        <div className="h-32 flex items-end gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
          {signals.map((n, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t transition-all duration-500 ${
                  n.signal > 70 ? 'bg-green-500' : n.signal > 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ height: `${n.signal}%` }}
              />
              <span className="text-[10px] text-muted-foreground truncate w-full text-center">{n.ssid.slice(0, 8)}</span>
            </div>
          ))}
        </div>

        {/* Network list */}
        {signals.sort((a, b) => b.signal - a.signal).map((n, i) => (
          <div key={i} className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Wifi className={`w-5 h-5 ${getSignalColor(n.signal)}`} />
              <div>
                <div className="text-sm font-medium text-foreground">{n.ssid}</div>
                <div className="text-xs text-muted-foreground">Ch {n.channel} • {n.band} • {n.security}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getSignalColor(n.signal)}`}>{n.signal}%</div>
              <div className="text-xs text-muted-foreground">-{100 - n.signal} dBm</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WifiAnalyzer;
