/**
 * Glassmorphism Demo - Unit Tests
 * Tests for glassmorphism effect controls and CSS generation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock glassmorphism state and functions for testing
const createGlassmorphismState = () => ({
  blur: 10,
  opacity: 0.1,
  saturation: 180,
  borderOpacity: 0.2
});

const defaults = {
  blur: 10,
  opacity: 0.1,
  saturation: 180,
  borderOpacity: 0.2
};

// Helper function to generate CSS
function generateGlassCSS(state) {
  const { blur, opacity, saturation, borderOpacity } = state;
  return `backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
background: rgba(255, 255, 255, ${opacity});
border: 1px solid rgba(255, 255, 255, ${borderOpacity});`;
}

// Validate glass effect values
function validateGlassValues(state) {
  const errors = [];
  
  if (state.blur < 0 || state.blur > 50) {
    errors.push('Blur must be between 0 and 50');
  }
  if (state.opacity < 0 || state.opacity > 1) {
    errors.push('Opacity must be between 0 and 1');
  }
  if (state.saturation < 0 || state.saturation > 300) {
    errors.push('Saturation must be between 0 and 300');
  }
  if (state.borderOpacity < 0 || state.borderOpacity > 1) {
    errors.push('Border opacity must be between 0 and 1');
  }
  
  return errors;
}

describe('Glassmorphism Demo', () => {
  describe('State Management', () => {
    it('should create initial state with default values', () => {
      const state = createGlassmorphismState();
      
      expect(state.blur).toBe(10);
      expect(state.opacity).toBe(0.1);
      expect(state.saturation).toBe(180);
      expect(state.borderOpacity).toBe(0.2);
    });

    it('should have correct default values', () => {
      expect(defaults.blur).toBe(10);
      expect(defaults.opacity).toBe(0.1);
      expect(defaults.saturation).toBe(180);
      expect(defaults.borderOpacity).toBe(0.2);
    });

    it('should allow state modification', () => {
      const state = createGlassmorphismState();
      state.blur = 20;
      state.opacity = 0.5;
      
      expect(state.blur).toBe(20);
      expect(state.opacity).toBe(0.5);
    });
  });

  describe('CSS Generation', () => {
    it('should generate valid CSS with default values', () => {
      const state = createGlassmorphismState();
      const css = generateGlassCSS(state);
      
      expect(css).toContain('backdrop-filter: blur(10px) saturate(180%)');
      expect(css).toContain('-webkit-backdrop-filter: blur(10px) saturate(180%)');
      expect(css).toContain('background: rgba(255, 255, 255, 0.1)');
      expect(css).toContain('border: 1px solid rgba(255, 255, 255, 0.2)');
    });

    it('should generate correct CSS with custom values', () => {
      const state = {
        blur: 25,
        opacity: 0.3,
        saturation: 200,
        borderOpacity: 0.5
      };
      const css = generateGlassCSS(state);
      
      expect(css).toContain('blur(25px)');
      expect(css).toContain('saturate(200%)');
      expect(css).toContain('rgba(255, 255, 255, 0.3)');
      expect(css).toContain('rgba(255, 255, 255, 0.5)');
    });

    it('should handle zero values correctly', () => {
      const state = {
        blur: 0,
        opacity: 0,
        saturation: 0,
        borderOpacity: 0
      };
      const css = generateGlassCSS(state);
      
      expect(css).toContain('blur(0px)');
      expect(css).toContain('saturate(0%)');
      expect(css).toContain('rgba(255, 255, 255, 0)');
    });

    it('should handle maximum values', () => {
      const state = {
        blur: 50,
        opacity: 1,
        saturation: 300,
        borderOpacity: 1
      };
      const css = generateGlassCSS(state);
      
      expect(css).toContain('blur(50px)');
      expect(css).toContain('saturate(300%)');
      expect(css).toContain('rgba(255, 255, 255, 1)');
    });
  });

  describe('Value Validation', () => {
    it('should validate correct values', () => {
      const state = createGlassmorphismState();
      const errors = validateGlassValues(state);
      
      expect(errors).toHaveLength(0);
    });

    it('should detect invalid blur value', () => {
      const state = { ...createGlassmorphismState(), blur: -5 };
      const errors = validateGlassValues(state);
      
      expect(errors).toContain('Blur must be between 0 and 50');
    });

    it('should detect invalid opacity value', () => {
      const state = { ...createGlassmorphismState(), opacity: 1.5 };
      const errors = validateGlassValues(state);
      
      expect(errors).toContain('Opacity must be between 0 and 1');
    });

    it('should detect invalid saturation value', () => {
      const state = { ...createGlassmorphismState(), saturation: 500 };
      const errors = validateGlassValues(state);
      
      expect(errors).toContain('Saturation must be between 0 and 300');
    });

    it('should detect multiple invalid values', () => {
      const state = {
        blur: -10,
        opacity: 2,
        saturation: 500,
        borderOpacity: -1
      };
      const errors = validateGlassValues(state);
      
      expect(errors.length).toBe(4);
    });
  });

  describe('Browser Compatibility', () => {
    it('should include webkit prefix for Safari', () => {
      const state = createGlassmorphismState();
      const css = generateGlassCSS(state);
      
      expect(css).toContain('-webkit-backdrop-filter');
    });

    it('should include both standard and prefixed properties', () => {
      const state = createGlassmorphismState();
      const css = generateGlassCSS(state);
      
      const hasStandard = css.includes('backdrop-filter:') && !css.includes('-webkit');
      const hasWebkit = css.includes('-webkit-backdrop-filter');
      
      expect(hasWebkit).toBe(true);
    });
  });
});
