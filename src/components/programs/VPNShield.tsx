import { useState } from 'react';
import { Shield, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const servers = [
  { country: '🇺🇸 United States', city: 'New York', ping: 12 },
  { country: '🇬🇧 United Kingdom', city: 'London', ping: 45 },
  { country: '🇩🇪 Germany', city: 'Frankfurt', ping: 38 },
  { country: '🇯🇵 Japan', city: 'Tokyo', ping: 120 },
  { country: '🇦🇺 Australia', city: 'Sydney', ping: 180 },
  { country: '🇨🇦 Canada', city: 'Toronto', ping: 25 },
  { country: '🇸🇬 Singapore', city: 'Singapore', ping: 95 },
  { country: '🇳🇱 Netherlands', city: 'Amsterdam', ping: 42 },
];

const VPNShield = () => {
  const [connected, setConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState(0);
  const [connecting, setConnecting] = useState(false);

  const toggleConnect = () => {
    if (connected) { setConnected(false); return; }
    setConnecting(true);
    setTimeout(() => { setConnecting(false); setConnected(true); }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Status */}
      <div className={`p-8 text-center ${connected ? 'bg-green-500/10' : 'bg-muted/30'}`}>
        <motion.div
          animate={connecting ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: connecting ? Infinity : 0 }}
        >
          {connected ? (
            <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-3" />
          ) : (
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
          )}
        </motion.div>
        <h2 className={`text-xl font-semibold ${connected ? 'text-green-500' : 'text-foreground'}`}>
          {connecting ? 'Connecting...' : connected ? 'Protected' : 'Not Connected'}
        </h2>
        {connected && <p className="text-sm text-muted-foreground mt-1">{servers[selectedServer].country} - {servers[selectedServer].city}</p>}

        <button
          onClick={toggleConnect}
          disabled={connecting}
          className={`mt-4 px-8 py-3 rounded-full font-semibold text-sm ${
            connected
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          } disabled:opacity-50`}
        >
          {connecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect'}
        </button>
      </div>

      {/* Server list */}
      <div className="flex-1 overflow-auto p-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">SERVER LOCATIONS</h3>
        {servers.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelectedServer(i)}
            className={`w-full flex items-center justify-between p-3 rounded mb-1 ${
              selectedServer === i ? 'bg-primary/10' : 'hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <div className="text-left">
                <div className="text-sm text-foreground">{s.country}</div>
                <div className="text-xs text-muted-foreground">{s.city}</div>
              </div>
            </div>
            <span className={`text-xs ${s.ping < 50 ? 'text-green-500' : s.ping < 100 ? 'text-yellow-500' : 'text-red-500'}`}>
              {s.ping}ms
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VPNShield;
