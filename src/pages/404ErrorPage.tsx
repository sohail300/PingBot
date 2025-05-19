import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

export default function ErrorPage404() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create Earth
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/earth-texture.jpg");
    const bumpMap = textureLoader.load("/earth-bump.jpg");
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.1,
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 15;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      scene.remove(earth);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [mounted]);

  const appClasses = `
    opacity-0 transition-opacity duration-1000
    ${mounted ? "opacity-100" : ""}
  `;

  return (
    <div className="bg-[#0e0e10] text-white text-center min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className={appClasses}>
        <div className="relative z-10 flex flex-col items-center justify-center gap-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-2xl">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pulse">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-200 mb-2">
            Oops! Looks like you're lost in space
          </h2>

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-gray-900 font-medium shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            size="lg"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
