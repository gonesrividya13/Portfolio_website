import React from 'react';

interface AvatarProps {
  state: 'idle' | 'thinking' | 'speaking';
}

export const Avatar: React.FC<AvatarProps> = ({ state }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-72 h-72">
      {/* Outer ambient glow */}
      <div 
        className={`absolute inset-4 rounded-full transition-all duration-1000 blur-2xl opacity-40 ${
          state === 'thinking' 
            ? 'bg-purple-600 animate-pulse scale-105' 
            : state === 'speaking' 
              ? 'bg-rose-500 scale-100' 
              : 'bg-blue-600 scale-95'
        }`}
      />

      {/* SVG Face Container */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-64 h-64 z-10 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-500 ${
          state === 'thinking' ? 'animate-bounce' : ''
        }`}
        style={{ animationDuration: state === 'thinking' ? '3s' : '0s' }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="faceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#090514" />
          </radialGradient>
          
          <linearGradient id="cyberBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>

          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Circular frame */}
        <circle 
          cx="100" 
          cy="100" 
          r="92" 
          fill="url(#faceGlow)" 
          stroke="url(#cyberBorder)" 
          strokeWidth="3" 
          className="transition-all duration-500"
        />

        {/* Ambient grid mesh pattern behind head (cyberpunk aesthetic) */}
        <g opacity="0.15">
          <line x1="40" y1="20" x2="40" y2="180" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="80" y1="20" x2="80" y2="180" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="120" y1="20" x2="120" y2="180" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="160" y1="20" x2="160" y2="180" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="20" y1="40" x2="180" y2="40" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="20" y1="80" x2="180" y2="80" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="20" y1="120" x2="180" y2="120" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="20" y1="160" x2="180" y2="160" stroke="#8b5cf6" strokeWidth="1" />
        </g>

        {/* Glowing Aura Ring (pulsing in thinking/speaking) */}
        <circle 
          cx="100" 
          cy="100" 
          r="80" 
          fill="none" 
          stroke={
            state === 'thinking' 
              ? '#c084fc' 
              : state === 'speaking' 
                ? '#f43f5e' 
                : '#60a5fa'
          } 
          strokeWidth="1.5" 
          strokeDasharray="6, 12"
          className={`origin-center ${
            state === 'thinking' 
              ? 'animate-[spin_8s_linear_infinite]' 
              : state === 'speaking' 
                ? 'animate-[spin_12s_linear_infinite]' 
                : 'animate-[spin_20s_linear_infinite]'
          }`}
        />

        {/* Head Group with idle breathing animation */}
        <g 
          className={`origin-center transition-transform duration-1000 ${
            state === 'speaking' ? 'animate-[headSpeak_0.5s_infinite_alternate_ease-in-out]' : 'animate-[breathe_4s_infinite_ease-in-out]'
          }`}
        >
          {/* Neck */}
          <rect x="90" y="135" width="20" height="25" rx="5" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="90" y1="145" x2="110" y2="145" stroke="#3b82f6" strokeWidth="1" />

          {/* Ears / Side Nodes */}
          <circle cx="50" cy="95" r="8" fill="#3b82f6" opacity="0.8" filter="url(#neonGlow)" />
          <circle cx="150" cy="95" r="8" fill="#3b82f6" opacity="0.8" filter="url(#neonGlow)" />
          <rect x="42" y="90" width="10" height="10" rx="2" fill="#1e1b4b" />
          <rect x="148" y="90" width="10" height="10" rx="2" fill="#1e1b4b" />

          {/* Robot Head Frame */}
          <rect 
            x="56" 
            y="50" 
            width="88" 
            height="90" 
            rx="25" 
            fill="#090514" 
            stroke="url(#cyberBorder)" 
            strokeWidth="2.5" 
          />

          {/* Inner Face Screen */}
          <rect 
            x="64" 
            y="58" 
            width="72" 
            height="74" 
            rx="18" 
            fill="#150e28" 
            stroke="#271c4c" 
            strokeWidth="1.5" 
          />

          {/* Eyes Group with blinking animation */}
          <g>
            {/* Left Eye */}
            <ellipse 
              cx="82" 
              cy="85" 
              rx="8" 
              ry={state === 'thinking' ? '2' : '8'}
              fill={
                state === 'thinking' 
                  ? '#c084fc' 
                  : state === 'speaking' 
                    ? '#f43f5e' 
                    : '#3b82f6'
              }
              filter="url(#neonGlow)"
              className="origin-[82px_85px] animate-[blink_5s_infinite_ease-in-out]"
            />
            {/* Right Eye */}
            <ellipse 
              cx="118" 
              cy="85" 
              rx="8" 
              ry={state === 'thinking' ? '2' : '8'}
              fill={
                state === 'thinking' 
                  ? '#c084fc' 
                  : state === 'speaking' 
                    ? '#f43f5e' 
                    : '#3b82f6'
              }
              filter="url(#neonGlow)"
              className="origin-[118px_85px] animate-[blink_5s_infinite_ease-in-out]"
            />
          </g>

          {/* Mouth Section */}
          <g className="origin-[100px_112px]">
            {state === 'speaking' ? (
              // Talking dynamic waveforms
              <path 
                d="M 80 112 Q 90 102 100 112 T 120 112"
                fill="none" 
                stroke="#f43f5e" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="animate-[mouthTalk_0.15s_infinite_alternate_ease-in-out]"
              />
            ) : state === 'thinking' ? (
              // Thinking slight curved line
              <circle cx="100" cy="112" r="3" fill="#c084fc" filter="url(#neonGlow)" />
            ) : (
              // Idle flat smile line
              <path 
                d="M 84 112 Q 100 118 116 112" 
                fill="none" 
                stroke="#60a5fa" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                filter="url(#neonGlow)"
              />
            )}
          </g>
        </g>
      </svg>

      {/* Speech Audio Waveform Bars underneath */}
      <div className="absolute bottom-2 flex items-center justify-center gap-1.5 h-12 w-48">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              state === 'speaking'
                ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                : state === 'thinking'
                  ? 'bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                  : 'bg-blue-600/30'
            }`}
            style={{
              height: state === 'speaking' 
                ? `${Math.max(10, Math.floor(Math.random() * 40))}px` 
                : state === 'thinking' 
                  ? '16px' 
                  : '6px',
              animation: state === 'speaking' 
                ? `bounceWave 0.5s infinite alternate ease-in-out` 
                : 'none',
              animationDelay: `${i * 0.08}s`
            }}
          />
        ))}
      </div>

      {/* CSS Animation Keyframes Injector */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        @keyframes mouthTalk {
          0% { d: path("M 80 112 Q 90 98 100 112 T 120 112"); }
          100% { d: path("M 80 112 Q 90 126 100 112 T 120 112"); }
        }
        @keyframes headSpeak {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-2px) scale(1.02); }
        }
        @keyframes bounceWave {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
};
