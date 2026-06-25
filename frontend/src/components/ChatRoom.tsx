import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, PhoneCall, PhoneOff, Radio } from 'lucide-react';
import { useGeminiLive } from '../hooks/useGeminiLive';

export const ChatRoom: React.FC = () => {
  const { connect, disconnect, isConnected, isSpeaking, error } = useGeminiLive();

  return (
    <section id="ai-room" className="py-24 relative overflow-hidden bg-slate-900/40">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20 mb-6">
            <Radio className="w-8 h-8 text-fuchsia-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400 mb-4">
            Live AI Interview Room
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Experience an ultra-low-latency, real-time voice conversation with my digital representative. Powered by the Gemini Multimodal Live API.
          </p>
        </div>

        <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl flex flex-col items-center min-h-[400px] justify-center overflow-hidden">
          
          {/* Animated Glow Rings */}
          {isConnected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                animate={{ 
                  scale: isSpeaking ? [1, 1.5, 1] : [1, 1.1, 1],
                  opacity: isSpeaking ? [0.2, 0.5, 0.2] : [0.1, 0.2, 0.1]
                }}
                transition={{ duration: isSpeaking ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 blur-2xl"
              />
              <motion.div 
                animate={{ 
                  scale: isSpeaking ? [1, 1.2, 1] : [1, 1.05, 1],
                  opacity: isSpeaking ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2]
                }}
                transition={{ duration: isSpeaking ? 1 : 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 blur-xl"
              />
            </div>
          )}

          {/* Central Avatar / Mic Icon */}
          <div className="relative z-10 mb-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
              isConnected 
                ? isSpeaking 
                  ? 'border-fuchsia-400 bg-fuchsia-500/20 shadow-[0_0_40px_rgba(232,121,249,0.5)]' 
                  : 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.5)]'
                : 'border-slate-700 bg-slate-800'
            }`}>
              {isConnected ? (
                isSpeaking ? <Radio className="w-12 h-12 text-fuchsia-400 animate-pulse" /> : <Mic className="w-12 h-12 text-cyan-400" />
              ) : (
                <MicOff className="w-12 h-12 text-slate-500" />
              )}
            </div>
          </div>

          <div className="relative z-10 mb-12 h-8 flex flex-col items-center">
            {isConnected ? (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-lg font-bold tracking-wide uppercase ${isSpeaking ? 'text-fuchsia-400' : 'text-cyan-400'}`}
              >
                {isSpeaking ? 'AI is speaking...' : 'Listening... (Speak now)'}
              </motion.span>
            ) : (
              <span className="text-lg font-medium text-slate-500">
                Ready to start the interview?
              </span>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm max-w-md text-center"
              >
                {error}
              </motion.div>
            )}
          </div>

          <div className="relative z-10">
            {isConnected ? (
              <button 
                onClick={disconnect}
                className="flex items-center px-8 py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-400 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]"
              >
                <PhoneOff className="w-5 h-5 mr-3" />
                End Live Interview
              </button>
            ) : (
              <button 
                onClick={connect}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
              >
                <PhoneCall className="w-5 h-5 mr-3" />
                Start Live Interview
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
