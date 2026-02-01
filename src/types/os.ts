export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  content?: string;
  children?: FileItem[];
}

export interface Subject {
  id: string;
  name: string;
  age: number;
  location: string;
  status: string;
  notes: string;
}

export interface TrackingDot {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface MinecraftBlock {
  type: 'grass' | 'dirt' | 'stone' | 'wood' | 'leaves' | 'water' | 'sand' | 'cobblestone' | 'plank' | 'brick';
}

export interface InventoryItem {
  type: string;
  count: number;
}
