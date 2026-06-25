import React from 'react';

interface AvatarProps {
  state: 'idle' | 'thinking' | 'speaking';
}

export const Avatar: React.FC<AvatarProps> = ({ state }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-72 h-72">
      {/* Outer ambient glow */}
      <div 
        className={`absolute inset-4 rounded-full transition-all duration-1000 blur-2xl opacity-45 ${
          state === 'thinking' 
            ? 'bg-purple-600/50 animate-pulse scale-105' 
            : state === 'speaking' 
              ? 'bg-rose-500/40 scale-100' 
              : 'bg-indigo-600/35 scale-95'
        }`}
      />

      {/* SVG Face Container */}
      <svg 
        viewBox="0 0 200 200" 
        className={`w-64 h-64 z-10 drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-500`}
      >
        <defs>
          {/* Ambient Lighting Gradients */}
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e152a" />
            <stop offset="100%" stopColor="#080710" />
          </radialGradient>
          
          <linearGradient id="cyberRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          <filter id="vectorShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Tech Ring frame */}
        <circle 
          cx="100" 
          cy="100" 
          r="92" 
          fill="url(#ringGlow)" 
          stroke="url(#cyberRing)" 
          strokeWidth="2.5" 
        />

        {/* Ambient background particles/mesh */}
        <g opacity="0.12">
          <circle cx="60" cy="50" r="1.5" fill="#c084fc" />
          <circle cx="140" cy="60" r="1.5" fill="#f43f5e" />
          <circle cx="40" cy="120" r="1" fill="#6366f1" />
          <circle cx="160" cy="130" r="2" fill="#c084fc" />
          <path d="M 30 100 Q 100 130 170 100" fill="none" stroke="#6366f1" strokeWidth="0.5" />
          <path d="M 40 80 Q 100 50 160 80" fill="none" stroke="#c084fc" strokeWidth="0.5" />
        </g>

        {/* Outer Circular Ring (spin animation) */}
        <circle 
          cx="100" 
          cy="100" 
          r="84" 
          fill="none" 
          stroke={
            state === 'thinking' 
              ? '#c084fc' 
              : state === 'speaking' 
                ? '#f43f5e' 
                : '#6366f1'
          } 
          strokeWidth="1" 
          strokeDasharray="4, 10"
          className={`origin-center ${
            state === 'thinking' 
              ? 'animate-[spin_10s_linear_infinite]' 
              : state === 'speaking' 
                ? 'animate-[spin_15s_linear_infinite]' 
                : 'animate-[spin_25s_linear_infinite]'
          }`}
        />

        {/* ==================== PORTRAIT GROUPS ==================== */}
        
        {/* HAIR BACK LAYER (Flowing behind shoulders) */}
        <path 
          d="M 60 80 C 40 100 35 130 40 185 L 160 185 C 165 130 160 100 140 80 C 130 70 70 70 60 80 Z" 
          fill="#0c0a0f" 
        />
        <path 
          d="M 50 100 C 40 115 38 135 43 185 L 157 185 C 162 135 160 115 150 100 C 145 92 135 80 120 75 Z" 
          fill="#131017" 
        />

        {/* NECK */}
        <path 
          d="M 88 120 C 88 135 90 148 100 148 C 110 148 112 135 112 120 Z" 
          fill="#b87a5a" 
        />
        <path 
          d="M 88 120 C 88 135 100 142 100 142 C 100 142 112 135 112 120 Z" 
          fill="#a06649" 
        />

        {/* CHEST / COLLAR / SKIN UPPER SECTION */}
        <path 
          d="M 68 150 C 68 150 82 172 100 172 C 118 172 132 150 132 150 L 140 185 L 60 185 Z" 
          fill="#c78765" 
        />

        {/* ORANGE TOP (With scoop neckline, matching photo) */}
        <path 
          d="M 56 185 C 56 168 64 160 76 160 C 84 160 90 168 100 168 C 110 168 116 160 124 160 C 136 160 144 168 144 185 L 152 210 L 48 210 Z" 
          fill="#ea580c" 
          filter="url(#vectorShadow)"
        />

        {/* GOLD CHAIN & PENDANT (Necklace matching photo) */}
        <path 
          d="M 85 142 Q 100 164 115 142" 
          fill="none" 
          stroke="#fbbf24" 
          strokeWidth="1.2" 
        />
        {/* Pendant loop and small circular crescent star pendant */}
        <line x1="100" y1="163" x2="100" y2="165" stroke="#fbbf24" strokeWidth="1" />
        <circle cx="100" cy="166" r="2.5" fill="#f59e0b" />
        <circle cx="101.2" cy="165.2" r="2" fill="#c78765" opacity="0.9" />

        {/* ==================== HEAD GROUP (Breathing Animation) ==================== */}
        <g 
          className={`origin-[100px_90px] transition-transform duration-1000 ${
            state === 'speaking' ? 'animate-[portraitSpeak_0.6s_infinite_alternate_ease-in-out]' : 'animate-[portraitBreathe_4s_infinite_ease-in-out]'
          }`}
        >
          {/* EARRINGS (Silver/White Hoops matching photo) */}
          <circle cx="67" cy="100" r="4.5" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="133" cy="100" r="4.5" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* FACE OVAL */}
          <path 
            d="M 68 85 C 68 62 82 54 100 54 C 118 54 132 62 132 85 C 132 108 120 125 100 125 C 80 125 68 108 68 85 Z" 
            fill="#cf8b67" 
          />

          {/* SOFT CHEEK BLUSH */}
          <ellipse cx="80" cy="102" rx="7" ry="4" fill="#e11d48" opacity="0.12" />
          <ellipse cx="120" cy="102" rx="7" ry="4" fill="#e11d48" opacity="0.12" />

          {/* NOSE */}
          <path 
            d="M 98 94 Q 100 102 102 102 Q 100 102 98 102" 
            fill="none" 
            stroke="#9f6244" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
          />

          {/* EYEBROWS */}
          <path 
            d="M 77 78 Q 85 73 92 78" 
            fill="none" 
            stroke="#1a1420" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M 108 78 Q 115 73 123 78" 
            fill="none" 
            stroke="#1a1420" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />

          {/* EYES (Blinking eyes matching shape) */}
          <g>
            {/* Left Eye */}
            <ellipse cx="85" cy="85" rx="7.5" ry="6" fill="#ffffff" />
            <circle cx="85" cy="85" r="4.5" fill="#1b120f" />
            <circle cx="86.5" cy="83.5" r="1.2" fill="#ffffff" />
            <path 
              d="M 76 85 Q 85 80 94 85" 
              fill="none" 
              stroke="#130b0a" 
              strokeWidth="1.8" 
            />
            {/* Eyelid Blink Cover */}
            <ellipse 
              cx="85" 
              cy="85" 
              rx="8" 
              ry="0.1" 
              fill="#cf8b67" 
              stroke="#130b0a"
              strokeWidth="0.8"
              className="origin-[85px_79px] animate-[portraitBlink_4.5s_infinite_ease-in-out]" 
            />

            {/* Right Eye */}
            <ellipse cx="115" cy="85" rx="7.5" ry="6" fill="#ffffff" />
            <circle cx="115" cy="85" r="4.5" fill="#1b120f" />
            <circle cx="116.5" cy="83.5" r="1.2" fill="#ffffff" />
            <path 
              d="M 106 85 Q 115 80 124 85" 
              fill="none" 
              stroke="#130b0a" 
              strokeWidth="1.8" 
            />
            {/* Eyelid Blink Cover */}
            <ellipse 
              cx="115" 
              cy="85" 
              rx="8" 
              ry="0.1" 
              fill="#cf8b67" 
              stroke="#130b0a"
              strokeWidth="0.8"
              className="origin-[115px_79px] animate-[portraitBlink_4.5s_infinite_ease-in-out]" 
            />
          </g>

          {/* MOUTH / LIPS (Morphing Lip-sync animation) */}
          <g className="origin-[100px_112px]">
            {state === 'speaking' ? (
              // Speaking mouth shape (open lips showing warm pink)
              <g>
                <path 
                  d="M 88 112 Q 100 124 112 112 C 112 112 100 128 88 112 Z" 
                  fill="#991b1b" 
                />
                <path 
                  d="M 88 112 Q 100 106 112 112 Q 100 126 88 112 Z" 
                  fill="none" 
                  stroke="#db2777" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  className="animate-[portraitMouthTalk_0.16s_infinite_alternate_ease-in-out]"
                />
              </g>
            ) : state === 'thinking' ? (
              // Thinking slight gentle smile
              <path 
                d="M 90 113 Q 100 116 110 113" 
                fill="none" 
                stroke="#db2777" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
            ) : (
              // Idle natural friendly smile matching photo lips
              <g>
                {/* Lip color outline */}
                <path 
                  d="M 88 112 Q 100 121 112 112" 
                  fill="none" 
                  stroke="#db2777" 
                  strokeWidth="4.5" 
                  strokeLinecap="round" 
                />
                {/* Inner smile dividing line */}
                <path 
                  d="M 89 112 Q 100 117 111 112" 
                  fill="none" 
                  stroke="#881337" 
                  strokeWidth="1.2" 
                />
              </g>
            )}
          </g>
        </g>

        {/* HAIR FRONT LAYER (Frames the face, overlaying eyebrows/ears, matching hairstyle) */}
        <path 
          d="M 64 80 C 64 65 72 44 100 44 C 128 44 136 65 136 80 C 136 95 133 115 130 145 C 124 115 125 90 124 82 C 120 62 102 58 92 70 C 86 78 84 100 81 125 C 78 115 76 95 72 145 C 68 115 64 95 64 80 Z" 
          fill="#17131e" 
        />
        {/* Glossy highlights on hair */}
        <path 
          d="M 76 58 Q 92 48 108 58" 
          fill="none" 
          stroke="#312e3f" 
          strokeWidth="2.5" 
          opacity="0.6" 
          strokeLinecap="round"
        />
        <path 
          d="M 122 80 C 121 100 122 115 124 130" 
          fill="none" 
          stroke="#262135" 
          strokeWidth="2.0" 
          opacity="0.8" 
        />
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
                  : 'bg-indigo-500/20'
            }`}
            style={{
              height: state === 'speaking' 
                ? `${[24, 38, 16, 32, 20, 12][i] || 20}px` 
                : state === 'thinking' 
                  ? '16px' 
                  : '6px',
              animation: state === 'speaking' 
                ? `portraitBounceWave 0.5s infinite alternate ease-in-out` 
                : 'none',
              animationDelay: `${i * 0.08}s`
            }}
          />
        ))}
      </div>

      {/* CSS Animation Keyframes Injector */}
      <style>{`
        @keyframes portraitBreathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(0.99); }
        }
        @keyframes portraitBlink {
          0%, 95%, 100% { ry: 0.1; }
          97.5% { ry: 6.5; }
        }
        @keyframes portraitMouthTalk {
          0% { d: path("M 88 112 Q 100 106 112 112 Q 100 126 88 112 Z"); }
          100% { d: path("M 88 112 Q 100 106 112 112 Q 100 114 88 112 Z"); }
        }
        @keyframes portraitSpeak {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-1.5px) scale(1.015); }
        }
        @keyframes portraitBounceWave {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
};
