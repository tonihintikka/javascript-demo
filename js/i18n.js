/**
 * I18n - Internationalization module
 * 
 * Handles Finnish/English language switching with:
 * - JSON-based translations
 * - localStorage persistence
 * - Dynamic DOM updates via data-i18n attributes
 */

class I18n {
  constructor(defaultLocale = 'fi') {
    this.locale = localStorage.getItem('locale') || defaultLocale;
    this.translations = {};
    this.loaded = false;
  }

  /**
   * Load translations for a given locale
   * @param {string} locale - 'fi' or 'en'
   * @returns {Promise<void>}
   */
  async load(locale = this.locale) {
    try {
      // Determine base path based on current location
      const basePath = this.getBasePath();
      const response = await fetch(`${basePath}locales/${locale}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${locale}`);
      }
      
      this.translations = await response.json();
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
        await this.load('fi');
      }
    }
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
