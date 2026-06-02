'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Cube3D({ roll = 0, pitch = 0, yaw = 0 }) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const rafRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 600;
    const H = 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    el.appendChild(renderer.domElement);

    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const mats = [
      new THREE.MeshBasicMaterial({ color: 0xffbe0b }),
      new THREE.MeshBasicMaterial({ color: 0xfb5607 }),
      new THREE.MeshBasicMaterial({ color: 0x06d6a0 }),
      new THREE.MeshBasicMaterial({ color: 0xff006e }),
      new THREE.MeshBasicMaterial({ color: 0x3a86ff }),
      new THREE.MeshBasicMaterial({ color: 0x8338ec }),
    ];
    const cube = new THREE.Mesh(geo, mats);
    scene.add(cube);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    cube.add(edges);

    sceneRef.current.cube = cube;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const cube = sceneRef.current.cube;
    if (!cube) return;
    const r = Math.PI / 180;
    cube.rotation.x = roll * r;
    cube.rotation.y = pitch * r;
    cube.rotation.z = yaw * r;
  }, [roll, pitch, yaw]);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '300px', background: '#0a0a0f', borderRadius: '12px' }}
    />
  );
}
