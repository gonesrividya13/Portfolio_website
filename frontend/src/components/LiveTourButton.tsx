import React from 'react';
import { MicOff, Loader2, Play } from 'lucide-react';
import { useLiveGuide } from '../context/LiveGuideContext';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveTourButton: React.FC = () => {
  const { connect, disconnect, isConnected, isSpeaking, error } = useLiveGuide();
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(true);

  // Hide the tooltip after 10 seconds automatically if they don't dismiss it
  React.useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = async () => {
    setShowTooltip(false);
    if (isConnected) {
      disconnect();
    } else {
      setIsConnecting(true);
      await connect();
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-end justify-end flex-col gap-4">
      
      <AnimatePresence>
        {showTooltip && !isConnected && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 text-black dark:text-white p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-xs origin-bottom-right"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm">Interactive Tour</h4>
              <button onClick={() => setShowTooltip(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">×</button>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Welcome to my world! Click the headset icon to enable the AI Audio Guide for the best experience during our journey. You can talk directly to my AI twin at any time!
            </p>
            {/* Small triangle pointer */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggle}
        disabled={isConnecting}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isConnected 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {isConnecting ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : isConnected ? (
          <MicOff className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
        
        {/* Speaking visualizer pulse */}
        {isConnected && isSpeaking && (
          <span className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-ping" style={{ animationDuration: '1.5s' }}></span>
        )}
      </button>

      {error && (
        <div className="absolute bottom-20 right-0 bg-red-100 text-red-600 text-xs p-2 rounded max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
};
