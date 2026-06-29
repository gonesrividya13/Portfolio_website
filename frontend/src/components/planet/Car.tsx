import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';
import * as THREE from 'three';

export const Car = ({ radius }: { radius: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/assets/car_sedan.glb');

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Bouncing animation to simulate driving suspension (slowed down)
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.03;
    }
  });

  return (
    // The car sits exactly at the top of the planet.
    // It faces AWAY from the camera (-Z axis) since our inverse rotation maps the road's forward to -Z.
    <group position={[0, radius + 0.05, 0]} rotation={[0, Math.PI, 0]}>
      <group ref={groupRef} scale={0.4}>
        <Clone object={scene} castShadow receiveShadow />
      </group>
    </group>
  );
};
