// src/components/Scene.jsx
import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';

// Post-processing
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

// Local components and data
import Earth from './Earth';
import Constellation from './Constellation';
// Ensure these paths are correct and files exist
import constellationInfoData from '../data/constellations.json';
import constellationLineData from '../data/constellations.lines.json';

// --- Reusable Components ---

function LoadingIndicator() {
  return (
    <Html center>
      <div className="text-white bg-black/70 backdrop-blur-sm p-4 rounded-lg shadow-lg font-semibold text-lg animate-pulse">
        Loading Celestial Data...
      </div>
    </Html>
  );
}

function SpaceSkybox() {
  const texture = useLoader(TextureLoader, '/textures/space_skybox.jpg');
  const { scene, gl } = useThree();

  useEffect(() => {
    if (texture) {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(gl, texture);
      scene.background = rt.texture;
      scene.environment = rt.texture; // Apply environment map too
       // Set background intensity if needed (optional)
      scene.backgroundIntensity = 0.8;
      scene.environmentIntensity = 0.8;


      return () => { // Cleanup
        scene.background = null;
        scene.environment = null;
        rt.dispose();
        texture.dispose();
      };
    }
  }, [texture, scene, gl]);

  return null;
}


// --- Main Scene Content ---
function SceneContent({ onConstellationClick, selectedConstellationId, setSelectedConstellationId }) {
    const [hoveredConstellationId, setHoveredConstellationId] = useState(null);
    const sceneRef = useRef(); // Ref for the scene background click

    // Process constellation data
    const constellationDataMap = useMemo(() => {
      const map = new Map();
       // Basic check if data looks like GeoJSON FeatureCollection
       if (!constellationInfoData?.features || !constellationLineData?.features) {
           console.error("Constellation data is missing or not in expected FeatureCollection format.");
           return map;
       }
      const infoMap = new Map(constellationInfoData.features.map(f => [f.id, f]));
      constellationLineData.features.forEach(lineFeature => {
        const info = infoMap.get(lineFeature.id);
        if (info) {
          map.set(lineFeature.id, { lineData: lineFeature, infoData: info });
        } else {
          console.warn(`No info data found for constellation line ID: ${lineFeature.id}`);
        }
      });
      return map;
    }, []); // Runs once

    const handleConstellationHover = (id) => {
        setHoveredConstellationId(id);
    };

    const handleConstellationClick = (infoDataFeature) => {
        setSelectedConstellationId(infoDataFeature.id); // Update selected ID state (passed down)
        onConstellationClick(infoDataFeature); // Call callback to open modal
    };

    // Click handler for the background (attached to a large sphere or plane)
    const handleBackgroundClick = (event) => {
        // Check if the click target is the background itself
        if (event.object === event.currentTarget) {
            if (selectedConstellationId) {
                setSelectedConstellationId(null); // Deselect if background is clicked
            }
        }
         // Stop propagation anyway to prevent potential issues
         event.stopPropagation();
    }


    return (
        <>
            {/* Invisible Sphere for background clicks */}
            {/* Place it first so other objects are rendered on top */}
             <mesh onClick={handleBackgroundClick} rotation={[0, 0, 0]} scale={[500, 500, 500]}>
                 <sphereGeometry args={[1, 8, 8]} />
                 <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.BackSide} />
             </mesh>

            {/* Lighting */}
            <ambientLight intensity={0.1} />
            <directionalLight position={[100, 10, 50]} intensity={0.8} color="#fffadc" />
            <pointLight position={[-100, -50, -150]} intensity={0.1} color="#aaccff" />

            {/* Background */}
            <SpaceSkybox />
            <Stars radius={300} depth={100} count={10000} factor={4} saturation={0} fade speed={0.3} />

            {/* Core Objects */}
            <Earth position={[0, 0, 0]} />

            {/* Constellations */}
            <group name="ConstellationsContainer">
                {Array.from(constellationDataMap.values()).map(({ lineData, infoData }) => (
                    <Constellation
                        key={infoData.id}
                        lineData={lineData}
                        infoData={infoData}
                        onHover={handleConstellationHover}
                        onClick={handleConstellationClick}
                        isHovered={hoveredConstellationId === infoData.id}
                        isSelected={selectedConstellationId === infoData.id} // Use selected ID from props
                    />
                ))}
            </group>

            {/* Controls */}
            <OrbitControls
                enableZoom={true} enablePan={true} minDistance={5} maxDistance={400}
                enableDamping={true} dampingFactor={0.05} zoomSpeed={0.7} rotateSpeed={0.4}
            />
        </>
    );
}


// --- Canvas Wrapper Component ---
function Scene({ onConstellationClick, selectedConstellationId, setSelectedConstellationId }) {
  return (
    <div className="absolute inset-0 pt-[60px] pb-[50px] md:pt-[70px] md:pb-[60px]">
      <Canvas
        camera={{ position: [0, 15, 45], fov: 60, near: 0.1, far: 2000 }} // Slightly adjusted camera
        gl={{ antialias: true, alpha: true, physicallyCorrectLights: true, outputColorSpace: THREE.SRGBColorSpace, toneMapping: THREE.ACESFilmicToneMapping }} // Use outputColorSpace
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]} // Max DPR 1.5 can save performance vs 2
        // shadows // Enable shadows if needed later
      >
        <Suspense fallback={<LoadingIndicator />}>
          <SceneContent
                onConstellationClick={onConstellationClick}
                selectedConstellationId={selectedConstellationId}
                setSelectedConstellationId={setSelectedConstellationId}
           />
        </Suspense>

        <EffectComposer disableNormalPass> {/* multisampling can be enabled if needed */}
           <Bloom
             intensity={1.0} // Slightly reduced intensity
             luminanceThreshold={0.3} // Lower threshold to catch highlights
             luminanceSmoothness={0.5}
             mipmapBlur={true}
             kernelSize={KernelSize.MEDIUM}
             radius={0.5}
           />
           {/* Add other effects like Noise or Vignette here if desired */}
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default Scene;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos