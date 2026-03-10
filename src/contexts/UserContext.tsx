import { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
  username: string;
  password: string;
  displayName: string;
  createdAt: string;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  isSetupComplete: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fbg-user-profile');
    return saved ? JSON.parse(saved) : null;
  });

  const setUser = (profile: UserProfile) => {
    localStorage.setItem('fbg-user-profile', JSON.stringify(profile));
    setUserState(profile);
  };

  const clearUser = () => {
    localStorage.removeItem('fbg-user-profile');
    localStorage.removeItem('fbg-installed-apps');
    localStorage.removeItem('fbg-theme');
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isSetupComplete: !!user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
