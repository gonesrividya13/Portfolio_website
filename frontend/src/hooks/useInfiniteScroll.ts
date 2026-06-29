import { useEffect, useState } from 'react';
import { scrollStore } from '../store';

export const useInfiniteScroll = (enabled: boolean = true) => {
  const [distance, setDistance] = useState(scrollStore.getDistance());

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!enabled) return;

      // Only allow scrolling the card if it is currently locked into place (active)
      const scrollContainer = document.querySelector('.active-scroll-card');
      
      if (scrollContainer) {
        const isScrollingDown = e.deltaY > 0;
        // Use a 3px threshold for sub-pixel rendering/scaling issues
        const isAtBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 3;
        const isAtTop = scrollContainer.scrollTop < 3;
        
        // If the active card has room to scroll
        if ((isScrollingDown && !isAtBottom) || (!isScrollingDown && !isAtTop)) {
          // If hovering over the card, let the browser handle it natively (for perfect mobile/trackpad physics)
          if (scrollContainer.contains(e.target as Node)) {
            return;
          } else {
            // If hovering outside, manually forward the scroll to the card at 1:1 speed
            scrollContainer.scrollTop += e.deltaY;
            e.preventDefault();
            return;
          }
        }
      }

      // If we reach here, either there is no locked card (in transit),
      // or the locked card is at its boundary.
      // Prevent default scrolling and advance the 3D globe journey.
      e.preventDefault();
      scrollStore.setDistance(e.deltaY * 0.00001); // Reverted back to the slow, smooth scroll speed
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!enabled) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      
      // Only allow scrolling the card if it is currently locked into place
      const scrollContainer = document.querySelector('.active-scroll-card');
      
      if (scrollContainer) {
        const isScrollingDown = deltaY > 0;
        const isAtBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 3;
        const isAtTop = scrollContainer.scrollTop < 3;
        
        if ((isScrollingDown && !isAtBottom) || (!isScrollingDown && !isAtTop)) {
          if (scrollContainer.contains(e.target as Node)) {
            // We handled it via native scroll, update touch start and do not advance globe
            touchStartY = currentY;
            return;
          } else {
            // Manually scroll if dragging outside the card
            scrollContainer.scrollTop += deltaY;
            touchStartY = currentY;
            e.preventDefault();
            return;
          }
        }
      }

      // If in transit or boundary reached, advance globe
      e.preventDefault();
      scrollStore.setDistance(deltaY * 0.000025); // Reverted back to the slow touch transition speed
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
