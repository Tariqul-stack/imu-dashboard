'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Cube3D({ roll = 0, pitch = 0, yaw = 0 }) {
  const containerRef = useRef(null);
  const rotationRef = useRef({ roll: 0, pitch: 0, yaw: 0 });

  // Keep rotation coordinates updated in a ref to avoid stale closures in animate loop
  useEffect(() => {
    rotationRef.current = { roll, pitch, yaw };
  }, [roll, pitch, yaw]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 300; // Fixed 300px height as per requirement

    // Create scene and set background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0f');

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    containerRef.current.appendChild(renderer.domElement);

    // Create cube geometry (1.2, 1.2, 1.2)
    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);

    // Define colors for each face:
    // Right (+X), Left (-X), Top (+Y), Bottom (-Y), Front (+Z), Back (-Z)
    const materials = [
      new THREE.MeshBasicMaterial({ color: '#ffbe0b' }), // Right
      new THREE.MeshBasicMaterial({ color: '#fb5607' }), // Left
      new THREE.MeshBasicMaterial({ color: '#06d6a0' }), // Top
      new THREE.MeshBasicMaterial({ color: '#ff006e' }), // Bottom
      new THREE.MeshBasicMaterial({ color: '#3a86ff' }), // Front
      new THREE.MeshBasicMaterial({ color: '#8338ec' })  // Back
    ];

    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Add EdgesGeometry on top of the cube with white lines
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: '#ffffff', linewidth: 2 });
    const edgesLine = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    cube.add(edgesLine);

    let animationFrameId;

    // Animation / render loop
    const animate = () => {
      // Convert degrees to radians
      const radX = rotationRef.current.roll * (Math.PI / 180);
      const radY = rotationRef.current.pitch * (Math.PI / 180);
      const radZ = rotationRef.current.yaw * (Math.PI / 180);

      // Apply rotation to cube (edgesLine inherits rotation since it is child of cube)
      cube.rotation.x = radX;
      cube.rotation.y = radY;
      cube.rotation.z = radZ;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Responsive resize observer
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      renderer.setSize(w, height);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.current);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      // Clean up DOM element
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose resources
      geometry.dispose();
      materials.forEach((mat) => mat.dispose());
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0f]">
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '300px' }} 
        className="w-full h-[300px]"
      />
    </div>
  );
}
