import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Send, Pickaxe, Heart, Drumstick } from 'lucide-react';

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
  id: string;
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

// Block colors for ore blocks
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

// Create texture loader singleton
const textureLoader = new THREE.TextureLoader();

const loadTexture = (src: string) => {
  const tex = textureLoader.load(src);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

// Preload textures
const textures = {
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

// Create materials map
const createMaterial = (type: BlockType): THREE.Material | THREE.Material[] => {
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

  return new THREE.MeshLambertMaterial({
    color: BLOCK_COLORS[type],
    transparent: type === 'water',
    opacity: type === 'water' ? 0.6 : 1,
  });
};

// Shared geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// Individual block component with proper hitbox
const BlockMesh = ({ 
  block, 
  onMine 
}: { 
  block: Block; 
  onMine: (id: string, position: [number, number, number], type: BlockType) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => createMaterial(block.type), [block.type]);

  return (
    <mesh
      ref={meshRef}
      position={block.position}
      geometry={boxGeometry}
      material={material}
      onClick={(e) => {
        e.stopPropagation();
        onMine(block.id, block.position, block.type);
      }}
      castShadow
      receiveShadow
    />
  );
};

// Optimized chunk-based world renderer
const WorldBlocks = ({
  blocks,
  onMineBlock,
}: {
  blocks: Block[];
  onMineBlock: (id: string, position: [number, number, number], type: BlockType) => void;
}) => {
  // Only render blocks near camera for performance
  const { camera } = useThree();
  const [visibleBlocks, setVisibleBlocks] = useState<Block[]>([]);
  
  useFrame(() => {
    const camPos = camera.position;
    const renderDistance = 32;
    
    const visible = blocks.filter(block => {
      const dx = block.position[0] - camPos.x;
      const dy = block.position[1] - camPos.y;
      const dz = block.position[2] - camPos.z;
      return dx * dx + dy * dy + dz * dz < renderDistance * renderDistance;
    });
    
    if (visible.length !== visibleBlocks.length) {
      setVisibleBlocks(visible);
    }
  });

  return (
    <group>
      {visibleBlocks.map((block) => (
        <BlockMesh key={block.id} block={block} onMine={onMineBlock} />
      ))}
    </group>
  );
};

// Player controller with proper physics
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

  // Create block lookup map for O(1) collision checks
  const blockMap = useMemo(() => {
    const map = new Map<string, Block>();
    blocks.forEach(block => {
      const key = `${block.position[0]},${block.position[1]},${block.position[2]}`;
      map.set(key, block);
    });
    return map;
  }, [blocks]);

  const hasBlock = useCallback((x: number, y: number, z: number): boolean => {
    return blockMap.has(`${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`);
  }, [blockMap]);

  useEffect(() => {
    camera.position.copy(position);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked.current) return;
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = true;
          break;
        case 'ShiftLeft':
          moveState.current.sprint = true;
          break;
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
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = false;
          break;
        case 'ShiftLeft':
          moveState.current.sprint = false;
          break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isLocked.current || e.button !== 2) return;
      e.preventDefault();
      
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      
      // Raycast to find placement position
      for (let t = 1; t <= 5; t += 0.5) {
        const checkX = Math.floor(camera.position.x + dir.x * t);
        const checkY = Math.floor(camera.position.y + dir.y * t);
        const checkZ = Math.floor(camera.position.z + dir.z * t);
        
        if (hasBlock(checkX, checkY, checkZ)) {
          // Place block adjacent to hit block
          const prevX = Math.floor(camera.position.x + dir.x * (t - 0.5));
          const prevY = Math.floor(camera.position.y + dir.y * (t - 0.5));
          const prevZ = Math.floor(camera.position.z + dir.z * (t - 0.5));
          
          if (!hasBlock(prevX, prevY, prevZ)) {
            onPlaceBlock([prevX, prevY, prevZ]);
          }
          return;
        }
      }
      
      // No block hit, place at max distance
      const placePos: [number, number, number] = [
        Math.floor(camera.position.x + dir.x * 4),
        Math.floor(camera.position.y + dir.y * 4),
        Math.floor(camera.position.z + dir.z * 4),
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
  }, [camera, onPlaceBlock, hasBlock]);

  // Collision detection
  const checkCollision = useCallback((x: number, y: number, z: number, playerHeight: number): boolean => {
    const playerRadius = 0.3;
    
    // Check feet and head level
    for (let dy = 0; dy < playerHeight; dy += 0.5) {
      for (let dx = -playerRadius; dx <= playerRadius; dx += playerRadius) {
        for (let dz = -playerRadius; dz <= playerRadius; dz += playerRadius) {
          if (hasBlock(Math.floor(x + dx), Math.floor(y - dy), Math.floor(z + dz))) {
            return true;
          }
        }
      }
    }
    return false;
  }, [hasBlock]);

  const getGroundLevel = useCallback((x: number, z: number): number => {
    for (let y = Math.floor(camera.position.y); y >= -10; y--) {
      if (hasBlock(Math.floor(x), y, Math.floor(z))) {
        return y + 1 + 1.7; // Block top + eye height
      }
    }
    return 1.7;
  }, [hasBlock, camera.position.y]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);

    // Gravity
    velocity.current.y -= 20 * d;
    velocity.current.y = Math.max(velocity.current.y, -25);

    // Movement direction
    const baseSpeed = moveState.current.sprint ? 7 : 4.5;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveX = (moveState.current.right ? 1 : 0) - (moveState.current.left ? 1 : 0);
    const moveZ = (moveState.current.forward ? 1 : 0) - (moveState.current.backward ? 1 : 0);

    const moveDir = forward.clone().multiplyScalar(moveZ).add(right.clone().multiplyScalar(moveX));
    if (moveDir.length() > 0) moveDir.normalize();

    // Try to move horizontally
    const newX = camera.position.x + moveDir.x * baseSpeed * d;
    const newZ = camera.position.z + moveDir.z * baseSpeed * d;

    // Check X movement
    if (!checkCollision(newX, camera.position.y, camera.position.z, 1.8)) {
      camera.position.x = newX;
    }

    // Check Z movement
    if (!checkCollision(camera.position.x, camera.position.y, newZ, 1.8)) {
      camera.position.z = newZ;
    }

    // Apply vertical movement
    const newY = camera.position.y + velocity.current.y * d;
    
    // Check ground collision
    const groundLevel = getGroundLevel(camera.position.x, camera.position.z);
    
    if (newY < groundLevel) {
      camera.position.y = groundLevel;
      velocity.current.y = 0;
      canJump.current = true;
    } else {
      // Check ceiling
      if (velocity.current.y > 0 && checkCollision(camera.position.x, newY + 0.3, camera.position.z, 0.1)) {
        velocity.current.y = 0;
      } else {
        camera.position.y = newY;
      }
    }

    // World bounds
    camera.position.x = Math.max(-48, Math.min(48, camera.position.x));
    camera.position.z = Math.max(-48, Math.min(48, camera.position.z));
    camera.position.y = Math.max(-5, Math.min(60, camera.position.y));

    setPosition(camera.position.clone());
  });

  return null;
};

