// src/lib/coords.js

/**
 * Converts Spherical coordinates (Right Ascension, Declination) in degrees
 * to Cartesian (x, y, z) for a Y-up coordinate system (common in Three.js).
 * RA: Angle in the XZ plane, eastward from -X axis (adjusting for astronomical convention).
 * Dec: Angle up/down from the XZ plane.
 * Longitude (RA) maps to rotations around the Y-axis.
 * Latitude (Dec) maps to the angle from the equatorial plane.
 *
 * @param {number} ra Right Ascension in degrees (-180 to 180 from JSON).
 * @param {number} dec Declination in degrees (-90 to 90).
 * @param {number} radius The distance from the origin (radius of the celestial sphere).
 * @returns {{x: number, y: number, z: number}} Cartesian coordinates.
 */
export function sphericalToCartesian(ra, dec, radius) {
    // Convert degrees to radians
    // Adjust RA: Astronomical RA increases eastward. Standard math angle increases counter-clockwise from +X.
    // To map RA=0 to -X axis and increase eastward (clockwise in XZ plane from above), use (RA + 90) or adjust signs.
    // Let's use the simpler direct conversion and adjust axes if needed.
    // Convert RA from [-180, 180] to [0, 360] if needed, but the direct formula works if interpreted correctly.
    // We map RA to the angle 'phi' and Dec to 'theta' in standard physics spherical coords (r, theta, phi)
    // but adjusting for Y-up: theta becomes angle from Y axis, phi angle in XZ plane.
    // Or easier: Use standard formulas and map axes:
    // x = r * cos(dec) * cos(ra)
    // y = r * sin(dec)
    // z = r * cos(dec) * sin(ra) <-- This maps RA=0 to +X axis.
  
    const raRad = (ra * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
  
    // Calculate cartesian coordinates
    const x = radius * Math.cos(decRad) * Math.cos(raRad);
    const y = radius * Math.sin(decRad);
    const z = radius * Math.cos(decRad) * Math.sin(raRad);
  
    // To match typical sky views where RA=0 is often centered:
    // We might need to rotate or flip axes. Let's negate Z initially.
    // If RA=0 should be along -X axis, then:
    // x = radius * Math.cos(decRad) * Math.sin(raRad); // swap sin/cos
    // y = radius * Math.sin(decRad);
    // z = radius * Math.cos(decRad) * Math.cos(raRad); // swap sin/cos
  
    // Let's stick to the standard formula and negate Z for sky view.
    return { x: x, y: y, z: -z };
  }

  // Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos