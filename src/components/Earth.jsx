// src/components/Earth.jsx
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping, MeshStandardMaterial, SRGBColorSpace } from 'three';
import { Sphere } from '@react-three/drei';

function Earth(props) {
  const earthRef = useRef();
  const cloudsRef = useRef();

  // Load textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
    '/textures/earth_daymap.jpg',
    '/textures/earth_normal_map.png',
    '/textures/earth_specular_map.jpg', // Often used as roughnessMap
    '/textures/earth_clouds.png'
  ]);

   // Texture settings using the modern colorSpace API
   [colorMap, cloudsMap, specularMap, normalMap].forEach(texture => {
     if(texture) {
       texture.wrapS = texture.wrapT = RepeatWrapping;
       // Higher anisotropy improves texture quality at grazing angles
       texture.anisotropy = 16; // Max anisotropy often best (check performance if needed)

       // Set color space ONLY for color textures (diffuse, emissive, clouds)
       if (texture === colorMap || texture === cloudsMap) {
            texture.colorSpace = SRGBColorSpace;
       }
       // Data textures (normal, roughness, metalness, AO) should remain Linear (default)
     }
   });


  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = elapsedTime * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y = elapsedTime * -0.07;
  });

  const earthRadius = 2;

  return (
    <group {...props}>
      <Sphere ref={earthRef} args={[earthRadius, 64, 64]} name="Earth">
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          // Use specularMap as roughnessMap (common PBR workflow)
          roughnessMap={specularMap}
          metalness={0.2} // Slightly metallic oceans/surface
          roughness={0.8} // Base roughness
          name="EarthMaterial" // Add names for debugging
        />
      </Sphere>

      {cloudsMap && (
        <Sphere ref={cloudsRef} args={[earthRadius + 0.015, 64, 64]} name="Clouds">
          <meshStandardMaterial
            map={cloudsMap}
            alphaMap={cloudsMap}
            transparent={true}
            opacity={0.4} // More subtle clouds
            depthWrite={false} // Render clouds correctly over Earth
            name="CloudMaterial"
          />
        </Sphere>
      )}
    </group>
  );
}

export default Earth;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos