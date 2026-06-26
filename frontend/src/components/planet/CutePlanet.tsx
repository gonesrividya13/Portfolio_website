import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { KenneyProp } from './KenneyProp';
import { Car } from './Car';
import { generatePlanetScenery, getPathFrame } from '../../utils/planetEngine';
import { scrollStore } from '../../store';

export const CutePlanet = () => {
  const planetRef = useRef<THREE.Group>(null);
  const skyRef = useRef<THREE.Group>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const sunMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const moonMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const starsRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Group>(null);

  const dayColor = useMemo(() => new THREE.Color('#ffffff'), []);
  const sunsetColor = useMemo(() => new THREE.Color('#ffaa55'), []);
  const nightColor = useMemo(() => new THREE.Color('#312e81'), []);
  const currentColor = useMemo(() => new THREE.Color(), []);

  const radius = 8;
  const buildingElevation = radius;
  const roadElevation = radius + 0.05;    

  const { items, pondCenter } = useMemo(() => {
    return generatePlanetScenery(radius, buildingElevation, roadElevation);
  }, [radius, buildingElevation, roadElevation]);

  const pondRotation = useMemo(() => {
    if (!pondCenter) return new THREE.Euler();
    const normal = pondCenter.clone().normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    return new THREE.Euler().setFromQuaternion(q);
  }, [pondCenter]);

  useFrame(() => {
    const distance = scrollStore.getDistance();
    
    if (planetRef.current) {
      // Loop the road continuously based on distance
      const t = distance * Math.PI * 2; 
      const frame = getPathFrame(t, radius);
      
      const zAxis = frame.forward.clone().negate();
      const yAxis = frame.up;                       
      const xAxis = yAxis.clone().cross(zAxis).normalize(); 
      
      const planetMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
      const invQ = new THREE.Quaternion().setFromRotationMatrix(planetMatrix.clone().transpose());
      planetRef.current.quaternion.copy(invQ);
    }

    // distance of 1.0 is one full day/night cycle
    const cycle = (distance * 0.5) % 1.0; 
    const normalizedCycle = cycle < 0 ? 1.0 + cycle : cycle; // handle negative scrolling

    // Calculate time of day (0 to 1) -> 0=Midday, 0.25=Sunset, 0.5=Midnight, 0.75=Sunrise
    const angle = normalizedCycle * Math.PI * 2;
    
    // Calculate explicit positions for Sun and Moon in a PERFECT circle to match planetary curvature.
    // By lowering the center of the orbit and pushing it deep (Z = -40), 
    // the arc looks perfectly round, stays on screen at midday, and sets off-screen at the horizon!
    const orbitRadius = 30; 
    const orbitCenterY = -15;
    const bgZ = -40;

    // Use a negative angle so it rises on the left and sets on the right properly
    const sunX = Math.sin(-angle) * orbitRadius;
    const sunY = orbitCenterY + Math.cos(-angle) * orbitRadius;
    
    const moonX = Math.sin(-angle + Math.PI) * orbitRadius;
    const moonY = orbitCenterY + Math.cos(-angle + Math.PI) * orbitRadius;

    if (skyRef.current) {
      // Find the meshes inside skyRef and position them
      const sunMesh = skyRef.current.children[1];
      const moonMesh = skyRef.current.children[2];
      
      if (sunMesh) sunMesh.position.set(sunX, sunY, bgZ);
      if (moonMesh) moonMesh.position.set(moonX, moonY, bgZ);
      
      // Light follows the sun, or if sun is below horizon, light turns off (intensity drops anyway)
    }

    // Calculate light intensity and color using sine waves
    const sunHeight = Math.cos(angle); // 1 at midday, -1 at midnight
    
    // The sun crosses the horizon (Y=0) when Math.cos(angle) = 0.5 because orbitCenterY is -15 and radius is 30.
    // So the sunset transition should happen between sunHeight 0.7 and 0.3
    let ambientIntensity: number;
    let dirIntensity: number;
    let isNight = false;

    if (sunHeight > 0.7) {
      // Full Day
      currentColor.copy(dayColor);
      ambientIntensity = 2.0;
      dirIntensity = 1.5;
      if (starsRef.current) starsRef.current.visible = false;
      if (cloudsRef.current) cloudsRef.current.visible = true;
    } else if (sunHeight > 0.3) {
      // Sunset / Sunrise transition
      const t = (sunHeight - 0.3) / 0.4; // 0 at bottom (0.3), 1 at top (0.7)
      currentColor.lerpColors(sunsetColor, dayColor, t);
      ambientIntensity = 0.8 + t * 1.2; // lerps from 0.8 to 2.0
      dirIntensity = t * 1.5; // Fades out completely before crossing the horizon!
      if (starsRef.current) starsRef.current.visible = true;
      if (cloudsRef.current) cloudsRef.current.visible = true;
    } else {
      // Full Night
      currentColor.copy(nightColor);
      ambientIntensity = 0.8;
      dirIntensity = 0.3; // Gentle moonlight
      isNight = true;
      if (starsRef.current) starsRef.current.visible = true;
      if (cloudsRef.current) cloudsRef.current.visible = false;
    }

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientIntensity * 0.4; 
      ambientLightRef.current.color.copy(currentColor);
    }

    if (dirLightRef.current) {
      if (isNight) {
        // At night, the directional light becomes the Moon!
        dirLightRef.current.position.set(moonX, moonY, bgZ);
        dirLightRef.current.color.copy(nightColor);
      } else {
        // During day, it follows the Sun
        dirLightRef.current.position.set(sunX, sunY, bgZ);
        dirLightRef.current.color.copy(currentColor);
      }
      dirLightRef.current.intensity = dirIntensity;
    }
  });


  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={1} color="#ffffff" />
      
      {/* Sky Group (Sun, Moon, Light) are manually positioned in useFrame */}
      <group ref={skyRef}>
        <directionalLight ref={dirLightRef} position={[0, 12, 0]} intensity={2} color="#ffffff" castShadow />
        
        {/* Sun */}
        <mesh position={[0, 12, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial ref={sunMaterialRef} color="#ffeeba" />
        </mesh>

        {/* Moon */}
        <mesh position={[0, -12, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial ref={moonMaterialRef} color="#cdddf2" />
        </mesh>
      </group>

      <group ref={starsRef}>
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </group>

      {/* Floating Clouds during Day */}
      <group ref={cloudsRef}>
        <group position={[5, 10, -10]} scale={0.5}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[1.5, 0, 0]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[-1.5, -0.5, 0]}>
            <sphereGeometry args={[1.8, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </group>

        <group position={[-8, 12, -15]} scale={0.6}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[1.5, 0, 0]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        </group>
      </group>
      
      {/* The Rotating Planet and Stationary Car */}
      <group position={[0, -radius, 0]}>
        <group ref={planetRef}>
          <Sphere args={[radius, 64, 64]} receiveShadow>
            <meshStandardMaterial color="#86efac" roughness={0.9} />
          </Sphere>
          
          <React.Suspense fallback={null}>
            {items.map((item, idx) => (
              <KenneyProp 
                key={`prop-${idx}`}
                url={item.url}
                position={item.position}
                quaternion={item.quaternion}
                baseScale={item.baseScale}
                scale={item.scale}
              />
            ))}
          </React.Suspense>

          {/* Render the Pond */}
          {pondCenter && (
            <mesh position={pondCenter} rotation={pondRotation}>
              <cylinderGeometry args={[0.5, 0.5, 0.05, 16]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.8} />
            </mesh>
          )}
        </group>

        {/* The Driving Car (Stationary at Top) */}
        <React.Suspense fallback={null}>
          <Car radius={radius} />
        </React.Suspense>
      </group>
    </>
  );
};
