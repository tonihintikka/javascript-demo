/**
 * View Transitions Demo - Unit Tests
 * Tests for View Transitions API, Bento Grid, and theme switching
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// View Transitions API support check
function supportsViewTransitions() {
  return typeof document !== 'undefined' && 
         'startViewTransition' in document;
}

// Bento grid item calculations
function calculateGridSpan(item) {
  const spans = {
    small: { col: 1, row: 1 },
    medium: { col: 2, row: 1 },
    large: { col: 2, row: 2 },
    wide: { col: 3, row: 1 },
    tall: { col: 1, row: 2 }
  };
  
  return spans[item.size] || spans.small;
}

// Grid layout calculation
function calculateGridLayout(items, columns = 4) {
  const grid = Array(columns).fill(0);
  const positions = [];
  
  for (const item of items) {
    const span = calculateGridSpan(item);
    
    // Find the best column to place this item
    let bestCol = 0;
    let minHeight = Infinity;
    
    for (let col = 0; col <= columns - span.col; col++) {
      const maxRowInSpan = Math.max(...grid.slice(col, col + span.col));
      if (maxRowInSpan < minHeight) {
        minHeight = maxRowInSpan;
        bestCol = col;
      }
    }
    
    positions.push({
      item,
      column: bestCol + 1,
      row: minHeight + 1,
      colSpan: span.col,
      rowSpan: span.row
    });
    
    // Update grid heights
    for (let col = bestCol; col < bestCol + span.col; col++) {
      grid[col] = minHeight + span.row;
    }
  }
  
  return positions;
}

// Theme state management
class ThemeManager {
  constructor(defaultTheme = 'dark') {
    this.theme = defaultTheme;
    this.listeners = [];
  }
  
  getTheme() {
    return this.theme;
  }
  
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      throw new Error('Invalid theme');
    }
    const oldTheme = this.theme;
    this.theme = theme;
    this.notify(oldTheme, theme);
  }
  
  toggle() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }
  
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }
  
  notify(oldTheme, newTheme) {
    this.listeners.forEach(listener => listener(oldTheme, newTheme));
  }
}

// Card expansion state
class CardExpansionManager {
  constructor() {
    this.expandedCard = null;
    this.cards = new Map();
  }
  
  register(id, card) {
    this.cards.set(id, card);
  }
  
  expand(id) {
    if (!this.cards.has(id)) {
      throw new Error(`Card ${id} not found`);
    }
    
    // Collapse current if any
    if (this.expandedCard && this.expandedCard !== id) {
      this.collapse(this.expandedCard);
    }
    
    this.expandedCard = id;
    return this.cards.get(id);
  }
  
  collapse(id) {
    if (this.expandedCard === id) {
      this.expandedCard = null;
    }
  }
  
  isExpanded(id) {
    return this.expandedCard === id;
  }
  
  getExpandedCard() {
    return this.expandedCard;
  }
}

// Transition timing
function createTransitionConfig(options = {}) {
  return {
    duration: options.duration || 300,
    easing: options.easing || 'ease-in-out',
    delay: options.delay || 0,
    ...options
  };
}

describe('View Transitions Demo', () => {
  describe('Feature Detection', () => {
    it('should detect View Transitions API support', () => {
      // In test environment, startViewTransition is not available
      const result = supportsViewTransitions();
      expect(typeof result).toBe('boolean');
    });

    it('should handle missing document gracefully', () => {
      const originalDocument = global.document;
      // @ts-ignore
      delete global.document;
      
      const result = supportsViewTransitions();
      expect(result).toBe(false);
      
      global.document = originalDocument;
    });
  });

  describe('Bento Grid - Grid Span Calculation', () => {
    it('should return correct span for small items', () => {
      const span = calculateGridSpan({ size: 'small' });
      expect(span).toEqual({ col: 1, row: 1 });
    });

    it('should return correct span for medium items', () => {
      const span = calculateGridSpan({ size: 'medium' });
      expect(span).toEqual({ col: 2, row: 1 });
    });

    it('should return correct span for large items', () => {
      const span = calculateGridSpan({ size: 'large' });
      expect(span).toEqual({ col: 2, row: 2 });
    });

    it('should return correct span for wide items', () => {
      const span = calculateGridSpan({ size: 'wide' });
      expect(span).toEqual({ col: 3, row: 1 });
    });

    it('should return correct span for tall items', () => {
      const span = calculateGridSpan({ size: 'tall' });
      expect(span).toEqual({ col: 1, row: 2 });
    });

    it('should default to small for unknown sizes', () => {
      const span = calculateGridSpan({ size: 'unknown' });
      expect(span).toEqual({ col: 1, row: 1 });
    });
  });

  describe('Bento Grid - Layout Calculation', () => {
    it('should position single item correctly', () => {
      const items = [{ id: 1, size: 'small' }];
      const layout = calculateGridLayout(items, 4);
      
      expect(layout).toHaveLength(1);
      expect(layout[0].column).toBe(1);
      expect(layout[0].row).toBe(1);
    });

    it('should position multiple small items in a row', () => {
      const items = [
        { id: 1, size: 'small' },
        { id: 2, size: 'small' },
        { id: 3, size: 'small' },
        { id: 4, size: 'small' }
      ];
      const layout = calculateGridLayout(items, 4);
      
      expect(layout[0].column).toBe(1);
      expect(layout[1].column).toBe(2);
      expect(layout[2].column).toBe(3);
      expect(layout[3].column).toBe(4);
    });

    it('should wrap items to next row', () => {
      const items = [
        { id: 1, size: 'small' },
        { id: 2, size: 'small' },
        { id: 3, size: 'small' },
        { id: 4, size: 'small' },
        { id: 5, size: 'small' }
      ];
      const layout = calculateGridLayout(items, 4);
      
      expect(layout[4].row).toBe(2);
    });

    it('should handle large items spanning multiple cells', () => {
      const items = [{ id: 1, size: 'large' }];
      const layout = calculateGridLayout(items, 4);
      
      expect(layout[0].colSpan).toBe(2);
      expect(layout[0].rowSpan).toBe(2);
    });

    it('should fill gaps with smaller items', () => {
      const items = [
        { id: 1, size: 'large' },
        { id: 2, size: 'small' },
        { id: 3, size: 'small' }
      ];
      const layout = calculateGridLayout(items, 4);
      
      // Large takes columns 1-2, small items should go to 3 and 4
      expect(layout[1].column).toBe(3);
      expect(layout[2].column).toBe(4);
    });
  });

  describe('Theme Manager', () => {
    let themeManager;

    beforeEach(() => {
      themeManager = new ThemeManager('dark');
    });

    it('should initialize with default theme', () => {
      expect(themeManager.getTheme()).toBe('dark');
    });

    it('should set theme to light', () => {
      themeManager.setTheme('light');
      expect(themeManager.getTheme()).toBe('light');
    });

    it('should toggle theme', () => {
      expect(themeManager.getTheme()).toBe('dark');
      themeManager.toggle();
      expect(themeManager.getTheme()).toBe('light');
      themeManager.toggle();
      expect(themeManager.getTheme()).toBe('dark');
    });

    it('should reject invalid theme', () => {
      expect(() => themeManager.setTheme('invalid')).toThrow('Invalid theme');
    });

    it('should notify subscribers on theme change', () => {
      const callback = vi.fn();
      themeManager.subscribe(callback);
      
      themeManager.setTheme('light');
      
      expect(callback).toHaveBeenCalledWith('dark', 'light');
    });

    it('should allow unsubscribing', () => {
      const callback = vi.fn();
      const unsubscribe = themeManager.subscribe(callback);
      
      unsubscribe();
      themeManager.setTheme('light');
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Card Expansion Manager', () => {
    let manager;

    beforeEach(() => {
      manager = new CardExpansionManager();
      manager.register('card-1', { title: 'Card 1' });
      manager.register('card-2', { title: 'Card 2' });
    });

    it('should expand a registered card', () => {
      const card = manager.expand('card-1');
      
      expect(card.title).toBe('Card 1');
      expect(manager.isExpanded('card-1')).toBe(true);
    });

    it('should throw error for unregistered card', () => {
      expect(() => manager.expand('unknown')).toThrow('Card unknown not found');
    });

    it('should collapse previous card when expanding new one', () => {
      manager.expand('card-1');
      manager.expand('card-2');
      
      expect(manager.isExpanded('card-1')).toBe(false);
      expect(manager.isExpanded('card-2')).toBe(true);
    });

    it('should collapse specific card', () => {
      manager.expand('card-1');
      manager.collapse('card-1');
      
      expect(manager.isExpanded('card-1')).toBe(false);
      expect(manager.getExpandedCard()).toBeNull();
    });

    it('should return currently expanded card', () => {
      expect(manager.getExpandedCard()).toBeNull();
      
      manager.expand('card-2');
      expect(manager.getExpandedCard()).toBe('card-2');
    });
  });

  describe('Transition Configuration', () => {
    it('should create config with defaults', () => {
      const config = createTransitionConfig();
      
      expect(config.duration).toBe(300);
      expect(config.easing).toBe('ease-in-out');
      expect(config.delay).toBe(0);
    });

    it('should allow custom duration', () => {
      const config = createTransitionConfig({ duration: 500 });
      expect(config.duration).toBe(500);
    });

    it('should allow custom easing', () => {
      const config = createTransitionConfig({ easing: 'linear' });
      expect(config.easing).toBe('linear');
    });

    it('should allow custom delay', () => {
      const config = createTransitionConfig({ delay: 100 });
      expect(config.delay).toBe(100);
    });

    it('should merge additional options', () => {
      const config = createTransitionConfig({ 
        duration: 400,
        customProp: 'value'
      });
      
      expect(config.duration).toBe(400);
      expect(config.customProp).toBe('value');
    });
  });
});
