/**
 * Fluid Motion Demo - WebGL Liquid Distortion Effects
 */

// ============================================
// WEBGL SHADER CODE
// ============================================

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_viscosity;
  uniform float u_distortion;
  uniform float u_speed;
  uniform float u_colorShift;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 center = vec2(0.5, 0.5);

    // Calculate distance from mouse (if applicable)
    float mouseInfluence = 0.0;
    if (u_mouse.x > 0.0) {
      vec2 mousePos = u_mouse / u_resolution;
      float dist = length(uv - mousePos);
      mouseInfluence = smoothstep(0.3, 0.0, dist) * 0.5;
    }

    // Liquid distortion waves
    float wave1 = sin(uv.x * 10.0 + u_time * u_speed) * u_distortion;
    float wave2 = cos(uv.y * 10.0 + u_time * u_speed * 0.8) * u_distortion;
    float wave3 = sin((uv.x + uv.y) * 8.0 - u_time * u_speed * 1.2) * u_distortion * 0.5;

    // Apply viscosity
    vec2 distorted = uv + vec2(wave1 + wave3, wave2 + wave3) * u_viscosity;
    distorted += mouseInfluence * (uv - u_mouse / u_resolution) * 0.1;

    // Create flowing color gradient
    float colorTime = u_time * u_speed * 0.5 + u_colorShift * 6.28;
    vec3 color1 = vec3(0.39, 0.40, 0.95); // Primary blue
    vec3 color2 = vec3(0.02, 0.71, 0.83); // Accent cyan
    vec3 color3 = vec3(0.06, 0.73, 0.51); // Success green

    // Mix colors based on distorted UVs
    float mixFactor1 = 0.5 + 0.5 * sin(distorted.x * 3.14159 + colorTime);
    float mixFactor2 = 0.5 + 0.5 * sin(distorted.y * 3.14159 + colorTime * 1.2);

    vec3 color = mix(color1, color2, mixFactor1);
    color = mix(color, color3, mixFactor2 * 0.5);

    // Add some shimmer
    float shimmer = sin(distorted.x * 20.0 + distorted.y * 20.0 + u_time * u_speed * 2.0) * 0.1 + 0.9;
    color *= shimmer;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ============================================
// WEBGL UTILITIES
// ============================================

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function setupCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio, 2);
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    preserveDrawingBuffer: false
  });

  if (!gl) {
    console.error('WebGL not supported');
    return null;
  }

  return gl;
}

// ============================================
// FLUID RENDERER CLASS
// ============================================

class FluidRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.gl = setupCanvas(canvas);

    if (!this.gl) {
      console.error('Failed to initialize WebGL');
      return;
    }

    this.params = {
      viscosity: options.viscosity ?? 0.5,
      distortion: options.distortion ?? 0.3,
      speed: options.speed ?? 1.0,
      colorShift: options.colorShift ?? 0.5,
      mouseTracking: options.mouseTracking ?? false
    };

    this.mouse = { x: 0, y: 0 };
    this.time = 0;
    this.isRunning = false;
    this.animationFrame = null;

    this.init();
  }

  init() {
    const gl = this.gl;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    // Create program
    this.program = createProgram(gl, vertexShader, fragmentShader);

    if (!this.program) {
      console.error('Failed to create program');
      return;
    }

    // Get attribute and uniform locations
    this.locations = {
      position: gl.getAttribLocation(this.program, 'a_position'),
      time: gl.getUniformLocation(this.program, 'u_time'),
      resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      mouse: gl.getUniformLocation(this.program, 'u_mouse'),
      viscosity: gl.getUniformLocation(this.program, 'u_viscosity'),
      distortion: gl.getUniformLocation(this.program, 'u_distortion'),
      speed: gl.getUniformLocation(this.program, 'u_speed'),
      colorShift: gl.getUniformLocation(this.program, 'u_colorShift')
    };

    // Create position buffer (full-screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Setup mouse tracking if enabled
    if (this.params.mouseTracking) {
      this.setupMouseTracking();
    }

    this.resize();
  }

  setupMouseTracking() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      this.mouse.y = this.canvas.height - (e.clientY - rect.top) * (this.canvas.height / rect.height);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = 0;
      this.mouse.y = 0;
    });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  updateParams(params) {
    Object.assign(this.params, params);
  }

  render(deltaTime) {
    const gl = this.gl;

    if (!this.program) return;

    this.time += deltaTime * 0.001;

    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use program
    gl.useProgram(this.program);

    // Set uniforms
    gl.uniform1f(this.locations.time, this.time);
    gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.locations.mouse, this.mouse.x, this.mouse.y);
    gl.uniform1f(this.locations.viscosity, this.params.viscosity);
    gl.uniform1f(this.locations.distortion, this.params.distortion);
    gl.uniform1f(this.locations.speed, this.params.speed);
    gl.uniform1f(this.locations.colorShift, this.params.colorShift);

    // Set attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!this.isRunning) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      this.render(deltaTime);

      this.animationFrame = requestAnimationFrame(loop);
    };

    this.animationFrame = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  destroy() {
    this.stop();

    if (this.gl) {
      this.gl.deleteBuffer(this.positionBuffer);
      this.gl.deleteProgram(this.program);
    }
  }
}

