import { useEffect, useState } from 'react';
import { scrollStore } from '../store';

export const useInfiniteScroll = (enabled: boolean = true) => {
  const [distance, setDistance] = useState(scrollStore.getDistance());

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!enabled) return;
      // Prevent default scrolling
      e.preventDefault();
      scrollStore.setDistance(e.deltaY * 0.00003); // Extremely slow crawling speed for guided tour
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!enabled) return;
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      scrollStore.setDistance(deltaY * 0.00008); // Extremely slow crawling speed for guided tour
      touchStartY = currentY;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabled) return;
      // Speed of driving via keyboard
      const keySpeed = 0.001; // Extremely slow crawling speed
      
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ': // Spacebar
          e.preventDefault();
          scrollStore.setDistance(keySpeed);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          scrollStore.setDistance(-keySpeed);
          break;
      }
    };

    // We must use passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    const unsubscribe = scrollStore.subscribe(setDistance);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribe();
    };
  }, [enabled]);

  return distance;
};
