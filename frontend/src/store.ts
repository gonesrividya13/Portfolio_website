type Listener = (distance: number) => void;

class ScrollStore {
  targetDistance: number = 0;
  currentDistance: number = 0;
  isNavigating: boolean = false;
  listeners: Set<Listener> = new Set();
  lerpFactor: number = 0.05; // 5% approach per frame

  constructor() {
    this.update = this.update.bind(this);
    requestAnimationFrame(this.update);
  }

  setDistance(delta: number) {
    this.targetDistance += delta;
  }

  getDistance() {
    return this.currentDistance;
  }

  scrollToDistance(targetMod: number, loopLength: number = 10) {
    const currentMod = this.targetDistance % loopLength;
    let diff = targetMod - currentMod;
    
    // Find shortest path on the cylinder
    if (diff > loopLength / 2) diff -= loopLength;
    if (diff < -loopLength / 2) diff += loopLength;
    
    this.targetDistance += diff;
    // If the jump is significant (e.g. more than 0.5 distance), treat it as a navigation jump
    if (Math.abs(diff) > 0.5) {
      this.isNavigating = true;
    }
  }

  getIsNavigating() {
    return this.isNavigating;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update() {
    // Lerp from current to target
    const diff = this.targetDistance - this.currentDistance;
    if (Math.abs(diff) > 0.0001) {
      this.currentDistance += diff * this.lerpFactor;
      this.listeners.forEach(l => l(this.currentDistance));
    } else {
      if (this.isNavigating) {
        this.isNavigating = false;
        // Trigger listeners one last time with navigation finished
        this.listeners.forEach(l => l(this.currentDistance));
      }
    }
    requestAnimationFrame(this.update);
  }
}

export const scrollStore = new ScrollStore();