// ============================================
// MAIN HERO CANVAS
// ============================================

let heroRenderer = null;

function initHeroCanvas() {
  const canvas = document.getElementById('fluid-canvas');
  if (!canvas) return;

  heroRenderer = new FluidRenderer(canvas, {
    viscosity: 0.5,
    distortion: 0.3,
    speed: 1.0,
    colorShift: 0.5,
    mouseTracking: true
  });

  heroRenderer.start();

  // Handle resize
  window.addEventListener('resize', () => {
    if (heroRenderer) {
      heroRenderer.resize();
    }
  });
}

// ============================================
// CONTROLS
// ============================================

function initControls() {
  const viscosityInput = document.getElementById('viscosity');
  const distortionInput = document.getElementById('distortion');
  const speedInput = document.getElementById('speed');
  const colorShiftInput = document.getElementById('color-shift');

  const viscosityValue = document.getElementById('viscosity-value');
  const distortionValue = document.getElementById('distortion-value');
  const speedValue = document.getElementById('speed-value');
  const colorShiftValue = document.getElementById('color-shift-value');

  function updateHeroRenderer() {
    if (!heroRenderer) return;

    heroRenderer.updateParams({
      viscosity: parseFloat(viscosityInput.value),
      distortion: parseFloat(distortionInput.value),
      speed: parseFloat(speedInput.value),
      colorShift: parseFloat(colorShiftInput.value)
    });
  }

  viscosityInput?.addEventListener('input', (e) => {
    viscosityValue.textContent = e.target.value;
    updateHeroRenderer();
  });

  distortionInput?.addEventListener('input', (e) => {
    distortionValue.textContent = e.target.value;
    updateHeroRenderer();
  });

  speedInput?.addEventListener('input', (e) => {
    speedValue.textContent = e.target.value;
    updateHeroRenderer();
  });

  colorShiftInput?.addEventListener('input', (e) => {
    colorShiftValue.textContent = e.target.value;
    updateHeroRenderer();
  });

  // Preset buttons
  const presetButtons = document.querySelectorAll('.preset-btn');

  const presets = {
    calm: { viscosity: 0.3, distortion: 0.2, speed: 0.5, colorShift: 0.3 },
    energetic: { viscosity: 0.7, distortion: 0.5, speed: 2.0, colorShift: 0.7 },
    chaotic: { viscosity: 1.0, distortion: 0.8, speed: 3.0, colorShift: 1.0 }
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const presetName = this.dataset.preset;
      const preset = presets[presetName];

      if (preset) {
        viscosityInput.value = preset.viscosity;
        distortionInput.value = preset.distortion;
        speedInput.value = preset.speed;
        colorShiftInput.value = preset.colorShift;

        viscosityValue.textContent = preset.viscosity;
        distortionValue.textContent = preset.distortion;
        speedValue.textContent = preset.speed;
        colorShiftValue.textContent = preset.colorShift;

        updateHeroRenderer();
      }
    });
  });
}

