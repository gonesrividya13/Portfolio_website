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
  COMMERCIAL: ['commercial_building_a.glb', 'commercial_building_b.glb', 'commercial_building_c.glb', 'commercial_skyscraper_a.glb', 'commercial_skyscraper_b.glb', 'commercial_skyscraper_c.glb'],
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

export const generatePlanetScenery = (radius: number, buildingElevation: number, roadElevation: number): SceneryItem[] => {
  const items: SceneryItem[] = [];
  const adjustedBuildingElevation = buildingElevation - 0.02;
  
  // A) GENERATE THE WINDING ROAD
  const numRoads = 120;
  for (let i = 0; i < numRoads; i++) {
    const t = (i / numRoads) * Math.PI * 2;
    const frame = getPathFrame(t, roadElevation);
    
    // We corrected Kenney models to act as standard Y-up models in Three.js!
    // Local Y = Up
    // Local -Z = Forward
    // X = right, Y = up, Z = -forward
    const negForward = frame.forward.clone().negate();
    const matrix = new THREE.Matrix4().makeBasis(frame.right, frame.up, negForward);
    const q = new THREE.Quaternion().setFromRotationMatrix(matrix);

    // Spin the road tile 90 degrees around its local Up (Y) axis so the painted lines align with the path
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
      const sideOffset = isRightSide ? 0.95 : -0.95; // distance from road center
      
      const lampPos = frame.position.clone().add(frame.right.clone().multiplyScalar(sideOffset));
      
      // Lamp should face the road
      const lampForward = isRightSide ? frame.right.clone().negate() : frame.right.clone();
      const lampNegForward = lampForward.clone().negate();
      const lampRight = lampForward.clone().cross(frame.up).normalize();
      
      const lampMatrix = new THREE.Matrix4().makeBasis(lampRight, frame.up, lampNegForward);
      const lampQ = new THREE.Quaternion().setFromRotationMatrix(lampMatrix);

      items.push({
        url: '/assets/light-curved.glb',
        baseScale: 1.0, // Increased to 1.0 so it's properly scaled relative to the car
        position: [lampPos.x, lampPos.y, lampPos.z],
        quaternion: [lampQ.x, lampQ.y, lampQ.z, lampQ.w],
        scale: 1
      });
    }
  }

  // B) GENERATE BIOMES (Clusters)
  // We'll increase the number of clusters to make the road feel populated
  const numClusters = 120;
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < numClusters; i++) {
    // Pick a random spot along the road's theta
    const theta = Math.random() * Math.PI * 2;
    const roadPhi = Math.PI / 2 + Math.sin(theta * 4) * 0.35;
    
    // Offset from the road to place the cluster
    // Use a distribution that favors being closer to the road, but also spans outwards
    const phiOffset = (Math.random() - 0.5) * 1.5; 
    const phi = roadPhi + phiOffset;
    
    // Ensure phi is within sphere bounds
    if (phi < 0.1 || phi > Math.PI - 0.1) continue;

    const cx = radius * Math.cos(theta) * Math.sin(phi);
    const cy = radius * Math.sin(theta) * Math.sin(phi);
    const cz = radius * Math.cos(phi);
    const center = new THREE.Vector3(cx, cy, cz);

    // Determine biome based on distance from the road (phiOffset) and theta sector
    let biome = 'nature';
    const distFromRoad = Math.abs(phiOffset);

    if (distFromRoad > 0.4) {
      // Outskirts: heavily favor nature (trees, rocks)
      biome = 'nature';
    } else {
      // Near the road: buildings and farms
      if (theta < 1.0) biome = 'commercial';
      else if (theta < 2.0) biome = 'suburban';
      else if (theta < 3.0) biome = 'industrial';
      else if (theta < 4.0) biome = 'holiday';
      else biome = 'farm'; // 4.0 to 2*PI
    }

    // Number of items depends on biome
    let itemsInCluster = Math.floor(Math.random() * 4) + 2; // Default sparse
    if (biome === 'farm') {
      itemsInCluster = Math.floor(Math.random() * 15) + 10; // Swarms of animals!
    } else if (['commercial', 'suburban', 'industrial'].includes(biome)) {
      itemsInCluster = Math.floor(Math.random() * 5) + 3; // Dense buildings
    } else if (biome === 'nature') {
      itemsInCluster = Math.floor(Math.random() * 8) + 4; // Dense forests
    }

    for (let j = 0; j < itemsInCluster; j++) {
      // Spread items tighter for swarms, wider for forests
      const spread = biome === 'farm' ? 1.5 : (biome === 'nature' ? 6.0 : 4.0);
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      );
      
      const pos = center.clone().add(offset).normalize().multiplyScalar(adjustedBuildingElevation);
      
      let objTheta = Math.atan2(pos.y, pos.x);
      if (objTheta < 0) objTheta += Math.PI * 2;
      
      const expectedPhi = Math.PI / 2 + Math.sin(objTheta * 4) * 0.35;
      const objPhi = Math.acos(pos.z / adjustedBuildingElevation);
      
      if (Math.abs(objPhi - expectedPhi) < 0.15) continue;

      const surfaceNormal = pos.clone().normalize();
      
      // Default nature objects (Y-Up aligned to normal)
      const arbitraryRight = up.clone().cross(surfaceNormal).normalize();
      if (arbitraryRight.lengthSq() < 0.001) arbitraryRight.set(1, 0, 0);
      const arbitraryForward = surfaceNormal.clone().cross(arbitraryRight).normalize();
      
      const arbitraryNegForward = arbitraryForward.clone().negate();
      let matrix = new THREE.Matrix4().makeBasis(arbitraryRight, surfaceNormal, arbitraryNegForward);
      let q = new THREE.Quaternion().setFromRotationMatrix(matrix);

      let url = '';
      let baseScale = 0.2;
      const rand = Math.random();

      if (biome === 'commercial') {
        if (rand > 0.7) url = `/assets/${BUILDINGS.COMMERCIAL[Math.floor(Math.random() * BUILDINGS.COMMERCIAL.length)]}`;
        else if (rand > 0.4) url = `/assets/${BUILDINGS.COMMERCIAL[Math.floor(Math.random() * BUILDINGS.COMMERCIAL.length)]}`;
        else { url = '/assets/sign-highway.glb'; baseScale = 0.2; }
        if (!url.includes('sign')) baseScale = 0.4;
      } else if (biome === 'suburban') {
        if (rand > 0.4) { url = `/assets/${BUILDINGS.SUBURBAN[Math.floor(Math.random() * BUILDINGS.SUBURBAN.length)]}`; baseScale = 0.3; }
        else if (rand > 0.2) { url = `/assets/${BUILDINGS.PETS[Math.floor(Math.random() * BUILDINGS.PETS.length)]}`; baseScale = 0.08; } // Scattered pets
        else { url = '/assets/flower_purpleA.glb'; baseScale = 0.15; }
      } else if (biome === 'industrial') {
        if (rand > 0.4) { url = `/assets/${BUILDINGS.INDUSTRIAL[Math.floor(Math.random() * BUILDINGS.INDUSTRIAL.length)]}`; baseScale = 0.4; }
        else { url = '/assets/construction-cone.glb'; baseScale = 0.15; }
      } else if (biome === 'holiday') {
        if (rand > 0.7) url = '/assets/holiday_snowman.glb';
        else if (rand > 0.4) url = '/assets/holiday_present.glb';
        else url = '/assets/holiday_tree.glb';
        baseScale = 0.3;
      } else if (biome === 'farm') {
        if (rand > 0.3) {
           url = `/assets/${BUILDINGS.PETS[Math.floor(Math.random() * BUILDINGS.PETS.length)]}`; 
           baseScale = 0.08; 
        }
        else if (rand > 0.15) { url = '/assets/flower_redA.glb'; baseScale = 0.2; }
        else { url = '/assets/tree_default.glb'; baseScale = 0.3; }

      } else {
        if (rand > 0.8) { url = '/assets/rock_largeA.glb'; baseScale = 0.2; }
        else if (rand > 0.6) { url = '/assets/mushroom_red.glb'; baseScale = 0.3; }
        else if (rand > 0.5) { url = `/assets/${BUILDINGS.PETS[Math.floor(Math.random() * BUILDINGS.PETS.length)]}`; baseScale = 0.08; } // Wild animals!
        else if (rand > 0.3) { url = '/assets/grass_large.glb'; baseScale = 0.2; }
        else { url = '/assets/tree_pineDefaultA.glb'; baseScale = 0.35; }
      }

      if (['commercial', 'suburban', 'industrial'].includes(biome)) {
        const roadPoint = getPathPoint(objTheta, buildingElevation);
        const forward = new THREE.Vector3().subVectors(roadPoint, pos).normalize();
        
        const right = forward.clone().cross(surfaceNormal).normalize();
        const correctedForward = surfaceNormal.clone().cross(right).normalize();
        const negCorrectedForward = correctedForward.clone().negate();
        
        matrix = new THREE.Matrix4().makeBasis(right, surfaceNormal, negCorrectedForward);
        q = new THREE.Quaternion().setFromRotationMatrix(matrix);
      }

      items.push({
        url,
        baseScale,
        position: [pos.x, pos.y, pos.z],
        quaternion: [q.x, q.y, q.z, q.w],
        scale: Math.random() * 0.4 + 0.8 
      });
    }
  }

  return items;
};
