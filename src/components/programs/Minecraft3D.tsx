import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Send, Pickaxe } from 'lucide-react';

// Import textures
import grassTopTex from '@/assets/textures/grass_top.png';
import grassSideTex from '@/assets/textures/grass_side.png';
import dirtTex from '@/assets/textures/dirt.png';
import stoneTex from '@/assets/textures/stone.png';
import woodTex from '@/assets/textures/wood.png';
import leavesTex from '@/assets/textures/leaves.png';
import sandTex from '@/assets/textures/sand.png';
import cobblestoneTex from '@/assets/textures/cobblestone.png';
import planksTex from '@/assets/textures/planks.png';
import bedrockTex from '@/assets/textures/bedrock.png';

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

// Texture loader component
const TexturedBlock = ({ position, type, onMine }: { position: [number, number, number]; type: BlockType; onMine: () => void }) => {
  const textures = useTexture({
    grassTop: grassTopTex,
    grassSide: grassSideTex,
    dirt: dirtTex,
    stone: stoneTex,
    wood: woodTex,
    leaves: leavesTex,
    sand: sandTex,
    cobblestone: cobblestoneTex,
    planks: planksTex,
    bedrock: bedrockTex,
  });

  // Configure textures for pixelated look
  Object.values(textures).forEach(tex => {
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
  });

  const materials = useMemo(() => {
    if (type === 'grass') {
      return [
        new THREE.MeshStandardMaterial({ map: textures.grassSide }), // right
        new THREE.MeshStandardMaterial({ map: textures.grassSide }), // left
        new THREE.MeshStandardMaterial({ map: textures.grassTop }), // top
        new THREE.MeshStandardMaterial({ map: textures.dirt }), // bottom
        new THREE.MeshStandardMaterial({ map: textures.grassSide }), // front
        new THREE.MeshStandardMaterial({ map: textures.grassSide }), // back
      ];
    }
    
    const textureMap: Record<BlockType, THREE.Texture> = {
      grass: textures.grassTop,
      dirt: textures.dirt,
      stone: textures.stone,
      wood: textures.wood,
      leaves: textures.leaves,
      sand: textures.sand,
      cobblestone: textures.cobblestone,
      planks: textures.planks,
      bedrock: textures.bedrock,
    };
    
    return new THREE.MeshStandardMaterial({ 
      map: textureMap[type],
      transparent: type === 'leaves',
      alphaTest: type === 'leaves' ? 0.5 : 0,
    });
  }, [type, textures]);

  return (
    <mesh position={position} onClick={onMine} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      {Array.isArray(materials) ? (
        materials.map((mat, i) => <primitive key={i} object={mat} attach={`material-${i}`} />)
      ) : (
        <primitive object={materials} attach="material" />
      )}
    </mesh>
  );
};

// Player controller
const Player = ({ onPlaceBlock }: { onPlaceBlock: (pos: [number, number, number]) => void }) => {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const canJump = useRef(true);
  const playerY = useRef(5);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveForward.current = true; break;
        case 'KeyS': moveBackward.current = true; break;
        case 'KeyA': moveLeft.current = true; break;
        case 'KeyD': moveRight.current = true; break;
        case 'Space':
          if (canJump.current) {
            velocity.current.y = 8;
            canJump.current = false;
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': moveForward.current = false; break;
        case 'KeyS': moveBackward.current = false; break;
        case 'KeyA': moveLeft.current = false; break;
        case 'KeyD': moveRight.current = false; break;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (e.button === 2) { // Right click to place
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        const placePos: [number, number, number] = [
          Math.round(camera.position.x + dir.x * 3),
          Math.round(camera.position.y + dir.y * 3),
          Math.round(camera.position.z + dir.z * 3),
        ];
        onPlaceBlock(placePos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [camera, onPlaceBlock]);

  useFrame((_, delta) => {
    // Gravity
    velocity.current.y -= 20 * delta;
    
    // Ground collision
    if (camera.position.y < 2) {
      camera.position.y = 2;
      velocity.current.y = 0;
      canJump.current = true;
    }

    // Movement
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
    direction.current.normalize();

    const speed = 8;
    if (moveForward.current || moveBackward.current) {
      velocity.current.z = -direction.current.z * speed;
    } else {
      velocity.current.z = 0;
    }
    if (moveLeft.current || moveRight.current) {
      velocity.current.x = -direction.current.x * speed;
    } else {
      velocity.current.x = 0;
    }

    // Apply velocity
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    camera.position.add(forward.multiplyScalar(velocity.current.z * delta));
    camera.position.add(right.multiplyScalar(velocity.current.x * delta));
    camera.position.y += velocity.current.y * delta;
  });

  return null;
};

// World generation
const generateWorld = (): Block[] => {
  const blocks: Block[] = [];
  const size = 16;

  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      // Bedrock layer
      blocks.push({ position: [x, -4, z], type: 'bedrock' });
      
      // Stone layers
      for (let y = -3; y <= -1; y++) {
        blocks.push({ position: [x, y, z], type: 'stone' });
      }
      
      // Dirt layer
      blocks.push({ position: [x, 0, z], type: 'dirt' });
      
      // Grass on top
      blocks.push({ position: [x, 1, z], type: 'grass' });
    }
  }

  // Add some trees
  const treePositions = [
    [3, 5], [-5, 3], [8, -4], [-10, 8], [0, -10], [12, 12], [-8, -8]
  ];

  treePositions.forEach(([tx, tz]) => {
    // Trunk
    for (let y = 2; y <= 5; y++) {
      blocks.push({ position: [tx, y, tz], type: 'wood' });
    }
    // Leaves
    for (let lx = -2; lx <= 2; lx++) {
      for (let lz = -2; lz <= 2; lz++) {
        for (let ly = 5; ly <= 7; ly++) {
          if (Math.abs(lx) + Math.abs(lz) + (ly - 5) < 4) {
            blocks.push({ position: [tx + lx, ly, tz + lz], type: 'leaves' });
          }
        }
      }
    }
  });

  return blocks;
};

