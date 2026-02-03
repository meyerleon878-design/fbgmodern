import { createContext, useContext, useState, ReactNode } from 'react';

export interface DownloadedFile {
  id: string;
  name: string;
  type: 'file';
  content: string;
  downloadedAt: string;
}

interface DownloadsContextType {
  downloads: DownloadedFile[];
  addDownload: (file: Omit<DownloadedFile, 'id' | 'downloadedAt'>) => void;
  clearDownloads: () => void;
}

const DownloadsContext = createContext<DownloadsContextType | undefined>(undefined);

export const DownloadsProvider = ({ children }: { children: ReactNode }) => {
  const [downloads, setDownloads] = useState<DownloadedFile[]>(() => {
    const saved = localStorage.getItem('fbg-downloads');
    return saved ? JSON.parse(saved) : [];
  });

  const addDownload = (file: Omit<DownloadedFile, 'id' | 'downloadedAt'>) => {
    const newFile: DownloadedFile = {
      ...file,
      id: `download-${Date.now()}`,
      downloadedAt: new Date().toLocaleString(),
    };
    setDownloads(prev => {
      const updated = [...prev, newFile];
      localStorage.setItem('fbg-downloads', JSON.stringify(updated));
      return updated;
    });
  };

  const clearDownloads = () => {
    setDownloads([]);
    localStorage.removeItem('fbg-downloads');
  };

  return (
    <DownloadsContext.Provider value={{ downloads, addDownload, clearDownloads }}>
      {children}
    </DownloadsContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadsContext);
  if (!context) {
    throw new Error('useDownloads must be used within a DownloadsProvider');
  }
  return context;
};
