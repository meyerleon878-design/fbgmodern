import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, ChevronRight, ChevronDown, Home, ArrowUp, Download, Search, Grid, List, Trash2 } from 'lucide-react';
import { useDownloads, DownloadedFile } from '@/contexts/DownloadsContext';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  content?: string;
  children?: FileItem[];
}

// Generate random account data
const generateAccounts = (): FileItem[] => {
  const accounts: FileItem[] = [];
  const count = 5 + Math.floor(Math.random() * 5);
  
  for (let i = 0; i < count; i++) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const fakeEmail = `player${randomNum}@minecraft.net`;
    const fakePassword = `P@ss${Math.floor(1000 + Math.random() * 9000)}!`;
    
    accounts.push({
      id: `folder-${randomNum}`,
      name: `FBG_MC_ACC_${randomNum}`,
      type: 'folder',
      children: [
        {
          id: `readme-${randomNum}`,
          name: 'README.txt',
          type: 'file',
          content: '=== VALID MINECRAFT ACCOUNT ===\n\nThis account has been verified and is ready for use.\nStatus: ACTIVE\nType: PREMIUM\n\n[FBG SYSTEMS]',
        },
        {
          id: `info-${randomNum}`,
          name: 'INFO.txt',
          type: 'file',
          content: `=== ACCOUNT INFORMATION ===\n\nAccount ID: MC-${randomNum}\nCreated: ${new Date().toLocaleDateString()}\nLast Login: ${new Date().toLocaleDateString()}\nRegion: GLOBAL\nVerification: COMPLETE\n\n[CONFIDENTIAL]`,
        },
        {
          id: `account-${randomNum}`,
          name: 'ACCOUNT.txt',
          type: 'file',
          content: `=== LOGIN CREDENTIALS ===\n\nEmail: ${fakeEmail}\nPassword: ${fakePassword}\n\n[DO NOT SHARE]`,
        },
      ],
    });
  }
  
  return accounts;
};

const createFileSystem = (downloads: DownloadedFile[]): FileItem => ({
  id: 'root',
  name: 'This PC',
  type: 'folder',
  children: [
    {
      id: 'c-drive',
      name: 'Local Disk (C:)',
      type: 'folder',
      children: [
        {
          id: 'users',
          name: 'Users',
          type: 'folder',
          children: [
            {
              id: 'fbg-admin',
              name: 'FBG_ADMIN',
              type: 'folder',
              children: [
                {
                  id: 'desktop',
                  name: 'Desktop',
                  type: 'folder',
                  children: [
                    { id: 'shortcut-1', name: 'Minecraft.lnk', type: 'file', content: '[Shortcut]\nTarget=C:\\Programs\\Minecraft\\minecraft.exe' },
                  ],
                },
                {
                  id: 'documents',
                  name: 'Documents',
                  type: 'folder',
                  children: [
                    { id: 'notes', name: 'notes.txt', type: 'file', content: 'Remember to check the downloads folder for new programs!' },
                  ],
                },
                {
                  id: 'downloads',
                  name: 'Downloads',
                  type: 'folder',
                  children: downloads.map(d => ({
                    id: d.id,
                    name: d.name,
                    type: 'file' as const,
                    content: d.content,
                  })),
                },
              ],
            },
          ],
        },
        {
          id: 'fbg-data',
          name: 'FBG_DATA',
          type: 'folder',
          children: [
            {
              id: 'mc-accounts',
              name: 'MC_ACCOUNTS',
              type: 'folder',
              children: generateAccounts(),
            },
          ],
        },
        {
          id: 'system32',
          name: 'System32',
          type: 'folder',
          children: [
            { id: 'config', name: 'config.sys', type: 'file', content: '[SYSTEM CONFIG]\nOS=FBG_OS\nVERSION=11.0\nMODE=MATRIX' },
            { id: 'drivers', name: 'drivers.inf', type: 'file', content: '[DRIVERS]\nGPU=FBG_GRAPHICS\nAUDIO=FBG_SOUND\nNETWORK=FBG_NET' },
          ],
        },
        {
          id: 'programs',
          name: 'Programs',
          type: 'folder',
          children: [
            {
              id: 'minecraft-folder',
              name: 'Minecraft',
              type: 'folder',
              children: [
                { id: 'mc-exe', name: 'minecraft.exe', type: 'file', content: '[Executable]\nVersion=3D\nEngine=FBG' },
              ],
            },
          ],
        },
      ],
    },
  ],
});

