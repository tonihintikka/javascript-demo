/**
 * Landing Page - Modern JavaScript Effects 2025
 * Features: 3D Particles, Scroll Animations, Magnetic Buttons, Card Hovers
 */

import * as THREE from 'three';

// ============================================
// HERO SECTION - 3D Particle Background
// ============================================

class ParticleBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });

    this.mouse = { x: 0, y: 0 };
    this.particles = null;

    this.init();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.position.z = 5;
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x6366f1); // Primary
    const color2 = new THREE.Color(0x06b6d4); // Accent

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Random positions in a sphere
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Gradient colors
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Rotate particles
    if (this.particles) {
      this.particles.rotation.x += 0.0005;
      this.particles.rotation.y += 0.001;

      // React to mouse
      this.particles.rotation.x += this.mouse.y * 0.0005;
      this.particles.rotation.y += this.mouse.x * 0.0005;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal-text, .reveal-fade');
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after reveal to improve performance
          this.observer.unobserve(entry.target);
        }
      });
    }, this.options);

    this.init();
  }

  init() {
    this.elements.forEach(el => {
      this.observer.observe(el);
    });
  }
}

// ============================================
// COUNTER ANIMATION (Stats)
// ============================================

class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.animated = new Set();

    this.options = {
      threshold: 0.5
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animateCounter(entry.target);
          this.animated.add(entry.target);
        }
      });
    }, this.options);

    this.init();
  }

  init() {
    this.counters.forEach(counter => {
      this.observer.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================

class MagneticButton {
  constructor(element) {
    this.element = element;
    this.strength = 0.3; // How strong the magnetic effect is
    this.setupEvents();
  }

  setupEvents() {
    this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.element.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  onMouseMove(event) {
    const rect = this.element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    this.element.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
  }

  onMouseLeave() {
    this.element.style.transform = 'translate(0, 0)';
  }
}

// Initialize all magnetic buttons
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-magnetic');
  buttons.forEach(btn => new MagneticButton(btn));
}

// ============================================
// DEMO CARDS - Mouse Tracking & Hover Effects
// ============================================

class DemoCards {
  constructor() {
    this.cards = document.querySelectorAll('.demo-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.onCardHover(e, card));
      card.addEventListener('mouseleave', () => this.onCardLeave(card));
    });
  }

  onCardHover(event, card) {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  }

  onCardLeave(card) {
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  }
}

// ============================================
// CARD PREVIEW ANIMATIONS
// ============================================

class CardPreviews {
  constructor() {
    this.init3DPreviews();
    this.initFluidPreviews();
    this.initScrollytellingPreview();
  }

  init3DPreviews() {
    const canvases = document.querySelectorAll('canvas[data-preview="3d"]');

    canvases.forEach(canvas => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });

      const size = canvas.clientWidth;
      renderer.setSize(size, size);
      camera.position.z = 3;

      // Create a rotating torus
      const geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100);
      const material = new THREE.MeshNormalMaterial({ wireframe: true });
      const torus = new THREE.Mesh(geometry, material);
      scene.add(torus);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
    });
  }

  initFluidPreviews() {
    const canvases = document.querySelectorAll('canvas[data-preview="fluid"]');

    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      const size = canvas.clientWidth;
      canvas.width = size;
      canvas.height = size;

      let time = 0;

      const animate = () => {
        requestAnimationFrame(animate);

        ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        ctx.fillRect(0, 0, size, size);

        // Draw fluid-like wave
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < size; x++) {
          const y = size / 2 + Math.sin(x * 0.05 + time) * 20;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        time += 0.05;
      };
      animate();
    });
  }

  initScrollytellingPreview() {
    const previews = document.querySelectorAll('.preview-scrollytelling');

    previews.forEach(preview => {
      const bars = [];
      const colors = ['#6366f1', '#8b5cf6', '#06b6d4'];

      for (let i = 0; i < 3; i++) {
        const bar = document.createElement('div');
        bar.style.cssText = `
          position: absolute;
          bottom: 0;
          left: ${i * 33.33}%;
          width: 30%;
          background: ${colors[i]};
          border-radius: 4px 4px 0 0;
          transition: height 0.3s ease;
        `;
        preview.appendChild(bar);
        bars.push(bar);
      }

      // Animate bars
      let index = 0;
      setInterval(() => {
        bars.forEach((bar, i) => {
          const height = (index === i) ? '80%' : `${Math.random() * 60 + 20}%`;
          bar.style.height = height;
        });
        index = (index + 1) % bars.length;
      }, 1000);
    });
  }
}

// ============================================
// CURSOR FOLLOWER
// ============================================

class CursorFollower {
  constructor() {
    this.cursor = document.getElementById('cursor-follower');
    this.position = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.speed = 0.15;

    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Activate on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .demo-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('active');
      });
    });

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth follow with easing
    this.position.x += (this.mouse.x - this.position.x) * this.speed;
    this.position.y += (this.mouse.y - this.position.y) * this.speed;

    this.cursor.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize 3D particle background (skip if reduced motion)
  if (!prefersReducedMotion) {
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
      new ParticleBackground(heroCanvas);
    }

    // Initialize card previews
    new CardPreviews();

    // Initialize cursor follower
    new CursorFollower();
  }

  // Initialize scroll animations
  new ScrollReveal();

  // Initialize counter animations
  new CounterAnimation();

  // Initialize magnetic buttons
  initMagneticButtons();

  // Initialize demo cards
  new DemoCards();

  // Initialize smooth scroll
  initSmoothScroll();

  console.log('🚀 Landing page initialized with modern effects');
});

// ============================================
// PERFORMANCE MONITORING (Development)
// ============================================

if (import.meta.env.DEV) {
  // Log performance metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('📊 Performance Metrics:', {
        'DOM Content Loaded': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
        'Load Complete': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
        'Total Load Time': `${perfData.loadEventEnd}ms`
      });
    }, 0);
  });
}
