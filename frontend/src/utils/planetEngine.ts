import * as THREE from 'three';

export interface SceneryItem {
  url: string;
  baseScale: number;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  scale: number;
}

export const BUILDINGS = {
  SUBURBAN: ['suburban_house_a.glb', 'suburban_house_b.glb', 'suburban_house_c.glb', 'suburban_house_d.glb', 'suburban_house_e.glb'],
  COMMERCIAL: [
    'building-c.glb', 'building-f.glb', 'building-g.glb', 
    'building-k.glb', 'building-m.glb',
    'building-skyscraper-a.glb', 'building-skyscraper-d.glb'
  ],
  INDUSTRIAL: ['industrial_building_c.glb', 'industrial_building_b.glb', 'industrial_building_d.glb'],
  PETS: ['pet_beaver.glb', 'pet_bee.glb', 'pet_bunny.glb', 'pet_cat.glb', 'pet_caterpillar.glb', 'pet_chick.glb', 'pet_cow.glb', 'pet_crab.glb', 'pet_deer.glb', 'pet_dog.glb', 'pet_elephant.glb', 'pet_fish.glb', 'pet_fox.glb', 'pet_giraffe.glb', 'pet_hog.glb', 'pet_koala.glb', 'pet_lion.glb', 'pet_monkey.glb', 'pet_panda.glb', 'pet_parrot.glb', 'pet_penguin.glb', 'pet_pig.glb', 'pet_polar.glb', 'pet_tiger.glb']
};

export const getPathPoint = (t: number, radius: number): THREE.Vector3 => {
  const theta = t;
  const phi = Math.PI / 2 + Math.sin(theta * 4) * 0.35;
  
  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
};

export const getPathFrame = (t: number, radius: number) => {
  const p = getPathPoint(t, radius);
  const delta = 0.01;
  const p2 = getPathPoint(t + delta, radius);
  
  const forward = new THREE.Vector3().subVectors(p2, p).normalize();
  const up = p.clone().normalize();
  const right = forward.clone().cross(up).normalize();
  const trueForward = up.clone().cross(right).normalize();
  
  return { position: p, forward: trueForward, up, right };
};