const FileExplorer = () => {
  const { downloads, clearDownloads } = useDownloads();
  const fileSystem = useMemo(() => createFileSystem(downloads), [downloads]);
  
  const [currentPath, setCurrentPath] = useState<FileItem[]>([fileSystem]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'c-drive']));
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentFolder = currentPath[currentPath.length - 1];

  const filteredChildren = useMemo(() => {
    if (!searchQuery.trim()) return currentFolder.children || [];
    return (currentFolder.children || []).filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentFolder.children, searchQuery]);

  const navigateTo = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item]);
      setSelectedFile(null);
      setSearchQuery('');
    } else {
      setSelectedFile(item);
    }
  };

  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedFile(null);
    }
  };

  const navigateHome = () => {
    setCurrentPath([fileSystem]);
    setSelectedFile(null);
  };

  const navigateToDownloads = () => {
    const downloadsPath = [
      fileSystem,
      fileSystem.children![0], // C:
      fileSystem.children![0].children![0], // Users
      fileSystem.children![0].children![0].children![0], // FBG_ADMIN
      fileSystem.children![0].children![0].children![0].children![2], // Downloads
    ];
    setCurrentPath(downloadsPath);
    setSelectedFile(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderTreeItem = (item: FileItem, depth: number = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const hasChildren = item.type === 'folder' && item.children && item.children.length > 0;
    const isDownloadsFolder = item.id === 'downloads';

    return (
      <div key={item.id}>
        <motion.button
          whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleExpand(item.id);
            }
            navigateTo(item);
          }}
          className="flex items-center gap-1 w-full px-2 py-1 text-left rounded"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            )
          ) : (
            <span className="w-3" />
          )}
          {item.type === 'folder' ? (
            isDownloadsFolder ? (
              <Download className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-primary flex-shrink-0" />
            )
          ) : (
            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
          <span className="text-xs text-foreground truncate">{item.name}</span>
        </motion.button>
        
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {item.children?.map(child => renderTreeItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const isInDownloadsFolder = currentFolder.id === 'downloads';

  return (
    <div className="flex h-full bg-card">
      {/* Sidebar */}
      <div className="w-48 border-r border-border flex flex-col">
        <div className="p-2 border-b border-border">
          <button
            onClick={navigateToDownloads}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Downloads</span>
            {downloads.length > 0 && (
              <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 rounded-full">
                {downloads.length}
              </span>
            )}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs text-muted-foreground mb-2 px-2">QUICK ACCESS</div>
          {renderTreeItem(fileSystem)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b border-border">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={navigateUp}
            className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
            disabled={currentPath.length <= 1}
          >
            <ArrowUp className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={navigateHome}
            className="p-1.5 rounded hover:bg-muted"
          >
            <Home className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 px-2 py-1 bg-input rounded flex-1 min-w-0 text-sm overflow-x-auto">
            {currentPath.map((item, index) => (
              <span key={item.id} className="flex items-center flex-shrink-0">
                {index > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground mx-1" />}
                <button
                  onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                  className="text-foreground hover:text-primary whitespace-nowrap"
                >
                  {item.name}
                </button>
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-32 pl-7 pr-2 py-1 bg-input border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
            >
              <Grid className="w-3 h-3 text-muted-foreground" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-muted' : ''}`}
            >
              <List className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>

          {isInDownloadsFolder && downloads.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearDownloads}
              className="p-1.5 rounded hover:bg-destructive/20 text-destructive"
              title="Clear Downloads"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* File List */}
          <div className="flex-1 p-4 overflow-y-auto">
            {filteredChildren.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Folder className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-sm">
                  {searchQuery ? 'No items match your search' : 'This folder is empty'}
                </p>
                {isInDownloadsFolder && (
                  <p className="text-xs mt-2">Download files from the Lecon Browser</p>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-4 gap-3">
                {filteredChildren.map(item => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onDoubleClick={() => navigateTo(item)}
                    onClick={() => setSelectedFile(item.type === 'file' ? item : null)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                      selectedFile?.id === item.id ? 'bg-primary/20 border border-primary' : 'hover:bg-muted'
                    }`}
                  >
                    {item.type === 'folder' ? (
                      <Folder className="w-10 h-10 text-primary" />
                    ) : (
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    )}
                    <span className="text-xs text-foreground text-center break-all line-clamp-2">{item.name}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChildren.map(item => (
                  <motion.button
                    key={item.id}
                    whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
                    onDoubleClick={() => navigateTo(item)}
                    onClick={() => setSelectedFile(item.type === 'file' ? item : null)}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
                      selectedFile?.id === item.id ? 'bg-primary/20 border border-primary' : ''
                    }`}
                  >
                    {item.type === 'folder' ? (
                      <Folder className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-sm text-foreground truncate">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {item.type === 'folder' ? 'Folder' : 'File'}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-border p-4 overflow-y-auto flex-shrink-0"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{selectedFile.name}</div>
                    <div className="text-xs text-muted-foreground">Text Document</div>
                  </div>
                </div>
                <div className="bg-input rounded p-3">
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-mono break-all">
                    {selectedFile.content}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-1 border-t border-border text-xs text-muted-foreground">
          <span>{filteredChildren.length} item(s)</span>
          {selectedFile && <span>Selected: {selectedFile.name}</span>}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
