/**
 * Scrollytelling Demo - Unit Tests
 * Tests for ScrollTrigger, progress tracking, and data visualization
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Progress calculation
function calculateScrollProgress(scrollY, sectionTop, sectionHeight, windowHeight) {
  const sectionStart = sectionTop - windowHeight;
  const sectionEnd = sectionTop + sectionHeight;
  const totalDistance = sectionEnd - sectionStart;
  
  const progress = (scrollY - sectionStart) / totalDistance;
  
  return Math.max(0, Math.min(1, progress));
}

// Data point animation timing
function calculateDataPointDelay(index, totalPoints, baseDuration = 500) {
  const stagger = baseDuration / totalPoints;
  return index * stagger;
}

// Section visibility state
class ScrollSectionManager {
  constructor() {
    this.sections = new Map();
    this.activeSection = null;
    this.listeners = [];
  }
  
  register(id, config) {
    this.sections.set(id, {
      ...config,
      progress: 0,
      isVisible: false
    });
  }
  
  updateProgress(id, progress) {
    const section = this.sections.get(id);
    if (!section) return;
    
    const wasVisible = section.isVisible;
    section.progress = progress;
    section.isVisible = progress > 0 && progress < 1;
    
    // Check if this section is now active (most in view)
    if (progress > 0.3 && progress < 0.7) {
      if (this.activeSection !== id) {
        const oldActive = this.activeSection;
        this.activeSection = id;
        this.notify('activeChange', { oldSection: oldActive, newSection: id });
      }
    }
    
    // Trigger enter/leave events
    if (!wasVisible && section.isVisible) {
      this.notify('enter', { id, progress });
    } else if (wasVisible && !section.isVisible) {
      this.notify('leave', { id, progress });
    }
  }
  
  getProgress(id) {
    return this.sections.get(id)?.progress ?? 0;
  }
  
  getActiveSection() {
    return this.activeSection;
  }
  
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
  
  notify(event, data) {
    this.listeners.forEach(listener => listener(event, data));
  }
}

// Progress bar state
class ProgressBarManager {
  constructor() {
    this.progress = 0;
    this.segments = [];
  }
  
  addSegment(id, label, weight = 1) {
    this.segments.push({ id, label, weight, progress: 0 });
    this.recalculateTotal();
  }
  
  updateSegmentProgress(id, progress) {
    const segment = this.segments.find(s => s.id === id);
    if (segment) {
      segment.progress = Math.max(0, Math.min(1, progress));
      this.recalculateTotal();
    }
  }
  
  recalculateTotal() {
    const totalWeight = this.segments.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight === 0) {
      this.progress = 0;
      return;
    }
    
    this.progress = this.segments.reduce((sum, s) => {
      return sum + (s.progress * s.weight / totalWeight);
    }, 0);
  }
  
  getProgress() {
    return this.progress;
  }
  
  getSegmentProgress(id) {
    return this.segments.find(s => s.id === id)?.progress ?? 0;
  }
}

// Data chart animation state
class ChartAnimationController {
  constructor(data) {
    this.data = data;
    this.animatedValues = data.map(() => 0);
    this.progress = 0;
  }
  
  setProgress(progress) {
    this.progress = Math.max(0, Math.min(1, progress));
    this.updateAnimatedValues();
  }
  
  updateAnimatedValues() {
    this.animatedValues = this.data.map((value, index) => {
      // Stagger the animation for each data point
      const pointCount = this.data.length;
      const pointStart = index / pointCount;
      const pointEnd = (index + 1) / pointCount;
      
      const pointProgress = Math.max(0, Math.min(1,
        (this.progress - pointStart) / (pointEnd - pointStart)
      ));
      
      return value * this.easeOutCubic(pointProgress);
    });
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  getAnimatedValues() {
    return [...this.animatedValues];
  }
  
  getAnimatedValue(index) {
    return this.animatedValues[index] ?? 0;
  }
}

// Parallax effect calculation
function calculateParallaxOffset(scrollY, elementTop, factor = 0.5) {
  const delta = scrollY - elementTop;
  return delta * factor;
}

// Text reveal animation
function calculateTextRevealProgress(scrollProgress, characterIndex, totalCharacters) {
  const charStart = characterIndex / totalCharacters;
  const charEnd = (characterIndex + 1) / totalCharacters;
  
  if (scrollProgress < charStart) return 0;
  if (scrollProgress > charEnd) return 1;
  
  return (scrollProgress - charStart) / (charEnd - charStart);
}

describe('Scrollytelling Demo', () => {
  describe('Scroll Progress Calculation', () => {
    it('should return 0 when above section', () => {
      const progress = calculateScrollProgress(0, 1000, 500, 800);
      expect(progress).toBe(0);
    });

    it('should return 1 when below section', () => {
      const progress = calculateScrollProgress(2000, 1000, 500, 800);
      expect(progress).toBe(1);
    });

    it('should return 0.5 when in middle of section', () => {
      // sectionStart = 1000 - 800 = 200
      // sectionEnd = 1000 + 500 = 1500
      // totalDistance = 1300
      // For 0.5: scrollY = 200 + 1300 * 0.5 = 850
      const progress = calculateScrollProgress(850, 1000, 500, 800);
      expect(progress).toBeCloseTo(0.5, 1);
    });

    it('should clamp values between 0 and 1', () => {
      const progressBelow = calculateScrollProgress(-500, 1000, 500, 800);
      const progressAbove = calculateScrollProgress(5000, 1000, 500, 800);
      
      expect(progressBelow).toBe(0);
      expect(progressAbove).toBe(1);
    });
  });

  describe('Data Point Animation Delay', () => {
    it('should return 0 for first point', () => {
      const delay = calculateDataPointDelay(0, 10, 500);
      expect(delay).toBe(0);
    });

    it('should distribute delays evenly', () => {
      const delay1 = calculateDataPointDelay(1, 10, 500);
      const delay2 = calculateDataPointDelay(2, 10, 500);
      
      expect(delay2 - delay1).toBeCloseTo(50);
    });

    it('should scale with base duration', () => {
      const delay = calculateDataPointDelay(5, 10, 1000);
      expect(delay).toBe(500);
    });
  });

  describe('Scroll Section Manager', () => {
    let manager;

    beforeEach(() => {
      manager = new ScrollSectionManager();
      manager.register('intro', { title: 'Introduction' });
      manager.register('data', { title: 'Data' });
      manager.register('conclusion', { title: 'Conclusion' });
    });

    it('should register sections', () => {
      expect(manager.getProgress('intro')).toBe(0);
    });

    it('should update progress', () => {
      manager.updateProgress('intro', 0.5);
      expect(manager.getProgress('intro')).toBe(0.5);
    });

    it('should track active section', () => {
      manager.updateProgress('intro', 0.5);
      expect(manager.getActiveSection()).toBe('intro');
    });

    it('should change active section when scrolling', () => {
      manager.updateProgress('intro', 0.9);
      manager.updateProgress('data', 0.5);
      
      expect(manager.getActiveSection()).toBe('data');
    });

    it('should notify on section enter', () => {
      const callback = vi.fn();
      manager.subscribe(callback);
      
      manager.updateProgress('intro', 0.1);
      
      expect(callback).toHaveBeenCalledWith('enter', expect.objectContaining({
        id: 'intro'
      }));
    });

    it('should notify on section leave', () => {
      const callback = vi.fn();
      manager.subscribe(callback);
      
      manager.updateProgress('intro', 0.5);
      callback.mockClear();
      
      manager.updateProgress('intro', 1);
      
      expect(callback).toHaveBeenCalledWith('leave', expect.objectContaining({
        id: 'intro'
      }));
    });
  });

  describe('Progress Bar Manager', () => {
    let progressBar;

    beforeEach(() => {
      progressBar = new ProgressBarManager();
      progressBar.addSegment('section1', 'Section 1', 1);
      progressBar.addSegment('section2', 'Section 2', 2);
      progressBar.addSegment('section3', 'Section 3', 1);
    });

    it('should start with 0 progress', () => {
      expect(progressBar.getProgress()).toBe(0);
    });

    it('should update segment progress', () => {
      progressBar.updateSegmentProgress('section1', 0.5);
      expect(progressBar.getSegmentProgress('section1')).toBe(0.5);
    });

    it('should calculate weighted total', () => {
      // Total weight = 4
      // If section1 (weight 1) is 100%, contribution = 1/4 = 0.25
      progressBar.updateSegmentProgress('section1', 1);
      expect(progressBar.getProgress()).toBe(0.25);
    });

    it('should handle multiple segment progress', () => {
      // section1: weight 1, progress 1 -> 1 * 1/4 = 0.25
      // section2: weight 2, progress 0.5 -> 0.5 * 2/4 = 0.25
      // Total = 0.5
      progressBar.updateSegmentProgress('section1', 1);
      progressBar.updateSegmentProgress('section2', 0.5);
      
      expect(progressBar.getProgress()).toBe(0.5);
    });

    it('should clamp segment progress to 0-1', () => {
      progressBar.updateSegmentProgress('section1', 1.5);
      expect(progressBar.getSegmentProgress('section1')).toBe(1);
      
      progressBar.updateSegmentProgress('section1', -0.5);
      expect(progressBar.getSegmentProgress('section1')).toBe(0);
    });
  });

  describe('Chart Animation Controller', () => {
    let controller;
    const testData = [100, 200, 300, 400];

    beforeEach(() => {
      controller = new ChartAnimationController(testData);
    });

    it('should initialize with zero values', () => {
      const values = controller.getAnimatedValues();
      expect(values).toEqual([0, 0, 0, 0]);
    });

    it('should animate to full values at progress 1', () => {
      controller.setProgress(1);
      const values = controller.getAnimatedValues();
      
      expect(values[0]).toBeCloseTo(100, 0);
      expect(values[1]).toBeCloseTo(200, 0);
      expect(values[2]).toBeCloseTo(300, 0);
      expect(values[3]).toBeCloseTo(400, 0);
    });

    it('should clamp progress between 0 and 1', () => {
      controller.setProgress(-1);
      expect(controller.progress).toBe(0);
      
      controller.setProgress(2);
      expect(controller.progress).toBe(1);
    });

    it('should stagger animation for each data point', () => {
      controller.setProgress(0.25);
      const values = controller.getAnimatedValues();
      
      // First point should be fully animated
      expect(values[0]).toBeCloseTo(100, 0);
      // Last point should still be 0
      expect(values[3]).toBe(0);
    });

    it('should get individual animated value', () => {
      controller.setProgress(1);
      expect(controller.getAnimatedValue(2)).toBeCloseTo(300, 0);
    });

    it('should return 0 for invalid index', () => {
      expect(controller.getAnimatedValue(100)).toBe(0);
    });
  });

  describe('Parallax Effect', () => {
    it('should return 0 at element position', () => {
      const offset = calculateParallaxOffset(500, 500, 0.5);
      expect(offset).toBe(0);
    });

    it('should return positive offset when scrolled past', () => {
      const offset = calculateParallaxOffset(600, 500, 0.5);
      expect(offset).toBe(50);
    });

    it('should return negative offset when scrolled before', () => {
      const offset = calculateParallaxOffset(400, 500, 0.5);
      expect(offset).toBe(-50);
    });

    it('should scale with factor', () => {
      const offset1 = calculateParallaxOffset(700, 500, 0.5);
      const offset2 = calculateParallaxOffset(700, 500, 1);
      
      expect(offset2).toBe(offset1 * 2);
    });
  });

  describe('Text Reveal Animation', () => {
    it('should return 0 before character starts', () => {
      // Character 5 of 10 starts at 50% scroll
      const progress = calculateTextRevealProgress(0.3, 5, 10);
      expect(progress).toBe(0);
    });

    it('should return 1 after character ends', () => {
      // Character 2 of 10 ends at 30% scroll
      const progress = calculateTextRevealProgress(0.5, 2, 10);
      expect(progress).toBe(1);
    });

    it('should return 0.5 in middle of character reveal', () => {
      // Character 0 of 10: starts at 0%, ends at 10%
      // Middle is at 5%
      const progress = calculateTextRevealProgress(0.05, 0, 10);
      expect(progress).toBeCloseTo(0.5, 1);
    });

    it('should handle first character', () => {
      const progress = calculateTextRevealProgress(0.1, 0, 10);
      expect(progress).toBe(1);
    });

    it('should handle last character', () => {
      const progress = calculateTextRevealProgress(0.95, 9, 10);
      expect(progress).toBeCloseTo(0.5, 1);
    });
  });
});
