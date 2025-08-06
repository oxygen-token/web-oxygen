"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Transition_Context_Type {
  isTransitioning: boolean;
  currentPath: string;
  startTransition: (path: string) => Promise<void>;
}

const Transition_Context = createContext<Transition_Context_Type | undefined>(undefined);

interface Transition_Provider_Props {
  children: ReactNode;
}

export const Transition_Provider = ({ children }: Transition_Provider_Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  const startTransition = useCallback(async (path: string) => {
    if (isTransitioning || path === currentPath) return;

    setIsTransitioning(true);

    try {
      await router.push(path, { scroll: false });
      setCurrentPath(path);
    } catch (error) {
      console.error('Transition error:', error);
    } finally {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }
  }, [isTransitioning, currentPath, router]);

  const value: Transition_Context_Type = {
    isTransitioning,
    currentPath,
    startTransition
  };

  return (
    <Transition_Context.Provider value={value}>
      {children}
    </Transition_Context.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(Transition_Context);
  if (context === undefined) {
    throw new Error('useTransition must be used within a Transition_Provider');
  }
  return context;
}; 