// ============================================
// EXAMPLE RENDERERS
// ============================================

const exampleRenderers = [];

function initExamples() {
  // Liquid Button
  const liquidBtn = document.getElementById('liquid-btn-1');
  if (liquidBtn) {
    const btnCanvas = liquidBtn.querySelector('.btn-canvas');
    const btnRenderer = new FluidRenderer(btnCanvas, {
      viscosity: 0.4,
      distortion: 0.4,
      speed: 1.5,
      colorShift: 0.6,
      mouseTracking: true
    });

    liquidBtn.addEventListener('mouseenter', () => btnRenderer.start());
    liquidBtn.addEventListener('mouseleave', () => btnRenderer.stop());

    exampleRenderers.push(btnRenderer);
  }

  // Image Distortion
  const imageDistortion = document.getElementById('image-distortion');
  if (imageDistortion) {
    const distortionCanvas = imageDistortion.querySelector('.distortion-canvas');
    const distortionRenderer = new FluidRenderer(distortionCanvas, {
      viscosity: 0.6,
      distortion: 0.5,
      speed: 0.8,
      colorShift: 0.4,
      mouseTracking: true
    });

    distortionRenderer.start();
    exampleRenderers.push(distortionRenderer);
  }

  // Liquid Loader
  const loaderCanvas = document.querySelector('.loader-canvas');
  if (loaderCanvas) {
    const loaderRenderer = new FluidRenderer(loaderCanvas, {
      viscosity: 0.8,
      distortion: 0.6,
      speed: 2.0,
      colorShift: 0.8
    });

    loaderRenderer.start();
    exampleRenderers.push(loaderRenderer);
  }

  // Card Fluid Background
  const cardFluidBg = document.querySelector('.card-fluid-bg');
  if (cardFluidBg) {
    const cardRenderer = new FluidRenderer(cardFluidBg, {
      viscosity: 0.3,
      distortion: 0.3,
      speed: 0.6,
      colorShift: 0.5
    });

    cardRenderer.start();
    exampleRenderers.push(cardRenderer);
  }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

function initPerformanceMonitoring() {
  const fpsCounter = document.getElementById('fps-counter');
  const frameTimeDisplay = document.getElementById('frame-time');
  const drawCallsDisplay = document.getElementById('draw-calls');

  if (!fpsCounter) return;

  let frameCount = 0;
  let lastTime = performance.now();
  let lastFrameTime = 0;

  function updateStats() {
    frameCount++;
    const currentTime = performance.now();
    const frameTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

      fpsCounter.textContent = fps;
      frameTimeDisplay.textContent = `${frameTime.toFixed(1)}ms`;
      drawCallsDisplay.textContent = exampleRenderers.length + 1; // +1 for hero

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(updateStats);
  }

  requestAnimationFrame(updateStats);
}

// ============================================
// INTERSECTION OBSERVER (Performance)
// ============================================

function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const canvas = entry.target;
      const renderer = exampleRenderers.find(r => r.canvas === canvas);

      if (renderer) {
        if (entry.isIntersecting) {
          renderer.start();
        } else {
          renderer.stop();
        }
      }
    });
  }, observerOptions);

  // Observe all example canvases
  exampleRenderers.forEach(renderer => {
    if (renderer.canvas && renderer.canvas !== document.getElementById('fluid-canvas')) {
      observer.observe(renderer.canvas);
    }
  });
}

// ============================================
// CLEANUP
// ============================================

function cleanup() {
  if (heroRenderer) {
    heroRenderer.destroy();
  }

  exampleRenderers.forEach(renderer => {
    renderer.destroy();
  });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Check WebGL support
  const testCanvas = document.createElement('canvas');
  const testGl = testCanvas.getContext('webgl');

  if (!testGl) {
    console.error('WebGL is not supported in this browser');
    alert('WebGL ei ole tuettu tässä selaimessa. Demo ei toimi.');
    return;
  }

  initHeroCanvas();
  initControls();
  initExamples();
  initIntersectionObserver();

  if (import.meta.env.DEV) {
    initPerformanceMonitoring();
  }

  console.log('✨ Fluid Motion demo initialized');
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
