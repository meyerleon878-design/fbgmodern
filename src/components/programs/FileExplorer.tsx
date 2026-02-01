import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, ChevronRight, ChevronDown, Home, ArrowUp } from 'lucide-react';
import { FileItem } from '@/types/os';

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

const fileSystem: FileItem = {
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
          ],
        },
      ],
    },
  ],
};

const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState<FileItem[]>([fileSystem]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'c-drive']));

  const currentFolder = currentPath[currentPath.length - 1];

  const navigateTo = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item]);
      setSelectedFile(null);
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
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )
          ) : (
            <span className="w-4" />
          )}
          {item.type === 'folder' ? (
            <Folder className="w-4 h-4 text-primary" />
          ) : (
            <FileText className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="text-sm text-foreground truncate">{item.name}</span>
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

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r border-border p-2 overflow-y-auto">
        <div className="text-xs text-muted-foreground mb-2 px-2">QUICK ACCESS</div>
        {renderTreeItem(fileSystem)}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b border-border">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={navigateUp}
            className="p-1 rounded hover:bg-muted"
            disabled={currentPath.length <= 1}
          >
            <ArrowUp className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={navigateHome}
            className="p-1 rounded hover:bg-muted"
          >
            <Home className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 px-2 py-1 bg-input rounded flex-1 text-sm">
            {currentPath.map((item, index) => (
              <span key={item.id} className="flex items-center">
                {index > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground mx-1" />}
                <button
                  onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                  className="text-foreground hover:text-primary"
                >
                  {item.name}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* File List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-4 gap-4">
              {currentFolder.children?.map(item => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onDoubleClick={() => navigateTo(item)}
                  onClick={() => setSelectedFile(item.type === 'file' ? item : null)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                    selectedFile?.id === item.id ? 'bg-primary/20 border border-primary' : 'hover:bg-muted'
                  }`}
                >
                  {item.type === 'folder' ? (
                    <Folder className="w-12 h-12 text-primary" />
                  ) : (
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  )}
                  <span className="text-xs text-foreground text-center break-all">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          {selectedFile && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              className="border-l border-border p-4 overflow-y-auto"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{selectedFile.name}</div>
                  <div className="text-xs text-muted-foreground">Text Document</div>
                </div>
              </div>
              <div className="bg-input rounded p-3">
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                  {selectedFile.content}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
