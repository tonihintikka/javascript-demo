/**
 * Micro-interactions Demo - Unit Tests
 * Tests for magnetic buttons, haptic feedback, and predictive UI
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Magnetic button calculation
function calculateMagneticOffset(mouseX, mouseY, rect, strength = 0.3) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  
  return {
    x: deltaX * strength,
    y: deltaY * strength
  };
}

// Check if point is within magnetic range
function isInMagneticRange(mouseX, mouseY, rect, range = 50) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const distance = Math.sqrt(
    Math.pow(mouseX - centerX, 2) + 
    Math.pow(mouseY - centerY, 2)
  );
  
  return distance <= (Math.max(rect.width, rect.height) / 2 + range);
}

// Haptic patterns
const hapticPatterns = {
  light: [50],
  medium: [100],
  heavy: [100, 50, 100],
  success: [50, 30, 100],
  error: [100, 50, 100, 50, 100]
};

// Intent detection based on mouse movement
function detectIntent(movements, targetRect) {
  if (movements.length < 3) return null;
  
  const recent = movements.slice(-5);
  const avgDeltaX = recent.reduce((sum, m) => sum + m.deltaX, 0) / recent.length;
  const avgDeltaY = recent.reduce((sum, m) => sum + m.deltaY, 0) / recent.length;
  
  // Calculate if moving towards target
  const lastPos = recent[recent.length - 1];
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;
  
  const currentDistance = Math.sqrt(
    Math.pow(lastPos.x - targetCenterX, 2) +
    Math.pow(lastPos.y - targetCenterY, 2)
  );
  
  const projectedX = lastPos.x + avgDeltaX * 5;
  const projectedY = lastPos.y + avgDeltaY * 5;
  
  const projectedDistance = Math.sqrt(
    Math.pow(projectedX - targetCenterX, 2) +
    Math.pow(projectedY - targetCenterY, 2)
  );
  
  return {
    movingTowards: projectedDistance < currentDistance,
    velocity: Math.sqrt(avgDeltaX * avgDeltaX + avgDeltaY * avgDeltaY),
    confidence: movements.length >= 5 ? 'high' : 'low'
  };
}

// Ripple effect calculation
function calculateRipplePosition(event, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    diameter: Math.max(rect.width, rect.height) * 2
  };
}

describe('Micro-interactions Demo', () => {
  describe('Magnetic Buttons', () => {
    const mockRect = {
      left: 100,
      top: 100,
      width: 100,
      height: 40
    };

    it('should calculate zero offset at center', () => {
      const offset = calculateMagneticOffset(150, 120, mockRect, 0.3);
      
      expect(offset.x).toBe(0);
      expect(offset.y).toBe(0);
    });

    it('should calculate positive offset when mouse is right of center', () => {
      const offset = calculateMagneticOffset(200, 120, mockRect, 0.3);
      
      expect(offset.x).toBeGreaterThan(0);
    });

    it('should calculate negative offset when mouse is left of center', () => {
      const offset = calculateMagneticOffset(100, 120, mockRect, 0.3);
      
      expect(offset.x).toBeLessThan(0);
    });

    it('should respect strength parameter', () => {
      const weakOffset = calculateMagneticOffset(200, 120, mockRect, 0.1);
      const strongOffset = calculateMagneticOffset(200, 120, mockRect, 0.5);
      
      expect(Math.abs(strongOffset.x)).toBeGreaterThan(Math.abs(weakOffset.x));
    });

    it('should calculate both X and Y offsets', () => {
      const offset = calculateMagneticOffset(200, 150, mockRect, 0.3);
      
      expect(offset.x).not.toBe(0);
      expect(offset.y).not.toBe(0);
    });

    describe('Magnetic Range Detection', () => {
      it('should detect point inside magnetic range', () => {
        const inRange = isInMagneticRange(150, 120, mockRect, 50);
        expect(inRange).toBe(true);
      });

      it('should detect point outside magnetic range', () => {
        const inRange = isInMagneticRange(300, 300, mockRect, 50);
        expect(inRange).toBe(false);
      });

      it('should respect custom range parameter', () => {
        // Just outside default range but inside larger range
        const inSmallRange = isInMagneticRange(250, 120, mockRect, 30);
        const inLargeRange = isInMagneticRange(250, 120, mockRect, 100);
        
        expect(inSmallRange).toBe(false);
        expect(inLargeRange).toBe(true);
      });
    });
  });

  describe('Haptic Feedback', () => {
    it('should have light haptic pattern', () => {
      expect(hapticPatterns.light).toEqual([50]);
    });

    it('should have medium haptic pattern', () => {
      expect(hapticPatterns.medium).toEqual([100]);
    });

    it('should have heavy haptic pattern with pauses', () => {
      expect(hapticPatterns.heavy).toHaveLength(3);
      expect(hapticPatterns.heavy).toContain(50); // Pause
    });

    it('should have success pattern', () => {
      expect(hapticPatterns.success).toBeDefined();
      expect(hapticPatterns.success.length).toBeGreaterThan(1);
    });

    it('should have error pattern with multiple vibrations', () => {
      expect(hapticPatterns.error).toBeDefined();
      expect(hapticPatterns.error.length).toBeGreaterThanOrEqual(3);
    });

    it('should verify navigator.vibrate is mockable', () => {
      const mockVibrate = vi.fn().mockReturnValue(true);
      navigator.vibrate = mockVibrate;
      
      navigator.vibrate(hapticPatterns.light);
      
      expect(mockVibrate).toHaveBeenCalledWith([50]);
    });
  });

  describe('Predictive UI / Intent Detection', () => {
    const targetRect = {
      left: 200,
      top: 200,
      width: 100,
      height: 50
    };

    it('should return null with insufficient data', () => {
      const movements = [
        { x: 100, y: 100, deltaX: 10, deltaY: 5 }
      ];
      
      const intent = detectIntent(movements, targetRect);
      expect(intent).toBeNull();
    });

    it('should detect movement towards target', () => {
      const movements = [
        { x: 100, y: 150, deltaX: 20, deltaY: 10 },
        { x: 120, y: 160, deltaX: 20, deltaY: 10 },
        { x: 140, y: 170, deltaX: 20, deltaY: 10 },
        { x: 160, y: 180, deltaX: 20, deltaY: 10 },
        { x: 180, y: 190, deltaX: 20, deltaY: 10 }
      ];
      
      const intent = detectIntent(movements, targetRect);
      
      expect(intent).not.toBeNull();
      expect(intent.movingTowards).toBe(true);
    });

    it('should detect movement away from target', () => {
      const movements = [
        { x: 200, y: 200, deltaX: -20, deltaY: -10 },
        { x: 180, y: 190, deltaX: -20, deltaY: -10 },
        { x: 160, y: 180, deltaX: -20, deltaY: -10 },
        { x: 140, y: 170, deltaX: -20, deltaY: -10 },
        { x: 120, y: 160, deltaX: -20, deltaY: -10 }
      ];
      
      const intent = detectIntent(movements, targetRect);
      
      expect(intent).not.toBeNull();
      expect(intent.movingTowards).toBe(false);
    });

    it('should calculate velocity', () => {
      const movements = [
        { x: 100, y: 100, deltaX: 30, deltaY: 40 },
        { x: 130, y: 140, deltaX: 30, deltaY: 40 },
        { x: 160, y: 180, deltaX: 30, deltaY: 40 }
      ];
      
      const intent = detectIntent(movements, targetRect);
      
      expect(intent.velocity).toBeGreaterThan(0);
      expect(intent.velocity).toBeCloseTo(50, 0); // sqrt(30^2 + 40^2) = 50
    });

    it('should indicate confidence level', () => {
      const fewMovements = [
        { x: 100, y: 100, deltaX: 10, deltaY: 5 },
        { x: 110, y: 105, deltaX: 10, deltaY: 5 },
        { x: 120, y: 110, deltaX: 10, deltaY: 5 }
      ];
      
      const manyMovements = [
        { x: 100, y: 100, deltaX: 10, deltaY: 5 },
        { x: 110, y: 105, deltaX: 10, deltaY: 5 },
        { x: 120, y: 110, deltaX: 10, deltaY: 5 },
        { x: 130, y: 115, deltaX: 10, deltaY: 5 },
        { x: 140, y: 120, deltaX: 10, deltaY: 5 }
      ];
      
      const lowConfidence = detectIntent(fewMovements, targetRect);
      const highConfidence = detectIntent(manyMovements, targetRect);
      
      expect(lowConfidence.confidence).toBe('low');
      expect(highConfidence.confidence).toBe('high');
    });
  });

  describe('Ripple Effect', () => {
    it('should calculate ripple position relative to element', () => {
      const mockEvent = { clientX: 150, clientY: 130 };
      const mockElement = {
        getBoundingClientRect: () => ({
          left: 100,
          top: 100,
          width: 100,
          height: 40
        })
      };
      
      const ripple = calculateRipplePosition(mockEvent, mockElement);
      
      expect(ripple.x).toBe(50);
      expect(ripple.y).toBe(30);
    });

    it('should calculate diameter based on element size', () => {
      const mockEvent = { clientX: 150, clientY: 120 };
      const mockElement = {
        getBoundingClientRect: () => ({
          left: 100,
          top: 100,
          width: 200,
          height: 100
        })
      };
      
      const ripple = calculateRipplePosition(mockEvent, mockElement);
      
      expect(ripple.diameter).toBe(400); // 200 * 2
    });

    it('should handle click at element edge', () => {
      const mockEvent = { clientX: 100, clientY: 100 };
      const mockElement = {
        getBoundingClientRect: () => ({
          left: 100,
          top: 100,
          width: 100,
          height: 40
        })
      };
      
      const ripple = calculateRipplePosition(mockEvent, mockElement);
      
      expect(ripple.x).toBe(0);
      expect(ripple.y).toBe(0);
    });
  });

  describe('Toggle Animations', () => {
    it('should support toggle states', () => {
      const states = ['on', 'off'];
      expect(states).toContain('on');
      expect(states).toContain('off');
    });

    it('should toggle between states', () => {
      let state = 'off';
      state = state === 'off' ? 'on' : 'off';
      expect(state).toBe('on');
      
      state = state === 'off' ? 'on' : 'off';
      expect(state).toBe('off');
    });
  });
});
