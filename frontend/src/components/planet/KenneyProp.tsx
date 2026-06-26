import React from 'react';
import * as THREE from 'three';
import { useGLTF, Clone } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

const AnimatedProp = ({ children, url }: { children: React.ReactNode, url: string }) => {
  const groupRef = React.useRef<THREE.Group>(null);
  
  // Random offset so instances don't move in sync
  const randomOffset = React.useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    if (url.includes('pet')) {
      // Faster, erratic hopping motion for swarms!
      groupRef.current.position.y = Math.max(0, Math.sin(time * 12 + randomOffset) * 0.3);
      groupRef.current.rotation.y = Math.sin(time * 3 + randomOffset) * 0.5;
    } else if (url.includes('flower') || url.includes('grass')) {
      // Gentle swaying in the wind
      groupRef.current.rotation.z = Math.sin(time * 2 + randomOffset) * 0.05;
      groupRef.current.rotation.x = Math.cos(time * 1.5 + randomOffset) * 0.05;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const LampBulb = ({ scene }: { scene: any }) => {
  const distance = useInfiniteScroll();
  
  // Calculate if it is night time
  const cycle = (distance * 0.5) % 1.0;
  const normalizedCycle = cycle < 0 ? 1.0 + cycle : cycle;
  // Day is roughly 0.80 to 1.0, and 0.0 to 0.20. Night is 0.20 to 0.80.
  const isNight = normalizedCycle > 0.20 && normalizedCycle < 0.80;

  // Dynamically find the top of the lamp using its bounding box!
  const box = React.useMemo(() => new THREE.Box3().setFromObject(scene), [scene]);
  
  // The highest point on Y axis is the lamp head. 
  // We place the bulb right at the top center.
  const bulbY = box.max.y - 0.1;
  const bulbX = (box.min.x + box.max.x) / 2;
  const bulbZ = box.min.z + 0.2; // Guessing the curve goes towards -Z

  return (
    <group position={[bulbX, bulbY, bulbZ]}>
      {isNight && (
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#fffaaa" />
        </mesh>
      )}
      {/* We add a tiny PointLight to cast actual light on the road at night! */}
      {isNight && <pointLight color="#fffaaa" intensity={2} distance={8} decay={2} />}
    </group>
  );
};

export const KenneyProp = ({ url, position, quaternion, scale = 1, baseScale = 1 }: any) => {
  const { scene } = useGLTF(url);
  const isLamp = url.includes('light-curved');
  
  return (
    <group position={position} quaternion={quaternion} scale={baseScale * scale}>
      <AnimatedProp url={url}>
        <Clone object={scene} castShadow receiveShadow />
      </AnimatedProp>
      {isLamp && <LampBulb scene={scene} />}
    </group>
  );
};
