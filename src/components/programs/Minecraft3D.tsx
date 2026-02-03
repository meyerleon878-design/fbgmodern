import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Send, Pickaxe } from 'lucide-react';

// Types
type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves' | 'sand' | 'cobblestone' | 'planks' | 'bedrock';

interface Block {
  position: [number, number, number];
  type: BlockType;
}

interface InventorySlot {
  type: BlockType;
  count: number;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
}

// Block colors
const BLOCK_COLORS: Record<BlockType, string> = {
  grass: '#4a7c23',
  dirt: '#8b5a2b',
  stone: '#808080',
  wood: '#8b4513',
  leaves: '#228b22',
  sand: '#f4d03f',
  cobblestone: '#6b6b6b',
  planks: '#deb887',
  bedrock: '#1a1a1a',
};

// Single block component
const Block3D = ({ position, type, onMine }: { position: [number, number, number]; type: BlockType; onMine: () => void }) => {
  const [hovered, setHovered] = useState(false);
  
  const color = useMemo(() => {
    if (type === 'grass') return '#4a7c23';
    return BLOCK_COLORS[type];
  }, [type]);

  return (
    <mesh 
      position={position} 
      onClick={(e) => {
        e.stopPropagation();
        onMine();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshLambertMaterial 
        color={hovered ? '#ffffff' : color} 
        transparent={type === 'leaves'}
        opacity={type === 'leaves' ? 0.85 : 1}
      />
    </mesh>
  );
};

// Optimized world renderer
const WorldBlocks = ({ blocks, onMineBlock }: { blocks: Block[]; onMineBlock: (index: number) => void }) => {
  return (
    <group>
      {blocks.map((block, index) => (
        <Block3D
          key={`${block.position[0]}-${block.position[1]}-${block.position[2]}`}
          position={block.position}
          type={block.type}
          onMine={() => onMineBlock(index)}
        />
      ))}
    </group>
  );
};

// Player controller
const Player = ({ 
  onPlaceBlock, 
  blocks 
}: { 
  onPlaceBlock: (pos: [number, number, number]) => void;
  blocks: Block[];
}) => {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const canJump = useRef(true);
  const isLocked = useRef(false);

  useEffect(() => {
    camera.position.set(0, 8, 15);
  }, [camera]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked.current) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': moveState.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': moveState.current.left = true; break;
        case 'KeyD': case 'ArrowRight': moveState.current.right = true; break;
        case 'Space':
          e.preventDefault();
          if (canJump.current) {
            velocity.current.y = 8;
            canJump.current = false;
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': moveState.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': moveState.current.left = false; break;
        case 'KeyD': case 'ArrowRight': moveState.current.right = false; break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isLocked.current || e.button !== 2) return;
      e.preventDefault();
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const placePos: [number, number, number] = [
        Math.round(camera.position.x + dir.x * 3),
        Math.round(camera.position.y + dir.y * 3),
        Math.round(camera.position.z + dir.z * 3),
      ];
      onPlaceBlock(placePos);
    };

    const handleLockChange = () => {
      isLocked.current = document.pointerLockElement !== null;
    };

    const handleContextMenu = (e: Event) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('pointerlockchange', handleLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('pointerlockchange', handleLockChange);
    };
  }, [camera, onPlaceBlock]);

  // Simple collision check
  const checkCollision = useCallback((pos: THREE.Vector3): number => {
    for (const block of blocks) {
      const bx = block.position[0];
      const by = block.position[1];
      const bz = block.position[2];
      
      if (Math.abs(pos.x - bx) < 0.8 && 
          Math.abs(pos.z - bz) < 0.8 &&
          pos.y > by && pos.y < by + 2) {
        return by + 1.8;
      }
    }
    return 2;
  }, [blocks]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    
    // Gravity
    velocity.current.y -= 20 * d;
    
    // Movement
    const speed = 5;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveX = (moveState.current.right ? 1 : 0) - (moveState.current.left ? 1 : 0);
    const moveZ = (moveState.current.forward ? 1 : 0) - (moveState.current.backward ? 1 : 0);

    camera.position.add(forward.clone().multiplyScalar(moveZ * speed * d));
    camera.position.add(right.clone().multiplyScalar(moveX * speed * d));
    camera.position.y += velocity.current.y * d;

    // Ground detection
    const groundLevel = checkCollision(camera.position);
    if (camera.position.y < groundLevel) {
      camera.position.y = groundLevel;
      velocity.current.y = 0;
      canJump.current = true;
    }

    // Bounds
    camera.position.x = Math.max(-30, Math.min(30, camera.position.x));
    camera.position.z = Math.max(-30, Math.min(30, camera.position.z));
    camera.position.y = Math.max(2, Math.min(50, camera.position.y));
  });

  return null;
};

// World generation
const generateWorld = (): Block[] => {
  const blocks: Block[] = [];
  const size = 8;

  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      blocks.push({ position: [x, -1, z], type: 'bedrock' });
      blocks.push({ position: [x, 0, z], type: 'stone' });
      blocks.push({ position: [x, 1, z], type: 'dirt' });
      blocks.push({ position: [x, 2, z], type: 'grass' });
    }
  }

  // Trees
  [[4, 4], [-5, 3], [6, -5], [-6, -6]].forEach(([tx, tz]) => {
    for (let y = 3; y <= 5; y++) {
      blocks.push({ position: [tx, y, tz], type: 'wood' });
    }
    for (let lx = -1; lx <= 1; lx++) {
      for (let lz = -1; lz <= 1; lz++) {
        blocks.push({ position: [tx + lx, 6, tz + lz], type: 'leaves' });
      }
    }
    blocks.push({ position: [tx, 7, tz], type: 'leaves' });
  });

  return blocks;
};

