/**
 * I18n - Internationalization module
 * 
 * Handles Finnish/English language switching with:
 * - Modular JSON-based translations (common + page-specific)
 * - localStorage persistence
 * - Dynamic DOM updates via data-i18n attributes
 * - Lazy loading of page-specific translations
 * - Caching to avoid redundant fetches
 */

class I18n {
  constructor(defaultLocale = 'fi') {
    this.locale = localStorage.getItem('locale') || defaultLocale;
    this.translations = {};
    this.loaded = false;
    this.loadedModules = new Set();
    this.cache = new Map(); // Cache for loaded JSON files
    this.useModular = true; // Try modular first, fallback to legacy
  }

  /**
   * Load translations for a given locale
   * Supports both modular (locales/fi/common.json) and legacy (locales/fi.json) formats
   * @param {string} locale - 'fi' or 'en'
   * @param {string[]} modules - Additional modules to load (e.g., ['landing', 'webgpu-3d'])
   * @returns {Promise<void>}
   */
  async load(locale = this.locale, modules = []) {
    try {
      const basePath = this.getBasePath();
      
      // Detect current page and add its module automatically
      const pageModule = this.detectPageModule();
      if (pageModule && !modules.includes(pageModule)) {
        modules.push(pageModule);
      }
      
      // Try modular loading first
      if (this.useModular) {
        try {
          await this.loadModular(locale, modules, basePath);
        } catch (modularError) {
          console.warn('Modular loading failed, trying legacy format:', modularError);
          this.useModular = false;
          await this.loadLegacy(locale, basePath);
        }
      } else {
        await this.loadLegacy(locale, basePath);
      }
      
      this.locale = locale;
      this.loaded = true;
      
      // Persist choice
      localStorage.setItem('locale', locale);
      
      // Apply translations to DOM
      this.apply();
      
      // Update html lang attribute
      document.documentElement.lang = locale;
      
      // Dispatch event for custom handling
      window.dispatchEvent(new CustomEvent('localeChange', { 
        detail: { locale, translations: this.translations } 
      }));
      
    } catch (error) {
      console.error('I18n load error:', error);
      // Fallback to Finnish if English fails, or vice versa
      if (locale !== 'fi') {
        console.warn('Falling back to Finnish');
        await this.load('fi', modules);
      }
    }
  }

  /**
   * Load modular translations (common + page-specific modules)
   * @param {string} locale - 'fi' or 'en'
   * @param {string[]} modules - Modules to load
   * @param {string} basePath - Base path for locales
   */
  async loadModular(locale, modules, basePath) {
    // Always load common first
    const commonPath = `${basePath}locales/${locale}/common.json`;
    const commonData = await this.fetchWithCache(commonPath);
    
    // Start with common translations
    this.translations = { ...commonData };
    this.loadedModules.add('common');
    
    // Load additional modules in parallel
    const modulePromises = modules.map(async (module) => {
      if (this.loadedModules.has(module)) return null;
      
      const modulePath = `${basePath}locales/${locale}/${module}.json`;
      try {
        const moduleData = await this.fetchWithCache(modulePath);
        this.loadedModules.add(module);
        return { module, data: moduleData };
      } catch (err) {
        console.warn(`Module ${module} not found for locale ${locale}`);
        return null;
      }
    });
    
    const results = await Promise.all(modulePromises);
    
    // Merge module data into translations
    results.forEach(result => {
      if (result) {
        // Page-specific modules go under their own key
        this.translations[result.module] = result.data;
      }
    });
  }