// Generate block ID
let blockIdCounter = 0;
const generateBlockId = () => `block_${blockIdCounter++}`;

// World generation
const generateWorld = (): Block[] => {
  const blocks: Block[] = [];
  const size = 16;
  const heightMap: number[][] = [];

  // Generate height map with noise
  for (let x = -size; x <= size; x++) {
    heightMap[x + size] = [];
    for (let z = -size; z <= size; z++) {
      const noise =
        Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 +
        Math.sin(x * 0.05 + z * 0.05) * 3;
      heightMap[x + size][z + size] = Math.floor(noise + 3);
    }
  }

  // Generate terrain
  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      const height = heightMap[x + size][z + size];

      // Bedrock layer
      blocks.push({ id: generateBlockId(), position: [x, -1, z], type: 'bedrock' });

      // Stone layers with occasional ores
      for (let y = 0; y < height - 2; y++) {
        const rand = Math.random();
        let type: BlockType = 'stone';
        if (rand < 0.02) type = 'coal';
        else if (rand < 0.03) type = 'iron';
        else if (rand < 0.035 && y < 2) type = 'gold';
        else if (rand < 0.04 && y < 1) type = 'diamond';
        blocks.push({ id: generateBlockId(), position: [x, y, z], type });
      }

      // Dirt layer
      if (height >= 2) {
        blocks.push({ id: generateBlockId(), position: [x, height - 2, z], type: 'dirt' });
      }

      // Surface layer
      const surfaceType: BlockType = Math.abs(x) > 12 || Math.abs(z) > 12 ? 'sand' : 'grass';
      blocks.push({ id: generateBlockId(), position: [x, height - 1, z], type: surfaceType });
    }
  }

  // Trees
  const treePositions = [
    [4, 4], [-5, 3], [6, -5], [-6, -6], [8, 8], [-8, -8], [10, -3], [-3, 10],
    [0, 7], [7, 0], [-7, 5], [5, -7],
  ];

  treePositions.forEach(([tx, tz]) => {
    const baseHeight = heightMap[tx + size]?.[tz + size] ?? 3;
    if (Math.abs(tx) <= 12 && Math.abs(tz) <= 12) {
      // Trunk
      for (let y = baseHeight; y <= baseHeight + 4; y++) {
        blocks.push({ id: generateBlockId(), position: [tx, y, tz], type: 'wood' });
      }
      // Leaves
      for (let lx = -2; lx <= 2; lx++) {
        for (let lz = -2; lz <= 2; lz++) {
          for (let ly = 0; ly <= 2; ly++) {
            if (Math.abs(lx) + Math.abs(lz) + ly <= 3 && !(lx === 0 && lz === 0 && ly === 0)) {
              blocks.push({ id: generateBlockId(), position: [tx + lx, baseHeight + 4 + ly, tz + lz], type: 'leaves' });
            }
          }
        }
      }
      blocks.push({ id: generateBlockId(), position: [tx, baseHeight + 7, tz], type: 'leaves' });
    }
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
    { type: 'sand', count: 32 },
  ]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'SYSTEM', text: 'Welcome to FBG Minecraft 3D!', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [health] = useState(20);
  const [hunger] = useState(20);
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
        setShowChat((prev) => !prev);
      }
      if (e.key === 'Escape') {
        controlsRef.current?.unlock();
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

  const handleMineBlock = useCallback((id: string, position: [number, number, number], type: BlockType) => {
    if (type === 'bedrock') return;

    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setInventory((prev) => {
      const existing = prev.find((s) => s.type === type);
      if (existing) {
        return prev.map((s) => (s.type === type ? { ...s, count: s.count + 1 } : s));
      }
      if (prev.length < 9) {
        return [...prev, { type, count: 1 }];
      }
      return prev;
    });
  }, []);

  const handlePlaceBlock = useCallback((position: [number, number, number]) => {
    const selectedItem = inventory[selectedSlot];
    if (!selectedItem || selectedItem.count <= 0) return;

    const isOccupied = blocks.some(
      (b) => b.position[0] === position[0] && b.position[1] === position[1] && b.position[2] === position[2]
    );
    if (isOccupied) return;

    setBlocks((prev) => [...prev, { id: generateBlockId(), position, type: selectedItem.type }]);
    setInventory((prev) =>
      prev.map((s, i) => (i === selectedSlot ? { ...s, count: s.count - 1 } : s)).filter((s) => s.count > 0)
    );
  }, [blocks, inventory, selectedSlot]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'You',
        text: chatInput,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
    setTimeout(() => {
      const responses = ['Nice build!', 'Cool!', 'GG!', 'Anyone trading diamonds?', 'Found iron!', 'Watch out for creepers!'];
      const names = ['Steve', 'Alex', 'Notch', 'Dream', 'Tommy'];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: names[Math.floor(Math.random() * names.length)],
          text: responses[Math.floor(Math.random() * responses.length)],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
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
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' fill='%23444'/%3E%3Crect x='16' y='16' width='16' height='16' fill='%23444'/%3E%3C/svg%3E")`,
            backgroundSize: '32px 32px',
          }}
        />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10">
          <h1 className="text-5xl font-bold text-foreground text-glow mb-2 tracking-wider">MINECRAFT</h1>
          <p className="text-muted-foreground mb-8">FBG 3D Edition v3.0</p>
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
            Controls: WASD to move, Space to jump, Shift to sprint
            <br />
            Left-click to mine, Right-click to place, T for chat
          </p>
        </motion.div>
      </div>
    );
  }

  // 3D Game
  return (
    <div className="h-full w-full relative select-none" onContextMenu={(e) => e.preventDefault()}>
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 200 }} gl={{ antialias: false, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 100, 50]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
        <hemisphereLight args={['#87CEEB', '#3d5c3d', 0.5]} />
        <Sky sunPosition={[100, 60, 100]} turbidity={0.3} rayleigh={0.5} />
        <fog attach="fog" args={['#87CEEB', 40, 120]} />

        <WorldBlocks blocks={blocks} onMineBlock={handleMineBlock} />
        <Player onPlaceBlock={handlePlaceBlock} blocks={blocks} position={playerPos} setPosition={setPlayerPos} />
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
              <div key={i} className={`w-2 h-2 rounded-sm ${i < health / 2 ? 'bg-red-500' : 'bg-muted'}`} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-card/80 px-2 py-1 rounded">
          <Drumstick className="w-4 h-4 text-amber-600" />
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-sm ${i < hunger / 2 ? 'bg-amber-600' : 'bg-muted'}`} />
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
            {messages.slice(-8).map((msg) => (
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
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
          <div
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`w-12 h-12 border-2 rounded flex flex-col items-center justify-center cursor-pointer transition-all relative ${
              selectedSlot === slot
                ? 'border-primary bg-primary/30 scale-105'
                : 'border-border/50 bg-card/80 hover:border-muted-foreground'
            }`}
          >
            {inventory[slot] && (
              <>
                <div className="w-7 h-7 rounded" style={{ backgroundColor: BLOCK_COLORS[inventory[slot].type] }} />
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
