type Listener = (distance: number) => void;

class ScrollStore {
  targetDistance: number = 0;
  currentDistance: number = 0;
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

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update() {
    // Lerp from current to target
    if (Math.abs(this.targetDistance - this.currentDistance) > 0.0001) {
      this.currentDistance += (this.targetDistance - this.currentDistance) * this.lerpFactor;
      this.listeners.forEach(l => l(this.currentDistance));
    }
    requestAnimationFrame(this.update);
  }
}

export const scrollStore = new ScrollStore();
