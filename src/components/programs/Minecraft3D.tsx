import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Send, Pickaxe, Heart, Drumstick, Shield } from 'lucide-react';

// Import textures
import grassTopTexture from '@/assets/textures/grass_top.png';
import grassSideTexture from '@/assets/textures/grass_side.png';
import dirtTexture from '@/assets/textures/dirt.png';
import stoneTexture from '@/assets/textures/stone.png';
import woodTexture from '@/assets/textures/wood.png';
import leavesTexture from '@/assets/textures/leaves.png';
import sandTexture from '@/assets/textures/sand.png';
import cobblestoneTexture from '@/assets/textures/cobblestone.png';
import planksTexture from '@/assets/textures/planks.png';
import bedrockTexture from '@/assets/textures/bedrock.png';

// Types
type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves' | 'sand' | 'cobblestone' | 'planks' | 'bedrock' | 'coal' | 'iron' | 'gold' | 'diamond' | 'water';

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

// Block colors for non-textured blocks
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
  coal: '#2d2d2d',
  iron: '#d4d4d4',
  gold: '#ffd700',
  diamond: '#00bfff',
  water: '#3498db',
};

// Texture loader hook
const useBlockTextures = () => {
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  
  const textures = useMemo(() => {
    const loadTexture = (src: string) => {
      const tex = textureLoader.load(src);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    return {
      grassTop: loadTexture(grassTopTexture),
      grassSide: loadTexture(grassSideTexture),
      dirt: loadTexture(dirtTexture),
      stone: loadTexture(stoneTexture),
      wood: loadTexture(woodTexture),
      leaves: loadTexture(leavesTexture),
      sand: loadTexture(sandTexture),
      cobblestone: loadTexture(cobblestoneTexture),
      planks: loadTexture(planksTexture),
      bedrock: loadTexture(bedrockTexture),
    };
  }, [textureLoader]);

  return textures;
};

// Optimized instanced block renderer
const InstancedBlocks = ({ 
  blocks, 
  type, 
  textures,
  onMine 
}: { 
  blocks: Block[]; 
  type: BlockType;
  textures: ReturnType<typeof useBlockTextures>;
  onMine: (position: [number, number, number]) => void;
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const filteredBlocks = useMemo(() => blocks.filter(b => b.type === type), [blocks, type]);
  
  useEffect(() => {
    if (!meshRef.current || filteredBlocks.length === 0) return;
    
    const matrix = new THREE.Matrix4();
    filteredBlocks.forEach((block, i) => {
      matrix.setPosition(block.position[0], block.position[1], block.position[2]);
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [filteredBlocks]);

  const materials = useMemo(() => {
    if (type === 'grass') {
      return [
        new THREE.MeshLambertMaterial({ map: textures.grassSide }),
        new THREE.MeshLambertMaterial({ map: textures.grassSide }),
        new THREE.MeshLambertMaterial({ map: textures.grassTop }),
        new THREE.MeshLambertMaterial({ map: textures.dirt }),
        new THREE.MeshLambertMaterial({ map: textures.grassSide }),
        new THREE.MeshLambertMaterial({ map: textures.grassSide }),
      ];
    }
    
    const textureMap: Partial<Record<BlockType, THREE.Texture>> = {
      dirt: textures.dirt,
      stone: textures.stone,
      wood: textures.wood,
      leaves: textures.leaves,
      sand: textures.sand,
      cobblestone: textures.cobblestone,
      planks: textures.planks,
      bedrock: textures.bedrock,
    };

    const tex = textureMap[type];
    if (tex) {
      return new THREE.MeshLambertMaterial({ 
        map: tex,
        transparent: type === 'leaves',
        opacity: type === 'leaves' ? 0.9 : 1,
      });
    }

    // Fallback to colors for ore blocks
    return new THREE.MeshLambertMaterial({ 
      color: BLOCK_COLORS[type],
      transparent: type === 'water',
      opacity: type === 'water' ? 0.7 : 1,
    });
  }, [type, textures]);

  if (filteredBlocks.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, filteredBlocks.length]}
      material={materials}
      onClick={(e) => {
        e.stopPropagation();
        const instanceId = e.instanceId;
        if (instanceId !== undefined && filteredBlocks[instanceId]) {
          onMine(filteredBlocks[instanceId].position);
        }
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
};

// World renderer using instanced meshes
const WorldBlocks = ({ 
  blocks, 
  onMineBlock 
}: { 
  blocks: Block[]; 
  onMineBlock: (position: [number, number, number]) => void;
}) => {
  const textures = useBlockTextures();
  const blockTypes: BlockType[] = ['grass', 'dirt', 'stone', 'wood', 'leaves', 'sand', 'cobblestone', 'planks', 'bedrock', 'coal', 'iron', 'gold', 'diamond', 'water'];

  return (
    <group>
      {blockTypes.map(type => (
        <InstancedBlocks
          key={type}
          blocks={blocks}
          type={type}
          textures={textures}
          onMine={onMineBlock}
        />
      ))}
    </group>
  );
};

// Player controller with improved physics
const Player = ({ 
  onPlaceBlock, 
  blocks,
  position,
  setPosition,
}: { 
  onPlaceBlock: (pos: [number, number, number]) => void;
  blocks: Block[];
  position: THREE.Vector3;
  setPosition: (pos: THREE.Vector3) => void;
}) => {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, sprint: false });
  const canJump = useRef(true);
  const isLocked = useRef(false);
  const lastGroundY = useRef(2);

  useEffect(() => {
    camera.position.copy(position);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked.current) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': moveState.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': moveState.current.left = true; break;
        case 'KeyD': case 'ArrowRight': moveState.current.right = true; break;
        case 'ShiftLeft': moveState.current.sprint = true; break;
        case 'Space':
          e.preventDefault();
          if (canJump.current) {
            velocity.current.y = 9;
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
        case 'ShiftLeft': moveState.current.sprint = false; break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isLocked.current || e.button !== 2) return;
      e.preventDefault();
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const placePos: [number, number, number] = [
        Math.round(camera.position.x + dir.x * 4),
        Math.round(camera.position.y + dir.y * 4),
        Math.round(camera.position.z + dir.z * 4),
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

  // Improved collision detection
  const getGroundLevel = useCallback((pos: THREE.Vector3): number => {
    let maxY = -10;
    
    for (const block of blocks) {
      const bx = block.position[0];
      const by = block.position[1];
      const bz = block.position[2];
      
      // Check if player is above this block
      if (Math.abs(pos.x - bx) < 0.4 && Math.abs(pos.z - bz) < 0.4) {
        const topY = by + 1;
        if (topY > maxY && pos.y >= topY - 0.1) {
          maxY = topY;
        }
      }
    }
    
    return maxY + 1.7; // Player eye height
  }, [blocks]);

  const checkHorizontalCollision = useCallback((pos: THREE.Vector3, dir: THREE.Vector3): boolean => {
    const checkPos = pos.clone().add(dir.clone().multiplyScalar(0.4));
    
    for (const block of blocks) {
      const bx = block.position[0];
      const by = block.position[1];
      const bz = block.position[2];
      
      if (Math.abs(checkPos.x - bx) < 0.8 && 
          Math.abs(checkPos.z - bz) < 0.8 &&
          pos.y - 1.7 < by + 1 && pos.y > by) {
        return true;
      }
    }
    return false;
  }, [blocks]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.03);
    
    // Gravity
    velocity.current.y -= 25 * d;
    velocity.current.y = Math.max(velocity.current.y, -30);
    
    // Movement
    const baseSpeed = moveState.current.sprint ? 8 : 5;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveX = (moveState.current.right ? 1 : 0) - (moveState.current.left ? 1 : 0);
    const moveZ = (moveState.current.forward ? 1 : 0) - (moveState.current.backward ? 1 : 0);

    // Calculate movement direction
    const moveDir = forward.clone().multiplyScalar(moveZ).add(right.clone().multiplyScalar(moveX));
    if (moveDir.length() > 0) moveDir.normalize();

    // Check horizontal collision before moving
    if (!checkHorizontalCollision(camera.position, moveDir)) {
      camera.position.add(moveDir.multiplyScalar(baseSpeed * d));
    }
    
    // Apply vertical movement
    camera.position.y += velocity.current.y * d;

    // Ground detection
    const groundLevel = getGroundLevel(camera.position);
    if (camera.position.y < groundLevel) {
      camera.position.y = groundLevel;
      velocity.current.y = 0;
      canJump.current = true;
      lastGroundY.current = groundLevel;
    }

    // Bounds
    camera.position.x = Math.max(-50, Math.min(50, camera.position.x));
    camera.position.z = Math.max(-50, Math.min(50, camera.position.z));
    camera.position.y = Math.max(-5, Math.min(60, camera.position.y));

    // Update position state
    setPosition(camera.position.clone());
  });

  return null;
};

// World generation with more variety
const generateWorld = (): Block[] => {
  const blocks: Block[] = [];
  const size = 16;
  const heightMap: number[][] = [];

  // Generate height map with noise
  for (let x = -size; x <= size; x++) {
    heightMap[x + size] = [];
    for (let z = -size; z <= size; z++) {
      const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 + 
                    Math.sin(x * 0.05 + z * 0.05) * 3;
      heightMap[x + size][z + size] = Math.floor(noise + 3);
    }
  }

  // Generate terrain
  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      const height = heightMap[x + size][z + size];
      
      // Bedrock layer
      blocks.push({ position: [x, -1, z], type: 'bedrock' });
      
      // Stone layers with occasional ores
      for (let y = 0; y < height - 2; y++) {
        const rand = Math.random();
        let type: BlockType = 'stone';
        if (rand < 0.02) type = 'coal';
        else if (rand < 0.03) type = 'iron';
        else if (rand < 0.035 && y < 2) type = 'gold';
        else if (rand < 0.04 && y < 1) type = 'diamond';
        blocks.push({ position: [x, y, z], type });
      }
      
      // Dirt layer
      blocks.push({ position: [x, height - 2, z], type: 'dirt' });
      
      // Surface layer
      const surfaceType: BlockType = Math.abs(x) > 12 || Math.abs(z) > 12 ? 'sand' : 'grass';
      blocks.push({ position: [x, height - 1, z], type: surfaceType });
    }
  }

  // Trees
  const treePositions = [
    [4, 4], [-5, 3], [6, -5], [-6, -6], [8, 8], [-8, -8], [10, -3], [-3, 10],
    [0, 7], [7, 0], [-7, 5], [5, -7]
  ];
  
  treePositions.forEach(([tx, tz]) => {
    const baseHeight = heightMap[tx + size]?.[tz + size] ?? 3;
    if (Math.abs(tx) <= 12 && Math.abs(tz) <= 12) {
      // Trunk
      for (let y = baseHeight; y <= baseHeight + 4; y++) {
        blocks.push({ position: [tx, y, tz], type: 'wood' });
      }
      // Leaves
      for (let lx = -2; lx <= 2; lx++) {
        for (let lz = -2; lz <= 2; lz++) {
          for (let ly = 0; ly <= 2; ly++) {
            if (Math.abs(lx) + Math.abs(lz) + ly <= 3 && !(lx === 0 && lz === 0 && ly === 0)) {
              blocks.push({ position: [tx + lx, baseHeight + 4 + ly, tz + lz], type: 'leaves' });
            }
          }
        }
      }
      blocks.push({ position: [tx, baseHeight + 7, tz], type: 'leaves' });
    }
  });

  // Small pond
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      if (x * x + z * z <= 9) {
        const waterX = x - 10;
        const waterZ = z - 10;
        blocks.push({ position: [waterX, 2, waterZ], type: 'water' });
      }
    }
  }

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
    { type: 'sand', count: 32 },
  ]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'SYSTEM', text: 'Welcome to FBG Minecraft 3D!', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [health, setHealth] = useState(20);
  const [hunger, setHunger] = useState(20);
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 10, 15));
  const controlsRef = useRef<any>(null);

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
      if (e.key === 'Escape') {
        if (controlsRef.current) {
          controlsRef.current.unlock();
        }
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

  const handleMineBlock = useCallback((position: [number, number, number]) => {
    const blockIndex = blocks.findIndex(b => 
      b.position[0] === position[0] && 
      b.position[1] === position[1] && 
      b.position[2] === position[2]
    );
    
    if (blockIndex === -1) return;
    const block = blocks[blockIndex];
    if (block.type === 'bedrock') return;
    
    setBlocks(prev => prev.filter((_, i) => i !== blockIndex));
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
      const responses = ['Nice build!', 'Cool!', 'GG!', 'Anyone trading diamonds?', 'Found iron!', 'Watch out for creepers!'];
      const names = ['Steve', 'Alex', 'Notch', 'Dream', 'Tommy'];
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
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' fill='%23444'/%3E%3Crect x='16' y='16' width='16' height='16' fill='%23444'/%3E%3C/svg%3E")`,
            backgroundSize: '32px 32px',
          }} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <h1 className="text-5xl font-bold text-foreground text-glow mb-2 tracking-wider">MINECRAFT</h1>
          <p className="text-muted-foreground mb-8">FBG 3D Edition v2.0</p>
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
              className="block w-64 py-3 bg-muted text-muted-foreground rounded font-semibold mx-auto"
            >
              MULTIPLAYER (Soon)
            </motion.button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Controls: WASD to move, Space to jump, Shift to sprint<br/>
            Left-click to mine, Right-click to place, T for chat
          </p>
        </motion.div>
      </div>
    );
  }

  // 3D Game
  return (
    <div className="h-full w-full relative select-none" onContextMenu={(e) => e.preventDefault()}>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 300 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[50, 100, 50]} 
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <hemisphereLight args={['#87CEEB', '#3d5c3d', 0.4]} />
        <Sky sunPosition={[100, 60, 100]} turbidity={0.3} rayleigh={0.5} />
        <fog attach="fog" args={['#87CEEB', 50, 150]} />
        
        <WorldBlocks blocks={blocks} onMineBlock={handleMineBlock} />
        <Player 
          onPlaceBlock={handlePlaceBlock} 
          blocks={blocks}
          position={playerPos}
          setPosition={setPlayerPos}
        />
        <PointerLockControls ref={controlsRef} />
      </Canvas>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-6 h-0.5 bg-white/90 shadow-lg" />
        <div className="w-0.5 h-6 bg-white/90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg" />
      </div>

      {/* Health and Hunger bars */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        <div className="flex items-center gap-1 bg-card/80 px-2 py-1 rounded">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-sm ${i < health / 2 ? 'bg-red-500' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-card/80 px-2 py-1 rounded">
          <Drumstick className="w-4 h-4 text-amber-600" />
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-sm ${i < hunger / 2 ? 'bg-amber-600' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="absolute top-4 left-4 text-xs text-white/80 bg-card/60 px-2 py-1 rounded z-20 font-mono">
        X: {Math.floor(playerPos.x)} Y: {Math.floor(playerPos.y)} Z: {Math.floor(playerPos.z)}
      </div>

      {/* Chat */}
      {showChat && (
        <div className="absolute bottom-24 left-4 w-72 z-20">
          <div className="bg-card/90 rounded p-2 max-h-40 overflow-y-auto mb-2 backdrop-blur-sm">
            {messages.slice(-8).map(msg => (
              <div key={msg.id} className="text-xs leading-relaxed">
                <span className="text-muted-foreground">[{msg.time}]</span>{' '}
                <span className="text-primary font-medium">&lt;{msg.sender}&gt;</span>{' '}
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
              className="flex-1 px-3 py-1.5 bg-input/90 border border-border rounded text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
            />
            <button type="submit" className="p-1.5 bg-primary rounded">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </form>
        </div>
      )}

      {/* Hotbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-card/80 p-1 rounded-lg backdrop-blur-sm">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(slot => (
          <div
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`w-12 h-12 border-2 rounded flex flex-col items-center justify-center cursor-pointer transition-all ${
              selectedSlot === slot 
                ? 'border-primary bg-primary/30 scale-105' 
                : 'border-border/50 bg-card/80 hover:border-muted-foreground'
            }`}
          >
            {inventory[slot] && (
              <>
                <div 
                  className="w-7 h-7 rounded"
                  style={{ backgroundColor: BLOCK_COLORS[inventory[slot].type] }}
                />
                <span className="text-[10px] text-foreground font-medium">{inventory[slot].count}</span>
              </>
            )}
            <span className="absolute top-0.5 left-1 text-[8px] text-muted-foreground">{slot + 1}</span>
          </div>
        ))}
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-card/60 px-3 py-2 rounded z-20">
        <p>Click to capture mouse</p>
        <p>ESC to release</p>
      </div>
    </div>
  );
};

export default Minecraft3D;
