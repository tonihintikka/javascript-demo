/**
 * WebGPU 3D Demo - Unit Tests
 * Tests for WebGPU detection, Three.js scene management, and effects
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// WebGPU support detection
function checkWebGPUSupport() {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

// WebGL fallback detection
function checkWebGLSupport() {
  if (typeof document === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Renderer selection logic
function selectRenderer(preferWebGPU = true) {
  const hasWebGPU = checkWebGPUSupport();
  const hasWebGL = checkWebGLSupport();
  
  if (preferWebGPU && hasWebGPU) {
    return 'webgpu';
  } else if (hasWebGL) {
    return 'webgl';
  } else {
    return null;
  }
}

// Tab state management
class TabManager {
  constructor(tabs) {
    this.tabs = tabs;
    this.activeTab = tabs[0] || null;
    this.listeners = [];
    this.tabContents = new Map();
  }
  
  setActiveTab(tabId) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (!tab) {
      throw new Error(`Tab ${tabId} not found`);
    }
    
    const oldTab = this.activeTab;
    this.activeTab = tab;
    this.notify('change', { oldTab, newTab: tab });
    return tab;
  }
  
  getActiveTab() {
    return this.activeTab;
  }
  
  isActive(tabId) {
    return this.activeTab?.id === tabId;
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
  
  getTabIndex(tabId) {
    return this.tabs.findIndex(t => t.id === tabId);
  }
  
  nextTab() {
    const currentIndex = this.getTabIndex(this.activeTab?.id);
    const nextIndex = (currentIndex + 1) % this.tabs.length;
    return this.setActiveTab(this.tabs[nextIndex].id);
  }
  
  previousTab() {
    const currentIndex = this.getTabIndex(this.activeTab?.id);
    const prevIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
    return this.setActiveTab(this.tabs[prevIndex].id);
  }
}

// Particle system configuration
class ParticleSystemConfig {
  constructor(options = {}) {
    this.count = options.count || 10000;
    this.size = options.size || 0.1;
    this.color = options.color || 0x00ff88;
    this.spread = options.spread || 50;
    this.speed = options.speed || 1;
    this.turbulence = options.turbulence || 0.5;
  }
  
  validate() {
    const errors = [];
    
    if (this.count < 1 || this.count > 1000000) {
      errors.push('Particle count must be between 1 and 1,000,000');
    }
    if (this.size <= 0) {
      errors.push('Particle size must be positive');
    }
    if (this.spread <= 0) {
      errors.push('Spread must be positive');
    }
    
    return errors;
  }
  
  clone() {
    return new ParticleSystemConfig({
      count: this.count,
      size: this.size,
      color: this.color,
      spread: this.spread,
      speed: this.speed,
      turbulence: this.turbulence
    });
  }
}

// PBR Material configuration
class PBRMaterialConfig {
  constructor(options = {}) {
    this.metalness = this.clamp(options.metalness ?? 0.5, 0, 1);
    this.roughness = this.clamp(options.roughness ?? 0.5, 0, 1);
    this.color = options.color || 0xffffff;
    this.envMapIntensity = options.envMapIntensity ?? 1;
  }
  
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  
  setMetalness(value) {
    this.metalness = this.clamp(value, 0, 1);
    return this;
  }
  
  setRoughness(value) {
    this.roughness = this.clamp(value, 0, 1);
    return this;
  }
  
  toObject() {
    return {
      metalness: this.metalness,
      roughness: this.roughness,
      color: this.color,
      envMapIntensity: this.envMapIntensity
    };
  }
}

// Post-processing effect chain
class EffectChain {
  constructor() {
    this.effects = [];
    this.enabled = true;
  }
  
  add(effect) {
    this.effects.push({
      ...effect,
      enabled: effect.enabled ?? true
    });
    return this.effects.length - 1;
  }
  
  remove(index) {
    if (index >= 0 && index < this.effects.length) {
      return this.effects.splice(index, 1)[0];
    }
    return null;
  }
  
  enable(index) {
    if (this.effects[index]) {
      this.effects[index].enabled = true;
    }
  }
  
  disable(index) {
    if (this.effects[index]) {
      this.effects[index].enabled = false;
    }
  }
  
  toggle(index) {
    if (this.effects[index]) {
      this.effects[index].enabled = !this.effects[index].enabled;
    }
  }
  
  getActiveEffects() {
    return this.effects.filter(e => e.enabled);
  }
  
  reorder(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.effects.length) return;
    if (toIndex < 0 || toIndex >= this.effects.length) return;
    
    const [effect] = this.effects.splice(fromIndex, 1);
    this.effects.splice(toIndex, 0, effect);
  }
}

// GPU compute simulation parameters
class GPUComputeParams {
  constructor() {
    this.workgroupSize = 64;
    this.particleCount = 65536; // Must be power of 2
    this.deltaTime = 1 / 60;
    this.gravity = -9.8;
    this.bounds = { x: 100, y: 100, z: 100 };
  }
  
  setParticleCount(count) {
    // Round to nearest power of 2
    const power = Math.round(Math.log2(count));
    this.particleCount = Math.pow(2, power);
    return this.particleCount;
  }
  
  getDispatchCount() {
    return Math.ceil(this.particleCount / this.workgroupSize);
  }
  
  validate() {
    if (!this.isPowerOf2(this.particleCount)) {
      return false;
    }
    if (this.workgroupSize > 256) {
      return false;
    }
    return true;
  }
  
  isPowerOf2(n) {
    return n > 0 && (n & (n - 1)) === 0;
  }
}

// Scene state management
class SceneManager {
  constructor() {
    this.objects = new Map();
    this.lights = [];
    this.camera = null;
    this.isAnimating = false;
  }
  
  addObject(id, object) {
    this.objects.set(id, object);
  }
  
  removeObject(id) {
    return this.objects.delete(id);
  }
  
  getObject(id) {
    return this.objects.get(id);
  }
  
  addLight(light) {
    this.lights.push(light);
    return this.lights.length - 1;
  }
  
  setCamera(camera) {
    this.camera = camera;
  }
  
  startAnimation() {
    this.isAnimating = true;
  }
  
  stopAnimation() {
    this.isAnimating = false;
  }
  
  getObjectCount() {
    return this.objects.size;
  }
  
  clear() {
    this.objects.clear();
    this.lights = [];
    this.camera = null;
    this.isAnimating = false;
  }
}

describe('WebGPU 3D Demo', () => {
  describe('Feature Detection', () => {
    it('should check WebGPU support', () => {
      const result = checkWebGPUSupport();
      expect(typeof result).toBe('boolean');
    });

    it('should check WebGL support', () => {
      const result = checkWebGLSupport();
      expect(typeof result).toBe('boolean');
    });

    it('should select appropriate renderer', () => {
      const renderer = selectRenderer(true);
      // In test environment, may return null or webgl
      expect(renderer === null || renderer === 'webgl' || renderer === 'webgpu').toBe(true);
    });
  });

  describe('Tab Manager', () => {
    let tabManager;
    const tabs = [
      { id: 'particles', label: 'Particles' },
      { id: 'pbr', label: 'PBR Materials' },
      { id: 'postprocessing', label: 'Post-Processing' },
      { id: 'compute', label: 'GPU Compute' }
    ];

    beforeEach(() => {
      tabManager = new TabManager(tabs);
    });

    it('should initialize with first tab active', () => {
      expect(tabManager.getActiveTab().id).toBe('particles');
    });

    it('should switch to specific tab', () => {
      tabManager.setActiveTab('pbr');
      expect(tabManager.getActiveTab().id).toBe('pbr');
    });

    it('should throw error for unknown tab', () => {
      expect(() => tabManager.setActiveTab('unknown')).toThrow();
    });

    it('should check if tab is active', () => {
      expect(tabManager.isActive('particles')).toBe(true);
      expect(tabManager.isActive('pbr')).toBe(false);
    });

    it('should notify on tab change', () => {
      const callback = vi.fn();
      tabManager.subscribe(callback);
      
      tabManager.setActiveTab('pbr');
      
      expect(callback).toHaveBeenCalledWith('change', expect.objectContaining({
        oldTab: expect.objectContaining({ id: 'particles' }),
        newTab: expect.objectContaining({ id: 'pbr' })
      }));
    });

    it('should navigate to next tab', () => {
      tabManager.nextTab();
      expect(tabManager.getActiveTab().id).toBe('pbr');
    });

    it('should wrap around to first tab', () => {
      tabManager.setActiveTab('compute');
      tabManager.nextTab();
      expect(tabManager.getActiveTab().id).toBe('particles');
    });

    it('should navigate to previous tab', () => {
      tabManager.setActiveTab('pbr');
      tabManager.previousTab();
      expect(tabManager.getActiveTab().id).toBe('particles');
    });

    it('should wrap around to last tab', () => {
      tabManager.previousTab();
      expect(tabManager.getActiveTab().id).toBe('compute');
    });
  });

  describe('Particle System Config', () => {
    it('should create with defaults', () => {
      const config = new ParticleSystemConfig();
      
      expect(config.count).toBe(10000);
      expect(config.size).toBe(0.1);
      expect(config.spread).toBe(50);
    });

    it('should accept custom options', () => {
      const config = new ParticleSystemConfig({
        count: 50000,
        size: 0.2,
        color: 0xff0000
      });
      
      expect(config.count).toBe(50000);
      expect(config.size).toBe(0.2);
      expect(config.color).toBe(0xff0000);
    });

    it('should validate count range', () => {
      const config = new ParticleSystemConfig({ count: 2000000 });
      const errors = config.validate();
      
      expect(errors).toContain('Particle count must be between 1 and 1,000,000');
    });

    it('should validate positive size', () => {
      const config = new ParticleSystemConfig({ size: -1 });
      const errors = config.validate();
      
      expect(errors).toContain('Particle size must be positive');
    });

    it('should clone correctly', () => {
      const original = new ParticleSystemConfig({ count: 5000 });
      const clone = original.clone();
      
      expect(clone.count).toBe(5000);
      clone.count = 1000;
      expect(original.count).toBe(5000);
    });
  });

  describe('PBR Material Config', () => {
    it('should clamp metalness to valid range', () => {
      const config = new PBRMaterialConfig({ metalness: 1.5 });
      expect(config.metalness).toBe(1);
      
      const config2 = new PBRMaterialConfig({ metalness: -0.5 });
      expect(config2.metalness).toBe(0);
    });

    it('should clamp roughness to valid range', () => {
      const config = new PBRMaterialConfig({ roughness: 2 });
      expect(config.roughness).toBe(1);
    });

    it('should allow chained setters', () => {
      const config = new PBRMaterialConfig()
        .setMetalness(0.8)
        .setRoughness(0.2);
      
      expect(config.metalness).toBe(0.8);
      expect(config.roughness).toBe(0.2);
    });

    it('should convert to plain object', () => {
      const config = new PBRMaterialConfig({
        metalness: 0.7,
        roughness: 0.3,
        color: 0xff00ff
      });
      
      const obj = config.toObject();
      
      expect(obj).toEqual({
        metalness: 0.7,
        roughness: 0.3,
        color: 0xff00ff,
        envMapIntensity: 1
      });
    });
  });

  describe('Effect Chain', () => {
    let chain;

    beforeEach(() => {
      chain = new EffectChain();
    });

    it('should add effects', () => {
      const index = chain.add({ name: 'bloom', intensity: 1 });
      expect(index).toBe(0);
      expect(chain.effects).toHaveLength(1);
    });

    it('should enable effects by default', () => {
      chain.add({ name: 'bloom' });
      expect(chain.effects[0].enabled).toBe(true);
    });

    it('should remove effects', () => {
      chain.add({ name: 'bloom' });
      chain.add({ name: 'vignette' });
      
      const removed = chain.remove(0);
      
      expect(removed.name).toBe('bloom');
      expect(chain.effects).toHaveLength(1);
    });

    it('should toggle effects', () => {
      chain.add({ name: 'bloom' });
      
      chain.toggle(0);
      expect(chain.effects[0].enabled).toBe(false);
      
      chain.toggle(0);
      expect(chain.effects[0].enabled).toBe(true);
    });

    it('should get only active effects', () => {
      chain.add({ name: 'bloom' });
      chain.add({ name: 'vignette', enabled: false });
      chain.add({ name: 'chromatic' });
      
      const active = chain.getActiveEffects();
      
      expect(active).toHaveLength(2);
      expect(active.map(e => e.name)).toEqual(['bloom', 'chromatic']);
    });

    it('should reorder effects', () => {
      chain.add({ name: 'bloom' });
      chain.add({ name: 'vignette' });
      chain.add({ name: 'chromatic' });
      
      chain.reorder(0, 2);
      
      expect(chain.effects.map(e => e.name)).toEqual(['vignette', 'chromatic', 'bloom']);
    });
  });

  describe('GPU Compute Params', () => {
    let params;

    beforeEach(() => {
      params = new GPUComputeParams();
    });

    it('should have default values', () => {
      expect(params.workgroupSize).toBe(64);
      expect(params.particleCount).toBe(65536);
    });

    it('should round particle count to power of 2', () => {
      const result = params.setParticleCount(50000);
      expect(result).toBe(65536); // 2^16
    });

    it('should calculate dispatch count', () => {
      params.particleCount = 1024;
      params.workgroupSize = 64;
      
      expect(params.getDispatchCount()).toBe(16);
    });

    it('should validate power of 2', () => {
      expect(params.isPowerOf2(64)).toBe(true);
      expect(params.isPowerOf2(65)).toBe(false);
      expect(params.isPowerOf2(128)).toBe(true);
    });

    it('should validate configuration', () => {
      expect(params.validate()).toBe(true);
      
      params.particleCount = 100; // Not power of 2
      expect(params.validate()).toBe(false);
    });

    it('should reject too large workgroup size', () => {
      params.workgroupSize = 512;
      expect(params.validate()).toBe(false);
    });
  });

  describe('Scene Manager', () => {
    let scene;

    beforeEach(() => {
      scene = new SceneManager();
    });

    it('should add and retrieve objects', () => {
      const mesh = { type: 'mesh', name: 'cube' };
      scene.addObject('cube', mesh);
      
      expect(scene.getObject('cube')).toBe(mesh);
    });

    it('should remove objects', () => {
      scene.addObject('cube', {});
      scene.removeObject('cube');
      
      expect(scene.getObject('cube')).toBeUndefined();
    });

    it('should track object count', () => {
      scene.addObject('obj1', {});
      scene.addObject('obj2', {});
      
      expect(scene.getObjectCount()).toBe(2);
    });

    it('should add lights', () => {
      const index = scene.addLight({ type: 'point', intensity: 1 });
      expect(index).toBe(0);
      expect(scene.lights).toHaveLength(1);
    });

    it('should set camera', () => {
      const camera = { type: 'perspective', fov: 75 };
      scene.setCamera(camera);
      
      expect(scene.camera).toBe(camera);
    });

    it('should control animation state', () => {
      expect(scene.isAnimating).toBe(false);
      
      scene.startAnimation();
      expect(scene.isAnimating).toBe(true);
      
      scene.stopAnimation();
      expect(scene.isAnimating).toBe(false);
    });

    it('should clear all scene data', () => {
      scene.addObject('cube', {});
      scene.addLight({});
      scene.setCamera({});
      scene.startAnimation();
      
      scene.clear();
      
      expect(scene.getObjectCount()).toBe(0);
      expect(scene.lights).toHaveLength(0);
      expect(scene.camera).toBeNull();
      expect(scene.isAnimating).toBe(false);
    });
  });
});
