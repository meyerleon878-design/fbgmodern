import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Send, Pickaxe, Heart, Drumstick, Sword, Shield } from 'lucide-react';

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

type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves' | 'sand' | 'cobblestone' | 'planks' | 'bedrock' | 'coal' | 'iron' | 'gold' | 'diamond' | 'water' | 'glass' | 'brick' | 'snow' | 'clay';

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

const BLOCK_COLORS: Record<BlockType, string> = {
  grass: '#4a7c23', dirt: '#8b5a2b', stone: '#808080', wood: '#8b4513',
  leaves: '#228b22', sand: '#f4d03f', cobblestone: '#6b6b6b', planks: '#deb887',
  bedrock: '#1a1a1a', coal: '#2d2d2d', iron: '#d4d4d4', gold: '#ffd700',
  diamond: '#00bfff', water: '#3498db', glass: '#c0e8ff', brick: '#b5533e',
  snow: '#f0f0f0', clay: '#a0897a',
};

const textureLoader = new THREE.TextureLoader();
const loadTexture = (src: string) => {
  const tex = textureLoader.load(src);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

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

// Cache materials
const materialCache = new Map<BlockType, THREE.Material | THREE.Material[]>();

const getMaterial = (type: BlockType): THREE.Material | THREE.Material[] => {
  if (materialCache.has(type)) return materialCache.get(type)!;
  
  let mat: THREE.Material | THREE.Material[];
  if (type === 'grass') {
    mat = [
      new THREE.MeshLambertMaterial({ map: textures.grassSide }),
      new THREE.MeshLambertMaterial({ map: textures.grassSide }),
      new THREE.MeshLambertMaterial({ map: textures.grassTop }),
      new THREE.MeshLambertMaterial({ map: textures.dirt }),
      new THREE.MeshLambertMaterial({ map: textures.grassSide }),
      new THREE.MeshLambertMaterial({ map: textures.grassSide }),
    ];
  } else {
    const textureMap: Partial<Record<BlockType, THREE.Texture>> = {
      dirt: textures.dirt, stone: textures.stone, wood: textures.wood,
      leaves: textures.leaves, sand: textures.sand, cobblestone: textures.cobblestone,
      planks: textures.planks, bedrock: textures.bedrock,
    };
    const tex = textureMap[type];
    if (tex) {
      mat = new THREE.MeshLambertMaterial({
        map: tex,
        transparent: type === 'leaves' || type === 'glass',
        opacity: type === 'leaves' ? 0.9 : type === 'glass' ? 0.3 : 1,
      });
    } else {
      mat = new THREE.MeshLambertMaterial({
        color: BLOCK_COLORS[type],
        transparent: type === 'water' || type === 'glass',
        opacity: type === 'water' ? 0.6 : type === 'glass' ? 0.3 : 1,
      });
    }
  }
  materialCache.set(type, mat);
  return mat;
};

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// Simple noise function
const noise2D = (x: number, z: number, seed: number = 42): number => {
  const n = Math.sin(x * 127.1 + z * 311.7 + seed) * 43758.5453;
  return n - Math.floor(n);
};

const smoothNoise = (x: number, z: number, scale: number, seed: number = 0): number => {
  const sx = x / scale;
  const sz = z / scale;
  const ix = Math.floor(sx);
  const iz = Math.floor(sz);
  const fx = sx - ix;
  const fz = sz - iz;
  const sfx = fx * fx * (3 - 2 * fx);
  const sfz = fz * fz * (3 - 2 * fz);
  const n00 = noise2D(ix, iz, seed);
  const n10 = noise2D(ix + 1, iz, seed);
  const n01 = noise2D(ix, iz + 1, seed);
  const n11 = noise2D(ix + 1, iz + 1, seed);
  const nx0 = n00 + (n10 - n00) * sfx;
  const nx1 = n01 + (n11 - n01) * sfx;
  return nx0 + (nx1 - nx0) * sfz;
};

const getHeight = (x: number, z: number): number => {
  const h1 = smoothNoise(x, z, 20, 1) * 8;
  const h2 = smoothNoise(x, z, 10, 2) * 4;
  const h3 = smoothNoise(x, z, 5, 3) * 2;
  return Math.floor(h1 + h2 + h3);
};

// World generation
const generateWorld = (): Map<string, Block> => {
  const blocks = new Map<string, Block>();
  const size = 24;

  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      const height = getHeight(x, z);
      const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
      
      // Bedrock
      blocks.set(key(x, -3, z), { position: [x, -3, z], type: 'bedrock' });
      
      // Stone layers
      for (let y = -2; y < height - 2; y++) {
        const rand = noise2D(x * 7 + y * 13, z * 11 + y * 3, 99);
        let type: BlockType = 'stone';
        if (rand < 0.03) type = 'coal';
        else if (rand < 0.045 && y < 2) type = 'iron';
        else if (rand < 0.05 && y < 0) type = 'gold';
        else if (rand < 0.055 && y < -1) type = 'diamond';
        blocks.set(key(x, y, z), { position: [x, y, z], type });
      }
      
      // Dirt layer
      if (height >= 0) {
        blocks.set(key(x, height - 2, z), { position: [x, height - 2, z], type: 'dirt' });
        blocks.set(key(x, height - 1, z), { position: [x, height - 1, z], type: 'dirt' });
      }
      
      // Surface
      const dist = Math.sqrt(x * x + z * z);
      const surfaceType: BlockType = dist > 20 ? 'sand' : height < -1 ? 'sand' : 'grass';
      blocks.set(key(x, height, z), { position: [x, height, z], type: surfaceType });
      
      // Water at sea level
      if (height < 0) {
        for (let y = height + 1; y <= 0; y++) {
          blocks.set(key(x, y, z), { position: [x, y, z], type: 'water' });
        }
      }
    }
  }

  // Trees
  for (let x = -size + 3; x <= size - 3; x += 3) {
    for (let z = -size + 3; z <= size - 3; z += 3) {
      const treeChance = noise2D(x * 3, z * 3, 77);
      if (treeChance > 0.7 && Math.sqrt(x * x + z * z) < 18) {
        const h = getHeight(x, z);
        if (h >= 0) {
          const key = (bx: number, by: number, bz: number) => `${bx},${by},${bz}`;
          const trunkHeight = 4 + Math.floor(noise2D(x, z, 55) * 3);
          for (let y = h + 1; y <= h + trunkHeight; y++) {
            blocks.set(key(x, y, z), { position: [x, y, z], type: 'wood' });
          }
          // Canopy
          const canopyBase = h + trunkHeight - 1;
          for (let lx = -2; lx <= 2; lx++) {
            for (let lz = -2; lz <= 2; lz++) {
              for (let ly = 0; ly <= 3; ly++) {
                const dist = Math.abs(lx) + Math.abs(lz) + ly;
                if (dist <= 3 && !(lx === 0 && lz === 0 && ly === 0)) {
                  const k = key(x + lx, canopyBase + ly, z + lz);
                  if (!blocks.has(k)) {
                    blocks.set(k, { position: [x + lx, canopyBase + ly, z + lz], type: 'leaves' });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return blocks;
};

// Block component  
const BlockMesh = ({ block, onMine }: { block: Block; onMine: (pos: [number, number, number], type: BlockType) => void }) => {
  const material = useMemo(() => getMaterial(block.type), [block.type]);
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={block.position}
      geometry={boxGeometry}
      material={material}
      onClick={(e) => { e.stopPropagation(); onMine(block.position, block.type); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      {hovered && (
        <lineSegments>
          <edgesGeometry args={[boxGeometry]} />
          <lineBasicMaterial color="white" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};

// Chunked world renderer
const WorldBlocks = ({ blockMap, onMineBlock }: { blockMap: Map<string, Block>; onMineBlock: (pos: [number, number, number], type: BlockType) => void }) => {
  const { camera } = useThree();
  const [visibleBlocks, setVisibleBlocks] = useState<Block[]>([]);
  const frameCount = useRef(0);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 5 !== 0) return; // Update every 5 frames
    
    const camPos = camera.position;
    const renderDist = 28;
    const renderDistSq = renderDist * renderDist;
    const visible: Block[] = [];
    
    blockMap.forEach((block) => {
      const dx = block.position[0] - camPos.x;
      const dy = block.position[1] - camPos.y;
      const dz = block.position[2] - camPos.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < renderDistSq) {
        // Face culling - only render if at least one face is exposed
        const [bx, by, bz] = block.position;
        const hasExposed = 
          !blockMap.has(`${bx+1},${by},${bz}`) || !blockMap.has(`${bx-1},${by},${bz}`) ||
          !blockMap.has(`${bx},${by+1},${bz}`) || !blockMap.has(`${bx},${by-1},${bz}`) ||
          !blockMap.has(`${bx},${by},${bz+1}`) || !blockMap.has(`${bx},${by},${bz-1}`);
        if (hasExposed) visible.push(block);
      }
    });
    
    setVisibleBlocks(visible);
  });

  return (
    <group>
      {visibleBlocks.map((block) => (
        <BlockMesh key={`${block.position[0]},${block.position[1]},${block.position[2]}`} block={block} onMine={onMineBlock} />
      ))}
    </group>
  );
};

// Player controller
const Player = ({ onPlaceBlock, blockMap, position, setPosition }: {
  onPlaceBlock: (pos: [number, number, number]) => void;
  blockMap: Map<string, Block>;
  position: THREE.Vector3;
  setPosition: (pos: THREE.Vector3) => void;
}) => {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, sprint: false });
  const canJump = useRef(true);
  const isLocked = useRef(false);

  const hasBlock = useCallback((x: number, y: number, z: number): boolean => {
    return blockMap.has(`${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`);
  }, [blockMap]);

  const getBlockAt = useCallback((x: number, y: number, z: number): Block | undefined => {
    return blockMap.get(`${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`);
  }, [blockMap]);

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
          if (canJump.current) { velocity.current.y = 7.5; canJump.current = false; }
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
      
      // Raycast step by step
      for (let t = 1; t <= 6; t += 0.25) {
        const cx = Math.floor(camera.position.x + dir.x * t);
        const cy = Math.floor(camera.position.y + dir.y * t);
        const cz = Math.floor(camera.position.z + dir.z * t);
        
        if (hasBlock(cx, cy, cz)) {
          // Find the face we hit and place adjacent
          const prevT = t - 0.25;
          const px = Math.floor(camera.position.x + dir.x * prevT);
          const py = Math.floor(camera.position.y + dir.y * prevT);
          const pz = Math.floor(camera.position.z + dir.z * prevT);
          
          if (!hasBlock(px, py, pz)) {
            // Don't place where player is standing
            const playerFeetX = Math.floor(camera.position.x);
            const playerFeetY = Math.floor(camera.position.y - 1.7);
            const playerHeadY = Math.floor(camera.position.y);
            const playerFeetZ = Math.floor(camera.position.z);
            if (px === playerFeetX && pz === playerFeetZ && (py === playerFeetY || py === playerHeadY)) return;
            onPlaceBlock([px, py, pz]);
          }
          return;
        }
      }
    };

    const handleLockChange = () => { isLocked.current = document.pointerLockElement !== null; };
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

  // AABB collision
  const collidesAt = useCallback((x: number, y: number, z: number): boolean => {
    const r = 0.25;
    for (let dx = -r; dx <= r; dx += r * 2) {
      for (let dz = -r; dz <= r; dz += r * 2) {
        for (let dy = 0; dy >= -1.6; dy -= 0.8) {
          const block = getBlockAt(x + dx, y + dy, z + dz);
          if (block && block.type !== 'water') return true;
        }
      }
    }
    return false;
  }, [getBlockAt]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);

    // Check if in water
    const inWater = getBlockAt(camera.position.x, camera.position.y - 0.5, camera.position.z)?.type === 'water';

    // Gravity (reduced in water)
    velocity.current.y -= (inWater ? 5 : 20) * d;
    velocity.current.y = Math.max(velocity.current.y, inWater ? -3 : -25);

    // Swimming
    if (inWater && moveState.current.forward) {
      velocity.current.y = Math.max(velocity.current.y, 2);
    }

    const baseSpeed = inWater ? 2.5 : moveState.current.sprint ? 7 : 4.5;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveX = (moveState.current.right ? 1 : 0) - (moveState.current.left ? 1 : 0);
    const moveZ = (moveState.current.forward ? 1 : 0) - (moveState.current.backward ? 1 : 0);
    const moveDir = forward.clone().multiplyScalar(moveZ).add(right.clone().multiplyScalar(moveX));
    if (moveDir.length() > 0) moveDir.normalize();

    // Horizontal movement with collision
    const newX = camera.position.x + moveDir.x * baseSpeed * d;
    if (!collidesAt(newX, camera.position.y, camera.position.z)) {
      camera.position.x = newX;
    }
    const newZ = camera.position.z + moveDir.z * baseSpeed * d;
    if (!collidesAt(camera.position.x, camera.position.y, newZ)) {
      camera.position.z = newZ;
    }

    // Vertical movement
    const newY = camera.position.y + velocity.current.y * d;
    
    // Ground check
    const feetY = newY - 1.7;
    const groundBlock = hasBlock(Math.floor(camera.position.x), Math.floor(feetY), Math.floor(camera.position.z));
    
    if (groundBlock && velocity.current.y <= 0) {
      camera.position.y = Math.floor(feetY) + 1 + 1.7;
      velocity.current.y = 0;
      canJump.current = true;
    } else if (velocity.current.y > 0 && hasBlock(Math.floor(camera.position.x), Math.floor(newY + 0.2), Math.floor(camera.position.z))) {
      velocity.current.y = 0;
    } else {
      camera.position.y = newY;
      if (velocity.current.y < 0) canJump.current = false;
    }

    // World bounds
    camera.position.x = Math.max(-48, Math.min(48, camera.position.x));
    camera.position.z = Math.max(-48, Math.min(48, camera.position.z));
    camera.position.y = Math.max(-5, Math.min(80, camera.position.y));

    // Snap to ground if falling through
    if (camera.position.y < -4) {
      camera.position.y = 15;
      velocity.current.y = 0;
    }

    setPosition(camera.position.clone());
  });

  return null;
};

// Main component
const Minecraft3D = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused'>('menu');
  const [blockMap, setBlockMap] = useState<Map<string, Block>>(new Map());
  const [inventory, setInventory] = useState<InventorySlot[]>([
    { type: 'dirt', count: 64 }, { type: 'stone', count: 64 }, { type: 'wood', count: 32 },
    { type: 'planks', count: 32 }, { type: 'cobblestone', count: 64 }, { type: 'sand', count: 32 },
    { type: 'glass', count: 16 }, { type: 'brick', count: 32 }, { type: 'leaves', count: 16 },
  ]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'SYSTEM', text: 'Welcome to FBG Minecraft 3D! Click to play.', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [health, setHealth] = useState(20);
  const [hunger, setHunger] = useState(20);
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 15, 0));
  const [dayTime, setDayTime] = useState(0.3);
  const [blocksMined, setBlocksMined] = useState(0);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (gameState === 'playing' && blockMap.size === 0) {
      setBlockMap(generateWorld());
    }
  }, [gameState, blockMap.size]);

  // Day/night cycle
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setDayTime(prev => (prev + 0.001) % 1);
    }, 100);
    return () => clearInterval(timer);
  }, [gameState]);

  // Hunger drain
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setHunger(prev => Math.max(0, prev - 0.5));
    }, 15000);
    return () => clearInterval(timer);
  }, [gameState]);

  // Health regen when well-fed
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      if (hunger > 14) setHealth(prev => Math.min(20, prev + 1));
      if (hunger <= 0) setHealth(prev => Math.max(0, prev - 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [gameState, hunger]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); setShowChat(prev => !prev); }
      if (e.key === 'Escape') {
        controlsRef.current?.unlock();
        if (gameState === 'playing') setGameState('paused');
      }
      if (e.key >= '1' && e.key <= '9') setSelectedSlot(parseInt(e.key) - 1);
      if (e.key === 'e' || e.key === 'E') {
        // Eat food (apple from leaves)
        const leafSlot = inventory.findIndex(s => s.type === 'leaves' && s.count > 0);
        if (leafSlot >= 0) {
          setHunger(prev => Math.min(20, prev + 4));
          setInventory(prev => prev.map((s, i) => i === leafSlot ? { ...s, count: s.count - 1 } : s).filter(s => s.count > 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, inventory]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) setIsLoggedIn(true);
  };

  const handleMineBlock = useCallback((position: [number, number, number], type: BlockType) => {
    if (type === 'bedrock') return;
    
    const key = `${position[0]},${position[1]},${position[2]}`;
    setBlockMap(prev => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
    
    // Drop items based on block type
    const dropType: BlockType = type === 'grass' ? 'dirt' : type === 'stone' ? 'cobblestone' : type;
    setInventory(prev => {
      const existing = prev.find(s => s.type === dropType);
      if (existing) return prev.map(s => s.type === dropType ? { ...s, count: s.count + 1 } : s);
      if (prev.length < 9) return [...prev, { type: dropType, count: 1 }];
      return prev;
    });
    setBlocksMined(prev => prev + 1);
  }, []);

  const handlePlaceBlock = useCallback((position: [number, number, number]) => {
    const selectedItem = inventory[selectedSlot];
    if (!selectedItem || selectedItem.count <= 0) return;

    const key = `${position[0]},${position[1]},${position[2]}`;
    if (blockMap.has(key)) return;

    setBlockMap(prev => {
      const next = new Map(prev);
      next.set(key, { position, type: selectedItem.type });
      return next;
    });
    setInventory(prev =>
      prev.map((s, i) => i === selectedSlot ? { ...s, count: s.count - 1 } : s).filter(s => s.count > 0)
    );
  }, [blockMap, inventory, selectedSlot]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'You', text: chatInput, time }]);
    setChatInput('');
    setTimeout(() => {
      const responses = ['Nice build!', 'Cool!', 'GG!', 'Anyone trading diamonds?', 'Found iron!', 'Watch out for creepers!', 'Epic!', 'Where did you find gold?'];
      const names = ['Steve', 'Alex', 'Notch', 'Dream', 'Tommy', 'Herobrine'];
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: names[Math.floor(Math.random() * names.length)],
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  const sunPosition = useMemo(() => {
    const angle = dayTime * Math.PI * 2;
    return [Math.cos(angle) * 100, Math.sin(angle) * 100 + 20, 50] as [number, number, number];
  }, [dayTime]);

  const isNight = dayTime > 0.5;

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gradient-to-b from-card to-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-80 glass p-6 rounded-lg border-glow">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Pickaxe className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground text-glow">MINECRAFT 3D</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2 bg-primary text-primary-foreground rounded font-semibold">LOGIN</motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Pause menu
  if (gameState === 'paused') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-card to-background">
        <h1 className="text-3xl font-bold text-foreground mb-2">GAME PAUSED</h1>
        <p className="text-muted-foreground mb-2">Blocks mined: {blocksMined}</p>
        <div className="space-y-3 mt-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGameState('playing')} className="block w-48 py-3 bg-primary text-primary-foreground rounded font-semibold mx-auto">
            RESUME
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGameState('menu')} className="block w-48 py-3 bg-muted text-muted-foreground rounded font-semibold mx-auto">
            QUIT TO MENU
          </motion.button>
        </div>
      </div>
    );
  }

  // Menu
  if (gameState === 'menu') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a3a5c 0%, #2d5a3c 50%, #4a3a2a 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='16' height='16' fill='%23444'/%3E%3Crect x='16' y='16' width='16' height='16' fill='%23444'/%3E%3C/svg%3E")`,
          backgroundSize: '32px 32px',
        }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-wider" style={{ textShadow: '2px 2px 0 #3b3b3b, 4px 4px 0 #2b2b2b' }}>MINECRAFT</h1>
          <p className="text-gray-300 mb-8">FBG 3D Edition v4.0</p>
          <div className="space-y-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGameState('playing')} className="block w-64 py-3 bg-[#4a8a4a] hover:bg-[#5a9a5a] text-white rounded font-semibold mx-auto border-b-4 border-[#3a6a3a]">
              SINGLEPLAYER
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="block w-64 py-3 bg-[#6a6a6a] text-gray-300 rounded font-semibold mx-auto border-b-4 border-[#4a4a4a]">
              MULTIPLAYER (Soon)
            </motion.button>
          </div>
          <div className="mt-6 text-xs text-gray-400 space-y-1">
            <p>WASD: Move | Space: Jump | Shift: Sprint</p>
            <p>Left-click: Mine | Right-click: Place | T: Chat | E: Eat</p>
            <p>1-9: Select hotbar slot | ESC: Pause</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3D Game
  return (
    <div className="h-full w-full relative select-none" onContextMenu={(e) => e.preventDefault()}>
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 200 }} gl={{ antialias: false, powerPreference: 'high-performance' }}>
        <ambientLight intensity={isNight ? 0.15 : 0.5} />
        <directionalLight position={sunPosition} intensity={isNight ? 0.2 : 1.2} castShadow shadow-mapSize={[1024, 1024]} />
        <hemisphereLight args={[isNight ? '#1a1a3a' : '#87CEEB', '#3d5c3d', isNight ? 0.1 : 0.5]} />
        <Sky sunPosition={sunPosition} turbidity={isNight ? 20 : 0.3} rayleigh={isNight ? 0 : 0.5} />
        <fog attach="fog" args={[isNight ? '#0a0a1a' : '#87CEEB', 30, 100]} />

        <WorldBlocks blockMap={blockMap} onMineBlock={handleMineBlock} />
        <Player onPlaceBlock={handlePlaceBlock} blockMap={blockMap} position={playerPos} setPosition={setPlayerPos} />
        <PointerLockControls ref={controlsRef} />
      </Canvas>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-6 h-0.5 bg-white/80" />
        <div className="w-0.5 h-6 bg-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-sm ${i < health / 2 ? 'bg-red-500' : 'bg-gray-600'}`} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
          <Drumstick className="w-4 h-4 text-amber-600" />
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-sm ${i < hunger / 2 ? 'bg-amber-600' : 'bg-gray-600'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Coordinates & stats */}
      <div className="absolute top-4 left-4 text-xs text-white/80 bg-black/50 px-2 py-1 rounded z-20 font-mono space-y-0.5">
        <p>X: {Math.floor(playerPos.x)} Y: {Math.floor(playerPos.y)} Z: {Math.floor(playerPos.z)}</p>
        <p>Blocks mined: {blocksMined}</p>
        <p>Time: {isNight ? '🌙 Night' : '☀️ Day'}</p>
      </div>

      {/* Chat */}
      {showChat && (
        <div className="absolute bottom-24 left-4 w-72 z-20">
          <div className="bg-black/70 rounded p-2 max-h-40 overflow-y-auto mb-2">
            {messages.slice(-8).map((msg) => (
              <div key={msg.id} className="text-xs leading-relaxed">
                <span className="text-gray-400">[{msg.time}]</span>{' '}
                <span className="text-green-400 font-medium">&lt;{msg.sender}&gt;</span>{' '}
                <span className="text-white">{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Press T to chat..." className="flex-1 px-3 py-1.5 bg-black/70 border border-gray-600 rounded text-sm text-white placeholder:text-gray-500" />
            <button type="submit" className="p-1.5 bg-green-600 rounded"><Send className="w-4 h-4 text-white" /></button>
          </form>
        </div>
      )}

      {/* Hotbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-black/70 p-1.5 rounded-lg">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((slot) => (
          <div key={slot} onClick={() => setSelectedSlot(slot)} className={`w-12 h-12 border-2 rounded flex flex-col items-center justify-center cursor-pointer relative ${
            selectedSlot === slot ? 'border-white bg-white/20 scale-110' : 'border-gray-600 bg-black/50 hover:border-gray-400'
          }`}>
            {inventory[slot] && (
              <>
                <div className="w-7 h-7 rounded" style={{ backgroundColor: BLOCK_COLORS[inventory[slot].type] }} />
                <span className="text-[9px] text-white font-bold">{inventory[slot].count}</span>
              </>
            )}
            <span className="absolute top-0.5 left-1 text-[8px] text-gray-400">{slot + 1}</span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-xs text-white/60 bg-black/40 px-3 py-2 rounded z-20">
        <p>Click to capture mouse</p>
        <p>ESC to pause | E to eat leaves</p>
      </div>
    </div>
  );
};

export default Minecraft3D;