  /**
   * Load legacy single-file translations
   * @param {string} locale - 'fi' or 'en'
   * @param {string} basePath - Base path for locales
   */
  async loadLegacy(locale, basePath) {
    const response = await fetch(`${basePath}locales/${locale}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${locale}`);
    }
    this.translations = await response.json();
  }

  /**
   * Fetch JSON with caching
   * @param {string} url - URL to fetch
   * @returns {Promise<object>}
   */
  async fetchWithCache(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    
    const data = await response.json();
    this.cache.set(url, data);
    return data;
  }

  /**
   * Detect which page module to load based on current URL
   * @returns {string|null}
   */
  detectPageModule() {
    const path = window.location.pathname;
    
    // Landing page
    if (path === '/' || path.endsWith('/index.html') || path.endsWith('/')) {
      return 'landing';
    }
    
    // Demo pages
    const demoMatch = path.match(/demos\/([a-z-]+)\.html/);
    if (demoMatch) {
      return demoMatch[1]; // e.g., 'webgpu-3d', 'glassmorphism'
    }
    
    return null;
  }

  /**
   * Load an additional module dynamically (for lazy loading)
   * @param {string} module - Module name (e.g., 'webgpu-3d')
   * @returns {Promise<void>}
   */
  async loadModule(module) {
    if (this.loadedModules.has(module)) return;
    
    const basePath = this.getBasePath();
    const modulePath = `${basePath}locales/${this.locale}/${module}.json`;
    
    try {
      const moduleData = await this.fetchWithCache(modulePath);
      this.translations[module] = moduleData;
      this.loadedModules.add(module);
      
      // Re-apply translations
      this.apply();
    } catch (err) {
      console.warn(`Could not load module ${module}:`, err);
    }
  }

  /**
   * Clear cache (useful when switching locales)
   */
  clearCache() {
    this.cache.clear();
    this.loadedModules.clear();
  }

  /**
   * Get base path for locales based on current page location
   * @returns {string}
   */
  getBasePath() {
    const path = window.location.pathname;
    // If we're in /demos/ subfolder, go up one level
    if (path.includes('/demos/')) {
      return '../';
    }
    return './';
  }

  /**
   * Get translation by key path (e.g., 'hero.title')
   * @param {string} key - Dot-notation key path
   * @param {object} params - Optional parameters for interpolation
   * @returns {string}
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Handle interpolation: {{param}}
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  apply() {
    if (!this.loaded) {
      console.warn('Translations not loaded yet');
      return;
    }

    // Handle text content translations
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const translation = this.t(key);
      
      if (translation !== key) {
        element.textContent = translation;
      }
    });

    // Handle placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.dataset.i18nPlaceholder;
      const translation = this.t(key);
      
      if (translation !== key) {
        element.placeholder = translation;
      }
    });

    // Handle title attribute translations
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.dataset.i18nTitle;
      const translation = this.t(key);
      
      if (translation !== key) {
        element.title = translation;
      }
    });

    // Handle aria-label translations
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.dataset.i18nAria;
      const translation = this.t(key);
      
      if (translation !== key) {
        element.setAttribute('aria-label', translation);
      }
    });

    // Handle HTML content (use with caution)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.dataset.i18nHtml;
      const translation = this.t(key);
      
      if (translation !== key) {
        element.innerHTML = translation;
      }
    });

    // Update language toggle button text
    this.updateToggleButton();
  }

  /**
   * Update the language toggle button to show current/available language
   */
  updateToggleButton() {
    const toggleBtn = document.querySelector('[data-lang-toggle]');
    if (toggleBtn) {
      const nextLocale = this.locale === 'fi' ? 'EN' : 'FI';
      toggleBtn.textContent = nextLocale;
      toggleBtn.setAttribute('aria-label', 
        this.locale === 'fi' ? 'Switch to English' : 'Vaihda suomeksi'
      );
    }
  }

  /**
   * Toggle between Finnish and English
   * @returns {Promise<void>}
   */
  async toggle() {
    const newLocale = this.locale === 'fi' ? 'en' : 'fi';
    // Clear cache when switching locales
    this.clearCache();
    await this.load(newLocale);
  }

  /**
   * Set up language toggle button
   * @param {string} selector - CSS selector for toggle button
   */
  setupToggle(selector = '[data-lang-toggle]') {
    const button = document.querySelector(selector);
    if (button) {
      button.addEventListener('click', () => this.toggle());
    }
  }

  /**
   * Get current locale
   * @returns {string}
   */
  getLocale() {
    return this.locale;
  }

  /**
   * Check if current locale is Finnish
   * @returns {boolean}
   */
  isFinnish() {
    return this.locale === 'fi';
  }

  /**
   * Check if current locale is English
   * @returns {boolean}
   */
  isEnglish() {
    return this.locale === 'en';
  }
}

// Create singleton instance
const i18n = new I18n();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await i18n.load();
    i18n.setupToggle();
  });
} else {
  // DOM already loaded
  (async () => {
    await i18n.load();
    i18n.setupToggle();
  })();
}

// Export for module usage
export { I18n, i18n };
export default i18n;
