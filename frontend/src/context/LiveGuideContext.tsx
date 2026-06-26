import React, { createContext, useContext } from 'react';
import { useGeminiLive } from '../hooks/useGeminiLive';

interface LiveGuideContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (text: string, turnComplete?: boolean) => void;
  isConnected: boolean;
  isSpeaking: boolean;
  isUserSpeaking: boolean;
  hasSpokenOnce: boolean;
  error: string | null;
}

const LiveGuideContext = createContext<LiveGuideContextType | undefined>(undefined);

export const LiveGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const liveSession = useGeminiLive();

  return (
    <LiveGuideContext.Provider value={liveSession}>
      {children}
    </LiveGuideContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLiveGuide = () => {
  const context = useContext(LiveGuideContext);
  if (context === undefined) {
    throw new Error('useLiveGuide must be used within a LiveGuideProvider');
  }
  return context;
};
