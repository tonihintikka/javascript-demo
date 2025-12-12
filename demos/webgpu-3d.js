/**
 * WebGPU & 3D Demo - JavaScript
 * Advanced 3D visualizations with Three.js, WebGPU detection, and post-processing
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// ===============================
// WebGPU Support Detection
// ===============================
async function checkWebGPUSupport() {
  const statusEl = document.getElementById('webgpu-status');
  const statusText = statusEl.querySelector('.status-text');
  
  if (!navigator.gpu) {
    statusEl.classList.add('unsupported');
    statusText.textContent = 'WebGPU not available - using WebGL fallback';
    return { supported: false, reason: 'API not available' };
  }
  
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      statusEl.classList.add('unsupported');
      statusText.textContent = 'No WebGPU adapter found - using WebGL';
      return { supported: false, reason: 'No adapter' };
    }
    
    const device = await adapter.requestDevice();
    statusEl.classList.add('supported');
    statusText.textContent = 'WebGPU supported ✓';
    
    // Hide compute warning
    const computeWarning = document.getElementById('compute-warning');
    if (computeWarning) computeWarning.classList.add('hidden');
    
    return {
      supported: true,
      adapter,
      device,
      features: [...adapter.features]
    };
  } catch (error) {
    statusEl.classList.add('unsupported');
    statusText.textContent = 'WebGPU error - using WebGL';
    return { supported: false, reason: error.message };
  }
}

// ===============================
// Theme Toggle
// ===============================
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const icon = toggle.querySelector('.theme-icon');
  
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    icon.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
  });
}

// ===============================
// Tab Navigation
// ===============================
function initTabs() {
  // Demo tabs
  const demoTabs = document.querySelectorAll('.tab-btn');
  const demoPanels = document.querySelectorAll('.demo-panel');
  
  demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      
      demoTabs.forEach(t => t.classList.remove('active'));
      demoPanels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tabId}-panel`).classList.add('active');
      
      // Initialize the demo if not already done
      initDemoByTab(tabId);
    });
  });
  
  // Code tabs
  const codeTabs = document.querySelectorAll('.code-tab-btn');
  const codePanels = document.querySelectorAll('.code-panel');
  
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const codeId = tab.dataset.code;
      
      codeTabs.forEach(t => t.classList.remove('active'));
      codePanels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${codeId}-code`).classList.add('active');
    });
  });
}

// ===============================
// Demo Initializers
// ===============================
const initializedDemos = new Set();

function initDemoByTab(tabId) {
  if (initializedDemos.has(tabId)) return;
  
  switch (tabId) {
    case 'particles':
      initParticlesDemo();
      break;
    case 'materials':
      initMaterialsDemo();
      break;
    case 'postfx':
      initPostFXDemo();
      break;
    case 'compute':
      initComputeDemo();
      break;
  }
  
  initializedDemos.add(tabId);
}

// ===============================
// Hero Background Animation
// ===============================
function initHeroBackground() {
  const container = document.getElementById('hero-canvas');
  if (!container) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 30;
  
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Create particle system
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 60;
    positions[i + 1] = (Math.random() - 0.5) * 60;
    positions[i + 2] = (Math.random() - 0.5) * 60;
    
    // Gradient colors
    const t = Math.random();
    colors[i] = 0.4 + t * 0.4;     // R
    colors[i + 1] = 0.2 + t * 0.5; // G
    colors[i + 2] = 0.8 + t * 0.2; // B
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // Add some connecting lines
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(200 * 6);
  
  for (let i = 0; i < 200; i++) {
    const idx = i * 6;
    const p1 = Math.floor(Math.random() * particleCount) * 3;
    const p2 = Math.floor(Math.random() * particleCount) * 3;
    
    linePositions[idx] = positions[p1];
    linePositions[idx + 1] = positions[p1 + 1];
    linePositions[idx + 2] = positions[p1 + 2];
    linePositions[idx + 3] = positions[p2];
    linePositions[idx + 4] = positions[p2 + 1];
    linePositions[idx + 5] = positions[p2 + 2];
  }
  
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.1
  });
  
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);
  
  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.001;
    
    particles.rotation.y = time * 0.2;
    particles.rotation.x = Math.sin(time) * 0.1;
    lines.rotation.y = time * 0.2;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// ===============================
// Particles Demo
// ===============================
let particlesDemo = null;

function initParticlesDemo() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);
  
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 20;
  
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  
  // Particle system
  let particles = null;
  let particleCount = 10000;
  let particleSize = 0.05;
  let particleSpeed = 1;
  let colorMode = 'rainbow';
  
  function createParticles() {
    if (particles) {
      scene.remove(particles);
      particles.geometry.dispose();
      particles.material.dispose();
    }
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Spherical distribution
      const radius = 10 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
      
      // Velocities
      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
      
      // Colors
      setParticleColor(colors, i, i / 3 / particleCount);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.userData.velocities = velocities;
    
    const material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }
  
  function setParticleColor(colors, index, t) {
    switch (colorMode) {
      case 'rainbow':
        const hue = t;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
        colors[index] = color.r;
        colors[index + 1] = color.g;
        colors[index + 2] = color.b;
        break;
      case 'gradient':
        colors[index] = 0.4 + t * 0.5;
        colors[index + 1] = 0.1 + t * 0.3;
        colors[index + 2] = 0.9 - t * 0.3;
        break;
      case 'solid':
        colors[index] = 0.4;
        colors[index + 1] = 0.4;
        colors[index + 2] = 0.95;
        break;
    }
  }
  
  createParticles();
  
  // Controls
  document.getElementById('particle-count').addEventListener('input', (e) => {
    particleCount = parseInt(e.target.value);
    document.getElementById('particle-count-value').textContent = particleCount.toLocaleString();
    createParticles();
  });
  
  document.getElementById('particle-size').addEventListener('input', (e) => {
    particleSize = parseFloat(e.target.value);
    document.getElementById('particle-size-value').textContent = particleSize.toFixed(2);
    if (particles) particles.material.size = particleSize;
  });
  
  document.getElementById('particle-speed').addEventListener('input', (e) => {
    particleSpeed = parseFloat(e.target.value);
    document.getElementById('particle-speed-value').textContent = particleSpeed.toFixed(1);
  });
  
  document.getElementById('particle-color').addEventListener('change', (e) => {
    colorMode = e.target.value;
    createParticles();
  });
  
  document.getElementById('reset-particles').addEventListener('click', () => {
    createParticles();
  });
  
  // Animation
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    // FPS counter
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = currentTime;
      document.getElementById('particles-fps').textContent = `${fps} FPS`;
    }
    
    controls.update();
    
    // Animate particles
    if (particles) {
      const positions = particles.geometry.attributes.position.array;
      const velocities = particles.geometry.userData.velocities;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * particleSpeed;
        positions[i + 1] += velocities[i + 1] * particleSpeed;
        positions[i + 2] += velocities[i + 2] * particleSpeed;
        
        // Boundary check - wrap around
        const limit = 12;
        if (Math.abs(positions[i]) > limit) positions[i] *= -0.9;
        if (Math.abs(positions[i + 1]) > limit) positions[i + 1] *= -0.9;
        if (Math.abs(positions[i + 2]) > limit) positions[i + 2] *= -0.9;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.001 * particleSpeed;
    }
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Resize handler
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  resizeObserver.observe(container);
  
  particlesDemo = { scene, camera, renderer, controls };
}

// ===============================
// PBR Materials Demo
// ===============================
function initMaterialsDemo() {
  const canvas = document.getElementById('materials-canvas');
  if (!canvas) return;
  
  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);
  
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5);
  
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  
  // Environment map (simple gradient for now)
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x1a1a2e);
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envMap = pmremGenerator.fromScene(envScene).texture;
  scene.environment = envMap;
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0x6366f1, 1, 10);
  pointLight.position.set(-3, 2, 2);
  scene.add(pointLight);
  
  // Sphere with PBR material
  const geometry = new THREE.SphereGeometry(1.5, 64, 64);
  let material = new THREE.MeshPhysicalMaterial({
    color: 0x6366f1,
    metalness: 0.5,
    roughness: 0.5,
    envMapIntensity: 1
  });
  
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
  
  // Material presets
  const materialPresets = {
    standard: {
      color: 0x6366f1,
      metalness: 0.5,
      roughness: 0.5,
      clearcoat: 0,
      transmission: 0
    },
    glass: {
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      clearcoat: 1,
      transmission: 0.9,
      thickness: 0.5,
      ior: 1.5
    },
    metal: {
      color: 0xcccccc,
      metalness: 1,
      roughness: 0.2,
      clearcoat: 0.3,
      transmission: 0
    },
    fabric: {
      color: 0x8844aa,
      metalness: 0,
      roughness: 0.9,
      clearcoat: 0,
      transmission: 0,
      sheen: 1,
      sheenRoughness: 0.5,
      sheenColor: 0xffffff
    },
    'tsl-custom': {
      color: 0x22d3ee,
      metalness: 0.7,
      roughness: 0.3,
      clearcoat: 0.5,
      transmission: 0,
      emissive: 0x112233,
      emissiveIntensity: 0.2
    }
  };
  
  function updateMaterial(preset) {
    const props = materialPresets[preset];
    Object.keys(props).forEach(key => {
      if (material[key] !== undefined) {
        material[key] = key === 'color' || key === 'sheenColor' || key === 'emissive'
          ? new THREE.Color(props[key])
          : props[key];
      }
    });
    material.needsUpdate = true;
  }
  
  // Controls
  document.getElementById('material-type').addEventListener('change', (e) => {
    updateMaterial(e.target.value);
  });
  
  document.getElementById('material-roughness').addEventListener('input', (e) => {
    material.roughness = parseFloat(e.target.value);
    document.getElementById('roughness-value').textContent = e.target.value;
  });
  
  document.getElementById('material-metalness').addEventListener('input', (e) => {
    material.metalness = parseFloat(e.target.value);
    document.getElementById('metalness-value').textContent = e.target.value;
  });
  
  document.getElementById('env-intensity').addEventListener('input', (e) => {
    material.envMapIntensity = parseFloat(e.target.value);
    document.getElementById('env-intensity-value').textContent = e.target.value;
  });
  
  // Animation
  let lastTime = performance.now();
  let frameCount = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    // FPS counter
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
      document.getElementById('materials-fps').textContent = `${frameCount} FPS`;
      frameCount = 0;
      lastTime = currentTime;
    }
    
    controls.update();
    sphere.rotation.y += 0.005;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Resize
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  resizeObserver.observe(container);
}

// ===============================
// Post-Processing Demo
// ===============================
function initPostFXDemo() {
  const canvas = document.getElementById('postfx-canvas');
  if (!canvas) return;
  
  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);
  
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2, 8);
  
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);
  
  // Create glowing objects
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    emissive: 0x6366f1,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2
  });
  
  // Torus knot
  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.3, 128, 32),
    glowMaterial
  );
  scene.add(torusKnot);
  
  // Floating spheres
  const spheres = [];
  for (let i = 0; i < 8; i++) {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(i / 8, 0.8, 0.5),
        emissive: new THREE.Color().setHSL(i / 8, 0.8, 0.3),
        emissiveIntensity: 0.5
      })
    );
    sphere.userData.angle = (i / 8) * Math.PI * 2;
    sphere.userData.radius = 2.5;
    sphere.userData.speed = 0.5 + Math.random() * 0.5;
    spheres.push(sphere);
    scene.add(sphere);
  }
  
  // Post-processing
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  
  // Bloom
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight),
    1.5,  // strength
    0.4,  // radius
    0.85  // threshold
  );
  composer.addPass(bloomPass);
  
  // Vignette shader
  const VignetteShader = {
    uniforms: {
      tDiffuse: { value: null },
      darkness: { value: 0.5 },
      offset: { value: 1.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float darkness;
      uniform float offset;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        vec2 center = vUv - vec2(0.5);
        float dist = length(center);
        float vignette = smoothstep(0.8, offset * 0.5, dist * (darkness + offset));
        gl_FragColor = vec4(texel.rgb * vignette, texel.a);
      }
    `
  };
  
  const vignettePass = new ShaderPass(VignetteShader);
  vignettePass.enabled = false;
  composer.addPass(vignettePass);
  
  // Chromatic aberration shader
  const ChromaticAberrationShader = {
    uniforms: {
      tDiffuse: { value: null },
      amount: { value: 0.02 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float amount;
      varying vec2 vUv;
      void main() {
        vec2 center = vUv - vec2(0.5);
        float dist = length(center);
        vec2 offset = center * dist * amount;
        
        float r = texture2D(tDiffuse, vUv + offset).r;
        float g = texture2D(tDiffuse, vUv).g;
        float b = texture2D(tDiffuse, vUv - offset).b;
        
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `
  };
  
  const chromaticPass = new ShaderPass(ChromaticAberrationShader);
  chromaticPass.enabled = false;
  composer.addPass(chromaticPass);
  
  // Controls
  document.getElementById('bloom-enabled').addEventListener('change', (e) => {
    bloomPass.enabled = e.target.checked;
  });
  
  document.getElementById('bloom-strength').addEventListener('input', (e) => {
    bloomPass.strength = parseFloat(e.target.value);
  });
  
  document.getElementById('vignette-enabled').addEventListener('change', (e) => {
    vignettePass.enabled = e.target.checked;
  });
  
  document.getElementById('vignette-amount').addEventListener('input', (e) => {
    vignettePass.uniforms.darkness.value = parseFloat(e.target.value);
  });
  
  document.getElementById('chromatic-enabled').addEventListener('change', (e) => {
    chromaticPass.enabled = e.target.checked;
  });
  
  document.getElementById('chromatic-amount').addEventListener('input', (e) => {
    chromaticPass.uniforms.amount.value = parseFloat(e.target.value);
  });
  
  // DOF placeholder (simplified)
  document.getElementById('dof-enabled').addEventListener('change', (e) => {
    // DOF would require more complex setup
    console.log('DOF enabled:', e.target.checked);
  });
  
  // Animation
  let lastTime = performance.now();
  let frameCount = 0;
  let time = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    // FPS counter
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
      document.getElementById('postfx-fps').textContent = `${frameCount} FPS`;
      frameCount = 0;
      lastTime = currentTime;
    }
    
    controls.update();
    
    // Animate objects
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.005;
    
    spheres.forEach(sphere => {
      const angle = sphere.userData.angle + time * sphere.userData.speed;
      sphere.position.x = Math.cos(angle) * sphere.userData.radius;
      sphere.position.z = Math.sin(angle) * sphere.userData.radius;
      sphere.position.y = Math.sin(time * 2 + sphere.userData.angle) * 0.5;
    });
    
    composer.render();
  }
  
  animate();
  
  // Resize
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
  });
  resizeObserver.observe(container);
}

// ===============================
// GPU Compute Demo (Placeholder)
// ===============================
function initComputeDemo() {
  const canvas = document.getElementById('compute-canvas');
  if (!canvas) return;
  
  const container = canvas.parentElement;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);
  
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 10, 30);
  
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  
  // GPU Compute simulation (simplified CPU version as fallback)
  let particleCount = 100000;
  let simSpeed = 1;
  let simType = 'particles';
  
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  function initParticles() {
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 30;
      
      velocities[i] = (Math.random() - 0.5) * 0.1;
      velocities[i + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i + 2] = (Math.random() - 0.5) * 0.1;
      
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.userData.velocities = velocities;
  }
  
  initParticles();
  
  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // Update counter
  document.getElementById('compute-info').textContent = `Particles: ${particleCount.toLocaleString()}`;
  
  // Controls
  document.getElementById('compute-count').addEventListener('input', (e) => {
    particleCount = parseInt(e.target.value);
    document.getElementById('compute-count-value').textContent = particleCount.toLocaleString();
    document.getElementById('compute-info').textContent = `Particles: ${particleCount.toLocaleString()}`;
    
    // Recreate particle system
    scene.remove(particles);
    geometry.dispose();
    
    const newPositions = new Float32Array(particleCount * 3);
    const newVelocities = new Float32Array(particleCount * 3);
    const newColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      newPositions[i] = (Math.random() - 0.5) * 30;
      newPositions[i + 1] = (Math.random() - 0.5) * 30;
      newPositions[i + 2] = (Math.random() - 0.5) * 30;
      
      newVelocities[i] = (Math.random() - 0.5) * 0.1;
      newVelocities[i + 1] = (Math.random() - 0.5) * 0.1;
      newVelocities[i + 2] = (Math.random() - 0.5) * 0.1;
      
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
      newColors[i] = color.r;
      newColors[i + 1] = color.g;
      newColors[i + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(newColors, 3));
    geometry.userData.velocities = newVelocities;
    
    scene.add(new THREE.Points(geometry, material));
  });
  
  document.getElementById('sim-speed').addEventListener('input', (e) => {
    simSpeed = parseFloat(e.target.value);
    document.getElementById('sim-speed-value').textContent = simSpeed.toFixed(1);
  });
  
  document.getElementById('compute-type').addEventListener('change', (e) => {
    simType = e.target.value;
  });
  
  // Animation
  let lastTime = performance.now();
  let frameCount = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    // FPS counter
    frameCount++;
    const currentTime = performance.now();
    if (currentTime - lastTime >= 1000) {
      document.getElementById('compute-fps').textContent = `${frameCount} FPS`;
      frameCount = 0;
      lastTime = currentTime;
    }
    
    controls.update();
    
    // Simple physics simulation
    const pos = geometry.attributes.position.array;
    const vel = geometry.userData.velocities;
    const gravity = simType === 'particles' ? -0.001 : 0;
    const bounds = 15;
    
    for (let i = 0; i < pos.length; i += 3) {
      // Apply gravity
      vel[i + 1] += gravity * simSpeed;
      
      // Update positions
      pos[i] += vel[i] * simSpeed;
      pos[i + 1] += vel[i + 1] * simSpeed;
      pos[i + 2] += vel[i + 2] * simSpeed;
      
      // Bounce off bounds
      if (Math.abs(pos[i]) > bounds) {
        pos[i] = Math.sign(pos[i]) * bounds;
        vel[i] *= -0.8;
      }
      if (pos[i + 1] < -bounds) {
        pos[i + 1] = -bounds;
        vel[i + 1] *= -0.8;
      }
      if (pos[i + 1] > bounds) {
        pos[i + 1] = bounds;
        vel[i + 1] *= -0.8;
      }
      if (Math.abs(pos[i + 2]) > bounds) {
        pos[i + 2] = Math.sign(pos[i + 2]) * bounds;
        vel[i + 2] *= -0.8;
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Resize
  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  resizeObserver.observe(container);
}

// ===============================
// Initialization
// ===============================
async function init() {
  // Check WebGPU support
  await checkWebGPUSupport();
  
  // Init UI
  initThemeToggle();
  initTabs();
  
  // Init hero background
  initHeroBackground();
  
  // Init first demo tab
  initParticlesDemo();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
