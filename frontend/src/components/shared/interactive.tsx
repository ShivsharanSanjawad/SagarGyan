import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

export default function PLYViewer() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 600;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 1000);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1); // white canvas background
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const loader = new PLYLoader();
    loader.load("/Segmentation.ply", (geometry) => {
      if (!geometry.hasAttribute("normal")) geometry.computeVertexNormals();

      const material = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      //Center model
      geometry.computeBoundingBox();
      const box = geometry.boundingBox!;
      const center = box.getCenter(new THREE.Vector3());
      points.position.sub(center);

      //Fit camera to model
      const sphere = geometry.boundingSphere || new THREE.Sphere();
      geometry.computeBoundingSphere();
      const radius = geometry.boundingSphere!.radius;

      const fov = (camera.fov * Math.PI) / 180;
      const dist = radius / Math.sin(fov / 2);

      camera.position.set(0, 0, dist * 1.2); 
      camera.lookAt(0, 0, 0);
      controls.update();
    });
    // Animate
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    // Resize
    const handleResize = () => {
      const w = mountRef.current?.clientWidth || width;
      const h = mountRef.current?.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border bg-white">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
