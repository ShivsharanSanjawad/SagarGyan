import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';

interface Interactive3DViewProps {
  activeView?: string;
}

// Default export a React component (TypeScript + Tailwind friendly)
export default function Interactive3DView({ activeView }: Interactive3DViewProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const frameId = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only initialize when the 3D view is active and the mount div exists
    if (!mountRef.current || activeView !== '3d') return;

    let mounted = true;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 600;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220); // dark background
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.001, 1000);
    camera.position.set(0, 0, 2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // Append canvas
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(1, 1, 1);
    scene.add(dir);

    // Orbit controls for smooth interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.6;
    controlsRef.current = controls;

    const loader = new PLYLoader();

    const onLoadPLY = (geometry: THREE.BufferGeometry) => {
      if (!mounted) return;

      // Ensure bounding box/normals/colors are available
      geometry.computeBoundingBox();
      if (!geometry.hasAttribute('normal')) geometry.computeVertexNormals();

      const hasColor = geometry.hasAttribute('color');

      // Points material (use vertex colors if present)
      const material = new THREE.PointsMaterial({
        size: 0.01,
        sizeAttenuation: true,
        vertexColors: hasColor,
        // fallback color if no vertex colors
        color: hasColor ? undefined : new THREE.Color(0x00ff88)
      });

      const points = new THREE.Points(geometry, material);
      pointsRef.current = points;
      scene.add(points);

      // Center and scale model so it's visible
      const box = geometry.boundingBox!;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 1.5 / maxDim : 1.0;

      // Move to center and scale
      points.position.sub(center);
      points.scale.setScalar(scale);

      // Move camera back a bit depending on size
      camera.position.set(0, 0, Math.max(1.5, 2.5 / scale));
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      setLoading(false);
    };

    const onErrorPLY = (err: any) => {
      console.warn('PLY load failed:', err);
      setError('Failed to load /Segmentation.ply — showing sample data');
      setLoading(false);

      // Fallback: simple random point cloud
      const count = 8000;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[3 * i] = (Math.random() - 0.5) * 2;
        positions[3 * i + 1] = (Math.random() - 0.5) * 2;
        positions[3 * i + 2] = (Math.random() - 0.5) * 2;
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.computeBoundingBox();
      const mat = new THREE.PointsMaterial({ size: 0.01, color: 0x00ff88 });
      const pts = new THREE.Points(geom, mat);
      pointsRef.current = pts;
      scene.add(pts);

      const box = geom.boundingBox!;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 1.5 / maxDim : 1.0;
      pts.position.sub(center);
      pts.scale.setScalar(scale);
      camera.position.set(0, 0, Math.max(1.5, 2.5 / scale));
    };

    // Try to load the PLY file from /Segmentation.ply (place it inside public/)
    loader.load(
      '/Segmentation.ply',
      onLoadPLY,
      // progress
      undefined,
      onErrorPLY
    );

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId.current = requestAnimationFrame(animate);
    };
    animate();

    // Responsive resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      if (frameId.current) cancelAnimationFrame(frameId.current);

      controls.dispose();

      if (pointsRef.current) {
        const g = pointsRef.current.geometry;
        const m = pointsRef.current.material as THREE.Material | THREE.Material[];
        if (g) g.dispose();
        if (Array.isArray(m)) m.forEach((mat) => mat.dispose());
        else m.dispose();
        scene.remove(pointsRef.current);
      }

      if (rendererRef.current) {
        const dom = rendererRef.current.domElement;
        rendererRef.current.dispose();
        if (dom && mountRef.current && mountRef.current.contains(dom)) {
          mountRef.current.removeChild(dom);
        }
      }

      // clear refs
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      pointsRef.current = null;
      frameId.current = null;
    };
  }, [activeView]);

  if (activeView !== '3d') return null;

  return (
    <div className="w-full h-96 relative bg-gray-900 rounded-lg overflow-hidden">
      {/* mount point for three.js canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* overlays */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black/60">
          Loading 3D view...
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-4 bg-red-800 text-white px-3 py-1 rounded text-sm">
          {error}
        </div>
      )}

      <div className="absolute top-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded">Three.js PLY Viewer</div>
    </div>
  );
}
