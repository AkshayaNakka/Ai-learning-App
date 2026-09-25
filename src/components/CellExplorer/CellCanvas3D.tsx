import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Organelle } from '../../types';
import { ORGANELLES } from '../../data/organelles';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sparkles, Layers, RefreshCw } from 'lucide-react';

interface CellCanvas3DProps {
  selectedOrganelle: Organelle | null;
  onSelectOrganelle: (organelle: Organelle) => void;
  cutawayMode: boolean;
  onToggleCutaway: () => void;
}

export const CellCanvas3D: React.FC<CellCanvas3DProps> = ({
  selectedOrganelle,
  onSelectOrganelle,
  cutawayMode,
  onToggleCutaway,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const highlightMeshRef = useRef<THREE.Mesh | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 8.5);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 8, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.7);
    dirLight2.position.set(-6, -4, -5);
    scene.add(dirLight2);

    const innerPointLight = new THREE.PointLight(0xa855f7, 1.5, 6);
    innerPointLight.position.set(0, 0, 0);
    scene.add(innerPointLight);

    // Group to hold all cell parts so we can orbit everything together
    const cellRoot = new THREE.Group();
    cellRoot.name = 'cellRoot';
    scene.add(cellRoot);

    const meshesMap = new Map<string, THREE.Object3D>();

    // A. Outer Cell Membrane (Cutaway support via sphere theta/phi or clipping)
    const membraneGeo = new THREE.SphereGeometry(
      3.6,
      48,
      36,
      0,
      cutawayMode ? Math.PI * 1.5 : Math.PI * 2, // cut away 90 deg quarter slice
      0,
      Math.PI
    );
    const membraneMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: cutawayMode ? 0.35 : 0.22,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.65,
      ior: 1.33,
      thickness: 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    membraneMesh.name = 'cell_membrane';
    cellRoot.add(membraneMesh);
    meshesMap.set('cell_membrane', membraneMesh);

    // Phospholipid bilayer edge ring
    const edgeRingGeo = new THREE.TorusGeometry(3.6, 0.05, 16, 64);
    const edgeRingMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3,
    });
    const edgeRing = new THREE.Mesh(edgeRingGeo, edgeRingMat);
    edgeRing.rotation.x = Math.PI / 2;
    cellRoot.add(edgeRing);

    // B. Cytoplasm Particle Cloud (interior cytosol fluid particles)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 3.2;
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const cytoplasmPoints = new THREE.Points(particleGeo, particleMat);
    cytoplasmPoints.name = 'cytoplasm';
    cellRoot.add(cytoplasmPoints);
    meshesMap.set('cytoplasm', cytoplasmPoints);

    // C. Nucleus (Command Center)
    const nucleusGroup = new THREE.Group();
    nucleusGroup.name = 'nucleus';

    // Nuclear envelope
    const nucGeo = new THREE.SphereGeometry(1.2, 32, 24);
    const nucMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.25,
      roughness: 0.35,
      metalness: 0.1,
    });
    const nucMesh = new THREE.Mesh(nucGeo, nucMat);
    nucleusGroup.add(nucMesh);

    // Inner Nucleolus
    const nucleolusGeo = new THREE.SphereGeometry(0.48, 20, 16);
    const nucleolusMat = new THREE.MeshStandardMaterial({
      color: 0x6d28d9,
      emissive: 0xa855f7,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    nucleolusMesh.position.set(0.2, 0.2, 0.2);
    nucleusGroup.add(nucleolusMesh);

    // Nuclear pores (tiny decorative rings on nucleus)
    for (let i = 0; i < 28; i++) {
      const phi = Math.acos(-1 + (2 * i) / 28);
      const theta = Math.sqrt(28 * Math.PI) * phi;
      const pore = new THREE.Mesh(
        new THREE.RingGeometry(0.04, 0.07, 8),
        new THREE.MeshBasicMaterial({ color: 0x3b0764, side: THREE.DoubleSide })
      );
      pore.position.set(
        1.21 * Math.sin(phi) * Math.cos(theta),
        1.21 * Math.sin(phi) * Math.sin(theta),
        1.21 * Math.cos(phi)
      );
      pore.lookAt(0, 0, 0);
      nucleusGroup.add(pore);
    }
    cellRoot.add(nucleusGroup);
    meshesMap.set('nucleus', nucleusGroup);

    // D. Mitochondria (Powerhouses with internal cristae)
    const mitoGroup = new THREE.Group();
    mitoGroup.name = 'mitochondria';

    const createMitochondrion = (pos: [number, number, number], rot: [number, number, number], scale = 1) => {
      const singleMito = new THREE.Group();
      singleMito.position.set(...pos);
      singleMito.rotation.set(...rot);
      singleMito.scale.set(scale, scale, scale);

      // Capsule body
      const capsuleGeo = new THREE.CapsuleGeometry(0.28, 0.7, 16, 20);
      const capsuleMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0x7c2d12,
        emissiveIntensity: 0.35,
        roughness: 0.3,
        metalness: 0.1,
      });
      const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMat);
      singleMito.add(capsuleMesh);

      // Inner cristae ribs
      for (let c = -0.3; c <= 0.3; c += 0.15) {
        const cristaGeo = new THREE.TorusGeometry(0.22, 0.035, 8, 16);
        const cristaMat = new THREE.MeshStandardMaterial({
          color: 0xfde047,
          emissive: 0xeab308,
          emissiveIntensity: 0.6,
        });
        const crista = new THREE.Mesh(cristaGeo, cristaMat);
        crista.position.y = c;
        crista.rotation.x = Math.PI / 2;
        singleMito.add(crista);
      }
      return singleMito;
    };

    mitoGroup.add(createMitochondrion([-1.9, 1.2, 0.7], [0.4, 0.8, 0.3], 1.0));
    mitoGroup.add(createMitochondrion([1.8, -1.3, 1.0], [-0.5, 0.2, 0.8], 0.85));
    mitoGroup.add(createMitochondrion([-1.5, -1.8, -1.0], [0.8, -0.6, 0.2], 0.9));
    mitoGroup.add(createMitochondrion([0.9, 2.1, -0.8], [0.2, 1.1, -0.4], 0.8));
    cellRoot.add(mitoGroup);
    meshesMap.set('mitochondria', mitoGroup);

    // E. Endoplasmic Reticulum (Rough ER & Smooth ER curved sheets)
    const erGroup = new THREE.Group();
    erGroup.name = 'endoplasmic_reticulum';

    // Layered wavy curved tori/sheets around nucleus
    for (let r = 1.45; r <= 2.15; r += 0.35) {
      const erGeo = new THREE.TorusGeometry(r, 0.12, 12, 48, Math.PI * 1.25);
      const erMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x164e63,
        emissiveIntensity: 0.3,
        roughness: 0.4,
        side: THREE.DoubleSide,
      });
      const erMesh = new THREE.Mesh(erGeo, erMat);
      erMesh.position.set(0.3, -0.1, 0.1);
      erMesh.rotation.set(0.6 + r * 0.2, 0.4, 0.2);
      erGroup.add(erMesh);
    }
    cellRoot.add(erGroup);
    meshesMap.set('endoplasmic_reticulum', erGroup);

    // F. Ribosomes (Tiny pink studded spheres on ER and free in cytosol)
    const riboGroup = new THREE.Group();
    riboGroup.name = 'ribosomes';
    const riboGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const riboMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xbe185d,
      emissiveIntensity: 0.7,
      roughness: 0.2,
    });

    // Ribosomes studded on Rough ER
    for (let i = 0; i < 70; i++) {
      const angle = (i / 70) * Math.PI * 1.4;
      const radius = 1.5 + (i % 3) * 0.35;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.15;
      const y = Math.sin(angle) * (radius * 0.7) + (Math.random() - 0.5) * 0.15;
      const z = (Math.random() - 0.5) * 0.4;
      const ribo = new THREE.Mesh(riboGeo, riboMat);
      ribo.position.set(x + 0.3, y - 0.1, z + 0.1);
      riboGroup.add(ribo);
    }

    // Free cytosolic ribosomes
    for (let i = 0; i < 40; i++) {
      const ribo = new THREE.Mesh(riboGeo, riboMat);
      ribo.position.set(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5
      );
      riboGroup.add(ribo);
    }
    cellRoot.add(riboGroup);
    meshesMap.set('ribosomes', riboGroup);

    // G. Golgi Apparatus (Stacked curved emerald cisternae + transport vesicles)
    const golgiGroup = new THREE.Group();
    golgiGroup.name = 'golgi_apparatus';
    golgiGroup.position.set(-1.8, -1.2, -0.6);
    golgiGroup.rotation.set(0.4, -0.6, 0.3);

    for (let g = 0; g < 5; g++) {
      const cisternaGeo = new THREE.CylinderGeometry(
        0.85 - g * 0.08,
        0.8 - g * 0.08,
        0.08,
        24,
        1,
        false,
        0,
        Math.PI * 1.5
      );
      const cisternaMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x064e3b,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.1,
      });
      const cisterna = new THREE.Mesh(cisternaGeo, cisternaMat);
      cisterna.position.y = g * 0.14 - 0.3;
      cisterna.rotation.x = 0.2;
      cisterna.rotation.z = 0.1;
      golgiGroup.add(cisterna);
    }

    // Budding Golgi secretory vesicles
    const vesGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const vesMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
    });
    for (let v = 0; v < 8; v++) {
      const vesicle = new THREE.Mesh(vesGeo, vesMat);
      vesicle.position.set(
        (Math.random() - 0.5) * 1.2,
        0.4 + Math.random() * 0.4,
        (Math.random() - 0.5) * 0.8
      );
      golgiGroup.add(vesicle);
    }
    cellRoot.add(golgiGroup);
    meshesMap.set('golgi_apparatus', golgiGroup);

    // H. Lysosomes (Hydrolytic amber digestive vesicles)
    const lysoGroup = new THREE.Group();
    lysoGroup.name = 'lysosomes';

    const createLysosome = (pos: [number, number, number], r = 0.26) => {
      const lyso = new THREE.Group();
      lyso.position.set(...pos);

      const sphereGeo = new THREE.SphereGeometry(r, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        emissive: 0x854d0e,
        emissiveIntensity: 0.4,
        roughness: 0.3,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      lyso.add(sphere);

      // Inner enzyme dots
      const innerDot = new THREE.Mesh(
        new THREE.DodecahedronGeometry(r * 0.45),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      lyso.add(innerDot);
      return lyso;
    };

    lysoGroup.add(createLysosome([-1.2, 1.8, -1.2], 0.28));
    lysoGroup.add(createLysosome([1.6, 1.4, 1.2], 0.22));
    lysoGroup.add(createLysosome([0.2, -2.1, -1.1], 0.25));
    lysoGroup.add(createLysosome([-2.2, 0.1, 1.3], 0.2));
    cellRoot.add(lysoGroup);
    meshesMap.set('lysosomes', lysoGroup);

    // I. Selected Organelle Pulsating Highlight Wireframe Sphere
    const highlightGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const highlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
    scene.add(highlightMesh);
    highlightMeshRef.current = highlightMesh;

    meshesMapRef.current = meshesMap;

    // 5. Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow gentle auto-rotation
      if (autoRotate && !isDraggingRef.current) {
        cellRoot.rotation.y += 0.003;
        cellRoot.rotation.x = Math.sin(elapsed * 0.3) * 0.08;
      }

      // Cytoplasm subtle float
      cytoplasmPoints.rotation.y += 0.001;

      // Mitochondria subtle respiratory pulse
      const mitoScale = 1 + Math.sin(elapsed * 2) * 0.02;
      mitoGroup.children.forEach((c) => {
        c.scale.set(mitoScale, mitoScale, mitoScale);
      });

      // Highlight pulse
      if (highlightMeshRef.current && highlightMeshRef.current.visible) {
        const pulse = 1 + Math.sin(elapsed * 4) * 0.06;
        highlightMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Raycasting for organelle selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedOrganelle = (clientX: number, clientY: number): Organelle | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      // Check all organelle groups
      const targets: THREE.Object3D[] = [];
      meshesMap.forEach((obj, key) => {
        if (key !== 'cell_membrane' && key !== 'cytoplasm') {
          targets.push(obj);
        }
      });

      const intersects = raycaster.intersectObjects(targets, true);
      if (intersects.length > 0) {
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && curr !== cellRoot) {
          if (curr.name && ORGANELLES.some((o) => o.id === curr!.name)) {
            return ORGANELLES.find((o) => o.id === curr!.name) || null;
          }
          curr = curr.parent;
        }
      }
      return null;
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        cellRoot.rotation.y += deltaX * 0.007;
        cellRoot.rotation.x += deltaY * 0.007;

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      } else {
        const hit = getIntersectedOrganelle(e.clientX, e.clientY);
        setHoveredName(hit ? hit.name : null);
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        // If minimal drag, treat as click
        const dist = Math.hypot(
          e.clientX - previousMousePositionRef.current.x,
          e.clientY - previousMousePositionRef.current.y
        );
        if (dist < 4) {
          const hit = getIntersectedOrganelle(e.clientX, e.clientY);
          if (hit) {
            onSelectOrganelle(hit);
          }
        }
      }
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.005;
      cameraRef.current.position.z = Math.min(Math.max(newZ, 4.5), 14);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [cutawayMode]);

  // Update highlight position when selectedOrganelle changes
  useEffect(() => {
    if (!highlightMeshRef.current) return;
    if (!selectedOrganelle) {
      highlightMeshRef.current.visible = false;
      return;
    }

    const obj = meshesMapRef.current.get(selectedOrganelle.id);
    if (obj) {
      const box = new THREE.Box3().setFromObject(obj);
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const radius = Math.max(size.x, size.y, size.z) * 0.7 + 0.2;

      highlightMeshRef.current.position.copy(center);
      highlightMeshRef.current.scale.set(radius, radius, radius);
      (highlightMeshRef.current.material as THREE.MeshBasicMaterial).color.set(selectedOrganelle.color);
      (highlightMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5;
      highlightMeshRef.current.visible = true;
    } else {
      highlightMeshRef.current.visible = false;
    }
  }, [selectedOrganelle]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? -1.2 : 1.2;
    const newZ = cameraRef.current.position.z + factor;
    cameraRef.current.position.z = Math.min(Math.max(newZ, 4.5), 14);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !sceneRef.current) return;
    cameraRef.current.position.set(0, 2, 8.5);
    const cellRoot = sceneRef.current.getObjectByName('cellRoot');
    if (cellRoot) {
      cellRoot.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* 3D Canvas mount point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          Interactive 3D Cell Anatomy
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-md">
          {cutawayMode ? '3D Cutaway Section View' : 'Full Cell View'}
        </span>
      </div>

      {/* Hovered Organelle indicator */}
      {hoveredName && (
        <div className="absolute top-4 right-4 pointer-events-none z-10">
          <div className="px-3 py-1.5 rounded-lg bg-blue-600/90 text-white text-xs font-bold shadow-lg backdrop-blur-md border border-blue-400/30 flex items-center gap-1.5 animate-in fade-in">
            <Eye className="w-3.5 h-3.5" />
            Click to inspect: {hoveredName}
          </div>
        </div>
      )}

      {/* Controls Overlay bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-10">
        {/* Left helpers */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
          <span>🖱️ Drag to rotate 360°</span>
          <span>•</span>
          <span>Scroll to zoom</span>
          <span>•</span>
          <span>Click organelle</span>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Cutaway Toggle */}
          <button
            onClick={onToggleCutaway}
            title={cutawayMode ? 'Switch to Full Outer Membrane' : 'Cutaway Interior Section'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              cutawayMode
                ? 'bg-blue-600/80 text-white border-blue-400 shadow-md shadow-blue-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            } backdrop-blur-md`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cutaway</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            className={`p-2 rounded-xl text-xs border transition-all ${
              autoRotate
                ? 'bg-indigo-600/80 text-white border-indigo-400'
                : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:bg-slate-800'
            } backdrop-blur-md`}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-2 rounded-xl text-xs bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800 backdrop-blur-md transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-2 rounded-xl text-xs bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800 backdrop-blur-md transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            title="Reset Perspective"
            className="p-2 rounded-xl text-xs bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800 backdrop-blur-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
