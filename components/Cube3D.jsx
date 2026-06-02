'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Cube3D({ roll = 0, pitch = 0, yaw = 0 }) {
  const containerRef = useRef(null);
  const rotationRef = useRef({ roll: 0, pitch: 0, yaw: 0 });

  useEffect(() => {
    rotationRef.current = { roll, pitch, yaw };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0a0f');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const materials = [
      new THREE.MeshBasicMaterial({ color: '#ffbe0b' }),
      new THREE.MeshBasicMaterial({ color: '#fb5607' }),
      new THREE.MeshBasicMaterial({ color: '#06d6a0' }),
      new THREE.MeshBasicMaterial({ color: '#ff006e' }),
      new THREE.MeshBasicMaterial({ color: '#3a86ff' }),
      new THREE.MeshBasicMaterial({ color: '#8338ec' }),
    ];

    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({ color: '#ffffff' })
    );
    cube.add(edges);

    let animId;
    const toRad = (deg) => deg * (Math.PI / 180);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const { roll, pitch, yaw } = rotationRef.current;
      cube.rotation.x = toRad(roll);
      cube.rotation.y = toRad(pitch);
      cube.rotation.z = toRad(yaw);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '300px', background: '#0a0a0f', borderRadius: '12px' }}
    />
  );
}
