import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Pickaxe } from 'lucide-react';
import { InventoryItem, MinecraftBlock } from '@/types/os';

// Block colors (Matrix style)
const blockColors: Record<MinecraftBlock['type'], string> = {
  grass: 'linear-gradient(180deg, #00aa00 0%, #006600 50%, #553300 50%, #442200 100%)',
  dirt: '#553300',
  stone: '#666666',
  wood: 'linear-gradient(90deg, #654321 0%, #8B4513 50%, #654321 100%)',
  leaves: '#004400',
  water: 'rgba(0, 100, 200, 0.6)',
  sand: '#c2b280',
  cobblestone: 'repeating-conic-gradient(#555 0 25%, #777 0 50%)',
  plank: '#C4A484',
  brick: 'repeating-linear-gradient(90deg, #8B4513 0px, #8B4513 10px, #654321 10px, #654321 12px)',
};

const craftingRecipes: Record<string, { ingredients: Record<string, number>; result: { type: string; count: number } }> = {
  plank: { ingredients: { wood: 1 }, result: { type: 'plank', count: 4 } },
  stick: { ingredients: { plank: 2 }, result: { type: 'stick', count: 4 } },
  torch: { ingredients: { stick: 1, coal: 1 }, result: { type: 'torch', count: 4 } },
};

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
}