// Main component
const Minecraft3D = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [inventory, setInventory] = useState<InventorySlot[]>([
    { type: 'dirt', count: 64 },
    { type: 'stone', count: 64 },
    { type: 'wood', count: 32 },
    { type: 'planks', count: 32 },
    { type: 'cobblestone', count: 64 },
  ]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'SYSTEM', text: 'Welcome to FBG Minecraft 3D!', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (gameState === 'playing' && blocks.length === 0) {
      setBlocks(generateWorld());
    }
  }, [gameState, blocks.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setShowChat(prev => !prev);
      }
      if (e.key >= '1' && e.key <= '9') {
        setSelectedSlot(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) setIsLoggedIn(true);
  };

  const handleMineBlock = useCallback((index: number) => {
    const block = blocks[index];
    if (!block || block.type === 'bedrock') return;
    
    setBlocks(prev => prev.filter((_, i) => i !== index));
    setInventory(prev => {
      const existing = prev.find(s => s.type === block.type);
      if (existing) {
        return prev.map(s => s.type === block.type ? { ...s, count: s.count + 1 } : s);
      }
      if (prev.length < 9) {
        return [...prev, { type: block.type, count: 1 }];
      }
      return prev;
    });
  }, [blocks]);

  const handlePlaceBlock = useCallback((position: [number, number, number]) => {
    const selectedItem = inventory[selectedSlot];
    if (!selectedItem || selectedItem.count <= 0) return;

    const isOccupied = blocks.some(b => 
      b.position[0] === position[0] && 
      b.position[1] === position[1] && 
      b.position[2] === position[2]
    );
    if (isOccupied) return;

    setBlocks(prev => [...prev, { position, type: selectedItem.type }]);
    setInventory(prev => 
      prev.map((s, i) => i === selectedSlot ? { ...s, count: s.count - 1 } : s)
        .filter(s => s.count > 0)
    );
  }, [blocks, inventory, selectedSlot]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatInput('');
    setTimeout(() => {
      const responses = ['Nice!', 'Cool build!', 'GG!', 'Anyone want to trade?'];
      const names = ['Steve', 'Alex', 'Notch'];
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: names[Math.floor(Math.random() * names.length)],
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  // Login screen
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
            <h1 className="text-2xl font-bold text-foreground text-glow">MINECRAFT 3D</h1>
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
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-900 to-card relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <h1 className="text-5xl font-bold text-foreground text-glow mb-2 tracking-wider">MINECRAFT</h1>
          <p className="text-muted-foreground mb-8">FBG 3D Edition</p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState('playing')}
              className="block w-64 py-3 bg-primary text-primary-foreground rounded font-semibold border-glow mx-auto"
            >
              SINGLEPLAYER
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3D Game
  return (
    <div className="h-full w-full relative" onContextMenu={(e) => e.preventDefault()}>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 200 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 80, 50]} intensity={0.7} />
        <hemisphereLight args={['#87CEEB', '#3d5c3d', 0.3]} />
        <Sky sunPosition={[100, 50, 100]} />
        <fog attach="fog" args={['#87CEEB', 40, 80]} />
        <WorldBlocks blocks={blocks} onMineBlock={handleMineBlock} />
        <Player onPlaceBlock={handlePlaceBlock} blocks={blocks} />
        <PointerLockControls />
      </Canvas>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-5 h-0.5 bg-white/80" />
        <div className="w-0.5 h-5 bg-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Chat */}
      {showChat && (
        <div className="absolute bottom-20 left-4 w-64 z-20">
          <div className="bg-card/80 rounded p-2 max-h-32 overflow-y-auto mb-2">
            {messages.slice(-6).map(msg => (
              <div key={msg.id} className="text-xs">
                <span className="text-muted-foreground">[{msg.time}]</span>{' '}
                <span className="text-primary">&lt;{msg.sender}&gt;</span>{' '}
                <span className="text-foreground">{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Press T to chat..."
              className="flex-1 px-2 py-1 bg-input/80 border border-border rounded text-xs text-foreground placeholder:text-muted-foreground"
            />
            <button type="submit" className="p-1 bg-primary rounded">
              <Send className="w-3 h-3 text-primary-foreground" />
            </button>
          </form>
        </div>
      )}

      {/* Hotbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(slot => (
          <div
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`w-10 h-10 border-2 rounded flex flex-col items-center justify-center cursor-pointer ${
              selectedSlot === slot ? 'border-primary bg-primary/30' : 'border-border/50 bg-card/80'
            }`}
          >
            {inventory[slot] && (
              <>
                <div 
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: BLOCK_COLORS[inventory[slot].type] }}
                />
                <span className="text-[10px] text-foreground">{inventory[slot].count}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Controls hint */}
      <div className="absolute top-4 left-4 text-xs text-foreground/90 bg-card/80 p-2 rounded z-20">
        <div>WASD - Move | Space - Jump</div>
        <div>Click - Mine | Right Click - Place</div>
        <div>1-9 - Select slot | T - Chat</div>
        <div className="text-primary mt-1">Click to start</div>
      </div>
    </div>
  );
};

export default Minecraft3D;
