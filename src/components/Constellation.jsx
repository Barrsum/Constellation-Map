// src/components/Constellation.jsx
import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Line, Points, PointMaterial } from '@react-three/drei';
import { sphericalToCartesian } from '../lib/coords';

// --- Configuration ---
const constellationRadius = 150;

// Colors
const defaultStarColor = new THREE.Color('#777788');
const defaultLineColor = new THREE.Color('#333344'); // Faint default line
const hoverStarColor = new THREE.Color('#00ffff');
const hoverLineColor = new THREE.Color('#00aaaa'); // Active line color
const selectedStarColor = new THREE.Color('#ffff00');
const selectedLineColor = new THREE.Color('#aaaa00'); // Active line color

// Widths / Sizes
const defaultLineWidth = 0.5;
const activeLineWidth = 2.0;
const defaultStarSize = 2.5;
const activeStarSize = 5.0;
const selectedStarSize = 6.0;

// --- Component ---
function Constellation({ lineData, infoData, onHover, onClick, isHovered, isSelected }) {
  const groupRef = useRef();
  const [internalHover, setInternalHover] = useState(false);

  const active = isHovered || internalHover || isSelected;

  // Calculate current visual properties
  const currentStarColor = isSelected ? selectedStarColor : (active ? hoverStarColor : defaultStarColor);
  const currentLineColor = isSelected ? selectedLineColor : (active ? hoverLineColor : defaultLineColor);
  const currentStarSize = isSelected ? selectedStarSize : (active ? activeStarSize : defaultStarSize);
  const currentLineWidth = active ? activeLineWidth : defaultLineWidth;

  // --- Geometry Processing ---
  const { linePoints, starPoints } = useMemo(() => {
    const starPositionsMap = new Map();
    const lines = [];
    let validData = true;

    if (!lineData?.geometry?.coordinates || !Array.isArray(lineData.geometry.coordinates)) {
        console.error(`Invalid line data structure for ${infoData?.id || 'unknown constellation'}`);
        validData = false;
    } else {
        lineData.geometry.coordinates.forEach(lineSegment => {
            if (!Array.isArray(lineSegment) || lineSegment.length < 2) return;
            for (let i = 0; i < lineSegment.length - 1; i++) {
                const coord1 = lineSegment[i];
                const coord2 = lineSegment[i + 1];
                if (!Array.isArray(coord1) || coord1.length !== 2 || !Array.isArray(coord2) || coord2.length !== 2) continue;
                const [ra1, dec1] = coord1;
                const [ra2, dec2] = coord2;
                if (isNaN(ra1) || isNaN(dec1) || isNaN(ra2) || isNaN(dec2)) continue;

                const p1 = sphericalToCartesian(ra1, dec1, constellationRadius);
                const p2 = sphericalToCartesian(ra2, dec2, constellationRadius);

                // Add extra check for NaN results from conversion
                 if (Object.values(p1).some(isNaN) || Object.values(p2).some(isNaN)) {
                    console.warn(`NaN generated from sphericalToCartesian for ${infoData?.id} using inputs RA1:${ra1}, Dec1:${dec1}, RA2:${ra2}, Dec2:${dec2}`);
                    continue; // Skip this segment if conversion failed
                }

                lines.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                const key1 = `${p1.x.toFixed(3)},${p1.y.toFixed(3)},${p1.z.toFixed(3)}`;
                const key2 = `${p2.x.toFixed(3)},${p2.y.toFixed(3)},${p2.z.toFixed(3)}`;
                if (!starPositionsMap.has(key1)) starPositionsMap.set(key1, [p1.x, p1.y, p1.z]);
                if (!starPositionsMap.has(key2)) starPositionsMap.set(key2, [p2.x, p2.y, p2.z]);
            }
        });
    }

    const stars = validData ? new Float32Array(starPositionsMap.size * 3) : new Float32Array(0);
     if (validData && starPositionsMap.size > 0) { // Check map size before creating array
        let i = 0;
        starPositionsMap.forEach(pos => { stars[i++] = pos[0]; stars[i++] = pos[1]; stars[i++] = pos[2]; });
    }

    // Ensure linePoints is valid
    if (lines.length === 0 && stars.length > 0) {
         console.warn(`Constellation ${infoData?.id} has stars but no lines.`);
         // Return empty lines if none generated but stars exist
         return { linePoints: [], starPoints: stars };
    }
    if (lines.length % 6 !== 0) {
        console.error(`Invalid linePoints length (${lines.length}) for ${infoData?.id}. Returning empty lines.`);
        return { linePoints: [], starPoints: stars }; // Return empty lines to prevent error
    }


    return { linePoints: lines, starPoints: stars };
  }, [lineData, infoData]);


  // --- Event Handlers --- (Keep as before)
  const handlePointerOver = (e) => { e.stopPropagation(); setInternalHover(true); onHover(infoData.id); document.body.style.cursor = 'pointer'; };
  const handlePointerOut = (e) => { e.stopPropagation(); if (!e.relatedTarget || !groupRef.current?.contains(e.relatedTarget)) { setInternalHover(false); onHover(null); document.body.style.cursor = 'auto'; } };
  const handleClick = (e) => { e.stopPropagation(); onClick(infoData); };

  // --- Render ---
  // Don't render if geometry is invalid or couldn't be processed
  if (starPoints.length === 0) {
      console.warn(`Skipping render for constellation ${infoData?.id} due to missing star points.`);
      return null;
  }

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      name={`ConstellationGroup_${infoData.id}`}
    >
      {/* Points */}
      <Points positions={starPoints} stride={3} frustumCulled={false}>
         <PointMaterial
           color={currentStarColor}
           size={currentStarSize}
           sizeAttenuation={true}
           depthWrite={false} // Keep this, generally safe and useful
           blending={THREE.AdditiveBlending} // Keep for bright stars
           opacity={active ? 1.0 : 0.7}
           transparent={true} // Required for opacity < 1
         />
      </Points>

      {/* Single Line - ONLY core props */}
      {/* Render only if linePoints is a valid array */}
      {linePoints.length > 0 && (
          <Line
            points={linePoints}      // The geometry points
            color={currentLineColor} // Dynamically set color
            lineWidth={currentLineWidth} // Dynamically set width
            // REMOVED: visible, dashed, name, all material-* props
          />
      )}
    </group>
  );
}

export default React.memo(Constellation);

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos