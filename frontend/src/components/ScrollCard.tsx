import React from 'react';

interface ScrollCardProps {
  distance: number;
  centerDistance: number;
  loopLength: number;
  align?: 'left' | 'right' | 'center';
  children: React.ReactNode;
}

export const ScrollCard: React.FC<ScrollCardProps> = ({ distance, centerDistance, loopLength, align = 'left', children }) => {
  // Find the shortest path diff around the looping track
  let diff = (distance % loopLength) - centerDistance;
  if (diff > loopLength / 2) diff -= loopLength;
  if (diff < -loopLength / 2) diff += loopLength;

  // Render optimization: If the card is far away, we can just display:none
  const isVisible = Math.abs(diff) < 1.5;

  // Calculate Y offset and opacity
  let yOffset = 0; // in vh
  let opacity = 0;
  
  // The distance window where the card stays perfectly still in the center of the screen
  const pauseRange = 0.4;
  
  if (diff < -pauseRange) {
    // Coming up from the bottom of the screen
    yOffset = -(diff + pauseRange) * 150; 
    opacity = 1 - Math.abs(diff + pauseRange) * 1.5;
  } else if (diff > pauseRange) {
    // Scrolling up and disappearing off the top
    yOffset = -(diff - pauseRange) * 150;
    opacity = 1 - Math.abs(diff - pauseRange) * 1.5;
  } else {
    // Paused perfectly in the center for reading
    yOffset = 0;
    opacity = 1;
  }
  
  const alignmentClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

  return (
    <div 
      className={`absolute inset-0 flex flex-col md:flex-row items-center p-8 md:p-24 pointer-events-none ${alignmentClass}`}
      style={{
        transform: `translateY(${yOffset}vh)`,
        opacity: Math.max(0, Math.min(1, opacity)),
        pointerEvents: Math.abs(diff) < pauseRange + 0.1 ? 'auto' : 'none',
        display: isVisible ? 'flex' : 'none'
      }}
    >
      <div className={`w-full ${align === 'center' ? 'max-w-4xl' : 'md:w-1/2'} bg-white/20 dark:bg-black/30 backdrop-blur-md p-8 rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl pointer-events-auto max-h-[85vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
};