const Minecraft = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  
  // Game state
  const [playerPos, setPlayerPos] = useState({ x: 8, y: 8 });
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { type: 'wood', count: 10 },
    { type: 'stone', count: 20 },
    { type: 'dirt', count: 15 },
  ]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [world, setWorld] = useState<(MinecraftBlock['type'] | null)[][]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'SYSTEM', text: 'Welcome to FBG Minecraft!', time: '12:00' },
    { id: '2', sender: 'Steve', text: 'Hello everyone!', time: '12:01' },
    { id: '3', sender: 'Alex', text: 'Anyone want to trade?', time: '12:02' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showCrafting, setShowCrafting] = useState(false);
  
  const gameRef = useRef<HTMLDivElement>(null);

  // Generate world
  useEffect(() => {
    const newWorld: (MinecraftBlock['type'] | null)[][] = [];
    for (let y = 0; y < 16; y++) {
      const row: (MinecraftBlock['type'] | null)[] = [];
      for (let x = 0; x < 16; x++) {
        if (y > 10) {
          row.push('stone');
        } else if (y > 8) {
          row.push('dirt');
        } else if (y === 8) {
          row.push('grass');
        } else if (y > 5 && Math.random() > 0.7) {
          row.push('leaves');
        } else if (y > 4 && y <= 8 && x % 5 === 0) {
          row.push('wood');
        } else {
          row.push(null);
        }
      }
      newWorld.push(row);
    }
    setWorld(newWorld);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleMove = useCallback((dx: number, dy: number) => {
    setPlayerPos(prev => {
      const newX = Math.max(0, Math.min(15, prev.x + dx));
      const newY = Math.max(0, Math.min(15, prev.y + dy));
      // Check if there's a block in the way
      if (world[newY]?.[newX] && dy < 0) {
        return prev; // Can't move through blocks
      }
      return { x: newX, y: newY };
    });
  }, [world]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        handleMove(0, -1);
        break;
      case 's':
      case 'arrowdown':
        handleMove(0, 1);
        break;
      case 'a':
      case 'arrowleft':
        handleMove(-1, 0);
        break;
      case 'd':
      case 'arrowright':
        handleMove(1, 0);
        break;
      case 'e':
        setShowCrafting(!showCrafting);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        setSelectedSlot(parseInt(e.key) - 1);
        break;
    }
  }, [handleMove, gameState, showCrafting]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleBlockClick = (x: number, y: number) => {
    if (world[y]?.[x]) {
      // Mine block
      const blockType = world[y][x];
      setWorld(prev => {
        const newWorld = [...prev];
        newWorld[y] = [...newWorld[y]];
        newWorld[y][x] = null;
        return newWorld;
      });
      // Add to inventory
      setInventory(prev => {
        const existing = prev.find(i => i.type === blockType);
        if (existing) {
          return prev.map(i => i.type === blockType ? { ...i, count: i.count + 1 } : i);
        }
        return [...prev, { type: blockType!, count: 1 }];
      });
    } else {
      // Place block
      const selectedItem = inventory[selectedSlot];
      if (selectedItem && selectedItem.count > 0) {
        setWorld(prev => {
          const newWorld = [...prev];
          newWorld[y] = [...newWorld[y]];
          newWorld[y][x] = selectedItem.type as MinecraftBlock['type'];
          return newWorld;
        });
        setInventory(prev => 
          prev.map((item, i) => 
            i === selectedSlot ? { ...item, count: item.count - 1 } : item
          ).filter(i => i.count > 0)
        );
      }
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');

    // Bot responses
    setTimeout(() => {
      const responses = ['Nice!', 'Cool!', 'Wow!', 'That\'s awesome!', 'GG!', 'Let\'s go!'];
      const botNames = ['Steve', 'Alex', 'Notch', 'Herobrine'];
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: botNames[Math.floor(Math.random() * botNames.length)],
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1000 + Math.random() * 2000);
  };

  const craft = (recipe: string) => {
    const rec = craftingRecipes[recipe];
    if (!rec) return;
    
    // Check ingredients
    for (const [ingredient, count] of Object.entries(rec.ingredients)) {
      const item = inventory.find(i => i.type === ingredient);
      if (!item || item.count < count) return;
    }
    
    // Remove ingredients
    let newInventory = [...inventory];
    for (const [ingredient, count] of Object.entries(rec.ingredients)) {
      newInventory = newInventory.map(i => 
        i.type === ingredient ? { ...i, count: i.count - count } : i
      ).filter(i => i.count > 0);
    }
    
    // Add result
    const existing = newInventory.find(i => i.type === rec.result.type);
    if (existing) {
      newInventory = newInventory.map(i => 
        i.type === rec.result.type ? { ...i, count: i.count + rec.result.count } : i
      );
    } else {
      newInventory.push({ type: rec.result.type, count: rec.result.count });
    }
    
    setInventory(newInventory);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gradient-to-b from-card to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-80 glass p-6 rounded-lg border-glow"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Pickaxe className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground text-glow">MINECRAFT</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 bg-primary text-primary-foreground rounded font-semibold"
            >
              LOGIN
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Menu
  if (gameState === 'menu') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-card to-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-foreground text-glow mb-2">MINECRAFT</h1>
          <p className="text-muted-foreground mb-8">FBG Edition</p>
          
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState('playing')}
              className="block w-64 py-3 bg-primary text-primary-foreground rounded font-semibold border-glow"
            >
              PLAY
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-64 py-3 bg-secondary text-secondary-foreground rounded font-semibold"
            >
              OPTIONS
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Game
  return (
    <div ref={gameRef} className="h-full flex flex-col bg-gradient-to-b from-blue-950 to-card overflow-hidden" tabIndex={0}>
      <div className="flex-1 flex">
        {/* Game World */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="grid gap-0.5"
              style={{ gridTemplateColumns: `repeat(16, 28px)` }}
            >
              {world.map((row, y) => 
                row.map((block, x) => (
                  <motion.div
                    key={`${x}-${y}`}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    onClick={() => handleBlockClick(x, y)}
                    className="w-7 h-7 border border-border/30 cursor-pointer relative"
                    style={{
                      background: block ? blockColors[block] : 
                        y < 6 ? 'transparent' : 'rgba(0,0,0,0.2)',
                    }}
                  >
                    {playerPos.x === x && playerPos.y === y && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <div className="w-5 h-6 bg-primary rounded-t-sm relative">
                          <div className="absolute top-1 left-1 w-1 h-1 bg-primary-foreground rounded-full" />
                          <div className="absolute top-1 right-1 w-1 h-1 bg-primary-foreground rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
          
        {/* Controls hint */}
        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-card/80 p-2 rounded">
          WASD: Move | Click: Mine/Place | E: Craft | 1-5: Select slot
        </div>
      </div>

        {/* Chat */}
        <div className="w-64 border-l border-border flex flex-col">
          <div className="p-2 border-b border-border">
            <span className="text-sm text-foreground">Chat</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {messages.map(msg => (
              <div key={msg.id} className="text-xs">
                <span className="text-muted-foreground">[{msg.time}]</span>{' '}
                <span className="text-primary">{msg.sender}:</span>{' '}
                <span className="text-foreground">{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-2 border-t border-border flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message..."
              className="flex-1 px-2 py-1 bg-input border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="submit" className="p-1 bg-primary rounded">
              <Send className="w-3 h-3 text-primary-foreground" />
            </button>
          </form>
        </div>
      </div>

      {/* Hotbar */}
      <div className="p-2 border-t border-border bg-card/90">
        <div className="flex justify-center gap-1">
          {[0, 1, 2, 3, 4].map(slot => (
            <motion.div
              key={slot}
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedSlot(slot)}
              className={`w-12 h-12 border-2 rounded flex flex-col items-center justify-center cursor-pointer ${
                selectedSlot === slot ? 'border-primary bg-primary/20' : 'border-border bg-secondary'
              }`}
            >
              {inventory[slot] && (
                <>
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ background: blockColors[inventory[slot].type as MinecraftBlock['type']] || '#888' }}
                  />
                  <span className="text-xs text-foreground">{inventory[slot].count}</span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Crafting Menu */}
      {showCrafting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-background/80 flex items-center justify-center z-10"
          onClick={() => setShowCrafting(false)}
        >
          <div 
            className="glass p-6 rounded-lg border-glow"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-foreground mb-4 text-glow">CRAFTING</h2>
            <div className="space-y-2">
              {Object.entries(craftingRecipes).map(([name, recipe]) => (
                <motion.button
                  key={name}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => craft(name)}
                  className="w-full p-3 bg-secondary rounded flex items-center justify-between"
                >
                  <span className="text-foreground capitalize">{name}</span>
                  <span className="text-xs text-muted-foreground">
                    {Object.entries(recipe.ingredients).map(([ing, count]) => `${count}x ${ing}`).join(' + ')}
                    {' → '}
                    {recipe.result.count}x {recipe.result.type}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Minecraft;