// Main Game Component
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
    { id: '2', sender: 'Steve', text: 'Nice world!', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && blocks.length === 0) {
      setBlocks(generateWorld());
    }
  }, [gameState, blocks.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        setShowChat(prev => !prev);
      }
      if (e.key >= '1' && e.key <= '5') {
        setSelectedSlot(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleMineBlock = useCallback((index: number) => {
    const block = blocks[index];
    setBlocks(prev => prev.filter((_, i) => i !== index));
    
    // Add to inventory
    setInventory(prev => {
      const existing = prev.find(s => s.type === block.type);
      if (existing) {
        return prev.map(s => s.type === block.type ? { ...s, count: s.count + 1 } : s);
      }
      return [...prev.slice(0, 5), { type: block.type, count: 1 }].slice(0, 9);
    });
  }, [blocks]);

  const handlePlaceBlock = useCallback((position: [number, number, number]) => {
    const selectedItem = inventory[selectedSlot];
    if (!selectedItem || selectedItem.count <= 0) return;

    // Check if position is already occupied
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

    // Bot response
    setTimeout(() => {
      const responses = ['Nice!', 'Cool build!', 'GG!', 'Anyone want to trade?', 'Found diamonds!'];
      const names = ['Steve', 'Alex', 'Notch', 'Herobrine'];
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: names[Math.floor(Math.random() * names.length)],
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
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
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-primary/30 rotate-45" />
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-primary/20 rotate-12" />
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-primary/25 -rotate-12" />
        </div>
        
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="block w-64 py-3 bg-secondary text-secondary-foreground rounded font-semibold mx-auto"
            >
              OPTIONS
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3D Game
  return (
    <div className="h-full w-full relative">
      <Canvas
        shadows
        camera={{ fov: 75, position: [0, 5, 10] }}
        onPointerDown={() => setIsLocked(true)}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 100, 50]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        {/* Sky */}
        <Sky sunPosition={[100, 50, 100]} />

        {/* Fog */}
        <fog attach="fog" args={['#87CEEB', 50, 200]} />

        {/* World Blocks */}
        {blocks.map((block, index) => (
          <TexturedBlock
            key={`${block.position.join(',')}-${index}`}
            position={block.position}
            type={block.type}
            onMine={() => handleMineBlock(index)}
          />
        ))}

        {/* Player Controller */}
        <Player onPlaceBlock={handlePlaceBlock} />
        
        {/* Pointer Lock Controls */}
        {isLocked && <PointerLockControls />}
      </Canvas>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-6 h-0.5 bg-foreground/80" />
        <div className="w-0.5 h-6 bg-foreground/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Chat */}
      {showChat && (
        <div className="absolute bottom-20 left-4 w-72 z-20">
          <div className="bg-card/80 rounded p-2 max-h-40 overflow-y-auto mb-2">
            {messages.slice(-8).map(msg => (
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
            className={`w-12 h-12 border-2 rounded flex flex-col items-center justify-center cursor-pointer ${
              selectedSlot === slot ? 'border-primary bg-primary/30' : 'border-border/50 bg-card/80'
            }`}
          >
            {inventory[slot] && (
              <>
                <div className="text-xs text-foreground capitalize truncate w-full text-center">
                  {inventory[slot].type.slice(0, 4)}
                </div>
                <span className="text-xs text-muted-foreground">{inventory[slot].count}</span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Controls hint */}
      <div className="absolute top-4 left-4 text-xs text-foreground/70 bg-card/60 p-2 rounded z-20">
        <div>WASD - Move | Space - Jump</div>
        <div>Click - Mine | Right Click - Place</div>
        <div>1-9 - Select slot | T - Toggle chat</div>
        <div>Click to lock mouse</div>
      </div>
    </div>
  );
};

export default Minecraft3D;
