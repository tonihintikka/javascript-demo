/**
 * Vitest Global Setup
 * Sets up testing environment for all unit tests
 */

import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: () => true,
});

// Mock navigator.gpu (WebGPU)
Object.defineProperty(navigator, 'gpu', {
  writable: true,
  value: undefined, // WebGPU not available in tests by default
});

// Mock canvas context
HTMLCanvasElement.prototype.getContext = function(type) {
  if (type === '2d') {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      fill: () => {},
      arc: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      measureText: () => ({ width: 0 }),
      fillText: () => {},
      strokeText: () => {},
    };
  }
  if (type === 'webgl' || type === 'webgl2') {
    return {
      canvas: this,
      getExtension: () => null,
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => true,
      useProgram: () => {},
      getAttribLocation: () => 0,
      getUniformLocation: () => ({}),
      uniform1f: () => {},
      uniform2f: () => {},
      uniform3f: () => {},
      uniform4f: () => {},
      uniformMatrix4fv: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      viewport: () => {},
      clearColor: () => {},
      clear: () => {},
      drawArrays: () => {},
      drawElements: () => {},
    };
  }
  return null;
};

// Console error tracking for tests
const originalError = console.error;
console.error = (...args) => {
  // Suppress specific expected errors
  const message = args[0]?.toString() || '';
  if (message.includes('WebGPU') || message.includes('WebGL')) {
    return;
  }
  originalError.apply(console, args);
};
