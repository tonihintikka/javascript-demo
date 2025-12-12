/**
 * Fluid Motion Demo - Unit Tests
 * Tests for WebGL shaders, metaballs, and liquid effects
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Shader compilation simulation
function validateShader(source, type) {
  const errors = [];
  
  // Basic GLSL validation
  if (!source || source.trim() === '') {
    errors.push('Shader source is empty');
    return { valid: false, errors };
  }
  
  if (type === 'vertex') {
    if (!source.includes('gl_Position')) {
      errors.push('Vertex shader must set gl_Position');
    }
    if (!source.includes('attribute') && !source.includes('in ')) {
      errors.push('Vertex shader should have vertex attributes');
    }
  }
  
  if (type === 'fragment') {
    if (!source.includes('gl_FragColor') && !source.includes('out ')) {
      errors.push('Fragment shader must output color');
    }
  }
  
  // Check for common syntax issues
  if ((source.match(/\{/g) || []).length !== (source.match(/\}/g) || []).length) {
    errors.push('Mismatched braces');
  }
  
  return { valid: errors.length === 0, errors };
}

// Metaball calculation
function calculateMetaball(x, y, balls) {
  let sum = 0;
  
  for (const ball of balls) {
    const dx = x - ball.x;
    const dy = y - ball.y;
    const distSq = dx * dx + dy * dy;
    
    // Avoid division by zero
    if (distSq < 0.0001) {
      sum += ball.radius * 10000;
    } else {
      sum += (ball.radius * ball.radius) / distSq;
    }
  }
  
  return sum;
}

// Check if point is inside metaball threshold
function isInsideMetaball(x, y, balls, threshold = 1.0) {
  return calculateMetaball(x, y, balls) >= threshold;
}

// Noise function (simplified Perlin-like)
function simpleNoise(x, y, seed = 0) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

// Liquid distortion calculation
function calculateDistortion(x, y, time, settings) {
  const { frequency, amplitude, speed } = settings;
  
  const distortionX = Math.sin(y * frequency + time * speed) * amplitude;
  const distortionY = Math.cos(x * frequency + time * speed) * amplitude;
  
  return {
    x: x + distortionX,
    y: y + distortionY
  };
}

// Mouse velocity tracking
function calculateVelocity(positions) {
  if (positions.length < 2) {
    return { vx: 0, vy: 0, speed: 0 };
  }
  
  const current = positions[positions.length - 1];
  const previous = positions[positions.length - 2];
  
  const vx = current.x - previous.x;
  const vy = current.y - previous.y;
  const speed = Math.sqrt(vx * vx + vy * vy);
  
  return { vx, vy, speed };
}

// Color interpolation for liquid effects
function lerpColor(color1, color2, t) {
  return {
    r: color1.r + (color2.r - color1.r) * t,
    g: color1.g + (color2.g - color1.g) * t,
    b: color1.b + (color2.b - color1.b) * t
  };
}

describe('Fluid Motion Demo', () => {
  describe('Shader Validation', () => {
    it('should validate vertex shader with gl_Position', () => {
      const shader = `
        attribute vec3 position;
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `;
      
      const result = validateShader(shader, 'vertex');
      expect(result.valid).toBe(true);
    });

    it('should reject vertex shader without gl_Position', () => {
      const shader = `
        attribute vec3 position;
        void main() {
          vec4 pos = vec4(position, 1.0);
        }
      `;
      
      const result = validateShader(shader, 'vertex');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Vertex shader must set gl_Position');
    });

    it('should validate fragment shader with gl_FragColor', () => {
      const shader = `
        void main() {
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `;
      
      const result = validateShader(shader, 'fragment');
      expect(result.valid).toBe(true);
    });

    it('should reject empty shader', () => {
      const result = validateShader('', 'vertex');
      expect(result.valid).toBe(false);
    });

    it('should detect mismatched braces', () => {
      const shader = `
        void main() {
          gl_FragColor = vec4(1.0);
      `;
      
      const result = validateShader(shader, 'fragment');
      expect(result.valid).toBe(false);
    });
  });

  describe('Metaball Calculations', () => {
    const balls = [
      { x: 0, y: 0, radius: 1 },
      { x: 2, y: 0, radius: 1 }
    ];

    it('should calculate high value near ball center', () => {
      const value = calculateMetaball(0, 0, balls);
      expect(value).toBeGreaterThan(100);
    });

    it('should calculate lower value far from balls', () => {
      const value = calculateMetaball(10, 10, balls);
      expect(value).toBeLessThan(1);
    });

    it('should detect point inside metaball', () => {
      const inside = isInsideMetaball(0.1, 0.1, balls, 1.0);
      expect(inside).toBe(true);
    });

    it('should detect point outside metaball', () => {
      const inside = isInsideMetaball(5, 5, balls, 1.0);
      expect(inside).toBe(false);
    });

    it('should have higher values between close balls', () => {
      const valueBetween = calculateMetaball(1, 0, balls);
      const valueOutside = calculateMetaball(5, 0, balls);
      
      expect(valueBetween).toBeGreaterThan(valueOutside);
    });

    it('should handle single ball', () => {
      const singleBall = [{ x: 0, y: 0, radius: 2 }];
      const value = calculateMetaball(0, 0, singleBall);
      
      expect(value).toBeGreaterThan(0);
    });

    it('should handle empty balls array', () => {
      const value = calculateMetaball(0, 0, []);
      expect(value).toBe(0);
    });
  });

  describe('Noise Function', () => {
    it('should return value between 0 and 1', () => {
      const value = simpleNoise(1.5, 2.3);
      
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });

    it('should return consistent values for same input', () => {
      const value1 = simpleNoise(5, 10, 42);
      const value2 = simpleNoise(5, 10, 42);
      
      expect(value1).toBe(value2);
    });

    it('should return different values for different inputs', () => {
      const value1 = simpleNoise(1, 1);
      const value2 = simpleNoise(2, 2);
      
      expect(value1).not.toBe(value2);
    });

    it('should be affected by seed', () => {
      const value1 = simpleNoise(5, 5, 0);
      const value2 = simpleNoise(5, 5, 100);
      
      expect(value1).not.toBe(value2);
    });
  });

  describe('Liquid Distortion', () => {
    const settings = {
      frequency: 0.1,
      amplitude: 10,
      speed: 1
    };

    it('should apply distortion to coordinates', () => {
      const result = calculateDistortion(100, 100, 1, settings);
      
      expect(result.x).not.toBe(100);
      expect(result.y).not.toBe(100);
    });

    it('should have time-dependent distortion', () => {
      const result1 = calculateDistortion(100, 100, 0, settings);
      const result2 = calculateDistortion(100, 100, 1, settings);
      
      expect(result1.x).not.toBe(result2.x);
    });

    it('should respect amplitude setting', () => {
      const lowAmp = { ...settings, amplitude: 1 };
      const highAmp = { ...settings, amplitude: 100 };
      
      const result1 = calculateDistortion(100, 100, 0.5, lowAmp);
      const result2 = calculateDistortion(100, 100, 0.5, highAmp);
      
      const deviation1 = Math.abs(result1.x - 100);
      const deviation2 = Math.abs(result2.x - 100);
      
      expect(deviation2).toBeGreaterThan(deviation1);
    });

    it('should return original position with zero amplitude', () => {
      const zeroAmp = { ...settings, amplitude: 0 };
      const result = calculateDistortion(100, 100, 1, zeroAmp);
      
      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
    });
  });

  describe('Mouse Velocity Tracking', () => {
    it('should return zero velocity with single position', () => {
      const positions = [{ x: 100, y: 100, time: 0 }];
      const velocity = calculateVelocity(positions);
      
      expect(velocity.vx).toBe(0);
      expect(velocity.vy).toBe(0);
      expect(velocity.speed).toBe(0);
    });

    it('should calculate horizontal velocity', () => {
      const positions = [
        { x: 100, y: 100 },
        { x: 110, y: 100 }
      ];
      const velocity = calculateVelocity(positions);
      
      expect(velocity.vx).toBe(10);
      expect(velocity.vy).toBe(0);
      expect(velocity.speed).toBe(10);
    });

    it('should calculate diagonal velocity', () => {
      const positions = [
        { x: 0, y: 0 },
        { x: 3, y: 4 }
      ];
      const velocity = calculateVelocity(positions);
      
      expect(velocity.vx).toBe(3);
      expect(velocity.vy).toBe(4);
      expect(velocity.speed).toBe(5); // 3-4-5 triangle
    });

    it('should handle negative velocity', () => {
      const positions = [
        { x: 100, y: 100 },
        { x: 90, y: 80 }
      ];
      const velocity = calculateVelocity(positions);
      
      expect(velocity.vx).toBe(-10);
      expect(velocity.vy).toBe(-20);
    });
  });

  describe('Color Interpolation', () => {
    const red = { r: 255, g: 0, b: 0 };
    const blue = { r: 0, g: 0, b: 255 };

    it('should return first color at t=0', () => {
      const result = lerpColor(red, blue, 0);
      
      expect(result.r).toBe(255);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
    });

    it('should return second color at t=1', () => {
      const result = lerpColor(red, blue, 1);
      
      expect(result.r).toBe(0);
      expect(result.g).toBe(0);
      expect(result.b).toBe(255);
    });

    it('should return middle color at t=0.5', () => {
      const result = lerpColor(red, blue, 0.5);
      
      expect(result.r).toBe(127.5);
      expect(result.b).toBe(127.5);
    });

    it('should interpolate all channels', () => {
      const color1 = { r: 100, g: 50, b: 200 };
      const color2 = { r: 200, g: 150, b: 100 };
      const result = lerpColor(color1, color2, 0.5);
      
      expect(result.r).toBe(150);
      expect(result.g).toBe(100);
      expect(result.b).toBe(150);
    });
  });
});
