import React from 'react';
import { Canvas } from '@react-three/fiber';

import { CutePlanet } from './planet/CutePlanet';

export const Scroll3DCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 2, 9], fov: 40 }} shadows dpr={[1, 1.5]}>
        <CutePlanet />
      </Canvas>
    </div>
  );
};