export const generatePlanetScenery = (radius: number, buildingElevation: number, roadElevation: number): { items: SceneryItem[], pondCenter: THREE.Vector3 | null } => {
  const items: SceneryItem[] = [];
  let pondCenter: THREE.Vector3 | null = null;
  const adjustedBuildingElevation = buildingElevation - 0.02;
  const up = new THREE.Vector3(0, 1, 0);
  
  // A) GENERATE THE WINDING ROAD
  const numRoads = 120;
  for (let i = 0; i < numRoads; i++) {
    const t = (i / numRoads) * Math.PI * 2;
    const frame = getPathFrame(t, roadElevation);
    
    const negForward = frame.forward.clone().negate();
    const matrix = new THREE.Matrix4().makeBasis(frame.right, frame.up, negForward);
    const q = new THREE.Quaternion().setFromRotationMatrix(matrix);
    const rotateY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    q.multiply(rotateY);

    items.push({
      url: '/assets/road-straight.glb',
      baseScale: 1.1,
      position: [frame.position.x, frame.position.y, frame.position.z],
      quaternion: [q.x, q.y, q.z, q.w],
      scale: 1
    });

    // Add Street Lamps every 3 tiles, alternating sides
    if (i % 3 === 0) {
      const isRightSide = (i % 6 === 0);
      const sideOffset = isRightSide ? 0.95 : -0.95;
      
      const lampPos = frame.position.clone().add(frame.right.clone().multiplyScalar(sideOffset));
      const lampForward = isRightSide ? frame.right.clone().negate() : frame.right.clone();
      const lampNegForward = lampForward.clone().negate();
      const lampRight = lampForward.clone().cross(frame.up).normalize();
      
      const lampMatrix = new THREE.Matrix4().makeBasis(lampRight, frame.up, lampNegForward);
      const lampQ = new THREE.Quaternion().setFromRotationMatrix(lampMatrix);

      items.push({
        url: '/assets/light-curved.glb',
        baseScale: 1.0,
        position: [lampPos.x, lampPos.y, lampPos.z],
        quaternion: [lampQ.x, lampQ.y, lampQ.z, lampQ.w],
        scale: 1
      });
    }
  }

  // B) GENERATE QUADRANTS
  
  // Helper to place items aligned to the road
  const placeAlignedItem = (t: number, phiOffset: number, url: string, baseScale: number, randomScaleFactor: number = 0.4) => {
    const roadPhi = Math.PI / 2 + Math.sin(t * 4) * 0.35;
    const phi = roadPhi + phiOffset;
    if (phi < 0.1 || phi > Math.PI - 0.1) return;

    const cx = radius * Math.cos(t) * Math.sin(phi);
    const cy = radius * Math.sin(t) * Math.sin(phi);
    const cz = radius * Math.cos(phi);
    const center = new THREE.Vector3(cx, cy, cz);
    
    // Slight jitter to prevent perfect Z-fighting
    const jitter = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
    );
    const pos = center.clone().add(jitter).normalize().multiplyScalar(adjustedBuildingElevation);

    const roadPoint = getPathPoint(t, buildingElevation);
    const surfaceNormal = pos.clone().normalize();
    const forward = new THREE.Vector3().subVectors(roadPoint, pos).normalize();
    const right = forward.clone().cross(surfaceNormal).normalize();
    const correctedForward = surfaceNormal.clone().cross(right).normalize();
    const negCorrectedForward = correctedForward.clone().negate();
    
    const matrix = new THREE.Matrix4().makeBasis(right, surfaceNormal, negCorrectedForward);
    const q = new THREE.Quaternion().setFromRotationMatrix(matrix);

    items.push({
      url,
      baseScale,
      position: [pos.x, pos.y, pos.z],
      quaternion: [q.x, q.y, q.z, q.w],
      scale: Math.random() * randomScaleFactor + (1.0 - randomScaleFactor/2)
    });
  };

  // 1. DOWNTOWN METROPOLIS (t = 0 to PI/2)
  // Increased step from 0.05 to 0.08 to reduce the total number of buildings
  for (let t = 0.05; t < Math.PI / 2 - 0.1; t += 0.08) {
    // Dense grid: push rows back to prevent road clipping
    const rows = [0.25, 0.45, -0.25, -0.45];
    for (const offset of rows) {
      if (Math.random() > 0.8) continue; // slight gaps
      const url = `/assets/${BUILDINGS.COMMERCIAL[Math.floor(Math.random() * BUILDINGS.COMMERCIAL.length)]}`;
      // Lower baseScale since these assets are large
      placeAlignedItem(t, offset, url, 0.25, 0.2); 
    }
  }

  // 2. SUBURBAN VILLAGE (t = PI/2 to PI)
  for (let t = Math.PI / 2 + 0.1; t < Math.PI - 0.1; t += 0.08) {
    // Sparse grid: single row on each side, pushed back slightly
    const rows = [0.25, -0.25];
    for (const offset of rows) {
      if (Math.random() > 0.6) continue; // more sparse
      const url = `/assets/${BUILDINGS.SUBURBAN[Math.floor(Math.random() * BUILDINGS.SUBURBAN.length)]}`;
      placeAlignedItem(t, offset, url, 0.3, 0.1);
      
      // Maybe place a pet in the yard
      if (Math.random() > 0.5) {
        const petUrl = `/assets/${BUILDINGS.PETS[Math.floor(Math.random() * BUILDINGS.PETS.length)]}`;
        placeAlignedItem(t, offset + (Math.random()>0.5 ? 0.05 : -0.05), petUrl, 0.08, 0.2);
      }
    }
  }

  // 3. INDUSTRIAL COMPLEX (t = PI to 3PI/2)
  for (let t = Math.PI + 0.1; t < Math.PI * 1.5 - 0.1; t += 0.12) {
    // Loose pattern
    const rows = [0.3, -0.3, 0.5, -0.5];
    for (const offset of rows) {
      if (Math.random() > 0.4) {
        const url = `/assets/${BUILDINGS.INDUSTRIAL[Math.floor(Math.random() * BUILDINGS.INDUSTRIAL.length)]}`;
        placeAlignedItem(t, offset, url, 0.5, 0.3);
      } else if (Math.random() > 0.8) {
        placeAlignedItem(t, offset, '/assets/construction-cone.glb', 0.15, 0.1);
      }
    }
  }

  // 4. SAFARI FOREST (t = 3PI/2 to 2PI)
  // Increased density from 0.03 to 0.015
  for (let t = Math.PI * 1.5; t < Math.PI * 2; t += 0.015) {
    // Organic scattering
    const offset = (Math.random() - 0.5) * 1.5;
    if (Math.abs(offset) < 0.2) continue; // keep road clear
    
    // Make it mostly dense trees
    const isForest = Math.random() > 0.1;
    if (isForest) {
      // Pines on the right side of the road, default trees on the left
      const isPine = offset > 0;
      placeAlignedItem(t, offset, isPine ? '/assets/tree_pineDefaultA.glb' : '/assets/tree_default.glb', 0.35, 0.4);
    } else {
      if (Math.random() > 0.5) placeAlignedItem(t, offset, '/assets/rock_largeA.glb', 0.2, 0.5);
      else placeAlignedItem(t, offset, '/assets/grass_large.glb', 0.2, 0.2);
    }
  }

  // C) GENERATE FIXED POINTS OF INTEREST (POIs) FOR THE AI TOUR GUIDE
  const pois = [
    { theta: 0.5, name: 'Mega-Corp Skyscraper', biome: 'commercial' as const },
    { theta: 3.5, name: 'Industrial Complex', biome: 'industrial' as const }, // moved to 3.5 to be in industrial zone
    { theta: 5.0, name: 'Elephant Stampede', biome: 'farm' as const }, // in Safari zone
    { theta: 5.8, name: 'Whispering Pines', biome: 'farm' as const } // Dense pine forest POI
  ];

  for (const poi of pois) {
    const roadPhi = Math.PI / 2 + Math.sin(poi.theta * 4) * 0.35;
    
    // Push the centerpieces further back from the road so they don't clip when scaled up
    const phiOffset = 0.45; 
    const phi = roadPhi + phiOffset;
    const cx = radius * Math.cos(poi.theta) * Math.sin(phi);
    const cy = radius * Math.sin(poi.theta) * Math.sin(phi);
    const cz = radius * Math.cos(phi);
    const center = new THREE.Vector3(cx, cy, cz);
    const surfaceNormal = center.clone().normalize();
    
    const arbitraryRight = up.clone().cross(surfaceNormal).normalize();
    const arbitraryForward = surfaceNormal.clone().cross(arbitraryRight).normalize();
    const arbitraryNegForward = arbitraryForward.clone().negate();
    const matrix = new THREE.Matrix4().makeBasis(arbitraryRight, surfaceNormal, arbitraryNegForward);
    const q = new THREE.Quaternion().setFromRotationMatrix(matrix);

    if (poi.biome === 'commercial') {
      // Build a multi-tiered mega skyscraper using the new kit assets!
      
      // Base layer (massive building block)
      items.push({
        url: '/assets/building-j.glb', // A large block building
        baseScale: 0.4,
        position: [center.x, center.y, center.z],
        quaternion: [q.x, q.y, q.z, q.w],
        scale: 1.5
      });

      // Middle layer (skyscraper)
      // Since normal is surfaceNormal, we translate the position along the surface normal
      // A building of baseScale 0.4 * scale 1.5 is roughly 0.6 units tall.
      const midPos = center.clone().add(surfaceNormal.clone().multiplyScalar(0.4));
      items.push({
        url: '/assets/building-skyscraper-d.glb', 
        baseScale: 0.4,
        position: [midPos.x, midPos.y, midPos.z],
        quaternion: [q.x, q.y, q.z, q.w],
        scale: 1.2
      });

      // Top spire
      const topPos = center.clone().add(surfaceNormal.clone().multiplyScalar(1.2));
      items.push({
        url: '/assets/building-skyscraper-e.glb', // Spire-like
        baseScale: 0.4,
        position: [topPos.x, topPos.y, topPos.z],
        quaternion: [q.x, q.y, q.z, q.w],
        scale: 0.8
      });
    } else if (poi.biome === 'industrial') {
      items.push({
        url: '/assets/industrial_building_d.glb',
        baseScale: 0.8,
        position: [center.x, center.y, center.z],
        quaternion: [q.x, q.y, q.z, q.w],
        scale: 1.5 
      });
    } else if (poi.biome === 'farm') {
      // Elephant Stampede
      for (let j = 0; j < 8; j++) {
        const spread = 0.4;
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread
        );
        const pos = center.clone().add(offset).normalize().multiplyScalar(adjustedBuildingElevation);
        const sn = pos.clone().normalize();
        const ar = up.clone().cross(sn).normalize();
        const af = sn.clone().cross(ar).normalize();
        const m = new THREE.Matrix4().makeBasis(ar, sn, af.clone().negate());
        const iq = new THREE.Quaternion().setFromRotationMatrix(m);
        
        items.push({
          url: '/assets/pet_elephant.glb',
          baseScale: 0.15,
          position: [pos.x, pos.y, pos.z],
          quaternion: [iq.x, iq.y, iq.z, iq.w],
          scale: 1.5
        });
      }
      // Put a pond right next to the elephants, closer to the road
      const pondPhi = roadPhi + 0.25; // Close to the road edge
      const pcx = radius * Math.cos(poi.theta) * Math.sin(pondPhi);
      const pcy = radius * Math.sin(poi.theta) * Math.sin(pondPhi);
      const pcz = radius * Math.cos(pondPhi);
      pondCenter = new THREE.Vector3(pcx, pcy, pcz).normalize().multiplyScalar(adjustedBuildingElevation);
    }
  }

  return { items, pondCenter };
};
