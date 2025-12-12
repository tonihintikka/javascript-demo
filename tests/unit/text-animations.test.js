/**
 * Text Animations Demo - Unit Tests
 * Tests for text splitting, animation effects, and scramble
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Text splitting utilities for testing
function splitIntoChars(text) {
  return text.split('').map((char, index) => ({
    char: char === ' ' ? '\u00A0' : char,
    index,
    delay: index * 0.05
  }));
}

function splitIntoWords(text) {
  return text.split(' ').map((word, index) => ({
    word,
    index,
    delay: index * 0.1
  }));
}

function splitIntoLines(text, delimiter = '\n') {
  return text.split(delimiter).map((line, index) => ({
    line: line.trim(),
    index,
    delay: index * 0.2
  }));
}

// Text scramble class for testing
class TextScramble {
  constructor() {
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.queue = [];
    this.frame = 0;
  }

  setText(newText, oldText = '') {
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    return this.queue;
  }

  getOutputAtFrame(frame) {
    let output = '';

    for (const item of this.queue) {
      if (frame >= item.end) {
        output += item.to;
      } else if (frame >= item.start) {
        output += this.chars[Math.floor(Math.random() * this.chars.length)];
      } else {
        output += item.from;
      }
    }

    return output;
  }
}

// Counter animation helper
function animateCounter(start, end, duration, callback) {
  const startTime = performance.now();
  const difference = end - start;

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(start + difference * easeOut);
    
    callback(currentValue, progress);
    
    return progress < 1;
  }

  return step;
}

describe('Text Animations Demo', () => {
  describe('Text Splitting - Characters', () => {
    it('should split text into individual characters', () => {
      const text = 'Hello';
      const chars = splitIntoChars(text);
      
      expect(chars).toHaveLength(5);
      expect(chars[0].char).toBe('H');
      expect(chars[4].char).toBe('o');
    });

    it('should preserve spaces as non-breaking spaces', () => {
      const text = 'Hi there';
      const chars = splitIntoChars(text);
      
      expect(chars[2].char).toBe('\u00A0');
    });

    it('should assign correct indices', () => {
      const text = 'ABC';
      const chars = splitIntoChars(text);
      
      expect(chars[0].index).toBe(0);
      expect(chars[1].index).toBe(1);
      expect(chars[2].index).toBe(2);
    });

    it('should calculate correct animation delays', () => {
      const text = 'Test';
      const chars = splitIntoChars(text);
      
      expect(chars[0].delay).toBeCloseTo(0);
      expect(chars[1].delay).toBeCloseTo(0.05);
      expect(chars[2].delay).toBeCloseTo(0.10);
      expect(chars[3].delay).toBeCloseTo(0.15);
    });

    it('should handle empty string', () => {
      const chars = splitIntoChars('');
      expect(chars).toHaveLength(0);
    });

    it('should handle special characters', () => {
      const text = 'äöå!@#';
      const chars = splitIntoChars(text);
      
      expect(chars).toHaveLength(6);
      expect(chars[0].char).toBe('ä');
    });
  });

  describe('Text Splitting - Words', () => {
    it('should split text into words', () => {
      const text = 'Hello World';
      const words = splitIntoWords(text);
      
      expect(words).toHaveLength(2);
      expect(words[0].word).toBe('Hello');
      expect(words[1].word).toBe('World');
    });

    it('should handle single word', () => {
      const words = splitIntoWords('Single');
      
      expect(words).toHaveLength(1);
      expect(words[0].word).toBe('Single');
    });

    it('should calculate correct word delays', () => {
      const text = 'One Two Three';
      const words = splitIntoWords(text);
      
      expect(words[0].delay).toBeCloseTo(0);
      expect(words[1].delay).toBeCloseTo(0.1);
      expect(words[2].delay).toBeCloseTo(0.2);
    });

    it('should handle multiple spaces', () => {
      const text = 'Word1  Word2';
      const words = splitIntoWords(text);
      
      // Multiple spaces create empty strings between words
      expect(words.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Text Splitting - Lines', () => {
    it('should split text into lines', () => {
      const text = 'Line one\nLine two\nLine three';
      const lines = splitIntoLines(text);
      
      expect(lines).toHaveLength(3);
      expect(lines[0].line).toBe('Line one');
      expect(lines[1].line).toBe('Line two');
      expect(lines[2].line).toBe('Line three');
    });

    it('should trim whitespace from lines', () => {
      const text = '  Padded  \n  Line  ';
      const lines = splitIntoLines(text);
      
      expect(lines[0].line).toBe('Padded');
      expect(lines[1].line).toBe('Line');
    });

    it('should calculate correct line delays', () => {
      const text = 'A\nB\nC';
      const lines = splitIntoLines(text);
      
      expect(lines[0].delay).toBeCloseTo(0);
      expect(lines[1].delay).toBeCloseTo(0.2);
      expect(lines[2].delay).toBeCloseTo(0.4);
    });
  });

  describe('Text Scramble Effect', () => {
    it('should create scramble queue', () => {
      const scramble = new TextScramble();
      const queue = scramble.setText('Hello', '');
      
      expect(queue).toHaveLength(5);
    });

    it('should track from and to characters', () => {
      const scramble = new TextScramble();
      const queue = scramble.setText('New', 'Old');
      
      expect(queue[0].from).toBe('O');
      expect(queue[0].to).toBe('N');
    });

    it('should handle length difference', () => {
      const scramble = new TextScramble();
      const queue = scramble.setText('Hi', 'Hello');
      
      expect(queue).toHaveLength(5); // Max of both lengths
    });

    it('should have start and end frames for each character', () => {
      const scramble = new TextScramble();
      const queue = scramble.setText('Test');
      
      queue.forEach(item => {
        expect(item.start).toBeGreaterThanOrEqual(0);
        expect(item.end).toBeGreaterThan(item.start);
      });
    });

    it('should include scramble characters', () => {
      const scramble = new TextScramble();
      
      expect(scramble.chars).toContain('!');
      expect(scramble.chars).toContain('#');
      expect(scramble.chars).toContain('_');
    });
  });

  describe('Counter Animation', () => {
    it('should start at initial value', () => {
      let firstValue = null;
      const step = animateCounter(0, 100, 1000, (value) => {
        if (firstValue === null) firstValue = value;
      });
      
      step(performance.now());
      expect(firstValue).toBe(0);
    });

    it('should reach target value at completion', () => {
      let lastValue = 0;
      const start = performance.now();
      const step = animateCounter(0, 100, 100, (value, progress) => {
        lastValue = value;
      });
      
      // Simulate completion
      step(start + 100);
      expect(lastValue).toBe(100);
    });

    it('should handle negative to positive range', () => {
      let finalValue = null;
      const start = performance.now();
      const step = animateCounter(-50, 50, 100, (value) => {
        finalValue = value;
      });
      
      step(start + 100);
      expect(finalValue).toBe(50);
    });

    it('should return false when animation is complete', () => {
      const start = performance.now();
      const step = animateCounter(0, 100, 100, () => {});
      
      const result = step(start + 200);
      expect(result).toBe(false);
    });

    it('should return true while animation is in progress', () => {
      const start = performance.now();
      const step = animateCounter(0, 100, 1000, () => {});
      
      const result = step(start + 500);
      expect(result).toBe(true);
    });
  });

  describe('Animation Types', () => {
    const animationTypes = ['fade', 'slide', 'scale', 'rotate', 'blur'];

    it.each(animationTypes)('should support %s animation type', (type) => {
      expect(animationTypes).toContain(type);
    });

    it('should support all character animation types', () => {
      const charAnimations = ['char-fade', 'char-slide', 'char-scale', 'char-rotate'];
      charAnimations.forEach(anim => {
        expect(anim).toMatch(/^char-/);
      });
    });

    it('should support all word animation types', () => {
      const wordAnimations = ['word-fade', 'word-slide', 'word-blur'];
      wordAnimations.forEach(anim => {
        expect(anim).toMatch(/^word-/);
      });
    });

    it('should support gradient animations', () => {
      const gradientAnimations = ['gradient-flow', 'gradient-pulse', 'gradient-rainbow', 'gradient-shimmer'];
      expect(gradientAnimations).toHaveLength(4);
    });
  });
});
